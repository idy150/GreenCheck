import { useNavigate, useLocation } from "react-router-dom";
import { FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaArrowRight, FaWeight, FaNetworkWired, FaImages, FaCode } from "react-icons/fa";

function Result() {
  const navigate = useNavigate();
  const location = useLocation();

  const level = location.state?.level || "C";
  const diagnostic = location.state?.diagnostic || {};

  const phrases = {
    A: "Très bon",
    B: "Bon",
    C: "Moyen",
    D: "Mauvais",
    E: "Très mauvais",
  };

  const descriptions = {
    A: "Votre site a un très faible impact environnemental. Excellent travail !",
    B: "Votre site est bien optimisé, mais quelques améliorations sont possibles.",
    C: "Votre site a un impact moyen. Plusieurs optimisations sont recommandées.",
    D: "Votre site est lourd et a un impact élevé sur l'environnement.",
    E: "Votre site a un impact très fort. Une optimisation urgente est nécessaire.",
  };

  const levelStyles = {
    A: "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50",
    B: "bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/50",
    C: "bg-gradient-to-br from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/50",
    D: "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/50",
    E: "bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg shadow-red-600/50",
  };

  const levelIcons = {
    A: <FaCheckCircle className="text-6xl" />,
    B: <FaCheckCircle className="text-6xl" />,
    C: <FaExclamationTriangle className="text-6xl" />,
    D: <FaExclamationTriangle className="text-6xl" />,
    E: <FaTimesCircle className="text-6xl" />,
  };

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-base-200 via-base-300 to-base-200">
        <div className="w-full max-w-lg bg-base-300/90 backdrop-blur-sm p-8 sm:p-10 rounded-3xl shadow-2xl border border-base-content/10 flex flex-col items-center gap-6 animate-fade-in">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-white">
            Résultat de l'analyse
          </h2>

          <div className="relative">
            <div
              className={`w-40 h-40 flex flex-col items-center justify-center rounded-full text-5xl font-bold ${levelStyles[level]} animate-scale-in`}
            >
              <div className="text-6xl mb-2">{levelIcons[level]}</div>
              <span className="text-6xl font-black">{level}</span>
            </div>
            <div className={`absolute inset-0 rounded-full ${levelStyles[level]} opacity-20 animate-ping`}></div>
          </div>

          <div className="text-center space-y-2">
            <p className="text-2xl font-bold text-white">{phrases[level]}</p>
            <p className="text-base text-base-content/70 max-w-md">{descriptions[level]}</p>
          </div>

          {diagnostic && Object.keys(diagnostic).length > 0 && (
            <div className="w-full space-y-3 mt-4">
              <h3 className="text-lg font-semibold text-white text-center mb-3">
                Détails de l'analyse
              </h3>

              <div className="bg-base-100/60 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaWeight className="text-primary text-xl" />
                  <span className="text-white">Poids de la page</span>
                </div>
                <span className="text-white font-semibold">
                  {diagnostic.page_weight_kb?.toFixed(2) || 0} KB
                </span>
              </div>

              <div className="bg-base-100/60 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaNetworkWired className="text-primary text-xl" />
                  <span className="text-white">Nombre de requêtes</span>
                </div>
                <span className="text-white font-semibold">{diagnostic.request_count || 0}</span>
              </div>

              <div className="bg-base-100/60 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaImages className="text-primary text-xl" />
                  <span className="text-white">Images</span>
                </div>
                <span className="text-white font-semibold">
                  {diagnostic.image_count || 0} total
                  {diagnostic.large_image_count > 0 && (
                    <span className="text-orange-400 ml-2">
                      ({diagnostic.large_image_count} grandes)
                    </span>
                  )}
                </span>
              </div>

              <div className="bg-base-100/60 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaCode className="text-primary text-xl" />
                  <span className="text-white">Scripts intégrés</span>
                </div>
                <span className="text-white font-semibold">
                  {diagnostic.inline_script_kb?.toFixed(2) || 0} KB
                </span>
              </div>

              {diagnostic.third_party_requests > 0 && (
                <div className="bg-base-100/60 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaNetworkWired className="text-primary text-xl" />
                    <span className="text-white">Requêtes tierces</span>
                  </div>
                  <span className="text-white font-semibold">
                    {diagnostic.third_party_requests}
                  </span>
                </div>
              )}
            </div>
          )}

          <button
            className="btn btn-primary mt-4 w-full sm:w-64 hover:scale-105 transition-all duration-200 shadow-lg group"
            onClick={() => navigate("/tips", { state: { level } })}
          >
            <span>Voir comment améliorer</span>
            <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content"
            onClick={() => navigate("/")}
          >
            Analyser un autre site
          </button>
        </div>
      </main>

      <footer className="bg-neutral-950 text-center font-extralight p-4 sm:p-6 text-white">
        <p>Copyright &copy; 2025 SMOOD Tech</p>
      </footer>
    </>
  );
}

export default Result;

