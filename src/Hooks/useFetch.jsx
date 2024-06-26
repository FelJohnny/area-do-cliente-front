import { useCallback, useState } from "react";

const useFetch = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const request = useCallback(async (url, options) => {
    let response;
    let json;
    try {
      setError(null);
      setLoading(true);
      response = await fetch(url, options);
      json = await response.json();
      setData(json)
      if (response.ok === false) throw new Error(json.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      return { response, json };
    }
  }, []);
  return {
    data,
    loading,
    error,
    request,
    setLoading
  };
};

export default useFetch;