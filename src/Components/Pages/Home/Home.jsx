import React, { useContext } from 'react'
import styles from './Home.module.css'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { GlobalContext } from '../../../Context/GlobalContext';
const Home = () => {

  const { userAuth,currentUser,page, setPage,setUserAuth} = useContext(GlobalContext);

  const data =[
    { name:'janeiro', uv:'400',pv: 2400, amt: 2400},
    { name:'fevereiro', uv:'400',pv: 1000, amt: 2400},
    { name:'março', uv:'400',pv: 1300, amt: 2400},
    { name:'abril', uv:'400',pv: 2000, amt: 2400},
    { name:'maio', uv:'400',pv: 1000, amt: 2400},
    { name:'etc', uv:'400',pv: 1000, amt: 2400},
  
  ]

  return (
    <div className={styles.ContainerHome}>
    <LineChart 
      width={800}
      height={300}
      data={data}
      >
      <XAxis dataKey="name"/>
      <YAxis/>
      <CartesianGrid stroke="#7a7a7a2b" strokeDasharray="5 5"/>
      <Line type="monotone" dataKey="uv" stroke="#8884d8" />
      <Line type="monotone" dataKey="pv" stroke="#82ca9d" />
    </LineChart>
    </div>
  )
}

export default Home
