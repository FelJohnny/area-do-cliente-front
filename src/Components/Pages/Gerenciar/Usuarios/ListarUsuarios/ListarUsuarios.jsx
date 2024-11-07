import React, { useState, useEffect, useContext } from 'react';
import styles from './ListarUsuarios.module.css';
import { GET_USUARIOS, DELETE_USUARIO, GET_PERMISSOES_BY_ROLE, GET_ROLES, UPDATE_USUARIO } from '../../../../../Api/api';
import { GlobalContext } from '../../../../../Context/GlobalContext';
import useFetch from '../../../../../Hooks/useFetch';
import InputText from '../../../../Forms/Input/InputText';
import InputSelect from '../../../../Forms/InputSelect/InputSelect';
import ModalCreateUserColecao from '../../../../Modals/ModalCreateUserColecao/ModalCreateUserColecao';
import ModalCreateUserClientes from '../../../../Modals/ModalCreateUserClientes/ModalCreateUserClientes';

const ListarUsuarios = () => {
  const { setPopUp } = useContext(GlobalContext);
  const { request } = useFetch();
  const [usuarios, setUsuarios] = useState([]);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [modalEditing, setModalEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [cargoFetch, setCargoFetch] = useState([]);
  const [permissoesFetch, setPermissoesFetch] = useState([]);
  const [permissoesCRUD, setPermissoesCRUD] = useState({});
  const [modal, setModal] = useState({ status: false, mod: '' });
  const [modalDelete, setModalDelete] = useState({ status: false, mod: '' });
  const [colecao, setColecao] = useState([]);
  const [clientes, setClientes] = useState([]);

  // Carrega todos os usuários
  useEffect(() => {
    const fetchUsuarios = async () => {
      const token = window.localStorage.getItem('token');
      const { url, options } = GET_USUARIOS(token);
      const { response, json } = await request(url, options);
      if (response.ok) setUsuarios(json.usuarios || []);
    };
    fetchUsuarios();
  }, [request]);

  // Carrega os cargos para seleção
  useEffect(() => {
    const fetchRoles = async () => {
      const token = window.localStorage.getItem("token");
      const { url, options } = GET_ROLES(token);
      const { response, json } = await request(url, options);
      if (response.ok) setCargoFetch(json);
    };
    fetchRoles();
  }, [request]);

  // Função para carregar permissões com base no cargo selecionado
  const handleCargoChange = async (selectedCargo) => {
    setPermissoesCRUD({});
    setSelectedUser((prev) => ({ ...prev, cargo: selectedCargo }));
    if (selectedCargo) {
      const token = window.localStorage.getItem("token");
      const { url, options } = GET_PERMISSOES_BY_ROLE(token, selectedCargo);
      const { response, json } = await request(url, options);
      if (response.ok) setPermissoesFetch(json);
    }
  };

  // Função para manipular mudanças CRUD
  const handleCRUDChange = (e, permissaoId, crudType) => {
    const isChecked = e.target.checked;
    setPermissoesCRUD((prev) => ({
      ...prev,
      [permissaoId]: { ...prev[permissaoId], [crudType]: isChecked }
    }));
  };

  // Função para abrir o modal de edição
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalEditing(true);
    handleCargoChange(user.usuario_roles[0]?.id || '');
    setColecao(user.usuario_colecoes || []);
    setClientes(user.usuario_clientes || []);
  };

  // Função para alternar exibição de detalhes
  const toggleUserDetails = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };



  // Função para excluir um usuário
  const handleDeleteUser = async (userId) => {
    const token = window.localStorage.getItem('token');
    const { url, options } = DELETE_USUARIO(token, userId);
    const { response, json } = await request(url, options);

    if (response.ok) {
      setUsuarios(usuarios.filter((user) => user.id !== userId));
      setPopUp({
        status: true,
        children: `Usuário excluído com sucesso!`,
        color: '#01be50',
      });
      setModalDelete({status: false, data:''})
    } else {
      setPopUp({
        status: true,
        children: 'Erro ao excluir usuário',
        color: '#ee5a35',
      });
      setModalDelete({status: false, data:''})

    }
  };

  // Função para abrir modais específicos para Clientes e Coleção
  const abrirModal = (e, nomeModal) => {
    e.preventDefault();
    setModal({ status: true, mod: nomeModal });
  };

  // Função para salvar as alterações do usuário
  const handleSaveChanges = async () => {
    const token = window.localStorage.getItem('token');
    const updatedData = {
      nome: selectedUser.nome,
      email: selectedUser.email,
      cargo: selectedUser.cargo,
      colecao,
      clientes,
      permissoesCRUD: Object.keys(permissoesCRUD).map(permissaoId => ({
        permissao_id: permissaoId,
        can_create: permissoesCRUD[permissaoId].can_create || false,
        can_read: permissoesCRUD[permissaoId].can_read || false,
        can_update: permissoesCRUD[permissaoId].can_update || false,
        can_delete: permissoesCRUD[permissaoId].can_delete || false,
      }))
    };

    if (token) {
      const { url, options } = UPDATE_USUARIO(token, selectedUser.id, updatedData);
      
      const { response, json } = await request(url, options);
      console.log(response);

      if (response.ok) {
        setPopUp({
          status: true,
          children: 'Alterações salvas com sucesso!',
          color: '#01be50',
        });
        setModalEditing(false);
        setUsuarios((prevUsers) =>
          prevUsers.map((user) => (user.id === selectedUser.id ? { ...user, ...updatedData } : user))
        );
      } else {
        setPopUp({
          status: true,
          children: 'Erro ao salvar alterações',
          color: '#ee5a35',
        });
      }
    }
  };

  useEffect(()=>{
    console.log(permissoesCRUD);
    
  })

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lista de Usuários</h2>
      <div className={styles.userList}>
        <div className={styles.columnsName}>
          <span className={styles.columnChild}>nome</span>
          <span className={styles.columnChild}>e-mail</span>
          <span className={styles.columnChild}>ações</span>
        </div>
        {usuarios.map((user) => (
          <div key={user.id} className={styles.userItem}>
            <div className={styles.userInfo}>
              <span className={styles.infoChild}>{user.nome}</span>
              <span className={styles.infoChild}>{user.email}</span>
              <div className={styles.infoChild+ ' ' + styles.infoButtons}>
                <button onClick={() => toggleUserDetails(user.id)} className={styles.actionButton}>
                  Visualizar
                </button>
                <button onClick={() => handleEditUser(user)} className={styles.actionButton}>
                  Editar
                </button>
                <button onClick={() => setModalDelete({status: true, data:user})} className={styles.actionButton}>
                  Excluir
                </button>
              </div>
            </div>
            {expandedUserId === user.id && (
              <div className={styles.userDetails}>
                <p><strong>Contato:</strong> {user.contato}</p>
                <p><strong>Cargo:</strong> {user.usuario_roles.map(role => role.nome).join(', ')}</p>
                <p><strong>Coleções:</strong> {user.usuario_colecoes.map(col => col.descricao).join(', ')}</p>
                <p><strong>Clientes:</strong></p>
                <div className={styles.containerRowClientes}>
                  {user.usuario_clientes.map((cli) => (
                    <div key={cli.cnpj} className={styles.row}>
                      <span className={styles.clienteNome}>{cli.nome}</span>
                      <span className={styles.clienteCnpj}>{cli.cnpj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {modalEditing && selectedUser && (
        <div className={styles.containerModal}>
          <div className={styles.modal}>
            <h2>Editar Usuário</h2>
            <InputText
              label="Nome:"
              id="nome"
              type="text"
              value={selectedUser.nome}
              onChange={(e) => setSelectedUser({ ...selectedUser, nome: e.target.value })}
            />
            <InputText
              label="Email:"
              id="email"
              type="email"
              value={selectedUser.email}
              onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
            />

            <button onClick={(e) => abrirModal(e, 'clientes')} className={styles.modalButton}>
              Editar Clientes
            </button>
            {clientes.length > 0 && "Vínculos OK"}

            <button onClick={(e) => abrirModal(e, 'colecao')} className={styles.modalButton}>
              Editar Coleção
            </button>
            {colecao.length > 0 && "Vínculos OK"}

            <InputSelect
              label="Cargo:"
              id="cargo"
              options={cargoFetch}
              onChange={(e) => handleCargoChange(e.target.value)}
              value={selectedUser.cargo}
            />

            <div className={styles.permissoes}>
              <h3>Permissões</h3>
              {permissoesFetch.map((permissao) => (
                <div key={permissao.id} className={styles.permissaoItem}>
                  <span className={styles.nomePermissao}>{permissao.nome}</span>
                  <div className={styles.crudCheckboxes}>
                    <label>
                      <input
                        type="checkbox"
                        checked={permissoesCRUD[permissao.id]?.can_create || false}
                        onChange={(e) => handleCRUDChange(e, permissao.id, 'can_create')}
                      />
                      Criar
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={permissoesCRUD[permissao.id]?.can_read || false}
                        onChange={(e) => handleCRUDChange(e, permissao.id, 'can_read')}
                      />
                      Consultar
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={permissoesCRUD[permissao.id]?.can_update || false}
                        onChange={(e) => handleCRUDChange(e, permissao.id, 'can_update')}
                      />
                      Alterar
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={permissoesCRUD[permissao.id]?.can_delete || false}
                        onChange={(e) => handleCRUDChange(e, permissao.id, 'can_delete')}
                      />
                      Deletar
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleSaveChanges} className={styles.saveButton}>
              Salvar Alterações
            </button>
            <button onClick={() => setModalEditing(false)} className={styles.closeButton}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {modal.status && modal.mod === 'clientes' && (
        <ModalCreateUserClientes
          setModal={setModal}
          modal={modal}
          clientes={clientes}
          setClientes={setClientes}
        />
      )}
      {modal.status && modal.mod === 'colecao' && (
        <ModalCreateUserColecao
          setModal={setModal}
          modal={modal}
          colecao={colecao}
          setColecao={setColecao}
        />
      )}

      {modalDelete.status&&(
        <div className={styles.containerModal}>
          <div className={styles.modalDelete}>
            <p>Tem certeza que deseja excluir o usuario:</p>
            <p>{modalDelete.data.nome}</p>
            <button onClick={()=>handleDeleteUser(modalDelete.data.id)}>SIM</button>
            <button onClick={()=>setModalDelete({status: false, data:''})}>NÃO</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListarUsuarios;
