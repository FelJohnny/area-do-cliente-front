import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './OptionsEmpresas.module.css';

const OptionsEmpresas = () => {
  return (
    <div className={`${styles.sublista} top-to-down-sequence`}>
      <NavLink to={'listar'} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}>Listar</NavLink>
      <NavLink to={'cadastrar'} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}>Cadastrar</NavLink>
    </div>
  );
}

export default OptionsEmpresas;
