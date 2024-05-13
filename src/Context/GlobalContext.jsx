import { createContext, useEffect, useState } from "react";


export const GlobalContext = createContext();

export const GlobalStorage = ({ children }) => {
  //define se a tela corresponde a um mobile
  //obs: caso sizeMobile inicie como false a autenticacao do token nao é executada
  const [sizeMobile, setSizeMobile] = useState(true)
  
  const [page, setPage] = useState(1);
  const [userAuth, setUserAuth] = useState({
    token: "",
    usuario: null,
    status: false,
  });

  const [currentUser, setCurrentUser] = useState({})

  function logout() {
    setUserAuth({
        token: "",
        usuario: null,
        status: false,
    })
    window.localStorage.removeItem('token')
    window.location.reload();
  }

  return (
    <GlobalContext.Provider
      value={{
        userAuth,
        setUserAuth,
        currentUser,
        setCurrentUser,
        logout,
        page,
        setPage,
        sizeMobile,
        setSizeMobile,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
