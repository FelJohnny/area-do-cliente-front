const URL = "http://localhost:3333";



  export function GET_PEDIDOS_ON_DATE(id, token,dataInicio,dataFim) {
    return {
      url: `${URL}/api/pedido/cliente/${id}/date/?dataInicio=${dataInicio}&dataFim=${dataFim}`,
      options: {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token} `,
        },
      },
    };
  }

  export function SEND_EMAIL_PED_CODCLI(codcli, pedido, token) {
    return {
      url: `${URL}/api/pedido/envio-email/${codcli}/${pedido}`,
      options: {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token} `,
        },
      },
    };
  }

  //--------------------------------NOVOS--------------------------------//

  export function POST_LOGIN(dataLogin) {
    return {
      url: `${URL}/api/usuario/login`,
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataLogin),
      },
    };
}

export function GET_USUARIO(id,token){
  return {
    url: `${URL}/api/usuario/${id}`,
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token} `,
      },
    },
  };
}

export function GET_PEDIDOS(id, token,page) {
  return {
    url: `${URL}/api/pedido/cliente/${id}/?page=${page}`,
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

export function GET_GRUPO_CLI(token){
  return {
    url: `${URL}/api/grupocli/`,
    options:{
      method: "GET",
      headers:{
        Authorization: `Bearer ${token}`,
      }
    }
  }
}