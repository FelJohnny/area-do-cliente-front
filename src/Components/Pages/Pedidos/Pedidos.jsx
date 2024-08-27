import React, { useContext, useEffect, useState } from 'react'
import styles from './Pedidos.module.css'
import Header from '../../Header/Header'
import { GlobalContext } from '../../../Context/GlobalContext';
import Loading from '../../Loading/Loading.jsx'
import Button from '../../Button/Button.jsx'
import ModalPedido from '../../Modals/ModalPedido/ModalPedido.jsx';
import useFetch from '../../../Hooks/useFetch.jsx';
import { GET_PEDIDOS } from '../../../Api/api.js';
import { jwtDecode } from 'jwt-decode';

const Pedidos = () => {
  const { page, setPage,setSizeMobile,sizeMobile,} = useContext(GlobalContext);

  const [pedidos, setPedidos] = useState([]);
  const [currentPedido, setCurrentPedido]=useState();
  const [modal, setModal] = useState(false);
  const { loading, data, request, error, setLoading } = useFetch();
  const [lasPage, setLastPage]= useState('');

  useEffect(()=>{
    async function pegaPedidos() {
      const token = window.localStorage.getItem("token");
        if (token) {
          const { id } = jwtDecode(token);
          const { url, options } = GET_PEDIDOS(id, token,page);
          const { response, json } = await request(url, options);
          if (response.ok) {
            setPedidos(json.pedidos.retorno)
            setLastPage(json.paginacao.total_Pages)
          } else {
            navigate('/')
          }
        }else{
          logout();
          navigate('/')
        }
    }
    pegaPedidos()
  },[])

  async function paginacao(page){
    const token = window.localStorage.getItem("token");
    setLoading(true)
    setPage(page)
    const { id } = jwtDecode(token);
    const { url, options } = GET_PEDIDOS(id, token, page);
    const { response, json } = await request(url, options);
    if (response.ok) {
      setPedidos(json.pedidos.retorno)
      setLastPage(json.paginacao.total_Pages)
    }
  }

  function currentPedidoFunction(index){
    setCurrentPedido(pedidos[index])
    setModal(true)
  }

  return (
    <div className={styles.containerPedidos}>
        <Header tela={'pedidos'}/>
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
          {pedidos&& !loading&& pedidos.map((pedido, index) => (
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
