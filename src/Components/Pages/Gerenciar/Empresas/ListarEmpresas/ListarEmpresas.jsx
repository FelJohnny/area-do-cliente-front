import React, { useContext, useEffect, useState } from 'react';
import { GET_EMPRESAS } from '../../../../../Api/api';
import useFetch from '../../../../../Hooks/useFetch';
import styles from './ListarEmpresas.module.css'
import { GlobalContext } from '../../../../../Context/GlobalContext';

const ListarEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const { request } = useFetch();
  const { setModal, modal } = useContext(GlobalContext);


  useEffect(() => {
    
    const fetchEmpresas = async () => {
      const token = window.localStorage.getItem('token');
      const { url, options } = GET_EMPRESAS(token);
      const { response, json } = await request(url, options);
      
      console.log(json);
      if (response.ok) {
        setEmpresas(json);
      }
    };    
    
    fetchEmpresas();
  }, [modal]);




  return (
    <div className={`${styles.Container} animation-left-rigth-suav`}>
      <h2 className={styles.tituloPage}>Empresas Cadastradas</h2>

      <div className={styles.subContainer}>
        <div className={styles.containerNomeColumn}>
          <h2 className={styles.nomeColumn}>nome</h2>
          <h2 className={styles.nomeCnpj}>cnpj</h2>
          <h2 className={styles.nomeCnpj}>ações</h2>
        </div>
        <div className={styles.empresas}>
          {empresas.map((empresa) => (
            <div className={styles.empresaRow} key={empresa.id}            
            >
              <p 
                className={styles.nomeEmpresa}
                >
                {empresa.nome}
              </p>
              <p className={styles.cnpjEmpresa}>{empresa.cnpj}</p>

              <div className={styles.acoesbtn}>
                <button className={styles.buttonRow} onClick={()=>setModal({status: true, nome:'empresaUsuario', data:empresa})}>usuarios</button>
                <button className={styles.buttonRow} onClick={()=>setModal({status: true, nome:'editaEmpresa', data:empresa})}>editar</button>
                <button className={styles.buttonRowDelete} onClick={()=>setModal({status: true, nome:'deletaEmpresa', data:empresa})}>excluir</button>
              </div>
              <div className={styles.descricaoEmpresa}>
                <p><b className={styles.bold}>Endereço: </b>{empresa.endereco}</p>
                <p><b className={styles.bold}>Descrição: </b> {empresa.descricao}</p>
              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  );
}

export default ListarEmpresas;
