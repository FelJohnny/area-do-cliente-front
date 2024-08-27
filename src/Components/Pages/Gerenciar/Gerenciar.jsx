import React from 'react'
import Header from '../../Header/Header'
import { Route, Routes } from 'react-router-dom'
import CadastrarUsuario from './Usuarios/CadastrarUsuarios/CadastrarUsuario'

const Gerenciar = () => {
  return (
    <div>
        <Header tela={'gerenciar'}/>
        <Routes >
              <Route path='/usuarios/cadastrar' element={<CadastrarUsuario/>}/>
          </Routes>
    </div>
  )
}

export default Gerenciar
