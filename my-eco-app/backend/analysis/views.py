import json
import logging
import re
import time
from dataclasses import dataclass
from typing import Dict, Tuple
from urllib.parse import urlparse

import requests
from requests.exceptions import RequestException, Timeout, ConnectionError as RequestsConnectionError

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST


USER_AGENT = "GreenCheckAnalyzer/1.0 (+https://greencheck.local)"
REQUEST_TIMEOUT = 10
CACHE_TTL_SECONDS = 300
IMG_PATTERN = re.compile(r"<img[^>]*>", re.IGNORECASE)
SIZE_HINT_PATTERN = re.compile(r"(?:width|height|data-[wh])\s*=\s*[\"']?(\d+)", re.IGNORECASE)
RESOURCE_PATTERN = re.compile(r"""(?:src|href)\s*=\s*["'](https?://[^"']+)["']""", re.IGNORECASE)
SCRIPT_PATTERN = re.compile(r"<script\b[^>]*>(.*?)</script>", re.IGNORECASE | re.DOTALL)

logger = logging.getLogger(__name__)
_CACHE: Dict[str, Tuple[float, "PageMetrics"]] = {}


LEVEL_MESSAGES = {
    "A": "Votre site a un très faible impact, excellent !",
    "B": "Bon score, quelques optimisations possibles.",
    "C": "Impact moyen, plusieurs améliorations sont recommandées.",
    "D": "Site lourd, impact élevé.",
    "E": "Impact très fort, optimisation urgente.",
}

LEVEL_TIPS = {
    "A": [
        "Maintenez vos images compressées et pensez à utiliser AVIF/WebP.",
        "Surveillez régulièrement le poids des pages après chaque nouvelle fonctionnalité.",
        "Activez la mise en cache longue durée pour les assets statiques.",
        "Continuez à préférez un hébergement alimenté en énergie renouvelable.",
    ],
    "B": [
        "Compressez davantage les images d'arrière-plan et les héros.",
        "Activez la minification et la compression gzip/brotli sur vos scripts.",
        "Chargez les polices en mode swap et limitez leur nombre.",
        "Retardez le chargement des scripts qui ne sont pas critiques.",
    ],
    "C": [
        "Réduisez les animations et librairies lourdes non utilisées.",
        "Combinez ou supprimez les scripts tiers non indispensables.",
        "Activez le lazy-loading sur toutes les images en dessous de la ligne de flottaison.",
        "Servez les vidéos via un lecteur externe optimisé plutôt qu'en autoplay.",
    ],
    "D": [
        "Optimisez ou remplacez les images supérieures à 1200px par des versions responsives.",
        "Implémentez un système de cache/CDN pour réduire les requêtes répétées.",
        "Supprimez les scripts inutilisés et fractionnez votre bundle JavaScript.",
        "Réduisez la taille des CSS en supprimant les classes non utilisées.",
    ],
    "E": [
        "Auditez chaque page pour supprimer les assets non critiques immédiatement.",
        "Convertissez toutes les images en WebP/AVIF avec compression agressive.",
        "Désactivez les carrousels et animations lourdes sur mobile.",
        "Choisissez un hébergeur vert et activez la compression serveur.",
        "Appliquez un design plus simple afin de limiter le nombre de composants.",
    ],
}


class AnalysisError(Exception):
    """Raised when the analyzer cannot process the requested URL."""


@dataclass
class PageMetrics:
    page_weight_kb: float
    request_count: int
    image_count: int
    large_image_count: int
    third_party_requests: int
    inline_script_kb: float

    def as_dict(self) -> Dict[str, float]:
        return {
            "page_weight_kb": self.page_weight_kb,
            "request_count": self.request_count,
            "image_count": self.image_count,
            "large_image_count": self.large_image_count,
            "third_party_requests": self.third_party_requests,
            "inline_script_kb": self.inline_script_kb,
        }


def health_check(request):
    """Simple health check endpoint."""
    return JsonResponse({"status": "ok", "message": "Backend Green Check is running"})


@csrf_exempt
@require_POST
def analyze_site(request):
    """
    Receive a URL, run a lightweight environmental impact analysis and
    return a normalized payload for the frontend.
    """
    try:
        payload = json.loads(request.body.decode("utf-8") or "{}")
    except json.JSONDecodeError:
        return JsonResponse({"error": "Payload JSON invalide."}, status=400)

    raw_url = (payload.get("url") or "").strip()
    if not raw_url:
        return JsonResponse({"error": "Merci de fournir une URL à analyser."}, status=400)

    try:
        normalized_url = _normalize_url(raw_url)
        metrics = _get_cached_metrics(normalized_url)
        if metrics is None:
            metrics = _fetch_page_metrics(normalized_url)
            _set_cached_metrics(normalized_url, metrics)
        else:
            logger.debug("Cache hit for %s", normalized_url)
        level, message, advice = _score(metrics)
    except AnalysisError as exc:
        return JsonResponse({"error": str(exc)}, status=400)

    response_payload = {
        "niveau": level,
        "message": message,
        "conseils": advice,
        "diagnostic": metrics.as_dict(),
    }
    return JsonResponse(response_payload)


def _normalize_url(raw_url: str) -> str:
    candidate = raw_url if raw_url.startswith(("http://", "https://")) else f"https://{raw_url}"
    parsed = urlparse(candidate)
    if not parsed.netloc:
        raise AnalysisError("URL fournie invalide.")
    if parsed.scheme not in ("http", "https"):
        raise AnalysisError("Seuls les protocoles HTTP/HTTPS sont acceptés.")
    return parsed.geturl()


def _fetch_page_metrics(url: str) -> PageMetrics:
    try:
        response = requests.get(
            url,
            headers={"User-Agent": USER_AGENT},
            timeout=REQUEST_TIMEOUT,
            allow_redirects=True,
        )
        response.raise_for_status()
        content = response.content
        # Déterminer l'encodage
        if response.encoding:
            html = response.text
        else:
            # Essayer de détecter l'encodage depuis les headers
            charset = response.headers.get("Content-Type", "").split("charset=")
            encoding = charset[-1].split(";")[0].strip() if len(charset) > 1 else "utf-8"
            html = content.decode(encoding, errors="ignore")
    except RequestsConnectionError as exc:
        logger.exception("Failed to fetch %s - Connection error", url)
        error_msg = str(exc)
        if "getaddrinfo failed" in error_msg or "11001" in error_msg:
            raise AnalysisError(
                "Impossible de se connecter au site. Vérifiez votre connexion Internet et que le nom de domaine est correct."
            ) from exc
        raise AnalysisError(f"Impossible de se connecter au site : {error_msg}") from exc
    except Timeout as exc:
        logger.exception("Failed to fetch %s - Timeout", url)
        raise AnalysisError("Le site a pris trop de temps à répondre. Veuillez réessayer.") from exc
    except RequestException as exc:
        logger.exception("Failed to fetch %s", url)
        if hasattr(exc, "response") and exc.response is not None:
            status_code = exc.response.status_code
            if status_code == 404:
                raise AnalysisError(
                    f"Le site demandé n'a pas été trouvé (404). Vérifiez que l'URL est correcte."
                ) from exc
            elif status_code == 403:
                raise AnalysisError(
                    f"Accès refusé au site (403). Le site bloque peut-être les requêtes automatisées."
                ) from exc
            elif status_code >= 500:
                raise AnalysisError(
                    f"Le site rencontre une erreur serveur (HTTP {status_code}). Réessayez plus tard."
                ) from exc
            else:
                raise AnalysisError(
                    f"Impossible d'analyser le site : erreur HTTP {status_code}"
                ) from exc
        raise AnalysisError(f"Impossible d'analyser le site : {exc}") from exc

    weight_kb = round(len(content) / 1024, 2)
    img_tags = IMG_PATTERN.findall(html)
    large_images = sum(1 for tag in img_tags if _is_likely_large_image(tag))
    resource_urls = RESOURCE_PATTERN.findall(html)
    request_count = max(1, len(resource_urls) + 1)  # +1 pour le document principal

    parsed_origin = urlparse(url).netloc
    third_party = sum(1 for resource in resource_urls if urlparse(resource).netloc != parsed_origin)
    inline_script_kb = _inline_script_weight(html)

    return PageMetrics(
        page_weight_kb=weight_kb,
        request_count=request_count,
        image_count=len(img_tags),
        large_image_count=large_images,
        third_party_requests=third_party,
        inline_script_kb=inline_script_kb,
    )


def _is_likely_large_image(img_tag: str) -> bool:
    tag_lower = img_tag.lower()
    if "hero" in tag_lower or "banner" in tag_lower:
        return True
    if any(ext in tag_lower for ext in (".png", ".webp", ".jpg", ".jpeg")) and "2x" in tag_lower:
        return True
    matches = SIZE_HINT_PATTERN.findall(img_tag)
    return any(int(match) >= 1400 for match in matches)


def _score(metrics: PageMetrics) -> Tuple[str, str, str]:
    """
    Calcule le score écologique total basé sur 5 métriques.
    Chaque métrique contribue 0-3 points selon des seuils prédéfinis.
    Score total possible : 0-15 points.
    """
    score = 0
    weight = metrics.page_weight_kb
    requests = metrics.request_count
    large_imgs = metrics.large_image_count
    third_party = metrics.third_party_requests
    inline_js = metrics.inline_script_kb

    # Seuils ajustés pour mieux distinguer les niveaux moyens
    # Format: [seuil_bon, seuil_moyen, seuil_lourd]
    score += _bucket(weight, [700, 1500, 2500])      # Poids page (KB)
    score += _bucket(requests, [40, 80, 120])        # Nombre requêtes
    score += _bucket(large_imgs, [1, 4, 8])          # Images grandes
    score += _bucket(third_party, [10, 25, 40])       # Requêtes tierces
    score += _bucket(inline_js, [50, 150, 300])        # Scripts inline (KB)

    level = _score_to_level(score)
    message = LEVEL_MESSAGES[level]
    advice = "; ".join(LEVEL_TIPS[level])
    return level, message, advice


def _bucket(value: float, thresholds):
    if value <= thresholds[0]:
        return 0
    if value <= thresholds[1]:
        return 1
    if value <= thresholds[2]:
        return 2
    return 3


def _score_to_level(score: int) -> str:
    """
    Convertit le score total en niveau écologique.
    
    Distribution équilibrée :
    - A (0-3) : Excellent, très faible impact
    - B (4-6) : Bon, quelques optimisations possibles
    - C (7-9) : Moyen, plusieurs améliorations recommandées
    - D (10-12) : Lourd, impact élevé
    - E (13-15) : Très lourd, optimisation urgente
    """
    if score <= 3:
        return "A"
    if score <= 6:
        return "B"
    if score <= 9:
        return "C"
    if score <= 12:
        return "D"
    return "E"


def _inline_script_weight(html: str) -> float:
    total_bytes = 0
    for match in SCRIPT_PATTERN.findall(html):
        snippet = match.strip()
        if not snippet:
            continue
        total_bytes += len(snippet.encode("utf-8"))
    return round(total_bytes / 1024, 2)


def _get_cached_metrics(url: str):
    entry = _CACHE.get(url)
    if not entry:
        return None
    timestamp, metrics = entry
    if time.time() - timestamp > CACHE_TTL_SECONDS:
        _CACHE.pop(url, None)
        return None
    return metrics


def _set_cached_metrics(url: str, metrics: PageMetrics):
    _CACHE[url] = (time.time(), metrics)
