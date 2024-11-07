import React, { useContext, useEffect, useState } from 'react';
import styles from './ModalUsuariosEmpresa.module.css';
import { GlobalContext } from '../../../../Context/GlobalContext';
import { GET_USUARIOS_BY_EMPRESA, GET_USUARIOS_DISPONIVEIS, ADD_USUARIO_TO_EMPRESA, DELETE_USUARIO_FROM_EMPRESA } from '../../../../Api/api';
import useFetch from '../../../../Hooks/useFetch';

const formatarData = (data) => {
  const date = new Date(data);
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const ano = date.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

const ModalUsuariosEmpresa = () => {
  const { modal, setModal, setPopUp } = useContext(GlobalContext);
  const { request } = useFetch();
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosDisponiveis, setUsuariosDisponiveis] = useState([]);
  const [showAddUserList, setShowAddUserList] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [usuarioToRemove, setUsuarioToRemove] = useState(null);

  function closeModal() {
    setModal({ status: false, nome: '', data: null });
  }

  const fetchUsuariosPorEmpresa = async (empresaId) => {
    const token = window.localStorage.getItem('token');
    const { url, options } = GET_USUARIOS_BY_EMPRESA(token, empresaId);
    const { response, json } = await request(url, options);
    if (response.ok) setUsuarios(json);
  };

  useEffect(() => {
    if (modal.data?.id) {
      fetchUsuariosPorEmpresa(modal.data.id);
    }
  }, [modal.data, request]);

  useEffect(() => {
    const fetchUsuariosDisponiveis = async () => {
      const token = window.localStorage.getItem('token');
      const { url, options } = GET_USUARIOS_DISPONIVEIS(token);
      const { response, json } = await request(url, options);

      if (response.ok) {
        const usuariosFiltrados = json.filter(
          (user) => !usuarios.some((u) => u.id === user.id)
        );
        setUsuariosDisponiveis(usuariosFiltrados);
      }
    };

    if (showAddUserList) {
      fetchUsuariosDisponiveis();
    }
  }, [showAddUserList, request, usuarios]);

  const handleAddUser = async (usuarioId) => {
    const token = window.localStorage.getItem('token');
    const { url, options } = ADD_USUARIO_TO_EMPRESA(token, modal.data.id, usuarioId);
    const { response, json } = await request(url, options);

    if (response.ok) {
      await fetchUsuariosPorEmpresa(modal.data.id);
      setPopUp({
        status: true,
        children: `Usuário adicionado com sucesso!`,
        color: '#01be50',
      });
      setTimeout(() => setPopUp({ status: false, children: '', color: '' }), 4000);
      setShowAddUserList(false);
    } else {
      setPopUp({
        status: true,
        children: json.message || 'Erro ao adicionar usuário',
        color: '#ee5a35',
      });
      setTimeout(() => setPopUp({ status: false, children: '', color: '' }), 4000);
    }
  };

  const confirmRemoveUser = (usuarioId) => {
    setUsuarioToRemove(usuarioId);
    setShowConfirmation(true);
  };

  const handleRemoveUser = async () => {
    const token = window.localStorage.getItem('token');
    const { url, options } = DELETE_USUARIO_FROM_EMPRESA(token, modal.data.id, usuarioToRemove);
    const { response, json } = await request(url, options);

    if (response.ok) {
      setUsuarios((prev) => prev.filter((user) => user.id !== usuarioToRemove));
      setPopUp({
        status: true,
        children: `Usuário removido com sucesso!`,
        color: '#01be50',
      });
      setTimeout(() => setPopUp({ status: false, children: '', color: '' }), 4000);
      setShowConfirmation(false);
      setUsuarioToRemove(null);
    } else {
      setPopUp({
        status: true,
        children: json.message || 'Erro ao remover usuário',
        color: '#ee5a35',
      });
      setTimeout(() => setPopUp({ status: false, children: '', color: '' }), 4000);
    }
  };

  return (
    <div className={styles.containerModal}>
      <div className={`${styles.modal} animation-opacity`}>
        <div className={styles.close} onClick={closeModal}>X</div>
        <h1 className={styles.tituloModal}>Usuários da Empresa</h1>

        <button className={styles.addUserButton} onClick={() => setShowAddUserList(!showAddUserList)}>
          {showAddUserList ? 'Voltar para Usuários Vinculados' : 'Adicionar Usuários'}
        </button>

        {showAddUserList ? (
          <div className={styles.userList}>
            {usuariosDisponiveis.length > 0 ? (
              usuariosDisponiveis.map((user) => (
                <div className={styles.userRow} key={user.id}>
                  <span>{user.nome}</span>
                  <button
                    className={styles.addUserActionButton}
                    onClick={() => handleAddUser(user.id)}
                  >
                    Adicionar
                  </button>
                </div>
              ))
            ) : (
              <p className={styles.noUsersText}>Todos os usuários já estão vinculados.</p>
            )}
          </div>
        ) : (
          <>
            <div className={styles.ColumnsName}>
              <span>Nome</span>
              <span>Email</span>
              <span>Contato</span>
              <span className={styles.columnUsuarioData}>Criado</span>
              <span className={styles.columnUsuarioData}>Atualizado</span>
              <span className={styles.columnUsuarioData}>Ações</span>
            </div>
            {usuarios.length > 0 ? (
              usuarios.map((usuario) => (
                <div className={styles.usuariosRow} key={usuario.id}>
                  <span>{usuario.nome}</span>
                  <span>{usuario.email}</span>
                  <span>{usuario.contato}</span>
                  <span className={styles.usuarioData}>{formatarData(usuario.createdAt)}</span>
                  <span className={styles.usuarioData}>{formatarData(usuario.updatedAt)}</span>
                  <div className={styles.containerButtons}>
                    <button className={styles.buttonsModal}>Visualizar</button>
                    <button className={styles.buttonsModal}>Editar</button>
                    <button
                      className={styles.buttonsModalRemove}
                      onClick={() => confirmRemoveUser(usuario.id)}
                    >
                      Remover
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.notUsers}>
                <h2>Sem usuários vinculados a esta empresa</h2>
              </div>
            )}
          </>
        )}

        {showConfirmation && (
          <div className={styles.confirmationModal}>
            <div className={styles.confirmationContent}>
              <p>Tem certeza de que deseja remover este usuário?</p>
              <div className={styles.confirmationButtons}>
                <button onClick={handleRemoveUser} className={styles.confirmButton}>Confirmar</button>
                <button onClick={() => setShowConfirmation(false)} className={styles.cancelButton}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalUsuariosEmpresa;
