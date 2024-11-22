import React from 'react';
import Header from '../../Header/Header';
import { Route, Routes } from 'react-router-dom';
import CadastrarUsuario from './Usuarios/CadastrarUsuarios/CadastrarUsuario';
import ListarUsuarios from './Usuarios/ListarUsuarios/ListarUsuarios';
import CadastrarEmpresa from './Empresas/CadastrarEmpresa/CadastrarEmpresa';
import ListarEmpresas from './Empresas/ListarEmpresas/ListarEmpresas';

const Gerenciar = () => {
  return (
    <div>
      <Header tela={'gerenciar'} />
      <Routes>
        <Route path='/usuarios/cadastrar' element={<CadastrarUsuario />} />
        <Route path='/usuarios/listar' element={<ListarUsuarios/>} />
        <Route path='/empresas/cadastrar' element={<CadastrarEmpresa />} />   {/* Rota para cadastrar empresa */}
        <Route path='/empresas/listar' element={<ListarEmpresas />} />              {/* Rota para listar empresas */}
      </Routes>
    </div>
  );
}

export default Gerenciar;
