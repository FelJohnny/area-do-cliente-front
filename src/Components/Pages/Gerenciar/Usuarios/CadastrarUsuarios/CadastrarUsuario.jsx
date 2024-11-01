import React, { useContext, useEffect, useState } from 'react';
import styles from './CadastrarUsuario.module.css';
import useForm from '../../../../../Hooks/useForm.jsx';
import InputText from '../../../../Forms/Input/InputText.jsx';
import Button from '../../../../Button/Button.jsx';
import ModalCreateUserColecao from '../../../../Modals/ModalCreateUserColecao/ModalCreateUserColecao.jsx';
import ModalCreateUserClientes from '../../../../Modals/ModalCreateUserClientes/ModalCreateUserClientes.jsx';
import { CRIA_USUARIO, GET_PERMISSOES, GET_PERMISSOES_BY_ROLE, GET_ROLES, GET_EMPRESAS } from '../../../../../Api/api.js';
import useFetch from '../../../../../Hooks/useFetch.jsx';
import { GlobalContext } from '../../../../../Context/GlobalContext.jsx';
import InputSelect from '../../../../Forms/InputSelect/InputSelect.jsx';

const CadastrarUsuario = () => {
    const { setPopUp } = useContext(GlobalContext);
    const [modal, setModal] = useState({ status: false, mod: '' });
    const nomeForm = useForm();
    const emailForm = useForm('email');
    const senhaForm = useForm();
    const contatoForm = useForm();
    const ConfirmarSenhaForm = useForm();

    const [colecao, setColecao] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [cargoFetch, setCargoFetch] = useState([]);
    const [permissoesFetch, setPermissoesFetch] = useState([]);
    const [permissoesCRUD, setPermissoesCRUD] = useState({});
    const [cargo, setCargo] = useState('');
    const [empresasFetch, setEmpresasFetch] = useState([]); // Estado para armazenar as empresas
    const [empresa, setEmpresa] = useState(''); // Estado para a empresa selecionada
    const { request, loading } = useFetch();

    useEffect(() => {
        async function carregaRoles() {
            const token = window.localStorage.getItem("token");
            const { url, options } = GET_ROLES(token);
            const { response, json } = await request(url, options);
            if (response.ok) {
                setCargoFetch(json);
            } else {
                setPopUp({
                    status: true,
                    children: 'Não foi possível carregar os cargos, tente novamente mais tarde',
                    color: '#ee5a35',
                });
                setTimeout(() => {
                    setPopUp({
                        status: false,
                        color: "",
                        children: ""
                    });
                }, 6000);
            }
        }

        async function carregaEmpresas() {
            const token = window.localStorage.getItem("token");
            const { url, options } = GET_EMPRESAS(token);
            const { response, json } = await request(url, options);
            if (response.ok) {
                setEmpresasFetch(json); // Armazena as empresas carregadas
            } else {
                setPopUp({
                    status: true,
                    children: 'Não foi possível carregar as empresas, tente novamente mais tarde',
                    color: '#ee5a35',
                });
                setTimeout(() => {
                    setPopUp({
                        status: false,
                        color: "",
                        children: ""
                    });
                }, 6000);
            }
        }

        carregaRoles();
        carregaEmpresas();
    }, []);

    // Função para buscar permissões com base no cargo selecionado
    const handleCargoChange = async (selectedCargo) => {
        setPermissoesCRUD({})
        if (selectedCargo !== cargo) {
            setCargo(selectedCargo);
            if (selectedCargo) {
                const token = window.localStorage.getItem("token");
                const { url, options } = GET_PERMISSOES_BY_ROLE(token, selectedCargo);
                const { response, json } = await request(url, options);
                if (response.ok) {
                    setPermissoesFetch(json);
                } else {
                    setPopUp({
                        status: true,
                        children: 'Não foi possível carregar as permissões para o cargo selecionado',
                        color: '#ee5a35',
                    });
                    setTimeout(() => {
                        setPopUp({
                            status: false,
                            color: "",
                            children: ""
                        });
                    }, 6000);
                }
            }
        }
    };

    function abrirModal(e, nomeModal) {
        e.preventDefault();
        setModal({ status: true, mod: nomeModal });
    }

    const handleCRUDChange = (e, permissaoId, crudType) => {
        const isChecked = e.target.checked;

        setPermissoesCRUD((prevState) => ({
            ...prevState,
            [permissaoId]: {
                ...prevState[permissaoId],
                [crudType]: isChecked
            }
        }));
    };

    async function cadastraUsuario(e) {
        e.preventDefault();
    
        const token = window.localStorage.getItem('token');
        if (
            nomeForm.validate() &&
            contatoForm.validate() &&
            emailForm.validate() &&
            senhaForm.validate() &&
            clientes.length > 0 &&
            colecao.length > 0 &&
            cargo &&
            empresa // Verifica se a empresa foi selecionada
        ) {
            const dataClientes = clientes.map(cliente => ({
                codcli: cliente.codcli,
                nome: cliente.nome,
                cnpj: cliente.cnpj,
                rg: cliente.num_rg
            }));
    
            // Extrai todos os permissoes_id a partir do permissoesCRUD
            const permissoesIdArray = Object.keys(permissoesCRUD);
    
            // Prepara o objeto permissoesCRUD para ser enviado
            const permissoesCRUDArray = Object.keys(permissoesCRUD).map(permissaoId => ({
                permissao_id: permissaoId,
                can_create: permissoesCRUD[permissaoId].can_create || false,
                can_read: permissoesCRUD[permissaoId].can_read || false,
                can_update: permissoesCRUD[permissaoId].can_update || false,
                can_delete: permissoesCRUD[permissaoId].can_delete || false,
            }));
    
            const dataUsuario = {
                nome: nomeForm.value,
                email: emailForm.value,
                contato: contatoForm.value,
                senha: senhaForm.value,
                colecao: colecao,
                clientes: dataClientes,
                permissoes_id: permissoesIdArray,
                roles_id: [cargo],
                empresa_id: empresa, // Inclui a empresa selecionada
                permissoesCRUD: permissoesCRUDArray
            };
            
            if (token) {
                const { url, options } = CRIA_USUARIO(token, dataUsuario);
                const { response, json } = await request(url, options);
                if (response.ok) {
                    setPopUp({
                        status: true,
                        children: 'Cadastro realizado',
                        color: '#01be50',
                    });
                    setTimeout(() => {
                        setPopUp({
                            status: false,
                            color: "",
                            children: ""
                        });
                    }, 6000);
    
                    // Limpar todos os campos após o cadastro bem-sucedido
                    nomeForm.reset();         // Limpa o campo de nome
                    emailForm.reset();        // Limpa o campo de email
                    contatoForm.reset();      // Limpa o campo de contato
                    senhaForm.reset();        // Limpa o campo de senha
                    ConfirmarSenhaForm.reset(); // Limpa o campo de confirmação de senha
                    setClientes([]);          // Limpa os clientes vinculados
                    setColecao([]);           // Limpa as coleções vinculadas
                    setCargo('');             // Reseta o cargo selecionado
                    setEmpresa('');           // Reseta a empresa selecionada
                    setPermissoesCRUD({});     // Limpa as permissões CRUD selecionadas
                    setPermissoesFetch([]);    // Limpa as permissões carregadas
    
                } else {
                    setPopUp({
                        status: true,
                        children: json.message,
                        color: '#ee5a35',
                    });
                    setTimeout(() => {
                        setPopUp({
                            status: false,
                            color: "",
                            children: ""
                        });
                    }, 6000);
                }
            }
        } else {
            setPopUp({
                status: true,
                children: "Preencha todos os campos necessários",
                color: '#f03202',
            });
            setTimeout(() => {
                setPopUp({
                    status: false,
                    color: "",
                    children: ""
                });
            }, 6000);
        }
    }

    return (
        <div className={`${styles.Container} animation-left-rigth-suav`}>
            <h2 className={styles.tituloPage}>Cadastrar um novo usuário</h2>
            <div className={styles.containerForm}>
                <form onSubmit={cadastraUsuario} className={styles.form}>
                    <InputText {...nomeForm} label="Nome" id="nome" type="text" autoComplete="off" />
                    <InputText {...emailForm} label="Email" id="email" type="email" autoComplete="off" />
                    <InputText {...contatoForm} label="Contato" id="contato" type="text" autoComplete="off" />
                    <InputText {...senhaForm} label="Senha:" id="senha" type="password" autoComplete="new-password" />
                    <InputText {...ConfirmarSenhaForm} label="Confirma Senha:" id="confirmsenha" type="password" autoComplete="new-password" />
        
                    <div className={styles.buttons}>
                        <div className={styles.containerBtn}>
                            <Button onClick={(e) => abrirModal(e, 'clientes')} children={'Vincular Clientes'} />
                            {clientes.length > 0 && "Vínculos OK"}
                        </div>
                        <div className={styles.containerBtn}>
                            <Button onClick={(e) => abrirModal(e, 'colecao')} children={'Vincular Coleção'} />
                            {colecao.length > 0 && "Vínculos OK"}
                        </div>
                    </div>

                    <InputSelect
                        label="Empresa:"
                        id='empresa'
                        options={empresasFetch}
                        placeholder="Selecione uma empresa"
                        onChange={(e) => setEmpresa(e.target.value)}
                        value={empresa}
                    />
                    <InputSelect
                        label="Cargo:"
                        id='cargo'
                        options={cargoFetch}
                        placeholder="Selecione um cargo"
                        onChange={(e) => handleCargoChange(e.target.value)}
                        value={cargo}
                    />

                    <div className={styles.permissoes}>
                        <h3 className={styles.Label}>Permissões</h3>
                        {!loading && permissoesFetch.map((permissao) => (
                            <div key={permissao.id} className={styles.permissaoItem}>
                                <span className={styles.nomePermissao}>{permissao.nome}</span>
                                <div className={styles.crudCheckboxes}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={permissoesCRUD[permissao.id]?.can_create || false}
                                            onChange={(e) => handleCRUDChange(e, permissao.id, 'can_create')}
                                            className={styles.checkbox}
                                        />
                                        Criar
                                    </label>
                                    
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={permissoesCRUD[permissao.id]?.can_read || false}
                                            onChange={(e) => handleCRUDChange(e, permissao.id, 'can_read')}
                                            className={styles.checkbox}

                                        />
                                        Consultar
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={permissoesCRUD[permissao.id]?.can_update || false}
                                            onChange={(e) => handleCRUDChange(e, permissao.id, 'can_update')}
                                            className={styles.checkbox}

                                        />
                                        Alterar
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={permissoesCRUD[permissao.id]?.can_delete || false}
                                            onChange={(e) => handleCRUDChange(e, permissao.id, 'can_delete')}
                                            className={styles.checkbox}

                                        />
                                        Deletar
                                    </label>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Button type="submit" children={'Cadastrar Usuário'} />

                </form>
                <div className={styles.observacao}>
                    <h1 className={styles.TituloObservacao}>Observações</h1>
                    <p> - Os <span className={styles.bold}>Clientes</span> e <span className={styles.bold}>Coleções</span> vinculadas ao usuário tem como objetivo principal filtrar os pedidos e produtos que o mesmo pode visualizar</p>
                    <h2 className={styles.subTituloObservacao}>Cargos</h2>
                    <p> - Cada cargo possui permissões distintas, que podem ser gerenciadas na aba de Cargos</p>
                    <h2 className={styles.subTituloObservacao}>Permissoes</h2>
                    <p> - As Permissões normalmente liberam acesso a telas e funcionalidades, portanto nem sempre os quatro tipos de acessos terão impacto na funcionalidade desejada</p>
                    <p>Porem é extremamente recomendado que libere apenas o que corresponde com o que o usuário utilizará</p>
                </div>
            </div>

            {modal.mod === 'clientes' && <ModalCreateUserClientes setModal={setModal} modal={modal} clientes={clientes} setClientes={setClientes} />}
            {modal.mod === 'colecao' && <ModalCreateUserColecao setModal={setModal} modal={modal} colecao={colecao} setColecao={setColecao} />}
        </div>
    );
}

export default CadastrarUsuario;
