import { createContext, useEffect, useState } from "react";
import useFetch from "../Hooks/useFetch";


export const GlobalContext = createContext();

export const GlobalStorage = ({ children }) => {
  
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
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
