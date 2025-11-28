import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Result from "./pages/Result.jsx";
import Tips from "./pages/Tips.jsx";
import Quiz from "./pages/Quiz.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/result" element={<Result />} />
      <Route path="/tips" element={<Tips />} />
      <Route path="/quiz" element={<Quiz />} />
    </Routes>
  );
}

export default App;
