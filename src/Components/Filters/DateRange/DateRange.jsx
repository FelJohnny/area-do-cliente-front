import styles from './DataRange.module.css'
import React, { useContext, useEffect, useState } from 'react'
import DateInput from '../../Forms/DateInput/DateInput'
import { GlobalContext } from '../../../Context/GlobalContext';
import useFetch from '../../../Hooks/useFetch';
import { GET_PEDIDOS_ON_DATE } from '../../../Api/api';
import { jwtDecode } from 'jwt-decode';

const DateRange = () => {
  const { inicio, setInicio,final, setFinal, logout, setPedidosPorData } = useContext(GlobalContext);
  const { request, error, data } = useFetch();

  useEffect(()=>{
    async function pegaPedidosPorData(){
      const token = window.localStorage.getItem("token");
      if (token) {
        const { codcli } = jwtDecode(token);
        const { url, options } = GET_PEDIDOS_ON_DATE(codcli,token,inicio,final);
        const {json} = await request(url, options);
        setPedidosPorData(json)
        console.log(json);
      }else{
        logout();
    }
  }
  pegaPedidosPorData()
},[final, inicio ])
  return (
    <form onSubmit={(e)=> e.preventDefault()} className={styles.form}>
        <DateInput label="De:" value={inicio} onChange={({target})=>{setInicio(target.value)}}/>
        <DateInput label="Até:"  value={final} onChange={({target})=>{setFinal(target.value)}}/>
        <div className={styles.tituloPage}>
          DashBoard
        </div>
    </form>
  )
}

export default DateRange
