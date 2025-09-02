import { jwtDecode } from "jwt-decode";

const API_URL = "https://localhost:7148";

function getToken() {
  return sessionStorage.getItem("token");
}

// USUARIO
export async function login(email, senha) {
  const response = await fetch(`${API_URL}/api/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const data = await response.json();

  if (data.token) {
    sessionStorage.setItem("token", data.token);
    console.log("Token salvo no sessionStorage:", data.token);
  } else {
    console.error("Login não retornou token:", data);
  }

  return data;
}

export async function cadastrarUsuario(dados) {
  const response = await fetch(`${API_URL}/api/Usuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return response;
}

export async function getUsuarioAutenticado() {
  const token = getToken();
  console.log("Token do usuário:", token);
  if (!token) throw new Error("Usuário não autenticado");

  const decoded = jwtDecode(token);
  const userId = decoded.nameid;
  if (!userId) throw new Error("ID do usuário não encontrado no token");

  const response = await fetch(`${API_URL}/api/Usuario/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Falha ao buscar dados do usuário");
  }

  const data = await response.json();
  return data;
}

export async function getOngs() {
  try {
    const response = await fetch(`${API_URL}/api/Usuario/tipo/1`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar ONGs:", error);
    return [];
  }
}


// BENEFICIOS

export async function criarBeneficio(dados) {
  try {
    const response = await fetch(`${API_URL}/api/Beneficios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(dados)
    });

    if (!response.ok) {
      const erro = await response.text();
      throw new Error(`Erro ao criar benefício: ${erro}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getBeneficios(idOng) {
  try {
    const response = await fetch(`${API_URL}/api/Beneficios`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar benefícios:", error);
    return [];
  }
}


export async function getBeneficiosPorOngId(idOng) {
  try {
    const response = await fetch(`${API_URL}/api/Beneficios/Usuario/${idOng}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });

    if (!response.ok) {
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar benefícios:", error);
    return [];
  }
}



// DOAÇÕES

export async function NovaDoacao(dados) {
  try {
    const response = await fetch(`${API_URL}/api/Doacoes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro ao processar a doação");
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Erro na NovaDoacao:", err);
    throw err;
  }
}

export async function GetDoacoesByDoador(id) {
  try {
    const response = await fetch(`${API_URL}/api/Doacoes/Doador/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    console.log("Response doações:", response);

    if (!response.ok) {
      throw new Error("Erro ao buscar doações");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar doações:", error);
    return [];
  }
}


export async function GetDoacoesByOngId(id) {
  try {
    const response = await fetch(`${API_URL}/api/Doacoes/ong/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    });
    console.log("Response doações:", response);

    if (!response.ok) {
      throw new Error("Erro ao buscar doações");
    }

    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar doações:", error);
    return [];
  }
}