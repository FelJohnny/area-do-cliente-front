import React, { useContext } from 'react'
import styles from './Header.module.css'
import { GlobalContext } from '../../Context/GlobalContext';
import DateRange from '../Filters/DateRange/DateRange';
const Header = ({tela}) => {

  const { currentUser } = useContext(GlobalContext);
  
  return (
    <header className={styles.ContainerHeader}>
      {tela==='home'? <DateRange/>: <h2>Meus pedidos</h2>}
      <div className={styles.nomeCli}>
        <p><span>Usuario:</span> {currentUser.status && currentUser.usuario.nome}</p>
      </div>
    </header> 
  )
}

export default Header