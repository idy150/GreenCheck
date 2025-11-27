import { useLocation, useNavigate } from "react-router-dom";

function AdvicePage() {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  
  const level = location.state?.level || "A"; 

  
  const advice = {
    A: [
      "Votre site est tres leger, continuez ainsi.",
      "Optimisez les images si nécessaire.",
      "Evitez les scripts inutiles."
    ],
    B: [
      "Compresser les images pour reduire le poids.",
      "Reduire les animations non essentielles.",
      "Limiter les scripts inutiles.",
      "Utiliser un design simple et efficace."
    ],
    C: [
      "Compresser toutes les images.",
      "Reduire le nombre de requêtes.",
      "Eviter les scripts lourds ou inutiles.",
      "Utiliser une compression côté serveur."
    ],
    D: [
      "Reduire drastiquement les images lourdes.",
      "Minimiser les scripts et CSS.",
      "Eviter les animations complexes.",
      "Choisir un hébergement plus performant et ecologique."
    ],
    E: [
      "Optimiser toutes les images et medias.",
      "Supprimer tous les scripts inutiles.",
      "Simplifier le design pour réduire le poids.",
      "Utiliser compression et cache cote serveur.",
      "Revoir totalement l’architecture du site."
    ]
  };

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4 py-10">
        <div className="w-full max-w-lg bg-base-300 p-8 rounded-2xl shadow-2xl flex flex-col gap-6">

          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Conseils pour améliorer votre site
          </h2>

          <ul className="flex flex-col gap-4">
            {advice[level].map((item, index) => (
              <li key={index} className="bg-base-100 p-4 rounded-lg text-white shadow-sm">
                {item}
              </li>
            ))}
          </ul>

        
          <button
            className="btn btn-primary mt-6 w-48 self-center hover:bg-primary-focus transition-colors"
            onClick={() => navigate("/")} // pour revenir au page dacceuil
          >
            Revenir à l'accueil
          </button>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-950 text-center font-extralight p-4 sm:p-6 text-white">
        <p>Copyright &copy; 2025 SMOOD Tech</p>
      </footer>
    </>
  );
}

export default AdvicePage;
