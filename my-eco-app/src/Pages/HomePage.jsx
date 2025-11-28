import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ANALYZE_ENDPOINT = import.meta.env.VITE_ANALYZE_ENDPOINT || "/api/analyze/";

function HomePage() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!url.trim()) {
      setError("Merci de renseigner l'URL du site à analyser.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(ANALYZE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Analyse impossible pour le moment.");
      }

      navigate("/result", { state: { result: payload } });
    } catch (requestError) {
      setError(requestError.message || "Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-lg flex flex-col items-center gap-6 bg-base-300 p-8 rounded-2xl shadow-2xl">
          <h2 className="font-bold text-2xl sm:text-3xl text-center text-white mb-4">
            Analysez l’impact écologique de votre site web
          </h2>

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <input
              className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              type="text"
              placeholder="Entrez le lien de votre site"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              disabled={loading}
            />

            {error && (
              <p className="text-error text-sm bg-error/10 border border-error/50 rounded-md px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary w-40 mx-auto hover:bg-primary-focus transition-colors disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Analyse..." : "Analyser"}
            </button>
          </form>
        </div>
      </main>

      <footer className="bg-neutral-950 text-center font-extralight p-4 sm:p-6 text-white">
        <p>Copyright &copy; 2025 SMOOD Tech</p>
      </footer>
    </>
  );
}

export default HomePage;
