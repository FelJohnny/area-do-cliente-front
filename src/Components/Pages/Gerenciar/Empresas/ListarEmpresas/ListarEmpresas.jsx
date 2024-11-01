import React, { useEffect, useState } from 'react';
import { GET_EMPRESAS, GET_USUARIOS_BY_EMPRESA } from '../../../../../Api/api';
import useFetch from '../../../../../Hooks/useFetch';
import styles from './ListarEmpresas.module.css'

const ListarEmpresas = () => {
  const [empresas, setEmpresas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [notFound, setNotFound] = useState('');
  const { request } = useFetch();

  useEffect(() => {
    const fetchEmpresas = async () => {
      const token = window.localStorage.getItem('token');
      const { url, options } = GET_EMPRESAS(token);
      const { response, json } = await request(url, options);
      
      if (response.ok) {
        setEmpresas(json);
        console.log(json);
        
      }
    };
    
    fetchEmpresas();
  }, []);

  const fetchUsuariosPorEmpresa = async (empresaId) => {
    setNotFound('')
    setUsuarios([]);

    const token = window.localStorage.getItem('token');
    const { url, options } = GET_USUARIOS_BY_EMPRESA(token, empresaId);
    const { response, json } = await request(url, options);
    
    if (response.ok) {
      console.log(json);
      setUsuarios(json);
    }

    if(json.message){
      setNotFound(json.message)
    }
  };

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
                onClick={() => fetchUsuariosPorEmpresa(empresa.id)}
                className={styles.nomeEmpresa}
                >
                {empresa.nome}
              </p>
              <p className={styles.cnpjEmpresa}>{empresa.cnpj}</p>
              <div className={styles.acoesbtn}>
                <button>usuarios</button>
                <button>editar</button>
                <button>excluir</button>
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
