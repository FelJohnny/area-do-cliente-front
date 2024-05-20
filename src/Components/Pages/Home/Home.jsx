import React, { useContext, useEffect } from 'react'
import styles from './Home.module.css'
import Header from '../../Header/Header.jsx'
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ResponsiveContainer, Legend,Tooltip } from 'recharts'
import { GlobalContext } from '../../../Context/GlobalContext';
import DateRange from '../../Filters/DateRange/DateRange.jsx';
const Home = () => {
  const { pedidosPorData } = useContext(GlobalContext);
  useEffect(()=>{
    if (Array.isArray(pedidosPorData)){
      transformData(pedidosPorData) 
    }
  },[pedidosPorData])

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
    console.log(pedidosAgrupados);
  }
    

    

  const data =[
    { name:'janeiro', uv:'400',pv: 2400, amt: 2400},
    { name:'fevereiro', uv:'500',pv: 1000, amt: 2400},
    { name:'março', uv:'400',pv: 1300, amt: 1000},
    { name:'abril', uv:'400',pv: 2000, amt: 300},
    { name:'maio', uv:'600',pv: 1000, amt: 0},
    { name:'etc', uv:'400',pv: 1000, amt: 1800},
  
  ]

  return (
    <>
      <Header tela={'home'}/>
      <div className={styles.ContainerHome}>
      <ResponsiveContainer height={400} width={"99%"}>
        <LineChart 
          height={300}
          width={800}
          data={data}
          >
          <XAxis dataKey="name"/>
          <YAxis />
          <Legend/>
          <Tooltip/>
          <CartesianGrid stroke="#7a7a7a2b" strokeDasharray="5 5" />
          <Line type="monotone" dataKey="uv" stroke="#A36AF9" strokeWidth={3}/>
          <Line type="monotone" dataKey="pv" stroke="#FBCB21" strokeWidth={3}/>
          <Line type="monotone" dataKey="amt" stroke="#000000" strokeWidth={3}/>
        </LineChart> 
      </ResponsiveContainer>
    </div>
    </>
  )
}

export default Home
