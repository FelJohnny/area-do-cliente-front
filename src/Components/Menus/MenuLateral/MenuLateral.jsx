import styles from './MenuLateral.module.css'
import { NavLink, useNavigate } from 'react-router-dom'
import LogoAmalfis from '../../../images/logo.svg'
import { useContext } from 'react'
import { GlobalContext } from '../../../Context/GlobalContext'


const MenuLateral = ({link1, link2,link3,link4, text1, text2,text3,text4}) => {
  const navigate=  useNavigate()

  const {logout }=useContext(GlobalContext)
  
  function handleLogout(){
    navigate('/')
    logout();
  }
  
  return (
    <div className={`${styles.menuLateral}`}>
        <img src={LogoAmalfis} alt="" />
        <NavLink to={link1} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}>{text1}</NavLink>
        <NavLink to={link2} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}>{text2}</NavLink>
        <NavLink to={link3} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}>{text3}</NavLink>
        <NavLink to={link4} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn} onClick={handleLogout}>{text4}</NavLink>
    </div>
  )
}

export default MenuLateral
