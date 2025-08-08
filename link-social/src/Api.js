const API_URL = "https://localhost:7148";


export async function login(email, senha) {
  const response = await fetch(`${API_URL}/api/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });
  return response.json();
}


export async function cadastrarUsuario(dados) {
  const response = await fetch(`${API_URL}/api/Usuario`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return response.json();
}
