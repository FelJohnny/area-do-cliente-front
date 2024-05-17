import React, { useContext } from 'react'
import styles from './Home.module.css'
import Header from '../../Header/Header.jsx'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { GlobalContext } from '../../../Context/GlobalContext';
import DateRange from '../../Filters/DateRange/DateRange.jsx';
const Home = () => {

  const { inicio, setInicio,final, setFinal, logout, pedidosPorData } = useContext(GlobalContext);


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
      
        <LineChart 
          height={300}
          width={800}
          data={data}
          >
          <XAxis dataKey="name"/>
          <YAxis/>
          <CartesianGrid stroke="#7a7a7a2b" strokeDasharray="5 5"/>
          <Line type="monotone" dataKey="uv" stroke="#8884d8" />
          <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
          <Line type="monotone" dataKey="amt" stroke="#b17e10" />
        </LineChart> 
    </div>
    </>
  )
}

export default Home
