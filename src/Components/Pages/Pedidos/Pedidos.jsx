import React, { useContext, useEffect, useState } from 'react';
import styles from './Pedidos.module.css';
import Header from '../../Header/Header';
import { GlobalContext } from '../../../Context/GlobalContext';
import Loading from '../../Loading/Loading.jsx';
import Button from '../../Button/Button.jsx';
import ModalPedido from '../../Modals/ModalPedido/ModalPedido.jsx';
import useFetch from '../../../Hooks/useFetch.jsx';
import { GET_PEDIDOS, GET_PEDIDOS_COM_FILTROS } from '../../../Api/api.js';
import { jwtDecode } from 'jwt-decode';

const Pedidos = () => {
  const { page, setPage } = useContext(GlobalContext);

  const [pedidos, setPedidos] = useState([]);
  const [currentPedido, setCurrentPedido] = useState();
  const [modal, setModal] = useState(false);
  const { loading, request, setLoading } = useFetch();
  const [lastPage, setLastPage] = useState('');
  const [searchText, setSearchText] = useState('');
  const [FiltroRegioes, setFiltroRegioes] = useState([]);


  
  // Separação dos filtros
  const [appliedFilters, setAppliedFilters] = useState({ regiaoFiltro: [] });
  const [selectedFilters, setSelectedFilters] = useState({ regiaoFiltro: [] });
  const filteredRegions = FiltroRegioes.filter(
    (regiao) =>
      regiao.descricao.toLowerCase().includes(searchText.toLowerCase()) ||
      selectedFilters.regiaoFiltro.includes(regiao.codigo)
  );
  

  useEffect(() => {
    async function pegaPedidos() {
      const token = window.localStorage.getItem("token");
      if (token) {
        const { id } = jwtDecode(token);
        const { url, options } = GET_PEDIDOS(id, token, page);
        const { response, json } = await request(url, options);
        if (response.ok) {
          const uniqueRegiao = [];
          const seenCodes = new Set();

          json.regioes
            .filter((item) => item && item.regiao_cli)
            .forEach((item) => {
              const codigo = item.regiao_cli.codigo;
              if (!seenCodes.has(codigo)) {
                seenCodes.add(codigo);
                uniqueRegiao.push({
                  codigo,
                  descricao: item.regiao_cli.descricao,
                  obs: item.regiao_cli.obs,
                });
              }
            });

          setFiltroRegioes(uniqueRegiao);
          setPedidos(json.pedidos.retorno);
          setLastPage(json.paginacao.total_Pages);
        }
      }
    }
    pegaPedidos();
  }, []);

  async function paginacao(page) {
    const token = window.localStorage.getItem("token");
    if (token) {
      setLoading(true);
      setPage(page);
  
      const { id } = jwtDecode(token);
  
      // Cria o corpo da requisição, garantindo que regiaoFiltro sempre exista
      const { url, options } = GET_PEDIDOS_COM_FILTROS(id, token, page, {
        regiaoFiltro: appliedFilters.regiaoFiltro.length ? appliedFilters.regiaoFiltro : [],
      });

      const { response, json } = await request(url, options);
  
      if (response.ok) {
        setPedidos(json.pedidos.retorno);
        setLastPage(json.paginacao.total_Pages);
      } else {
        console.error('Erro ao buscar pedidos com paginação:', response.statusText);
      }
  
      setLoading(false);
    }
  }
  
  function currentPedidoFunction(index) {
    setCurrentPedido(pedidos[index]);
    setModal(true);
  }

  async function filtrarPedido() {
    const token = window.localStorage.getItem("token");
    if (token) {
      setPage(1); // Reseta a paginação
      setAppliedFilters(selectedFilters); // Aplica os filtros selecionados
  
      const { id } = jwtDecode(token);
  
      // Cria o corpo da requisição, garantindo que regiaoFiltro sempre exista
      const body = {
        regiaoFiltro: selectedFilters.regiaoFiltro.length ? selectedFilters.regiaoFiltro : [],
      };
  
      const { url, options } = GET_PEDIDOS_COM_FILTROS(id, token, 1, body);
  
      const { response, json } = await request(url, options);
  
      if (response.ok) {
        setPedidos(json.pedidos.retorno);
        setLastPage(json.paginacao.total_Pages);
      } else {
        console.error('Erro ao buscar pedidos com filtros:', response.statusText);
      }
    }
  }
  

  function handleCheckboxChange(codigo) {
    setSelectedFilters((prev) => {
      const newRegiaoFiltro = prev.regiaoFiltro.includes(codigo)
        ? prev.regiaoFiltro.filter((item) => item !== codigo)
        : [...prev.regiaoFiltro, codigo];

      return { ...prev, regiaoFiltro: newRegiaoFiltro };
    });
  }

  return (
    <div>
      <Header tela={'pedidos'} />
      <section className={styles.containerPedidos}>
        <div className={styles.ContainerfiltrosPedido}>
          <p className={styles.tituloFiltro}>Filtros</p>
          <button 
            onClick={filtrarPedido}
            className={styles.buttonBusca}
            >Aplicar Filtros</button>
          <div className={styles.containerFiltroRegiao}>
            <p className={styles.tituloRegiao}>Região</p>
            <input
              type="text"
              placeholder="buscar região"
              className={styles.buscaRegiao}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)} // Atualiza o texto de busca
            />
            {!filteredRegions.length&& !loading&&<p>Nenhuma região encontrada</p>}
            <div className={styles.listCheckbox}>
            {filteredRegions &&
              filteredRegions.map((regiao) => (
                <label className={styles.labelCheckbox} key={regiao.codigo}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    onChange={() => handleCheckboxChange(regiao.codigo)}
                    checked={selectedFilters.regiaoFiltro.includes(regiao.codigo)}
                  />
                  {regiao.descricao}
                </label>
              ))}
            </div>
          </div>
        </div>
        <div>
          <div className={styles.nomeColuna}>
            <span>ID</span>
            <span>N° PEDIDO</span>
            <span>EMISSÃO</span>
            <span>ENTREGA_PREV</span>
            <span>SITUAÇÃO</span>
          </div>
          {loading && (
            <div className={styles.loading}>
              <Loading />
            </div>
          )}
          {pedidos &&
            !loading &&
            pedidos.map((pedido, index) => (
              <div
                key={index}
                className={`${styles.rowPedido} animation-left-rigth-suav`}
              >
                <span>{pedido.numero}</span>
                <span>{pedido.ped_cli}</span>
                <span>{pedido.dt_emissao}</span>
                <span>{pedido.dt_saida}</span>
                <span>
                  {pedido.situacao_pedido
                    ? pedido.situacao_pedido.descricao
                    : 'AGUARDANDO ANALISE'}
                </span>
                <Button onClick={() => currentPedidoFunction(index)}>
                  Ver mais
                </Button>
              </div>
            ))}
          {!loading && (
            <div className={styles.navegacao}>
              {page !== 1 ? (
                <button type="button" onClick={() => paginacao(1)}>
                  primeira
                </button>
              ) : (
                <button type="button" disabled>
                  primeira
                </button>
              )}
              {page !== 1 && page !== 2 ? (
                <button type="button" onClick={() => paginacao(page - 2)}>
                  {page - 2}
                </button>
              ) : (
                ''
              )}
              {page !== 1 ? (
                <button type="button" onClick={() => paginacao(page - 1)}>
                  {page - 1}
                </button>
              ) : (
                ''
              )}
              <button type="button" disabled>
                {page}
              </button>
              {page + 1 <= lastPage ? (
                <button type="button" onClick={() => paginacao(page + 1)}>
                  {page + 1}
                </button>
              ) : (
                ''
              )}
              {page + 2 <= lastPage ? (
                <button type="button" onClick={() => paginacao(page + 2)}>
                  {page + 2}
                </button>
              ) : (
                ''
              )}
              {page !== lastPage ? (
                <button type="button" onClick={() => paginacao(lastPage)}>
                  ultima
                </button>
              ) : (
                <button type="button" disabled>
                  ultima
                </button>
              )}
            </div>
          )}
        </div>
      </section>
      {modal && (
        <ModalPedido
          setModal={setModal}
          pedidos={pedidos}
          currentPedido={currentPedido}
          modal={modal}
        />
      )}
    </div>
  );
};

export default Pedidos;
