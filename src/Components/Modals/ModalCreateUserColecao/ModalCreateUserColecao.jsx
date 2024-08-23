import React, { useRef } from 'react'
import styles from './ModalCreateUserColecao.module.css'

const ModalCreateUserColecao = ({modal, setModal,colecao, setColecao}) => {

    const CloseContainer = useRef(null);
    const modalContainer = useRef(null);
    function closeModal(event) {
        event.preventDefault();
        if (
          event.target === modalContainer.current ||
          event.target === CloseContainer.current
        ){
          setModal(!modal);
        }
      }

  return (
    <div className={styles.containerModal} ref={modalContainer} onClick={closeModal}>
        <section className={`${styles.modal} animation-opacity`}>
          <button
            ref={CloseContainer}
            onClick={closeModal}
            className={styles.close}
          >X</button>
          
        </section>
    </div>
  )
}

export default ModalCreateUserColecao
