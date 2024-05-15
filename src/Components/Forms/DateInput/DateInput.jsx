import React from 'react'
import styles from './DataInput.module.css'

const DateInput = ({label, ...props}) => {
  return (
    <div className={styles.containerDate}>
      <label htmlFor={label} className={styles.label} >{label}</label>
      <input id={label}  name={label} type="date" className={styles.input}{...props}/>
    </div> 
  )
}

export default DateInput
