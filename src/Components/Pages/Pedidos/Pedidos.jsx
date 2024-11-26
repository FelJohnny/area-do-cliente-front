import React, { useContext, useEffect, useState } from 'react';
import styles from './Pedidos.module.css';
import Header from '../../Header/Header';
import { GlobalContext } from '../../../Context/GlobalContext';
import Loading from '../../Loading/Loading.jsx';
import Button from '../../Button/Button.jsx';
import ModalPedido from '../../Modals/ModalPedido/ModalPedido.jsx';
import useFetch from '../../../Hooks/useFetch.jsx';
import { GET_CLIENTES_POR_USUARIO, GET_PEDIDOS, GET_PEDIDOS_COM_FILTROS } from '../../../Api/api.js';
import { jwtDecode } from 'jwt-decode';

const Pedidos = () => {
  const { page, setPage } = useContext(GlobalContext);
  const [pedidos, setPedidos] = useState([]);
  const [currentPedido, setCurrentPedido] = useState();
  const [modal, setModal] = useState(false);
  const { loading, request, setLoading } = useFetch();
  const [lastPage, setLastPage] = useState('');
  const [searchTextRegiao, setSearchTextRegiao] = useState('');
  const [searchTextEmpresa, setSearchTextEmpresa] = useState('');
  const [FiltroRegioes, setFiltroRegioes] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Separação dos filtros
  const [appliedFilters, setAppliedFilters] = useState({ regiaoFiltro: [] });
  const [selectedFilters, setSelectedFilters] = useState({ regiaoFiltro: [] });


  const [clientes, setClientes] = useState([]);
  const [filtroClientes, setFiltroClientes] = useState([]);
  const [selectedClientes, setSelectedClientes] = useState([]);

  const [filtroNumPed, setFiltroNumPed] = useState('')
  useEffect(() => {
    async function pegaPedidos() {
      const token = window.localStorage.getItem("token");
      if (token) {
        const { id } = jwtDecode(token);
        const { url, options } = GET_PEDIDOS(id, token, page);
        const { response, json } = await request(url, options);
        if (response.ok) {
          console.log(json);
          
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

    async function pegaEntidadesPorClientes() {
      const token = window.localStorage.getItem("token");
    
      if (token) {
        const { id } = jwtDecode(token);
        const { url, options } = GET_CLIENTES_POR_USUARIO(token, id);
        const { response, json } = await request(url, options);
    
        if (response.ok) {
          const uniqueClientes = [];
          const seenCodes = new Set();
    
          json.forEach((cliente) => {
            if (!seenCodes.has(cliente.codcli)) {
              seenCodes.add(cliente.codcli);
              uniqueClientes.push({
                codcli: cliente.codcli,
                nome: cliente.nome,
                cnpj: cliente.cnpj,
              });
            }
          });
    
          setClientes(uniqueClientes);
          setFiltroClientes(uniqueClientes);
        }
      }
    }
    
    pegaEntidadesPorClientes()
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
        clienteFiltro: selectedClientes.length ? selectedClientes : [],
        filtroNumPed:filtroNumPed

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
      setErrorMessage(''); // Limpa mensagens de erro anteriores
  
      const { id } = jwtDecode(token);
  
      // corpo da requisição, garantindo que regiao Filtro sempre exista
      const body = {
        regiaoFiltro: selectedFilters.regiaoFiltro.length ? selectedFilters.regiaoFiltro : [],
        clienteFiltro: selectedClientes.length ? selectedClientes : [],
        filtroNumPed:filtroNumPed
      };
  
      const { url, options } = GET_PEDIDOS_COM_FILTROS(id, token, 1, body);
  
      try {
        const { response, json } = await request(url, options);
  
        if (response.ok) {
          setPedidos(json.pedidos.retorno);
          setLastPage(json.paginacao.total_Pages);
        } else if (response.status === 400) {
          setPedidos([]); // Certifique-se de limpar os pedidos
          setErrorMessage('Não foi encontrado nenhum pedido com o filtro informado');
        } else {
          setErrorMessage('Erro ao buscar pedidos. Tente novamente mais tarde.');
        }
      } catch (error) {
        setErrorMessage('Erro ao se comunicar com o servidor. Tente novamente mais tarde.');
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

  function handleClienteCheckboxChange(codcli) {
    setSelectedClientes((prev) =>
      prev.includes(codcli)
        ? prev.filter((item) => item !== codcli)
        : [...prev, codcli]
    );
  }

  const filteredRegions = FiltroRegioes.filter(
    (regiao) =>
      regiao.descricao.toLowerCase().includes(searchTextRegiao.toLowerCase()) ||
      selectedFilters.regiaoFiltro.includes(regiao.codigo)
  );
  
  const filteredClientes = filtroClientes.filter((cliente) => {
    const searchTerm = searchTextEmpresa.toLowerCase().trim();
  
    return (
      cliente.nome.toLowerCase().includes(searchTerm) || 
      cliente.cnpj.includes(searchTerm) || 
      selectedClientes.includes(cliente.codcli)
    );
  });

  return (
    <div>
      <Header tela={'pedidos'} />
      <section className={styles.containerPedidos}>
        <div className={styles.ContainerfiltrosPedido}>
          <button 
            onClick={filtrarPedido}
            className={styles.buttonBusca}
            >Aplicar Filtros
          </button>
          {/* FILTRO REGIAO*/}
          <div className={styles.containerFiltroRegiao}>
            <p className={styles.tituloRegiao}>Região</p>
            <input
              type="text"
              placeholder="buscar região"
              className={styles.buscaRegiao}
              value={searchTextRegiao}
              onChange={(e) => setSearchTextRegiao(e.target.value)} // Atualiza o texto de busca
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
          {/* FILTRO Empresa*/}
          <div className={styles.containerFiltroEmpresa}>
            <p className={styles.tituloRegiao}>Empresa</p>
            <input
              type="text"
              placeholder="buscar empresa"
              className={styles.buscaRegiao}
              value={searchTextEmpresa}
              onChange={(e) => setSearchTextEmpresa(e.target.value)} // Atualiza o texto de busca
            />
            {!filteredClientes.length&& !loading&&<p>Nenhuma empresa encontrada</p>}
            <div className={styles.listCheckboxEntidade}>
              {filteredClientes &&
                filteredClientes.map((cliente) => (
                  <label
                    className={styles.labelCheckbox}
                    key={cliente.codcli}
                    title={cliente.nome} // Tooltip para mostrar o nome completo
                  >
                    <input
                      type="checkbox"
                      className={styles.checkbox}
                      onChange={() => handleClienteCheckboxChange(cliente.codcli)}
                      checked={selectedClientes.includes(cliente.codcli)}
                    />
                    {/* Nome truncado */}
                    <span>
                      {cliente.nome.length > 15
                        ? `${cliente.nome.substring(0, 15)}...`
                        : cliente.nome}
                    </span>
                    {/* CNPJ */}
                    <p className={styles.cnpjfiltro}>{cliente.cnpj}</p>
                  </label>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.ContainerListaPedido}>
          <div className={styles.containerInputConsulta}>
            <input 
              
              type="text"
              className={styles.inputConsulta}
              placeholder='Buscar por nº de pedido'
              value={filtroNumPed}
              onChange={(e)=>setFiltroNumPed(e.target.value)}
            />
            <button 
              className={styles.buttonBuscaNumPed}
              onClick={filtrarPedido}
            >Buscar</button>
          </div>
          <div className={styles.nomeColuna}>
            <span>ID</span>
            <span>N° PEDIDO</span>
            <span>EMISSÃO</span>
            <span>ENTREGA_PREV</span>
            <span>SITUAÇÃO</span>
          </div>
          <div>
  {loading && (
    <div className={styles.loading}>
      <Loading />
    </div>
  )}
  {!loading && errorMessage && (
    <p className={styles.errorMessage}>{errorMessage}</p>
  )}
  {!loading && pedidos.length > 0 && pedidos.map((pedido, index) => (
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
</div>


          {!loading && !errorMessage&&(
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
