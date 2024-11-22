import { useState } from "react";
import { regexEmail, regexPassword } from "../Utils/Regex/validacaoRegex.js";

const validacao = {
  email: {
    regex: regexEmail,
    message: "Preencha um email válido",
  },
  senha: {
    regex: regexPassword,
    message:
      "Preencha com pelo menos uma letra, numero ou caractere especial [ a-A, 1, @ ]",
  }
};

const useForm = (type, maxLength) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState(null);

  function validate(value) {
    if (type === false) return true;
    if (value.length === 0) {
      setError("Preencha um valor");
      return false;
    } else if (maxLength && value.length > maxLength) {
      setError(`O valor deve ter no máximo ${maxLength} caracteres`);
      return false;
    } else if (validacao[type] && !validacao[type].regex.test(value)) {
      setError(validacao[type].message);
      return false;
    } else {
      setError(null);
      return true;
    }
  }

  function onChange({ target }) {
    if (error) validate(target.value);
    
    if (type === 'phone') {
      const formattedNumber = formatPhoneNumber(target.value);
      setValue(formattedNumber);
    } else {
      setValue(target.value);
    }
  }

  function reset() {
    setValue("");
    setError(null);
  }
  
  return {
    value,
    setValue,
    error,
    setError,
    onChange,
    validate: () => validate(value),
    onBlur: () => validate(value),
    reset: () => reset(),
  };
};

export default useForm;
