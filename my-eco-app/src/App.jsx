
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage.jsx";
import ResultPage from "./Pages/ResultPage.jsx";
import AdvicePage from "./Pages/AdvicePage.jsx";


function App() {
 

  return (
    <>
       <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/advice" element={<AdvicePage />} />
       </Routes>
    </>
  )
}

export default App
