import React, { useContext, useEffect, useState } from 'react'
import styles from './Pedidos.module.css'
import Header from '../../Header/Header'
import { GlobalContext } from '../../../Context/GlobalContext';
import Loading from '../../Loading/Loading.jsx'
import Button from '../../Button/Button.jsx'
import ModalPedido from '../../ModalPedido/ModalPedido.jsx';
import useFetch from '../../../Hooks/useFetch.jsx';
import { GET_AUTH_USER } from '../../../Api/api.js';
import { jwtDecode } from 'jwt-decode';

const Pedidos = () => {
  const { userAuth,currentUser,page, setPage,setUserAuth} = useContext(GlobalContext);
  const [pedidos, setPedidos] = useState([]);
  const [currentPedido, setCurrentPedido]=useState();
  const [modal, setModal] = useState(false);
  const { loading, data, request, error, setLoading } = useFetch();
  const [lasPage, setLastPage]= useState('');

  useEffect(()=>{
    if(!userAuth.status){
      setLoading(true)
    }
  },[])

  useEffect(()=>{
    if(userAuth.status){
      setPedidos(userAuth.usuario.pedidos.retorno)
      setLastPage(userAuth.usuario.paginacao.total_Pages)
      setLoading(false)
    }
  },[userAuth])


  async function paginacao(page){
    setLoading(true)
    setPage(page)
    const { codcli } = jwtDecode(userAuth.token);
    const { url, options } = GET_AUTH_USER(codcli, userAuth.token, page);
    const { response, json } = await request(url, options);
    if (response.ok) {
      setUserAuth({ token:userAuth.token, usuario: json, status: true });
    }
  }

  function currentPedidoFunction(index){
    setCurrentPedido(pedidos[index])
    setModal(true)
  }

  return (
    <div className={styles.containerPedidos}>
        <Header/>
        <section>
          <div className={styles.nomeColuna}>
            <span>ID</span>
            <span>N° PEDIDO</span>
            <span>EMISSÃO</span>
            <span>ENTREGA_PREV</span>
            <span>SITUAÇÃO</span>
          </div>
          {loading&& (
            <div className={styles.loading}>
              <Loading/>
            </div>
          )}
          {userAuth.status&& !loading&& pedidos.map((pedido, index) => (
          <div key={index} className={`${styles.rowPedido} animation-left-rigth-suav`}>
            <span>{pedido.numero}</span>
            <span>{pedido.ped_cli}</span>
            <span>{pedido.dt_emissao}</span>
            <span>{pedido.dt_saida}</span>
            <span>{pedido.situacao_pedido ? pedido.situacao_pedido.descricao: 'AGUARDANDO ANALISE'}</span>
            <Button onClick={()=>currentPedidoFunction(index)}>Ver mais</Button>
          </div>
          ))}
          {!loading&& <div className={styles.navegacao}>
            {page !==1 ? <button type='button' onClick={()=> paginacao(1)}>primeira</button>: <button type='button' disabled>primeira</button>}
            {page !==1 && page !==2? <button type='button' onClick={()=> paginacao(page -2)}>{page -2}</button>:''}
            {page !==1 ? <button type='button' onClick={()=> paginacao(page -1)}>{page -1}</button>:''}
            <button type='button' disabled>{page}</button>
            {page + 1 <= lasPage ? <button type='button' onClick={()=> paginacao(page + 1)}>{page +1}</button>:''}
            {page + 2 <= lasPage ? <button type='button' onClick={()=> paginacao(page + 2)}>{page +2}</button>:''}
            {page !== lasPage ?<button type='button' onClick={()=> paginacao(lasPage)}>ultima</button>: <button type='button' disabled>ultima</button>}
          </div>}
        </section>
        {modal&& <ModalPedido setModal={setModal} pedidos={pedidos} currentPedido={currentPedido} modal={modal}/>}

    </div>
  )
}

export default Pedidos
