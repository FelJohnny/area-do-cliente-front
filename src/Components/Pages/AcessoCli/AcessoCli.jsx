import React, { useContext, useEffect, useState } from 'react'
import styles from './AcessoCli.module.css'
import MenuLateral from '../../Menus/MenuLateral/MenuLateral.jsx'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Home from '../Home/Home.jsx'
import Pedidos from '../Pedidos/Pedidos.jsx'
import { GlobalContext } from '../../../Context/GlobalContext.jsx'
import MenuMobile from '../../Menus/MenuMobile/MenuMobile.jsx'
import { jwtDecode } from 'jwt-decode'
import { GET_USUARIO } from '../../../Api/api.js'
import useFetch from '../../../Hooks/useFetch.jsx'
import PopUp from '../../PopUp/PopUp.jsx'
import Gerenciar from '../Gerenciar/Gerenciar.jsx'

const AcessoCli = () => {

  const { setSizeMobile,sizeMobile, setUserAuth, setCurrentUser, logout, page, popUp,currentUser } = useContext(GlobalContext);
  const { request } = useFetch();
  const navigate = useNavigate();

  //valida token
  useEffect(() => {
    async function fetchValidaToken() {
      const token = window.localStorage.getItem("token");
      if (token) {
        const { id } = jwtDecode(token);
        const { url, options } = GET_USUARIO(id, token);
        const { response, json } = await request(url, options);
        if (response.ok) {
          setCurrentUser({
            usuario:json.usuario,
            status: json.status,
            token:token,
          });
        } else {
          navigate('/');
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
          // link3={'gerenciar'}
          link3={'/'}
          text1={'Home'}
          text2={'Pedidos'}
          // text3={'Gerenciar'}
          text3={'Sair'}
        />
      </div>:''}

        <div className={styles.containerPage}>
          <Routes >
              <Route path='home' element={<Home/>}/>
              <Route path='pedidos' element={<Pedidos />}/>
              {/* <Route path='gerenciar/*' element={<Gerenciar/>}/> */}
          </Routes>
        </div>
        {sizeMobile ? 
        <MenuMobile
          link1={'home'}
          link2={'pedidos'}
          link3={'/'}
          text1={'Home'}
          text2={'Pedidos'}
          text3={'Sair'}
         /> :''}
       <PopUp status={popUp.status} color={popUp.color}>{popUp.children}</PopUp>
    </div>
  )
}

export default AcessoCli
