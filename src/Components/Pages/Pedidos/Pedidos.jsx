import React, { useContext, useEffect, useState } from 'react'
import styles from './Pedidos.module.css'
import Header from '../../Header/Header'
import { GlobalContext } from '../../../Context/GlobalContext';


const Pedidos = () => {
  const { userAuth,currentUser } = useContext(GlobalContext);
  const [pedidos, setPedidos] = useState([]);
  useEffect(()=>{
    if(userAuth.status){
      setPedidos(userAuth.usuario.pedidos.retorno)
    }
  },[userAuth])
  console.log(userAuth);
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

          {userAuth.status && pedidos.map((pedido, index) => (
          <div key={index} className={styles.rowPedido}>
            <span>{pedido.numero}</span>
            <span>{pedido.ped_cli}</span>
            <span>{pedido.dt_emissao}</span>
            <span>{pedido.dt_saida}</span>
            <span>{pedido.situacao_pedido ? pedido.situacao_pedido.descricao: 'AGUARDANDO ANALISE'}</span>
          </div>
        ))}

        </section>

    </div>
  )
}

export default Pedidos
