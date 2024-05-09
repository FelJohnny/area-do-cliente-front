import styles from './MenuLateral.module.css'
import { NavLink, useNavigate } from 'react-router-dom'
import LogoAmalfis from '../../images/logo.svg'
import { GlobalContext } from '../../Context/GlobalContext';
import { useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { GET_AUTH_USER } from '../../Api/api';
import useFetch from '../../Hooks/useFetch';

const MenuLateral = ({link1, link2,link3, text1, text2,text3, setBtnAtivo}) => {

  const { setUserAuth, setCurrentUser, logout } = useContext(GlobalContext);
  const { request } = useFetch();

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchValidaToken() {
      const token = window.localStorage.getItem("token");
      if (token) {
        const { codcli } = jwtDecode(token);
        const { url, options } = GET_AUTH_USER(codcli, token);
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

  function handleLogout(){
    logout();
  }
  
  return (
    <div className={`${styles.menuLateral}`}>
        <img src={LogoAmalfis} alt="" />
        <NavLink to={link1} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}>{text1}</NavLink>
        <NavLink to={link2} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}>{text2}</NavLink>
        <NavLink to={link3} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn} onClick={handleLogout}>{text3}</NavLink>
    </div>
  )
}

export default MenuLateral
