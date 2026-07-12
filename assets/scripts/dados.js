// Tudo que é "de fora" (rede) ou "que precisa lembrar" (localStorage) mora aqui.
// motor.js não sabe que isso existe — só recebe o array de vagas prontinho.
 
const CHAVE_PERFIL = "skillmatch:perfil";
 
// RF13 — fetch + async/await. O caminho é relativo à PÁGINA (index.html), por isso
// começa com "./assets/..." e não "./vagas.json" (que seria relativo a este arquivo).
export async function carregarVagas() {
  const resposta = await fetch("./assets/dados/vagas.json");
 
  if (!resposta.ok) {
    // response.ok checado explicitamente, como pede o RF13
    throw new Error(`Não foi possível carregar as vagas (HTTP ${resposta.status})`);
  }
 
  const vagas = await resposta.json();
  return vagas;
}
 
// RF14 — Persistência: nunca guardar dado sensível (senha, documento, etc.),
// só o que é necessário para reabrir o app já com o perfil preenchido.
export function salvarPerfil(perfil) {
  localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
}
 
// RF14 — trata o null da primeira visita (quando ainda não existe nada salvo)
export function carregarPerfilSalvo() {
  const bruto = localStorage.getItem(CHAVE_PERFIL);
  if (bruto === null) return null;
 
  try {
    return JSON.parse(bruto);
  } catch {
    // Se por algum motivo o dado salvo estiver corrompido, ignora em vez de quebrar o app
    return null;
  }
}
 