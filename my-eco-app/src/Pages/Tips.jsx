import { useNavigate, useLocation } from "react-router-dom";
import { FaLightbulb, FaCheck, FaHome, FaArrowLeft } from "react-icons/fa";

function Tips() {
  const navigate = useNavigate();
  const location = useLocation();

  const level = location.state?.level || "C";

  const tips = {
    A: [
      "Votre site est déjà très optimisé, continuez ainsi !",
      "Optimisez les images si nécessaire avec des formats modernes (WebP, AVIF).",
      "Évitez d'ajouter des scripts inutiles à l'avenir.",
      "Maintenez une architecture légère et performante.",
    ],
    B: [
      "Compresser les images pour réduire le poids de la page.",
      "Réduire les animations non essentielles.",
      "Limiter les scripts inutiles et les bibliothèques JavaScript lourdes.",
      "Utiliser un design simple et efficace.",
      "Choisir un hébergement écologique si possible.",
    ],
    C: [
      "Compresser toutes les images et utiliser des formats modernes.",
      "Réduire le nombre de requêtes HTTP.",
      "Éviter les scripts lourds ou inutiles.",
      "Utiliser une compression côté serveur (Gzip, Brotli).",
      "Optimiser le CSS et le JavaScript (minification).",
    ],
    D: [
      "Réduire drastiquement les images lourdes et les remplacer par des versions optimisées.",
      "Minimiser les scripts et CSS non essentiels.",
      "Éviter les animations complexes et les effets visuels lourds.",
      "Choisir un hébergement plus performant et écologique.",
      "Mettre en place un système de cache efficace.",
    ],
    E: [
      "Optimiser toutes les images et médias (compression, formats modernes).",
      "Supprimer tous les scripts inutiles et réduire les dépendances.",
      "Simplifier le design pour réduire significativement le poids.",
      "Utiliser compression et cache côté serveur de manière agressive.",
      "Revoir totalement l'architecture du site pour la rendre plus légère.",
      "Envisager un hébergement vert et optimisé.",
    ],
  };

  const levelColors = {
    A: "text-green-400",
    B: "text-blue-400",
    C: "text-yellow-400",
    D: "text-orange-400",
    E: "text-red-400",
  };

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-base-200 via-base-300 to-base-200 px-4 py-10">
        <div className="w-full max-w-2xl bg-base-300/90 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-2xl border border-base-content/10 flex flex-col gap-6 animate-fade-in">
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className={`p-3 bg-primary/20 rounded-full ${levelColors[level]}`}>
              <FaLightbulb className="text-4xl" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white">
              Conseils pour améliorer votre site
            </h2>
            <p className="text-sm text-center text-base-content/60">
              Voici des recommandations adaptées à votre niveau ({level})
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {tips[level].map((tip, index) => (
              <div
                key={index}
                className="bg-base-100/80 backdrop-blur-sm p-5 rounded-xl text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-l-4 border-primary flex items-start gap-4 group"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="p-2 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors">
                    <FaCheck className="text-primary text-sm" />
                  </div>
                </div>
                <p className="text-sm sm:text-base flex-1 pt-1">{tip}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <button
              className="btn btn-outline w-full hover:scale-105 transition-all duration-200 group"
              onClick={() => navigate("/quiz")}
            >
              🎮 Tester mes connaissances (Quiz)
            </button>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                className="btn btn-primary flex-1 hover:scale-105 transition-all duration-200 shadow-lg group"
                onClick={() => navigate("/")}
              >
                <FaHome className="mr-2" />
                Revenir à l'accueil
              </button>
              <button
                className="btn btn-ghost flex-1 text-base-content/60 hover:text-base-content group"
                onClick={() => navigate("/result", { state: { level } })}
              >
                <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
                Retour aux résultats
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-neutral-950 text-center font-extralight p-4 sm:p-6 text-white">
        <p>Copyright &copy; 2025 SMOOD Tech</p>
      </footer>
    </>
  );
}

export default Tips;

