import React, { useContext } from 'react';
import styles from './MenuMobile.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../../../Context/GlobalContext';
import HomeSvg from '../../../images/Home.svg';
import PedidosSvg from '../../../images/Pedidos.svg';
import SairSvg from '../../../images/Sair.svg';

const MenuMobile = ({ link1, link2, link3, text1, text2, text3 }) => {
  const { logout } = useContext(GlobalContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.menuMobile}>
      {link1 && (
        <NavLink to={link1} className={({ isActive }) => (isActive ? styles.btnAtivo : styles.btn)}>
          <img src={HomeSvg} alt={text1} />
        </NavLink>
      )}
      {link2 && (
        <NavLink to={link2} className={({ isActive }) => (isActive ? styles.btnAtivo : styles.btn)}>
          <img src={PedidosSvg} alt={text2} />
        </NavLink>
      )}
      <NavLink to={link3} className={({ isActive }) => (isActive ? styles.btnAtivo : styles.btn)} onClick={handleLogout}>
        <img src={SairSvg} alt={text3} />
      </NavLink>
    </div>
  );
};

export default MenuMobile;
