import { Children, useContext, useRef, useState } from 'react'
import styles from './ModalPedido.module.css'
import Button from '../../Button/Button.jsx';
import {SEND_EMAIL_PED_CODCLI} from '../../../Api/api.js'
import { GlobalContext } from '../../../Context/GlobalContext.jsx';
import { jwtDecode } from 'jwt-decode';
import useFetch from '../../../Hooks/useFetch.jsx';
import Loading from '../../Loading/Loading.jsx';

const ModalPedido = ({modal, setModal, currentPedido}) => {
  const modalContainer = useRef(null);
  const CloseContainerPost = useRef(null);
  const { userAuth, logout,popUp, setPopUp, currentUser } = useContext(GlobalContext);
  const { request, loading,error } = useFetch();
  
  function closeModal(event) {
    event.preventDefault();
    if (
      event.target === modalContainer.current ||
      event.target === CloseContainerPost.current
    ){
      setModal(!modal);
    }
  }

  async function sendPedidoEmail(){
    if(userAuth.status){
      const { codcli } = jwtDecode(userAuth.token);
      if(codcli) {
        const pedido = currentPedido.numero;
        const { url, options } = SEND_EMAIL_PED_CODCLI(codcli, pedido, userAuth.token);
        const { response, json } = await request(url, options);
        if(response.ok){
          setPopUp({
            status:true,
            children:json.message,
            color:'#65d3bb',
          });
          setTimeout(() => {
            setPopUp({
              status:false,
              color: "",
              children: ""
            });
          }, 6000);
        }else{
          setPopUp({
            status:true,
            children:json.message,
            color:'#f8a090',
          });
          setTimeout(() => {
            setPopUp({
              status:false,
              color: "",
              children: ""
            });
          }, 6000);
        }
      }
    }else{
      console.log('usuario nao autenticado, token invalido');
      logout();

    }
  }

  return (
      
      <div  className={styles.containerModal} ref={modalContainer} onClick={closeModal}>
        <section className={`${styles.modal} animation-opacity`}>
            <button
            ref={CloseContainerPost}
            onClick={closeModal}
            className={styles.close}
            >
            X
            </button>
            <div className={styles.infoPed}>
              <div>
                <h3>{currentPedido.info_cliente.nome}</h3>
                <p>EMAIL CADASTRADO: {currentPedido.info_cliente.email}</p>
                <p>CONTATO CADASTRADO: {currentPedido.info_cliente.telefone}</p>
                <p>CNPJ: {currentPedido.info_cliente.cnpj}</p>
              </div>
              <div>
                <h3>Nº PEDIDO: {currentPedido.ped_cli}</h3>
                <p>ID: {currentPedido.numero}</p>
                <p>NF: {currentPedido.nota}</p>
              </div>
              <div>
                <h3>DATAS</h3>
                <p>DT EMISSÃO: {currentPedido.dt_emissao}</p>
                <p>DT SAIDA: {currentPedido.dt_saida}</p>
                <p>DT ENTREGA: {currentPedido.entrega}</p>
              </div>
            </div>
            <div className={styles.buttons}>
              {/* <Button onClick={sendPedidoEmail}>Receber Email</Button> */}
            </div>
            <div className={styles.nomeColuna}>
                <span>NOME</span>
                <div>
                  <span>TAMANHO</span>
                  <span>QTDE_F</span>
                  <span>QTDE_PEN</span>
                </div>
            </div>
            <section className={styles.listaProd}>
                {currentPedido && currentPedido.itens_pedido.map((produtoPed, index) => (
                <div key={index} className={styles.rowPedido}>
                    <span>{produtoPed.detalhes_produto.descricao}</span>
                    <div>
                      <span>{produtoPed.tam}</span>
                      <span>{produtoPed.qtde_f.split('.')[0]}</span>
                      <span>{produtoPed.qtde.split('.')[0]}</span>
                    </div>
                </div>))}
            </section>
            {loading&& (
              <div className={styles.loading}>
                <Loading/>
              </div>
            )}
        </section>
    </div>
  )
}

export default ModalPedido
