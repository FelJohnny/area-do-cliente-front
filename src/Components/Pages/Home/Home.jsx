import React, { useContext, useEffect, useState } from 'react'
import styles from './Home.module.css'
import Header from '../../Header/Header.jsx'
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Legend,Tooltip } from 'recharts'
import { GlobalContext } from '../../../Context/GlobalContext';

const Home = () => {
  const { pedidosPorData } = useContext(GlobalContext);
  const [dado, setDado]=useState(null)
  const [dash,setDash]=useState(null)
  useEffect(()=>{
    if (Array.isArray(pedidosPorData)){
      transformData(pedidosPorData)
    }
  },[pedidosPorData])

  // useEffect(()=>{
  //   if(dado){
  //     console.log(Object.keys(dado));
  //     console.log(dado[Object.keys(dado)]);

  //     const data = Object.keys(dado).map(chave => {
  //       const pedidos = dado[chave];
  //       return {
  //         name: chave,
  //         custo: pedidos.precoTotal,
  //         pedidos: pedidos.quantidade,
  //       };
  //     });

  //     setDash(data)
  //   }
  // },[dado])

  function transformData(data){      
    const pedidosAgrupados = data.reduce((acc,item)=>{
      const [ano, mes] = item.dt_emissao.split("-")
      const chave = `${mes}-${ano}`;
      if(acc[chave]){
        acc[chave].push(item)
        }
      else{
        acc[chave] = [item]
      }        

      acc[chave].quantidade = (acc[chave].quantidade || 0) + 1;
      acc[chave].precoTotal = (acc[chave].precoTotal || 0);

      item.itens_pedido.forEach((produto) => {
        acc[chave].precoTotal += parseFloat(produto.preco);
      });
      
      return acc
    },{})
    setDado(pedidosAgrupados)

  }
    
  return (
    <>
      <Header tela={'home'}/>
      <div className={styles.ContainerHome}>
      {/* <ResponsiveContainer height={400} width={"99%"}>
        <LineChart 
          height={300}
          width={800}
          data={dash}
          >
          <XAxis dataKey="name"/>
          <YAxis />
          <Legend/>
          <Tooltip/>
          <CartesianGrid stroke="#7a7a7a2b" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="custo" stroke="#A36AF9" strokeWidth={3}/>
          <Line type="monotone" dataKey="pedidos" stroke="#FBCB21" strokeWidth={3}/>
        </LineChart> 
      </ResponsiveContainer> */}
    </div>
    </>
  )
}

export default Home
