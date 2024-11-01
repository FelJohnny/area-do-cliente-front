import React from 'react';
import { NavLink, Route, Routes } from 'react-router-dom';
import styles from './OptionsGerenciar.module.css';
import OptionsEmpresas from './OptionEmpresas/OptionEmpresas';
import OptionsUsuarios from './OptionsUsuarios/OptionsUsuarios';



const OptionsGerenciar = () => {
  return (
    <div className={`${styles.container}`}>
      <div className={`${styles.listaOptions} animeDown`}>
        <NavLink to={'usuarios'} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}>Usuarios</NavLink>
        <NavLink to={'empresas'} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}>Empresas</NavLink>
      </div>
      <Routes>
        <Route path='usuarios/*' element={<OptionsUsuarios />} />
        <Route path='empresas/*' element={<OptionsEmpresas />} />
      </Routes>
    </div>
  );
}

export default OptionsGerenciar;
