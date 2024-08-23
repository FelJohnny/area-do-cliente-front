import React, { useContext } from 'react'
import styles from './Header.module.css'
import { GlobalContext } from '../../Context/GlobalContext';
import DateRange from '../Filters/DateRange/DateRange';
import OptionsGerenciar from '../Filters/OptionsGerenciar/OptionsGerenciar';
const Header = ({tela}) => {

  const { currentUser } = useContext(GlobalContext);
  
  return (
    <header className={styles.ContainerHeader}>
      <div className={styles.nav}>
        {tela==='home'&& <DateRange/>}
        {tela==='pedidos'&&<h2>Meus pedidos</h2>}
        {tela==='gerenciar'&&
        (<>
          <h2>Gerenciar Sistema</h2>
          <div>
            <OptionsGerenciar/>
          </div>
        </>)
        }
      </div>
      <div className={styles.nomeCli}>
        <p><span>Usuario:</span> {currentUser.status && currentUser.usuario.nome}</p>
      </div>
    </header> 
  )
}

export default Header