import { useNavigate } from "react-router-dom";

import { FaScaleBalanced } from "react-icons/fa6";
import { IoIosGitPullRequest } from "react-icons/io";
import { FaRegImages } from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";

  function ResultPage({ level = "A" }) {
  const navigate = useNavigate();

 
  const phrases = {
    A: "Votre site a un tres faible impact, excellent !",
    B: "Bon score, quelques optimisations possibles.",
    C: "Impact moyen, plusieurs améliorations sont recommandees.",
    D: "Site lourd, impact eleve.",
    E: "Impact très fort, optimisation urgente.",
  };

  
  const levelStyles = {
    A: "bg-green-500 text-white",
    B: "bg-blue-500 text-white",
    C: "bg-yellow-400 text-black",
    D: "bg-orange-500 text-white",
    E: "bg-red-600 text-white",
  };


  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center p-10">
        <div className="w-full max-w-md bg-base-300 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6">

          
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Résultat de votre analyse
          </h2>

          
          <div className={`w-32 h-32 flex items-center justify-center rounded-full text-3xl font-bold ${levelStyles[level]}`}>
            {level}
          </div>

          
          <p className="text-center text-lg mt-2">
            {phrases[level]}
          </p>


                <div class="flex items-center gap-2 bg-base-100 p-2 rounded-lg w-full">
                    <FaScaleBalanced className="w-5 h-5 text-primary" />
                    Taille de la page : [ A revoir ]
                </div>
                <div class="flex items-center gap-2 bg-base-100 p-2 rounded-lg w-full">
                    <IoIosGitPullRequest className="w-5 h-5 text-primary" />
                    Nombre de requetes : [ A revoir ]
                </div>
                <div class="flex items-center gap-2 bg-base-100 p-2 rounded-lg w-full">
                    <FaRegImages className="w-5 h-5 text-primary" />
                    Images : [ A revoir ]
                </div>
                <div class="flex items-center gap-2 bg-base-100 p-2 rounded-lg w-full">
                    <MdOutlineDescription className="w-5 h-5 text-primary" />
                    Heavy Script : [ A revoir ]
                </div>

           


             <button
            className="btn btn-primary mt-6 w-48 hover:bg-primary-focus transition-colors"
            onClick={() => navigate("/advice")}
          >
            Voir comment améliorer
          </button>

        </div>
      </main>

     
      <footer className="bg-neutral-950 text-center font-extralight p-4 sm:p-6 text-white">
        <p>Copyright &copy; 2025 SMOOD Tech</p>
      </footer>
    </>
  );
}

export default ResultPage;
