import React, { useContext } from 'react'
import styles from './ModalConfirmaDelete.module.css'
import { GlobalContext } from '../../../../Context/GlobalContext';
import { DELETE_EMPRESA } from '../../../../Api/api';
import useFetch from '../../../../Hooks/useFetch';

const ModalConfirmaDelete = () => {

  const { modal, setModal, setPopUp } = useContext(GlobalContext);
  const { request } = useFetch();
  
  function closeModal() {
    setModal({ status: false, nome: '', data: null });
  }

  async function deletaEmpresa(id){
    const token = window.localStorage.getItem('token');
    const {url, options} = DELETE_EMPRESA(token,id);
    const { response, json } = await request(url, options);
    if(response.ok){
        setPopUp({
            status: true,
            children: json.message,
            color: '#01be50',
        });
        setTimeout(() => {
            setPopUp({
                status: false,
                color: "",
                children: ""
            });
        }, 6000);
        closeModal();
    }else{
      if(json.message){
        setPopUp({
            status: true,
            children: json.message,
            color: '#e45f5f',
        });
        setTimeout(() => {
            setPopUp({
                status: false,
                color: "",
                children: ""
            });
        }, 6000);
        closeModal();
      }
    }
  }
  
  return (
    <div className={styles.containerModal}>
        <div className={styles.modal}>
            <h2 className={styles.texto}>Tem certeza que deseja excluir a empresa:</h2>
            <h2 className={styles.nomeEmpresa}>{modal.data.nome}</h2>
            <div className={styles.buttonsDelete}>
                <button className={styles.btnYes} onClick={()=>deletaEmpresa(modal.data.id)}>Sim</button>
                <button className={styles.btnNo} onClick={()=> closeModal()}>Não</button>
            </div>
        </div>
      
    </div>
  )
}

export default ModalConfirmaDelete
