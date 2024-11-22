import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../../Context/GlobalContext';
import styles from './ModalEditaEmpresa.module.css';

import { UPDATE_EMPRESA } from '../../../../Api/api';
import useFetch from '../../../../Hooks/useFetch';
import useForm from '../../../../Hooks/useForm';

const ModalEditaEmpresa = () => {
    const { modal, setModal, setPopUp } = useContext(GlobalContext);
    const { request } = useFetch();

    // Campos com useForm, para validação e controle de estado dos inputs
    const nomeForm = useForm(null, 255);
    const descricaoForm = useForm(null, 255);
    const enderecoForm = useForm(null, 255);
    const cnpjForm = useForm(null, 18); // Limite para CNPJ formatado

    // Estados para armazenar valores iniciais
    const [initialData, setInitialData] = useState({});

    // UseEffect para definir valores iniciais dos campos apenas uma vez
    useEffect(() => {
        if (modal.data) {
            const initialValues = {
                nome: modal.data.nome || '',
                descricao: modal.data.descricao || '',
                endereco: modal.data.endereco || '',
                cnpj: modal.data.cnpj || '',
            };

            setInitialData(initialValues);
            nomeForm.setValue(initialValues.nome);
            descricaoForm.setValue(initialValues.descricao);
            enderecoForm.setValue(initialValues.endereco);
            cnpjForm.setValue(initialValues.cnpj);
        }
    }, [modal.data]);

    // Função para fechar o modal
    function closeModal() {
        setModal({ status: false, nome: '', data: null });
    }

    // Função para enviar as alterações
    async function handleSave(e) {
        e.preventDefault();

        // Validando os campos antes do envio
        if (nomeForm.validate() && descricaoForm.validate() && enderecoForm.validate() && cnpjForm.validate()) {
            const updatedData = {
                nome: nomeForm.value,
                descricao: descricaoForm.value,
                endereco: enderecoForm.value,
                cnpj: cnpjForm.value,
            };

            // Verificar se há alterações em relação aos valores iniciais
            const hasChanges = Object.keys(updatedData).some(
                key => updatedData[key] !== initialData[key]
            );

            if (!hasChanges) {
                setPopUp({
                    status: true,
                    children: 'Nenhuma alteração foi feita.',
                    color: '#f0ad4e',
                });
                setTimeout(() => {
                    setPopUp({ status: false, color: "", children: "" });
                }, 6000);
                closeModal();
                return;
            }

            const token = window.localStorage.getItem('token');
            if (token && modal.data?.id) {
                const { url, options } = UPDATE_EMPRESA(token, modal.data.id, updatedData);
                const { response, json } = await request(url, options);
                
                if (response.ok) {
                    setPopUp({
                        status: true,
                        children: 'Empresa atualizada com sucesso!',
                        color: '#01be50',
                    });
                    setTimeout(() => {
                        setPopUp({ status: false, color: "", children: "" });
                    }, 6000);
                    closeModal();
                } else {
                    setPopUp({
                        status: true,
                        children: json.message || 'Erro ao atualizar empresa',
                        color: '#ee5a35',
                    });
                    setTimeout(() => {
                        setPopUp({ status: false, color: "", children: "" });
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
                setPopUp({ status: false, color: "", children: "" });
            }, 6000);
        }
    }

    // Função para formatar o CNPJ enquanto o usuário digita
    const handleCNPJChange = (e) => {
        const formattedCNPJ = formatCNPJ(e.target.value);
        cnpjForm.setValue(formattedCNPJ);
    };

    // Função para formatar o CNPJ no formato correto
    const formatCNPJ = (value) => {
        return value
            .replace(/\D/g, '') 
            .replace(/^(\d{2})(\d)/, '$1.$2')
            .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
            .replace(/\.(\d{3})(\d)/, '.$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .slice(0, 18);
    };

    return (
        <div className={styles.containerModal}>
            <div className={styles.modal}>
                <div className={styles.close} onClick={closeModal}>X</div>
                <h2>Editar Empresa</h2>
                
                <form className={styles.form} onSubmit={handleSave}>
                    <div className={styles.inputContainer}>
                        <label>Nome da Empresa</label>
                        <input
                            type="text"
                            value={nomeForm.value}
                            onChange={nomeForm.onChange}
                            onBlur={nomeForm.onBlur}
                            autoComplete="off"
                        />
                        {nomeForm.error && <p className={styles.error}>{nomeForm.error}</p>}
                    </div>
                    
                    <div className={styles.inputContainer}>
                        <label>Descrição</label>
                        <input
                            type="text"
                            value={descricaoForm.value}
                            onChange={descricaoForm.onChange}
                            onBlur={descricaoForm.onBlur}
                            autoComplete="off"
                        />
                        {descricaoForm.error && <p className={styles.error}>{descricaoForm.error}</p>}
                    </div>
                    
                    <div className={styles.inputContainer}>
                        <label>Endereço</label>
                        <input
                            type="text"
                            value={enderecoForm.value}
                            onChange={enderecoForm.onChange}
                            onBlur={enderecoForm.onBlur}
                            autoComplete="off"
                        />
                        {enderecoForm.error && <p className={styles.error}>{enderecoForm.error}</p>}
                    </div>
                    
                    <div className={styles.inputContainer}>
                        <label>CNPJ</label>
                        <input
                            type="text"
                            value={cnpjForm.value}
                            onChange={handleCNPJChange}
                            onBlur={cnpjForm.onBlur}
                            autoComplete="off"
                        />
                        {cnpjForm.error && <p className={styles.error}>{cnpjForm.error}</p>}
                    </div>
                    
                    <button type="submit">
                        Salvar Alterações
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ModalEditaEmpresa;
