const URL = "https://cliente.amalfis.com.br";

export function POST_LOGIN(dataLogin) {
    return {
      url: `${URL}/api/auth/login`,
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataLogin),
      },
    };
}

export function GET_AUTH_USER(codcli, token,page) {
    return {
      url: `${URL}/api/pedido/cliente/${codcli}/?page=${page}`,
      options: {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token} `,
        },
      },
    };
  }

  export function GET_PEDIDOS_ON_DATE(codcli, token,dataInicio,dataFim) {
    return {
      url: `${URL}/api/pedido/cliente/${codcli}/date/?dataInicio=${dataInicio}&dataFim=${dataFim}`,
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