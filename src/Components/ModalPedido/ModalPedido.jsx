import { useRef } from 'react'
import styles from './ModalPedido.module.css'

const ModalPedido = ({modal, setModal, currentPedido}) => {
  const modalContainer = useRef(null);
  const CloseContainerPost = useRef(null);

  function closeModal(event) {
    event.preventDefault();
    if (
      event.target === modalContainer.current ||
      event.target === CloseContainerPost.current
    ){
      setModal(!modal);
    }
  }

  console.log(currentPedido);
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
            <div className={styles.nomeColuna}>
                <span>codigo</span>
                <span>cor</span>
                <span>tam</span>
                <span>preço</span>
                <span>qtde_f</span>
                <span>qtde_pen</span>
            </div>
            <section className={styles.listaProd}>
                {!currentPedido&& (
                    <div className={styles.loading}>
                    <Loading/>
                    </div>
                )}
                {currentPedido && currentPedido.itens_pedido.map((produtoPed, index) => (
                <div key={index} className={styles.rowPedido}>
                    <span>{produtoPed.codigo}</span>
                    <span>{produtoPed.cor}</span>
                    <span>{produtoPed.tam}</span>
                    <span>{produtoPed.preco}</span>
                    <span>{produtoPed.qtde_f}</span>
                    <span>{produtoPed.qtde}</span>
                </div>))}
            </section>
        </section>
    </div>
  )
}

export default ModalPedido
