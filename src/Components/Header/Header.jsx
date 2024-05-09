import React, { useContext } from 'react'
import styles from './Header.module.css'
import { GlobalContext } from '../../Context/GlobalContext';
const Header = () => {

  const { userAuth,currentUser } = useContext(GlobalContext);

  
  return (
    <header className={styles.ContainerHeader}>
      <div className={styles.nomeCli}>
        <p>Empresa: {userAuth.status && currentUser.nome}</p>
      </div>
    </header> 
  )
}

export default Header
