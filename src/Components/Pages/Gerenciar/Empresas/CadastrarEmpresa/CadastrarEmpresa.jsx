import React, { useContext } from 'react';
import styles from './CadastrarEmpresa.module.css';
import useForm from '../../../../../Hooks/useForm.jsx';
import InputText from '../../../../Forms/Input/InputText.jsx';
import Button from '../../../../Button/Button.jsx';
import { CRIA_EMPRESA } from '../../../../../Api/api.js';
import useFetch from '../../../../../Hooks/useFetch.jsx';
import { GlobalContext } from '../../../../../Context/GlobalContext.jsx';
import { useNavigate } from 'react-router-dom';

const CadastrarEmpresa = () => {
    const { setPopUp } = useContext(GlobalContext);
    const nomeForm = useForm(null, 255);
    const descricaoForm = useForm(null, 255);
    const enderecoForm = useForm(null, 255);
    const cnpjForm = useForm(null, 18); // Limite para CNPJ formatado
    const { request } = useFetch();
    const navigate = useNavigate();

    // Função para formatar o CNPJ
    const formatCNPJ = (value) => {
        return value
            .replace(/\D/g, '') 
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .slice(0, 18); // Limite ao tamanho máximo do CNPJ
    };

    const handleCNPJChange = (e) => {
        const formattedCNPJ = formatCNPJ(e.target.value);
        cnpjForm.setValue(formattedCNPJ);
    };

    async function handleSubmit(e) {
        e.preventDefault();

        if (
            nomeForm.validate() &&
            descricaoForm.validate() &&
            enderecoForm.validate() &&
            cnpjForm.validate()
        ) {
            const token = window.localStorage.getItem('token');
            const dataEmpresa = {
                nome: nomeForm.value,
                descricao: descricaoForm.value,
                endereco: enderecoForm.value,
                cnpj: cnpjForm.value,
            };

            if (token) {
                const { url, options } = CRIA_EMPRESA(token, dataEmpresa);
                const { response, json } = await request(url, options);
                if (response.ok) {
                    setPopUp({
                        status: true,
                        children: 'Empresa cadastrada com sucesso!',
                        color: '#01be50',
                    });
                    setTimeout(() => {
                        setPopUp({
                            status: false,
                            color: "",
                            children: ""
                        });
                    }, 6000);
                    nomeForm.reset();
                    descricaoForm.reset();
                    enderecoForm.reset();
                    cnpjForm.reset();
                    navigate('/area-cli/gerenciar/empresas/listar');
                } else {
                    setPopUp({
                        status: true,
                        children: json.message || 'Erro ao cadastrar empresa',
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
        } else {
            setPopUp({
                status: true,
                children: 'Preencha todos os campos corretamente!',
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

    return (
        <div className={`${styles.Container} animation-left-rigth-suav`}>
            <h2 className={`${styles.tituloPage} `}>Cadastrar uma nova empresa</h2>
            <div className={styles.containerForm}>
                <form onSubmit={handleSubmit} className={`${styles.form} `}>
                    <InputText {...nomeForm} label="Nome da Empresa" id="nome" type="text" autoComplete="off" />
                    <InputText {...descricaoForm} label="Descrição" id="descricao" type="text" autoComplete="off" />
                    <InputText {...enderecoForm} label="Endereço" id="endereco" type="text" autoComplete="off" />
                    <InputText
                        {...cnpjForm}
                        label="CNPJ"
                        id="cnpj"
                        type="text"
                        value={cnpjForm.value}
                        onChange={handleCNPJChange}
                        autoComplete="off"
                    />
                    <Button type="submit" children="Cadastrar Empresa" />
                </form>
                <div className={`${styles.observacao} `}>
                    <h1 className={styles.TituloObservacao}>Observações</h1>
                    <p> - Vincular <span className={styles.bold}>Usuários</span> a uma empresa permite que eles tenham acesso a funções específicas relacionadas àquela empresa.</p>
                    <h2 className={styles.subTituloObservacao}>Descrição</h2>
                    <p> - A descrição deve ser clara para identificar a empresa corretamente.</p>
                    <h2 className={styles.subTituloObservacao}>Endereço</h2>
                    <p> - Certifique-se de que o endereço esteja correto para facilitar operações futuras.</p>
                    <h2 className={styles.subTituloObservacao}>CNPJ</h2>
                    <p> - Insira um CNPJ válido. O formato será automaticamente ajustado.</p>
                </div>
            </div>
        </div>
    );
}

export default CadastrarEmpresa;
