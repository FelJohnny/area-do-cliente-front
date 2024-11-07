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



//--------------------------------USUARIO--------------------------------//

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

// Função para buscar todos os usuários
export function GET_USUARIOS(token) {
  return {
    url: `${URL}/api/usuarios`,
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

export function GET_CLI_POR_GPCLI(token,grupocli){
  return {
    url: `${URL}/api/entidade/grupo/${grupocli}`,
    options:{
      method: "GET",
      headers:{
        Authorization: `Bearer ${token}`,
      }
    }
  }
}

export function GET_COLECAO_POR_CODIGO(token,codigo){
  return {
    url: `${URL}/api/colecao/${codigo}`,
    options:{
      method: "GET",
      headers:{
        Authorization: `Bearer ${token}`,
      }
    }
  }
}

export function GET_COLECAO_POR_DESCRICAO(token,desc){
  return {
    url: `${URL}/api/colecao/descricao/${desc}`,
    options:{
      method: "GET",
      headers:{
        Authorization: `Bearer ${token}`,
      }
    }
  }
}

export function CRIA_USUARIO(token,data){
  return {
    url: `${URL}/api/usuario/register`,
    options:{
      method: "POST",
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  }
}

export function DELETE_USUARIO(token, usuarioId) {
  return {
    url: `${URL}/api/usuario/${usuarioId}`,  // Verifique se o endpoint está correto
    options: {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

export const UPDATE_USUARIO = (token, userId, data) => {
  return {
    url: `${URL}/api/usuario/${userId}`,
    options: {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    },
  };
};

//--------------------------------ROLES--------------------------------//
export function GET_ROLES(token){
  return {
    url: `${URL}/api/roles/`,
    options:{
      method: "GET",
      headers:{
        Authorization: `Bearer ${token}`,
      }
    }
  }
}

//--------------------------------PERMISSOES--------------------------------//
export function GET_PERMISSOES(token){
  return {
    url: `${URL}/api/permissoes/`,
    options:{
      method: "GET",
      headers:{
        Authorization: `Bearer ${token}`,
      }
    }
  }
}

//-----------------------PERMISSOES POR ROLE-----------------------//
export function GET_PERMISSOES_BY_ROLE(token, roleId) {
  return {
    url: `${URL}/api/roles/${roleId}/permissoes`,
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

//------------------------------- EMPRESAS --------------------------------//

export function CRIA_EMPRESA(token, dataEmpresa) {
  return {
    url: `${URL}/api/empresas`,
    options: {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataEmpresa),
    },
  };
}

export function GET_EMPRESAS(token) {
  return {
    url: `${URL}/api/empresas`,
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

export function GET_EMPRESA_BY_ID(token, id) {
  return {
    url: `${URL}/api/empresas/${id}`,
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

export function DELETE_EMPRESA(token, id) {
  return {
    url: `${URL}/api/empresas/${id}`,
    options: {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

export function UPDATE_EMPRESA(token, id, dataEmpresa) {
  return {
    url: `${URL}/api/empresas/${id}`,
    options: {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataEmpresa),
    },
  };
}

//------------------------------ USUARIOS_EMPRESA ----------------------------//

export function GET_USUARIOS_BY_EMPRESA(token, empresaId) {
  return {
    url: `${URL}/api/empresas/${empresaId}/usuarios`,
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

export function DELETE_USUARIO_FROM_EMPRESA(token, empresaId, usuarioId) {
  return {
    url: `${URL}/api/empresas/${empresaId}/usuarios/${usuarioId}`,
    options: {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}

export function UPDATE_USUARIO_FROM_EMPRESA(token, empresaId, usuarioId, dataUsuario) {
  return {
    url: `${URL}/api/empresas/${empresaId}/usuarios/${usuarioId}`,
    options: {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataUsuario),
    },
  };
}

export function ADD_USUARIO_TO_EMPRESA(token, empresaId, usuarioId) {
  return {
    url: `${URL}/api/empresas/${empresaId}/usuarios/${usuarioId}`,
    options: {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  };
}


export function GET_USUARIOS_DISPONIVEIS(token) {
  return {
    url: `${URL}/api/usuarios/disponiveis`,  // URL correta para a rota de usuários disponíveis
    options: {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  };
}
