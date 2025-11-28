import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const fallbackAdvice = {
  A: [
    "Votre site est très léger, continuez à surveiller le poids des médias.",
    "Automatisez la compression des nouvelles images.",
    "Évitez d'ajouter des scripts tiers non indispensables.",
  ],
  B: [
    "Compressez les images d'arrière-plan et bannière.",
    "Réduisez les animations non essentielles.",
    "Activez la mise en cache navigateur pour les assets.",
    "Simplifiez les bibliothèques JavaScript utilisées.",
  ],
  C: [
    "Activez le lazy-loading sur toutes les images.",
    "Combinez ou supprimez les scripts tiers inutiles.",
    "Utilisez une compression serveur (gzip/brotli).",
    "Réduisez le nombre de requêtes simultanées.",
  ],
  D: [
    "Remplacez les images lourdes par des versions responsives.",
    "Scindez votre bundle JS pour charger uniquement le nécessaire.",
    "Supprimez les animations coûteuses sur mobile.",
    "Choisissez un hébergement plus performant et vert.",
  ],
  E: [
    "Auditez chaque page pour retirer les assets superflus.",
    "Convertissez toutes les images en WebP/AVIF avec forte compression.",
    "Réduisez drastiquement les scripts et widgets externes.",
    "Appliquez un design plus simple pour limiter les composants.",
    "Activez cache + CDN pour servir les assets statiques.",
  ],
};

function AdvicePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const level = location.state?.level || "A";
  const providedAdvice = location.state?.conseils || [];

  useEffect(() => {
    if (!location.state?.level) {
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  const adviceList =
    providedAdvice.length > 0
      ? providedAdvice
      : fallbackAdvice[level] || fallbackAdvice.C;

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4 py-10">
        <div className="w-full max-w-lg bg-base-300 p-8 rounded-2xl shadow-2xl flex flex-col gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Conseils pour améliorer votre site
          </h2>

          <ul className="flex flex-col gap-4">
            {adviceList.map((item, index) => (
              <li key={index} className="bg-base-100 p-4 rounded-lg text-white shadow-sm">
                {item}
              </li>
            ))}
          </ul>

          <button
            className="btn btn-primary mt-6 w-48 self-center hover:bg-primary-focus transition-colors"
            onClick={() => navigate("/")}
          >
            Revenir à l'accueil
          </button>
        </div>
      </main>

      <footer className="bg-neutral-950 text-center font-extralight p-4 sm:p-6 text-white">
        <p>Copyright &copy; 2025 SMOOD Tech</p>
      </footer>
    </>
  );
}

export default AdvicePage;
