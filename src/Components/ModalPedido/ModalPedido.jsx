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

  console.log(currentPedido.itens_pedido);
  return (
      
      <div  className={styles.containerModal} ref={modalContainer} onClick={closeModal}>
            <button
            ref={CloseContainerPost}
            onClick={closeModal}
            className={styles.close}
            >
            X
            </button>
        <section className={`${styles.modal} animation-opacity`}>
            <p>{currentPedido.numero}</p>
            
            <section>
                <div className={styles.nomeColuna}>
                    <span>codigo</span>
                    <span>cor</span>
                    <span>tam</span>
                    <span>preço</span>
                    <span>qtde_f</span>
                    <span>qtde_pen</span>
                </div>
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
                    

                </div>
                ))}
            </section>
        </section>
    </div>
  )
}

export default ModalPedido
