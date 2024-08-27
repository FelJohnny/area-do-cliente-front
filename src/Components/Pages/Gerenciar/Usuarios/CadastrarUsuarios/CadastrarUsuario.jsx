import React, { useContext, useState } from 'react'
import styles from './CadastrarUsuario.module.css'
import useForm from '../../../../../Hooks/useForm.jsx';
import InputText from '../../../../Forms/Input/InputText.jsx';
import Button from '../../../../Button/Button.jsx';
import ModalCreateUserColecao from '../../../../Modals/ModalCreateUserColecao/ModalCreateUserColecao.jsx'
import ModalCreateUserClientes from '../../../../Modals/ModalCreateUserClientes/ModalCreateUserClientes.jsx';
import { CRIA_USUARIO } from '../../../../../Api/api.js';
import useFetch from '../../../../../Hooks/useFetch.jsx';
import { GlobalContext } from '../../../../../Context/GlobalContext.jsx';



const CadastrarUsuario = () => {

    const { setPopUp } = useContext(GlobalContext);
    const [modal, setModal] = useState({status: false, mod:''});
    const nomeForm = useForm();
    const emailForm = useForm('email');
    const senhaForm = useForm()
    const contatoForm = useForm()
    const ConfirmarSenhaForm = useForm()
    const [colecao, setColecao] = useState([])
    const [clientes,setClientes] = useState([])
    const { request, loading } = useFetch();


    function abrirModal(e,nomeModal){
        e.preventDefault();        
        setModal({status:true, mod:nomeModal})
    }
    
    async function cadastraUsuario(e){
        e.preventDefault();
        const token = window.localStorage.getItem('token');


        //valida todos os campos
        if (
          nomeForm.validate() &&
          contatoForm.validate() &&
          emailForm.validate() &&
          senhaForm.validate()
        ) {

            const dataClientes =  clientes.map(cliente => ({
                    codcli: cliente.codcli,
                    nome: cliente.nome,
                    cnpj: cliente.cnpj,
                    rg: cliente.num_rg })
                    
                );
                const dataUsuario = {
                    nome: nomeForm.value,
                    email: emailForm.value,
                    contato:contatoForm.value,
                    senha: senhaForm.value,
                    colecao: colecao,
                    clientes: dataClientes,
                    roles_id:['227f61f6-3815-4bb7-b0cd-8819d29ad6ae'],
                    permissoes_id:['3c33c3fc-b5e1-4d87-b162-6b4d0dcf76c3','767adb42-b9ad-4b97-9542-f832fa03a608'],
                };
                
            // console.log(dataUsuario);
        if(token){
            const { url, options } = CRIA_USUARIO(token, dataUsuario);
            const { response, json } = await request(url, options);
            console.log(json);
            
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
              } else {
                setPopUp({
                  status: true,
                  children: 'Erro ao cadastrar',
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
}
    
  return (
    <div className={styles.Container}>

        <h2>Cadastrar um novo usuario</h2>
        <form onSubmit={cadastraUsuario} className={styles.form}>
            <InputText {...nomeForm} label="Nome" id="nome" type="text" />
            <InputText {...emailForm} label="Email" id="email" type="email" />
            <InputText {...contatoForm} label="Contato" id="contato" type="text" />
            <InputText {...senhaForm} label="Senha:" id="senha" type="password" />
            <InputText {...ConfirmarSenhaForm} label="Confirma Senha:" id="confirmsenha" type="password" />
            <div className={styles.buttons}>
                <div className={styles.containerBtn}>
                    <Button onClick={(e)=>abrirModal(e,'clientes')} children={'vincular Clientes'}/>
                    {clientes.length > 0&& "vinculos ok"}
                </div>
                <div className={styles.containerBtn}>
                    <Button onClick={(e)=>abrirModal(e,'colecao')} children={'vincular Coleção'}/>
                    {colecao.length > 0&& "vinculos ok"}

                </div>
            </div>
                <button onClick={(e)=> cadastraUsuario(e)}>cadastrar usuario</button>
        </form>
        {modal.mod === 'clientes' && <ModalCreateUserClientes setModal={setModal} modal={modal} clientes={clientes} setClientes={setClientes}/>}
        {modal.mod === 'colecao' && <ModalCreateUserColecao setModal={setModal} modal={modal} colecao={colecao} setColecao={setColecao}/>}
    </div>
  )
}

export default CadastrarUsuario
