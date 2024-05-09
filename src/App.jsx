import './App.css'
import AcessoCli from './Components/Pages/AcessoCli/AcessoCli';
import Login from './Components/Pages/Login/Login';
import { GlobalStorage } from "./Context/GlobalContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {

  return (
  <GlobalStorage>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route exact path="/area-cli/*" element={<AcessoCli/>} />
      </Routes>
    </BrowserRouter>
  </GlobalStorage>
  )

}

export default App
