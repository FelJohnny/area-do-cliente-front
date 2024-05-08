import React from 'react'
import styles from './Login.module.css'
import useForm from '../../Hooks/useForm'
import InputText from '../Forms/Input/InputText';
import Button from '../Button/Button.jsx'
import LogoAmalfis from '../../images/logo.svg'

const Login = () => {
    const emailForm = useForm('email');
    const senhaForm = useForm()

    async function handleSubimit(e){ 
        e.preventDefault();
    }

  return (
    <div className={styles.bodyLogin}>
        <section className={styles.containerLogin}>
            <div className={styles.backgroudLogin}></div>
            <div className={styles.ContainerForm}>
                <form action="">
                    <img src={LogoAmalfis} alt="Logo Amalfis" />
                    <InputText {...emailForm} label="Email" id="email" type="email" />
                    <InputText {...senhaForm} label="Senha" id="senha" type="password" />
                    <Button onClick={handleSubimit}>Entrar</Button>
                </form>
            </div>
        </section>
    </div>
  )
}

export default Login
