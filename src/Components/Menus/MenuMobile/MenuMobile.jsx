import React, { useContext } from 'react'
import styles from './MenuMobile.module.css'
import { NavLink } from 'react-router-dom'
import { GlobalContext } from '../../../Context/GlobalContext'
import HomeSvg from '../../../images/Home.svg'
import PedidosSvg from '../../../images/Pedidos.svg'
import SairSVG from '../../../images/Sair.svg'

const MenuMobile = ({link1, link2,link3, text1, text2,text3}) => {
  const {logout }=useContext(GlobalContext)

    function handleLogout(){
        logout();
    }

  return (
    <div className={styles.menuMobile}>
        <NavLink to={link1} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}><img src={HomeSvg}/></NavLink>
        <NavLink to={link2} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}><img src={PedidosSvg}/></NavLink>
        <NavLink to={link3} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn} onClick={handleLogout}><img src={SairSVG}/></NavLink>
    </div>
  )
}

export default MenuMobile
