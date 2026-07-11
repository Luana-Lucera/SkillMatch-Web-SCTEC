// Ponto de entrada (<script type="module">). Não tem regra de negócio nem manipula
// DOM diretamente — só chama motor.js, ui.js e dados.js na ordem certa.
 
import { VagaFrontEnd, analisarPerfil, criarContadorDeAnalises } from "./motor.js";
import {
  carregarVagas,
  salvarPerfil,
  carregarPerfilSalvo,
} from "./dados.js";
import {
  aoEnviarFormulario,
  preencherFormulario,
  mostrarCarregando,
  mostrarErro,
  mostrarVazio,
  renderizarResultados,
  atualizarContadorAnalises,
} from "./ui.js";
 
const contarAnalise = criarContadorDeAnalises(); // closure: uma por sessão
let vagasCarregadas = [];
 
async function iniciar() {
  // RF14 — se já existe perfil salvo, o formulário volta preenchido
  const perfilSalvo = carregarPerfilSalvo();
  if (perfilSalvo) preencherFormulario(perfilSalvo);
 
  await buscarVagas();
 
  // RF10 — reage ao envio do formulário
  aoEnviarFormulario((perfil) => {
    salvarPerfil(perfil); // RF14 — lembra do perfil para a próxima visita
    processarPerfil(perfil);
 
    // se já usou antes, roda a análise assim que reenviar; se as vagas ainda
    // não tiverem chegado, o clique fica sem efeito visível — por isso buscamos antes
  });
 
  // Se já havia perfil salvo, roda a análise automaticamente ao abrir a página
  if (perfilSalvo && vagasCarregadas.length > 0) {
    processarPerfil(perfilSalvo);
  }
}
 
// RF13 — os três estados: carregando / vazio / erro (sucesso não conta como estado)
async function buscarVagas() {
  mostrarCarregando();
  try {
    const catalogo = await carregarVagas();
 
    if (!catalogo || catalogo.length === 0) {
      mostrarVazio("Nenhuma vaga disponível no momento.");
      return;
    }
 
    // Transforma cada objeto puro do JSON em instância do motor (dados -> regras)
    vagasCarregadas = catalogo.map((dadosVaga) => new VagaFrontEnd(dadosVaga));
  } catch (erro) {
    mostrarErro(erro.message);
  }
}
 
function processarPerfil(perfil) {
  if (vagasCarregadas.length === 0) {
    mostrarVazio("As vagas ainda não foram carregadas. Tente novamente em instantes.");
    return;
  }
 
  analisarPerfil(perfil, vagasCarregadas, (resultadoFinal) => {
    renderizarResultados(resultadoFinal);
    atualizarContadorAnalises(contarAnalise());
  });
}
 
iniciar();
 

