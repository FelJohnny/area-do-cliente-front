const PORT = 3333;
const URL = "http://localhost";

export function POST_LOGIN(dataLogin) {
    return {
      url: `${URL}:${PORT}/api/auth/login`,
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
      url: `${URL}:${PORT}/api/pedido/cliente/${codcli}/?page=${page}`,
      options: {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token} `,
        },
      },
    };
  }