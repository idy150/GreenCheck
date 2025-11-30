import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLeaf, FaSearch } from "react-icons/fa";

function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!url.trim()) {
      alert("Veuillez entrer une URL");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/analyze/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        navigate("/result", {
          state: {
            level: data.niveau,
            url: url.trim(),
            message: data.message,
            conseils: data.conseils,
            diagnostic: data.diagnostic,
          },
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.error || "Erreur lors de l'analyse. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Impossible de se connecter au serveur. Vérifiez que le backend est démarré.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-base-200 via-base-300 to-base-200">
        <div className="w-full max-w-2xl flex flex-col items-center gap-8 bg-base-300/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-base-content/10 animate-fade-in">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-primary/20 rounded-full animate-pulse">
              <FaLeaf className="text-5xl text-primary" />
            </div>
            <h1 className="font-bold text-3xl sm:text-4xl text-center text-white mb-2">
              Green Check
            </h1>
            <h2 className="font-semibold text-lg sm:text-xl text-center text-base-content/80">
              Analysez l'impact écologique de votre site web
            </h2>
            <p className="text-sm text-center text-base-content/60 max-w-md">
              Découvrez comment votre site web impacte l'environnement et obtenez des conseils pour l'optimiser
            </p>
          </div>

          <button
            className="btn btn-outline btn-sm text-base-content/70 hover:text-base-content"
            onClick={() => navigate("/quiz")}
          >
            🎮 Mini-quiz Green Coding
          </button>

          <div className="w-full flex flex-col gap-4">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/40 text-xl" />
              <input
                className="input input-bordered w-full pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !isLoading) {
                    handleAnalyze();
                  }
                }}
                disabled={isLoading}
              />
            </div>

            <button
              className={`btn btn-primary w-full py-3 text-lg font-semibold hover:scale-105 transition-all duration-200 shadow-lg ${
                isLoading ? "loading" : ""
              }`}
              onClick={handleAnalyze}
              disabled={isLoading}
            >
              {isLoading ? "Analyse en cours..." : "Analyser"}
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-neutral-950 text-center font-extralight p-4 sm:p-6 text-white">
        <p>Copyright &copy; 2025 SMOOD Tech</p>
      </footer>
    </>
  );
}

export default Home;

