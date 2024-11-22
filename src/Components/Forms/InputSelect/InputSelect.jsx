import React, { useState } from 'react';
import styles from './InputSelect.module.css';

const InputSelect = ({ onChange, label, id, options, placeholder, error, errorConfere, value }) => {
    const [descricao, setDescricao] = useState('');

    const atribuiDescricao = (e) => {
        const selectedId = e.target.value;
        onChange(e); // Chamando a função passada como onChange, garantindo independência no estado

        if (selectedId === '') {
            setDescricao('');
        } else {
            const selectedOption = options.find(option => option.id === selectedId);
            if (selectedOption) {
                setDescricao(selectedOption.descricao);
            }
        }
    };

    return (
        <div className={styles.containerSelect}>
            <label htmlFor={id} className={styles.label}>{label}</label>
            <select 
                name={id} 
                id={id} 
                value={value} 
                onChange={atribuiDescricao}
            >
                <option value="" disabled>{placeholder}</option>
                {options && options.map((option) => (
                    <option key={option.id} value={option.id}>{option.nome}</option>
                ))}
            </select>
            {descricao && <p>{descricao}</p>}
            {errorConfere ? <p className={styles.error}>{errorConfere}</p> : <p className={styles.error}>{error}</p>}
        </div>
    );
};

export default InputSelect;
