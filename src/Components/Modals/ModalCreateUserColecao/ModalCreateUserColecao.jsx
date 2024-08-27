import React, { useContext, useRef, useState } from 'react';
import styles from './ModalCreateUserColecao.module.css';
import useFetch from '../../../Hooks/useFetch';
import { GET_COLECAO_POR_CODIGO, GET_COLECAO_POR_DESCRICAO } from '../../../Api/api';
import Loading from '../../Loading/Loading';
import { GlobalContext } from '../../../Context/GlobalContext.jsx';
import { useNavigate } from 'react-router-dom';

const ModalCreateUserCollections = ({ modal, setModal, colecao, setColecao }) => {
  const { setPopUp } = useContext(GlobalContext);

  const CloseContainer = useRef(null);
  const modalContainer = useRef(null);


  const [inputCodigoValue, setInputCodigoValue] = useState('');
  const [inputDescricaoValue, setInputDescricaoValue] = useState('');
  const [resultadoBusca, setResultadoBusca] = useState([]);
  
  const { request, loading } = useFetch();

  // Busca coleção por código
  async function buscaPorCodigo() {
    const token = window.localStorage.getItem('token');
    if (token) {
      const { url, options } = GET_COLECAO_POR_CODIGO(token, inputCodigoValue);
      const { response, json } = await request(url, options);
      if (response.ok) {
        const resultadoFiltrado = json.retorno.filter(
          item => !(colecao && colecao.some(colecao => colecao.codigo === item.codigo))
        );
        setResultadoBusca(resultadoFiltrado);
      } else {
        setPopUp({
          status: true,
          children: 'Não foi possível encontrar essa coleção',
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

  // Busca coleção por descrição
  async function buscaPorDescricao() {
    const token = window.localStorage.getItem('token');
    if (token) {
      const { url, options } = GET_COLECAO_POR_DESCRICAO(token, inputDescricaoValue);
      const { response, json } = await request(url, options);
      if (response.ok) {
        const resultadoFiltrado = json.retorno.filter(
          item => !(colecao && colecao.some(colecao => colecao.codigo === item.codigo))
        );
        setResultadoBusca(resultadoFiltrado);
      } else {
        setPopUp({
          status: true,
          children: 'Não foi possível encontrar essa coleção',
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

  function vinculaColecao(item) {
    setColecao([...colecao, item]);
    setResultadoBusca(resultadoBusca.filter(colecao => colecao.codigo !== item.codigo));
  }

  function desvinculaColecao(item) {
    setColecao(colecao.filter(colecao => colecao.codigo !== item.codigo));
  }

  function closeModal(event) {
    event.preventDefault();
    if (
      event.target === modalContainer.current ||
      event.target === CloseContainer.current
    ) {
      setModal(!modal);
    }
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
              {/* Filtro por Código */}
              <div className={styles.containerInput}>
                <span>Buscar por Código:</span>
                <div className={styles.containerInput2}>
                  <input
                    className={styles.inputText}
                    id="filtroCodigoInput"
                    type="text"
                    value={inputCodigoValue}
                    onChange={(e) => setInputCodigoValue(e.target.value)}
                    disabled={inputDescricaoValue !== ''}
                  />
                  <button
                    disabled={!inputCodigoValue || inputDescricaoValue !== ''}
                    className={styles.btnBuscar}
                    onClick={buscaPorCodigo}
                  >
                    Buscar
                  </button>
                </div>
              </div>
              {/* Filtro por Descrição */}
              <div className={styles.containerInput}>
                <span>Buscar por Descrição:</span>
                <div className={styles.containerInput2}>
                  <input
                    className={styles.inputText}
                    id="filtroDescricaoInput"
                    type="text"
                    value={inputDescricaoValue}
                    onChange={(e) => setInputDescricaoValue(e.target.value)}
                    disabled={inputCodigoValue !== ''}
                  />
                  <button
                    disabled={!inputDescricaoValue || inputCodigoValue !== ''}
                    className={styles.btnBuscar}
                    onClick={buscaPorDescricao}
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </div>
            <section className={styles.containerSection}>
              <span>Resultado da busca:</span>
              <div className={styles.containerResultado}>
                {resultadoBusca && resultadoBusca.map((item, index) => (
                  <li key={index} className={styles.itemResultado} onClick={() => vinculaColecao(item)}>
                    {item.codigo} - {item.descricao}
                  </li>
                ))}
              </div>
              <span>Coleções Vinculadas:</span>
              <div className={styles.containerResultado}>
                {colecao && colecao.map((item, index) => (
                  <li key={index} className={styles.itemResultado} onClick={() => desvinculaColecao(item)}>
                    {item.codigo} - {item.descricao}
                  </li>
                ))}
              </div>
            </section>
            <button className={styles.btnFinalizar} onClick={() => setModal(!modal)}>
              Finalizar
            </button>
          </>
        )}
      </section>
    </div>
  );
};

export default ModalCreateUserCollections;
