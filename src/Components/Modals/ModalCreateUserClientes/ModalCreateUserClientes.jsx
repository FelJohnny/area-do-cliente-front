import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './ModalCreateUserClientes.module.css';
import useFetch from '../../../Hooks/useFetch';
import { GET_CLI_POR_GPCLI, GET_GRUPO_CLI } from '../../../Api/api';
import Loading from '../../Loading/Loading';
import { GlobalContext } from '../../../Context/GlobalContext.jsx';
import { useNavigate } from 'react-router-dom';

const ModalCreateUserClientes = ({ modal, setModal, clientes, setClientes }) => {
  const { setPopUp } = useContext(GlobalContext);

  const CloseContainer = useRef(null);
  const modalContainer = useRef(null);
  const inputContainerGrupoCliRef = useRef(null);
  const inputContainerCodCliRef = useRef(null);

  const [listaGrupoCli, setListaGrupoCli] = useState([]);
  const [filteredListaGpCli, setFilteredListaGpCli] = useState([]);
  const [inputGrupoCliValue, setInputGrupoCliValue] = useState('');
  const [grupocliFetch, setGrupocliFetch] = useState('');
  const [resultadoBusca, setResultadoBusca] = useState([]);
  
  const [selectedFiltro, setSelectedFiltro] = useState('codigo');
  const [inputCodCliValue, setInputCodCliValue] = useState('');
  const navigate = useNavigate();

  const { request, loading } = useFetch();

  //puxa grupo de clientes para listar no input
  useEffect(() => {
    async function PegaGrupoCli() {
      const token = window.localStorage.getItem('token');
      if (token) {
        const { url, options } = GET_GRUPO_CLI(token);
        const { response, json } = await request(url, options);
        if (response.ok) {
          setListaGrupoCli(json.retorno);
        }
      } else {
        navigate('/');
      }
    }
    PegaGrupoCli();
  }, []);

  //
  useEffect(() => {
    if (inputGrupoCliValue) {
      const filtered = listaGrupoCli.filter(item =>
        item[selectedFiltro]?.toLowerCase().includes(inputGrupoCliValue.toLowerCase())
      );
      setFilteredListaGpCli(filtered);
    } else {
      setFilteredListaGpCli([]);
    }
  }, [inputGrupoCliValue, selectedFiltro, listaGrupoCli]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        inputContainerGrupoCliRef.current &&
        !inputContainerGrupoCliRef.current.contains(event.target)
      ) {
        setFilteredListaGpCli([]);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  function closeModal(event) {
    event.preventDefault();
    if (
      event.target === modalContainer.current ||
      event.target === CloseContainer.current
    ) {
      setModal(!modal);
      setGrupocliFetch('');
    }
  }

  function handleSelectGrupoCliItem(item) {
    setInputGrupoCliValue(`${item.codigo} - ${item.descricao}`);
    setGrupocliFetch(item.codigo);
    setFilteredListaGpCli([]);
  }

  async function buscaCliPorGrupoCli() {
    const token = window.localStorage.getItem('token');
    if (token) {
      const { url, options } = GET_CLI_POR_GPCLI(token, grupocliFetch);
      const { response, json } = await request(url, options);
      if (response.ok) {
        const resultadoFiltrado = json.retorno.filter(
          item => !clientes.some(cliente => cliente.codcli === item.codcli)
        );
        setResultadoBusca(resultadoFiltrado);
      } else {
        setPopUp({
          status: true,
          children: 'Informe um grupo de cliente válido',
          color: '#ee5a35',
        });
        setTimeout(() => {
          setPopUp({
            status: false,
            color: "",
            children: ""
          });
        }, 6000);
      }
    }
  }

  function vinculaCliente(item) {
    setClientes([...clientes, item]);
    setResultadoBusca(resultadoBusca.filter(cliente => cliente.codcli !== item.codcli));
  }

  function desvinculaCliente(item) {
    setClientes(clientes.filter(cliente => cliente.codcli !== item.codcli));
    // setResultadoBusca([...resultadoBusca, item]);
  }

  return (
    <div className={styles.containerModal} ref={modalContainer} onClick={closeModal}>
      <section className={`${styles.modal} animation-opacity`}>
        <button ref={CloseContainer} onClick={closeModal} className={styles.close}>
          X
        </button>

        {loading ? (
          <div className={styles.loading}>
            <Loading />
          </div>
        ) : (
          <>
            <div className={styles.filters}>
              {/* Filtro por GrupoCli */}
              <div className={styles.containerInput}>
                <span>Filtrar por grupo de cliente:</span>
                <div className={styles.containerInput2}>
                  <select
                    id="selectFiltroGrupoCli"
                    value={selectedFiltro}
                    onChange={(e) => setSelectedFiltro(e.target.value)}
                    className={styles.select}
                    disabled={inputCodCliValue !== ''}
                  >
                    <option value="codigo">Código</option>
                    <option value="descricao">Descrição</option>
                  </select>

                  <div className={styles.inputContainer} ref={inputContainerGrupoCliRef}>
                    <input
                      className={styles.inputText}
                      id="filtroGrupoCliInput"
                      type="text"
                      value={inputGrupoCliValue}
                      onChange={(e) => setInputGrupoCliValue(e.target.value)}
                      disabled={inputCodCliValue !== ''}
                    />
                    {filteredListaGpCli.length > 0 && (
                      <ul className={styles.listaGrupoCli}>
                        {filteredListaGpCli.map((item, index) => (
                          <li key={index} className={styles.li} onClick={() => handleSelectGrupoCliItem(item)}>
                            {item.codigo} - {item.descricao}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <button disabled={!inputGrupoCliValue || inputCodCliValue !== ''} className={styles.btnBuscar} onClick={buscaCliPorGrupoCli}>buscar</button>
              </div>
              {/* Filtro por CodCli */}
              <div className={styles.containerInput}>
                <span>Filtrar por Cliente:</span>
                <div className={styles.containerInput2}>
                  <select
                    id="selectFiltroCodCli"
                    value={selectedFiltro}
                    onChange={(e) => setSelectedFiltro(e.target.value)}
                    className={styles.select}
                    disabled={inputGrupoCliValue !== ''}
                  >
                    <option value="nome">Nome</option>
                    <option value="codcli">CodCli</option>
                  </select>

                  <div className={styles.inputContainer} ref={inputContainerCodCliRef}>
                    <input
                      className={styles.inputText}
                      id="filtroCodCliInput"
                      type="text"
                      value={inputCodCliValue}
                      onChange={(e) => setInputCodCliValue(e.target.value)}
                      disabled={inputGrupoCliValue !== ''}
                    />
                  </div>
                </div>
                <button disabled={!inputCodCliValue || inputGrupoCliValue !== ''} className={styles.btnBuscar}>buscar</button>
              </div>
            </div>
            <section className={styles.containerSection}>
              <span>Resultado da busca:</span>
              <div className={styles.containerResultado}>
                {resultadoBusca && resultadoBusca.map((item, index) => (
                  <li key={index} className={styles.itemResultado} onClick={() => vinculaCliente(item)}>
                    {item.codcli} - {item.nome} - CNPJ: {item.cnpj}
                  </li>
                ))}
              </div>
              <span>Clientes Vinculados:</span>
              <div className={styles.containerResultado}>
                {clientes && clientes.map((item, index) => (
                  <li key={index} className={styles.itemResultado} onClick={() => desvinculaCliente(item)}>
                    {item.codcli} - {item.nome} - CNPJ: {item.cnpj}
                  </li>
                ))}
              </div>
            </section>
            <button className={styles.btnFinalizar} onClick={()=>setModal(!modal)}>finalizar</button>
          </>
        )}
      </section>
    </div>
  );
};

export default ModalCreateUserClientes;
