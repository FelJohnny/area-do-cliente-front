import React, { useContext, useEffect, useState } from 'react'
import styles from './Login.module.css'
import useForm from '../../../Hooks/useForm.jsx'
import InputText from '../../Forms/Input/InputText.jsx';
import Loading from '../../Loading/Loading.jsx'
import Button from '../../Button/Button.jsx'
import LogoAmalfis from '../../../images/logo.svg'
import { GET_USUARIO, POST_LOGIN } from '../../../Api/api.js';
import useFetch from '../../../Hooks/useFetch.jsx';
import { jwtDecode } from 'jwt-decode';
import { GlobalContext } from '../../../Context/GlobalContext.jsx';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [token, setToken] = useState(null);

    const emailForm = useForm('email');
    const senhaForm = useForm()
    const navigate = useNavigate()
    const { request, error, loading, data } = useFetch();
    const { userAuth, currentUser, setCurrentUser, logout } = useContext(GlobalContext);


    async function handleSubimit(e){ 
      e.preventDefault();
      if (emailForm.validate() && senhaForm.validate()) {
          const dataLogin = {
            email: emailForm.value,
            senha: senhaForm.value,
          };

        async function postLogin(){
            const { url, options } = POST_LOGIN(dataLogin);
            const requestLogin = await request(url, options);
            if (requestLogin.response.ok) {
              const token = requestLogin.json.token;
              setToken(token);
              window.localStorage.setItem("token", token);
              authLogin(token);
              navigate('/area-cli/home')
            }else {
              setToken(null);
            }
        }

        async function authLogin(token) {
            const { id } = jwtDecode(token);
            const { url, options } = GET_USUARIO(id, token);
            const { response, json } = await request(url, options);
            if (!response.ok) {
              setCurrentUser(null)
            } else {
              setCurrentUser({
                usuario:json.usuario,
                status: json.status,
                token:token,
              });
            }
        }

        postLogin();
      }
    }


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
            navigate('/area-cli/home')
          } else {
            navigate('/')
            logout();
          }
        }else{
          navigate('/')
        }
      }
      fetchValidaToken();
    }, []);

  return (
    <div className={styles.bodyLogin}>
        <h1 className={`animation-opacity`}>Área do cliente</h1>
        <section className={`${styles.containerLogin} animation-opacity`}>
            <div className={styles.backgroudLogin }></div>
            <div className={`${styles.ContainerForm} animation-rigth-to-left`}>
                <form action="">
                    <img src={LogoAmalfis} alt="Logo Amalfis" />
                    <InputText {...emailForm} label="Email" id="email" type="email" />
                    <InputText {...senhaForm} label="Senha" id="senha" type="password" />
                    <Button onClick={handleSubimit}>{currentUser.status ? 'Bem vindo' :'Entrar'}</Button>
                    <p className={data && !loading ? styles.error : ''}>
                    {data && !loading ? data.message : ''}
                    </p>
                    {loading? <Loading/> : <span></span>}
                </form>
            </div>
        </section>
    </div>
  )
}

export default Login
