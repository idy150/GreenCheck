import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaScaleBalanced } from "react-icons/fa6";
import { IoIosGitPullRequest } from "react-icons/io";
import { FaRegImages } from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";

const levelStyles = {
  A: "bg-green-500 text-white",
  B: "bg-blue-500 text-white",
  C: "bg-yellow-400 text-black",
  D: "bg-orange-500 text-white",
  E: "bg-red-600 text-white",
};

function ResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const result = location.state?.result;

  useEffect(() => {
    if (!result) {
      navigate("/", { replace: true });
    }
  }, [result, navigate]);

  if (!result) {
    return null;
  }

  const { niveau, message, diagnostic = {}, conseils = "" } = result;
  const adviceList = conseils
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center p-10">
        <div className="w-full max-w-md bg-base-300 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            Résultat de votre analyse
          </h2>

          <div
            className={`w-32 h-32 flex items-center justify-center rounded-full text-3xl font-bold ${
              levelStyles[niveau] || levelStyles.C
            }`}
          >
            {niveau}
          </div>

          <p className="text-center text-lg mt-2 text-white">{message}</p>

          <div className="w-full flex flex-col gap-3">
            <StatRow
              icon={<FaScaleBalanced className="w-5 h-5 text-primary" />}
              label="Poids de la page"
              value={`${diagnostic.page_weight_kb ?? "?"} Ko`}
            />
            <StatRow
              icon={<IoIosGitPullRequest className="w-5 h-5 text-primary" />}
              label="Nombre de requêtes"
              value={diagnostic.request_count ?? "?"}
            />
            <StatRow
              icon={<FaRegImages className="w-5 h-5 text-primary" />}
              label="Images (dont lourdes)"
              value={`${diagnostic.image_count ?? "?"} / ${
                diagnostic.large_image_count ?? "?"
              }`}
            />
            <StatRow
              icon={<MdOutlineDescription className="w-5 h-5 text-primary" />}
              label="Scripts inline"
              value={`${diagnostic.inline_script_kb ?? "?"} Ko`}
            />
          </div>

          <button
            className="btn btn-primary mt-6 w-48 hover:bg-primary-focus transition-colors"
            onClick={() =>
              navigate("/advice", {
                state: { level: niveau, conseils: adviceList },
              })
            }
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

function StatRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 bg-base-100 p-3 rounded-lg w-full text-white">
      {icon}
      <span className="flex-1">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export default ResultPage;

