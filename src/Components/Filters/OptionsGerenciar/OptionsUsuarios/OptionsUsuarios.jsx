import React from 'react'
import { NavLink } from 'react-router-dom'
import styles from './OptionsUsuarios.module.css'

const OptionsUsuarios = () => {
  return (
    <div className={`${styles.sublista} top-to-down-sequence`}>
        <NavLink to={'listar'} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}>Listar</NavLink>
        <NavLink to={'cadastrar'} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}>Cadastrar</NavLink>
        <NavLink to={'editar'} className={({ isActive }) => isActive ? styles.btnAtivo : styles.btn}>Editar</NavLink>
    </div>
  )
}

export default OptionsUsuarios
