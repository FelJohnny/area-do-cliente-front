import React, { useState } from 'react'
import styles from './CadastrarUsuario.module.css'
import useForm from '../../../../../Hooks/useForm.jsx';
import InputText from '../../../../Forms/Input/InputText.jsx';
import Button from '../../../../Button/Button.jsx';
import ModalCreateUserColecao from '../../../../Modals/ModalCreateUserColecao/ModalCreateUserColecao.jsx'
import ModalCreateUserClientes from '../../../../Modals/ModalCreateUserClientes/ModalCreateUserClientes.jsx';



const CadastrarUsuario = () => {

    const [modal, setModal] = useState({status: false, mod:''});
    const nomeForm = useForm();
    const emailForm = useForm('email');
    const senhaForm = useForm()
    const ConfirmarSenhaForm = useForm()
    const [colecao, setColecao] = useState([])
    const [clientes,setClientes] = useState([])

    function abrirModal(e,nomeModal){
        e.preventDefault();        
        setModal({status:true, mod:nomeModal})
    }


    function cadastraUsuario(e){
        e.preventDefault();
        
    }

  return (
    <div className={styles.Container}>

        <h2>Cadastrar um novo usuario</h2>
        <form onSubmit={cadastraUsuario} className={styles.form}>
            <InputText {...nomeForm} label="Nome" id="nome" type="text" />
            <InputText {...emailForm} label="Email" id="email" type="email" />
            <InputText {...senhaForm} label="Senha:" id="senha" type="password" />
            <InputText {...ConfirmarSenhaForm} label="Confirma Senha:" id="confirmsenha" type="password" />
            <div className={styles.buttons}>
                <Button onClick={(e)=>abrirModal(e,'colecao')} children={'vincular Coleção'}/>
                <Button onClick={(e)=>abrirModal(e,'clientes')} children={'vincular Clientes'}/>
            </div>
        </form>
        {modal.mod === 'colecao' && <ModalCreateUserColecao setModal={setModal} modal={modal} colecao={colecao} setColecao={setColecao}/>}
        {modal.mod === 'clientes' && <ModalCreateUserClientes setModal={setModal} modal={modal} clientes={clientes} setClientes={setClientes}/>}
    </div>
  )
}

export default CadastrarUsuario
