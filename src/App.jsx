import './App.css'
import Login from './Components/Login/Login';
import { GlobalStorage } from "./Context/GlobalContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {

  return (
  <GlobalStorage>
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </GlobalStorage>
  )

}

export default App
