import React from 'react'
import styles from './AcessoCli.module.css'
import MenuLateral from '../../MenuLateral/MenuLateral.jsx'
import { Route, Routes } from 'react-router-dom'
import Home from '../Home/Home.jsx'
import Pedidos from '../Pedidos/Pedidos.jsx'

const AcessoCli = () => {
  return (
    <div className={styles.containerAcesso}>
        <MenuLateral
            link1={'home'}
            link2={'pedidos'}
            link3={'sair'}
            text1={'Home'}
            text2={'Pedidos'}
            text3={'Sair'}
        />
        <Routes>
            <Route path='home' element={<Home/>}/>
            <Route path='pedidos' element={<Pedidos />}/>
        </Routes>
    </div>
  )
}

export default AcessoCli
