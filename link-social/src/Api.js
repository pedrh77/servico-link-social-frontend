const API_URL = "https://localhost:7148";

function getToken() {
  return sessionStorage.getItem("token");
}


export async function login(email, senha) {
  const response = await fetch(`${API_URL}/api/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  const data = await response.json();
  if (data.token) {
    sessionStorage.setItem("token", data.token);
  }
  return response;
}


export async function cadastrarUsuario(dados) {
  const response = await fetch(`${API_URL}/api/Usuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return response
}

// Exemplo de requisição autenticada
export async function getComToken(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });
  return response.json();
}
