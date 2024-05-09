import React, { useContext, useEffect, useState } from 'react'
import styles from './Pedidos.module.css'
import Header from '../../Header/Header'
import { GlobalContext } from '../../../Context/GlobalContext';
import Loading from '../../Loading/Loading.jsx'
import Button from '../../Button/Button.jsx'
import ModalPedido from '../../ModalPedido/ModalPedido.jsx';

const Pedidos = () => {
  const { userAuth,currentUser } = useContext(GlobalContext);
  const [pedidos, setPedidos] = useState([]);
  const [currentPedido, setCurrentPedido]=useState();
  const [modal, setModal] = useState(false);

  useEffect(()=>{
    if(userAuth.status){
      setPedidos(userAuth.usuario.pedidos.retorno)
    }
  },[userAuth])

  function currentPedidoFunction(index){
    
    setCurrentPedido(pedidos[index])
    setModal(true)
  }

  return (
    <div className={styles.containerPedidos}>
        <Header/>
        <section>
          <div className={styles.nomeColuna}>
            <span>id</span>
            <span>ped_cli</span>
            <span>emissão</span>
            <span>entrega_prev</span>
            <span>situação</span>
          </div>
          {!userAuth.status&& (
            <div className={styles.loading}>
              <Loading/>
            </div>
          )}
          {userAuth.status && pedidos.map((pedido, index) => (
          <div key={index} className={styles.rowPedido}>
            <span>{pedido.numero}</span>
            <span>{pedido.ped_cli}</span>
            <span>{pedido.dt_emissao}</span>
            <span>{pedido.dt_saida}</span>
            <span>{pedido.situacao_pedido ? pedido.situacao_pedido.descricao: 'AGUARDANDO ANALISE'}</span>
            <Button onClick={()=>currentPedidoFunction(index)}>Ver mais</Button>
          </div>
        ))}
        </section>
        {modal&& <ModalPedido setModal={setModal} pedidos={pedidos} currentPedido={currentPedido} modal={modal}/>}

    </div>
  )
}

export default Pedidos
