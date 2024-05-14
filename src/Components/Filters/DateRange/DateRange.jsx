import styles from './DataRange.module.css'
import React, { useContext, useState } from 'react'
import DateInput from '../../Forms/DateInput/DateInput'
import { GlobalContext } from '../../../Context/GlobalContext';

const DateRange = () => {
  const { userAuth } = useContext(GlobalContext);
  const [inicio, setInicio] = useState('')
  const [final, setFinal] = useState('')

  return (
    <form onSubmit={(e)=> e.preventDefault()} className={styles.form}>
        <DateInput label="Inicio" value={inicio} onChange={({target})=>{setInicio(target.value)}}/>
        <DateInput label="Final"  value={final} onChange={({target})=>{setFinal(target.value)}}/>
        <div className={styles.tituloPage}>
          Resumo
        </div>
    </form>
  )
}

export default DateRange
