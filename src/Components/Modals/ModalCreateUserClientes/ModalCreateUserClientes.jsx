import React, { useEffect, useRef, useState } from 'react';
import styles from './ModalCreateUserClientes.module.css';
import useFetch from '../../../Hooks/useFetch';
import { GET_GRUPO_CLI } from '../../../Api/api';
import Loading from '../../Loading/Loading';

const ModalCreateUserClientes = ({ modal, setModal }) => {
  const CloseContainer = useRef(null);
  const modalContainer = useRef(null);
  const inputContainerRef = useRef(null); // Ref para o container do input e da lista

  const [listaGpCli, setListaGpCli] = useState([]);
  const [filteredListaGpCli, setFilteredListaGpCli] = useState([]);
  const [selectedFiltro, setSelectedFiltro] = useState('codigo');
  const [inputValue, setInputValue] = useState('');

  const { request, data, loading, error } = useFetch();

  useEffect(() => {
    async function PegaGrupoCli() {
      const token = window.localStorage.getItem('token');
      if (token) {
        const { url, options } = GET_GRUPO_CLI(token);
        const { response, json } = await request(url, options);
        if (response.ok) {
          setListaGpCli(json.retorno);
        }
      }
    }
    PegaGrupoCli();
  }, []);

  useEffect(() => {
    if (inputValue) {
      const filtered = listaGpCli.filter(item =>
        item[selectedFiltro]?.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredListaGpCli(filtered);
    } else {
      setFilteredListaGpCli([]);
    }
  }, [inputValue, selectedFiltro, listaGpCli]);

  useEffect(() => {
    // Função para detectar cliques fora do container do input
    function handleClickOutside(event) {
      if (inputContainerRef.current && !inputContainerRef.current.contains(event.target)) {
        setFilteredListaGpCli([]); // Esconde a lista ao clicar fora
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
    }
  }

  function handleSelectItem(item) {
    setInputValue(selectedFiltro === 'codigo' ? item.codigo : item.descricao);
    setFilteredListaGpCli([]); // Limpa a lista após selecionar um item
  }

  return (
    <div className={styles.containerModal} ref={modalContainer} onClick={closeModal}>
      <section className={`${styles.modal} animation-opacity`}>
        <button ref={CloseContainer} onClick={closeModal} className={styles.close}>
          X
        </button>

        {loading ?(
        <div className={styles.loading}>
          <Loading/>
        </div>): 
        
        <div className={styles.filter}>
          <div className={styles.containerInput}>
            <select
              id="selectFiltro"
              value={selectedFiltro}
              onChange={(e) => setSelectedFiltro(e.target.value)}
              className={styles.select}
            >
              <option value="codigo">Código</option>
              <option value="descricao">Descrição</option>
            </select>

            <div className={styles.inputContainer} ref={inputContainerRef}>
              <input
                className={styles.inputText}
                id="filtroInput"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              {filteredListaGpCli.length > 0 && (
                <ul className={styles.listaGrupoCli}>
                  {filteredListaGpCli.map((item, index) => (
                    <li key={index} onClick={() => handleSelectItem(item)}>
                      {item.codigo} - {item.descricao}
                    </li>
                  ))}
                </ul>)}
            </div>
          </div>
        </div>
        }
        
      </section>
    </div>
  );
};

export default ModalCreateUserClientes;
