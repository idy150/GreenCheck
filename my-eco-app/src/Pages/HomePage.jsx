function HomePage() {
  return (
    <>
      
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-lg flex flex-col items-center gap-6 bg-base-300 p-8 rounded-2xl shadow-2xl">
          
         
          <h2 className="font-bold text-2xl sm:text-3xl text-center text-white mb-4">
            Analysez l’impact écologique de votre site web
          </h2>
          
          
          <input
            className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
            type="text"
            placeholder="Entrez le lien de votre site"
          />
          
          
          <button className="btn btn-primary w-40 hover:bg-primary-focus transition-colors">
            Analyser
          </button>
        </div>
      </main>

      
      <footer className="bg-neutral-950 text-center font-extralight p-4 sm:p-6 text-white">
        <p>Copyright &copy; 2025 SMOOD Tech</p>
      </footer>
    </>
  );
}

export default HomePage;
