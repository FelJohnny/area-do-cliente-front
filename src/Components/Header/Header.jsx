import React, { useContext } from 'react'
import styles from './Header.module.css'
import { GlobalContext } from '../../Context/GlobalContext';
import DateRange from '../Filters/DateRange/DateRange';
const Header = ({tela}) => {

  const { userAuth,currentUser } = useContext(GlobalContext);

  
  return (
    <header className={styles.ContainerHeader}>
      {tela==='home'? <DateRange/>: <h2>Meus pedidos</h2>}
      <div className={styles.nomeCli}>
        <p><span>Empresa:</span> {userAuth.status && currentUser.nome}</p>
        <p><span>CNPJ:</span> {userAuth.status && currentUser.cnpj}</p>
      </div>
    </header> 
  )
}

export default Header