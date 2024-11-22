import React, { useContext } from 'react';
import styles from './MenuLateral.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import LogoAmalfis from '../../../images/logo.svg';
import { GlobalContext } from '../../../Context/GlobalContext';

const MenuLateral = ({ link1, link2, link3, link4, text1, text2, text3, text4 }) => {
  const navigate = useNavigate();
  const { logout } = useContext(GlobalContext);

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  return (
    <div className={`${styles.menuLateral} top-to-down-sequence`}>
      <img src={LogoAmalfis} alt="Logo Amalfis" />
      {link1 && (
        <NavLink to={link1} className={({ isActive }) => (isActive ? styles.btnAtivo : styles.btn)}>
          {text1}
        </NavLink>
      )}
      {link2 && (
        <NavLink to={link2} className={({ isActive }) => (isActive ? styles.btnAtivo : styles.btn)}>
          {text2}
        </NavLink>
      )}
      {link3 && (
        <NavLink to={link3} className={({ isActive }) => (isActive ? styles.btnAtivo : styles.btn)}>
          {text3}
        </NavLink>
      )}
      <NavLink to={link4} className={({ isActive }) => (isActive ? styles.btnAtivo : styles.btn)} onClick={handleLogout}>
        {text4}
      </NavLink>
    </div>
  );
};

export default MenuLateral;
