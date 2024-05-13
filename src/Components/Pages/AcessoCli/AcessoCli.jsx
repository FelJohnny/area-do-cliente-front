import React, { useContext, useEffect, useState } from 'react'
import styles from './AcessoCli.module.css'
import MenuLateral from '../../Menus/MenuLateral/MenuLateral.jsx'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from '../Home/Home.jsx'
import Pedidos from '../Pedidos/Pedidos.jsx'
import { GlobalContext } from '../../../Context/GlobalContext.jsx'
import MenuMobile from '../../Menus/MenuMobile/MenuMobile.jsx'
import { jwtDecode } from 'jwt-decode'
import { GET_AUTH_USER } from '../../../Api/api.js'
import useFetch from '../../../Hooks/useFetch.jsx'

const AcessoCli = () => {

  const { setSizeMobile,sizeMobile, setUserAuth, setCurrentUser, logout, page } = useContext(GlobalContext);
  const { request } = useFetch();
  const navigate = useNavigate()
  //valida token
  useEffect(() => {
    async function fetchValidaToken() {
      const token = window.localStorage.getItem("token");
      if (token) {
        const { codcli } = jwtDecode(token);
        const { url, options } = GET_AUTH_USER(codcli, token, page);
        const { response, json } = await request(url, options);
        if (response.ok) {
          setUserAuth({ token, usuario: json, status: true });
          setCurrentUser(json.pedidos.retorno[0].info_cliente);
        } else {
          setUserAuth({
            token: "",
            usuario: null,
            status: false,
          });
          setCurrentUser(null)
          logout();          
        }
      }else{
        navigate('/')
      }
    }
    fetchValidaToken();
  }, []);

  //valida tamanho tela
  useEffect(()=>{
  function handleResize(){
   setSizeMobile(window.innerWidth < 1100)
  }
  window.addEventListener("resize", handleResize);
  handleResize();
  return () => window.removeEventListener("resize", handleResize);
  },[])

  return (
    <div className={styles.containerAcesso}>
      {!sizeMobile ?
      <div className={styles.containerMenu}>
        <MenuLateral
            link1={'home'}
            link2={'pedidos'}
            link3={'sair'}
            text1={'Home'}
            text2={'Pedidos'}
            text3={'Sair'}
            />
        </div>:''}

        <div className={styles.containerPage}>
          <Routes >
              <Route path='home' element={<Home/>}/>
              <Route path='pedidos' element={<Pedidos />}/>
          </Routes>
        </div>
        {sizeMobile ? 
        <MenuMobile
          link1={'home'}
          link2={'pedidos'}
          link3={'sair'}
          text1={'Home'}
          text2={'Pedidos'}
          text3={'Sair'}
         /> :''}
    </div>
  )
}

export default AcessoCli
