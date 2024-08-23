import React from 'react'
import { NavLink, Route, Routes } from 'react-router-dom'
import styles from './OptionsGerenciar.module.css'
import OptionsUsuarios from '../OptionsUsuarios/OptionsUsuarios'
const OptionsGerenciar = () => {
  return (
    <div className={styles.container}>
        <div className={styles.listaOptions}>
            <NavLink to={'usuarios'} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}>Usuarios</NavLink>
            <NavLink to={'estoque'} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}>Estoque</NavLink>
        </div>
        <Routes >
            <Route path='usuarios/*' element={<OptionsUsuarios link1={'/'}  text1={'usuarios'}  />}/>
        </Routes>
    </div>
  )
}

export default OptionsGerenciar
