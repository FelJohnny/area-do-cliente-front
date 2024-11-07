import { createContext, useEffect, useState } from "react";


export const GlobalContext = createContext();

export const GlobalStorage = ({ children }) => {
  //define se a tela corresponde a um mobile
  //obs: caso sizeMobile inicie como false a autenticacao do token nao é executada
  const [sizeMobile, setSizeMobile] = useState(true)

  const [popUp, setPopUp] =useState({
    status:false,
    color: "",
    children: ""
  })

  
  //================================CONSULTA DE PEDIDOS POR DATA=================================/
  function getDate(monthsAgo, startOfMonth = false) {
    const date = new Date();
  // Ajusta a data para três meses atrás
    date.setMonth(date.getMonth() - monthsAgo);

    if (startOfMonth) {
      date.setDate(1); // Define o dia como 1 para começar do primeiro dia do mês
    }

    // Formatação da data
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  }
  const [inicio, setInicio] = useState(getDate(4,true))
  const [final, setFinal] = useState(getDate(0))

  const [pedidosPorData, setPedidosPorData] = useState(null);
    //=============================================================================================/
  
  const [page, setPage] = useState(1);

  const [currentUser, setCurrentUser] = useState({})

  function logout() {
    setCurrentUser({status:false})
    window.localStorage.removeItem('token')
    //window.location.reload();
  }

  const [modal, setModal]=useState({
    status: false,
    nome: '',
    data:null,
  })



  return (
    <GlobalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        logout,
        page,
        setPage,
        sizeMobile,
        setSizeMobile,
        popUp,
        setPopUp,
        inicio,
        setInicio,
        final,
        setFinal,
        pedidosPorData,
        setPedidosPorData,
        modal, setModal
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
