// Tudo que toca no DOM mora aqui: ler formulário, validar, desenhar cards,
// mostrar estados (carregando/vazio/erro). Não conhece regra de negócio nem fetch.
 
const form = document.querySelector("#form-perfil");
const campoNome = document.querySelector("#nome");
const campoArea = document.querySelector("#area");
const campoHabilidades = document.querySelector("#habilidades");
const campoExperiencia = document.querySelector("#experiencia");
const erroFormulario = document.querySelector("#erro-formulario");
 
const regiaoStatus = document.querySelector("#status-vagas"); // aria-live
const containerResultados = document.querySelector("#resultados");
const containerMelhorVaga = document.querySelector("#melhor-vaga");
const contadorAnalises = document.querySelector("#contador-analises");
 
// RF10 — captura o submit, impede reload e valida os campos obrigatórios
export function aoEnviarFormulario(callback) {
  form.addEventListener("submit", (evento) => {
    evento.preventDefault();
 
    const perfil = lerFormulario();
    const mensagemErro = validarPerfil(perfil);
 
    if (mensagemErro) {
      exibirErroFormulario(mensagemErro);
      return;
    }
 
    exibirErroFormulario(null);
    callback(perfil); // callback: quem decide o que fazer com o perfil é o main.js
  });
}
 
function lerFormulario() {
  const habilidades = campoHabilidades.value
    .split(",")
    .map((h) => h.trim())
    .filter((h) => h.length > 0);
 
  return {
    nome: campoNome.value.trim(),
    area: campoArea.value.trim(),
    habilidades,
    experienciaMeses: Number(campoExperiencia.value) || 0,
  };
}
 
function validarPerfil(perfil) {
  if (!perfil.nome) return "Informe seu nome.";
  if (!perfil.area) return "Informe sua área de interesse.";
  if (perfil.habilidades.length === 0) {
    return "Informe ao menos uma habilidade, separada por vírgula (ex.: html, css, javascript).";
  }
  return null;
}
 
// Feedback de erro acessível: usa aria-live para leitor de tela avisar sem recarregar o foco
function exibirErroFormulario(mensagem) {
  erroFormulario.textContent = mensagem ?? "";
  erroFormulario.hidden = !mensagem;
}
 
// RF14 (leitura) — preenche o formulário com o perfil salvo, se existir
export function preencherFormulario(perfil) {
  if (!perfil) return;
  campoNome.value = perfil.nome ?? "";
  campoArea.value = perfil.area ?? "";
  campoHabilidades.value = (perfil.habilidades ?? []).join(", ");
  campoExperiencia.value = perfil.experienciaMeses ?? "";
}
 
// RF13 — os três estados exigidos pela semana 11
export function mostrarCarregando() {
  regiaoStatus.textContent = "Carregando vagas…";
  containerResultados.innerHTML = "";
  containerMelhorVaga.innerHTML = "";
}
 
export function mostrarErro(mensagem) {
  regiaoStatus.textContent = `Erro: ${mensagem}`;
  containerResultados.innerHTML = "";
  containerMelhorVaga.innerHTML = "";
}
 
export function mostrarVazio(mensagem) {
  regiaoStatus.textContent = mensagem;
  containerResultados.innerHTML = "";
  containerMelhorVaga.innerHTML = "";
}
 
// RF11 — cards gerados por JS (createElement/classList), nada de HTML fixo
export function renderizarResultados({ resultados, melhor, recomendacao }) {
  regiaoStatus.textContent = `${resultados.length} vaga(s) analisada(s).`;
  containerResultados.innerHTML = "";
  containerMelhorVaga.innerHTML = "";
 
  if (resultados.length === 0) {
    mostrarVazio("Nenhuma vaga encontrada no catálogo.");
    return;
  }
 
  resultados.forEach((resultado) => {
    containerResultados.appendChild(criarCardVaga(resultado));
  });
 
  if (melhor) {
    containerMelhorVaga.appendChild(criarDestaqueMelhorVaga(melhor, recomendacao));
  }
}
 
function criarCardVaga(resultado) {
  const { vaga, percentual, encontradas, faltantes, classificacao } = resultado;
 
  const card = document.createElement("article");
  card.classList.add("card-vaga", `card-vaga--${classificacao.toLowerCase()}`);
 
  const cabecalho = document.createElement("div");
  cabecalho.classList.add("card-vaga__cabecalho");
 
  const titulo = document.createElement("h3");
  titulo.textContent = vaga.getRotulo();
 
  const selo = document.createElement("span");
  selo.classList.add("selo-percentual");
  selo.setAttribute("aria-label", `Compatibilidade de ${percentual} por cento, classificação ${classificacao}`);
  selo.textContent = `${percentual}%`;
 
  cabecalho.append(titulo, selo);
 
  const classificacaoEl = document.createElement("p");
  classificacaoEl.classList.add("card-vaga__classificacao");
  classificacaoEl.textContent = `Classificação: ${classificacao}`;
 
  const infoVaga = document.createElement("p");
  infoVaga.classList.add("card-vaga__info");
  infoVaga.textContent = `${vaga.modalidade} · R$ ${vaga.salario.toLocaleString("pt-BR")}`;
 
  const encontradasEl = criarListaHabilidades("Você já tem", encontradas, "encontrada");
  const faltantesEl = criarListaHabilidades("Falta estudar", faltantes, "faltante");
 
  card.append(cabecalho, classificacaoEl, infoVaga, encontradasEl, faltantesEl);
  return card;
}
 
function criarListaHabilidades(titulo, habilidades, tipoClasse) {
  const bloco = document.createElement("div");
  bloco.classList.add("lista-habilidades");
 
  const rotulo = document.createElement("p");
  rotulo.classList.add("lista-habilidades__titulo");
  rotulo.textContent = `${titulo}:`;
 
  const lista = document.createElement("ul");
  lista.classList.add("lista-habilidades__itens");
 
  if (habilidades.length === 0) {
    const item = document.createElement("li");
    item.textContent = "—";
    lista.appendChild(item);
  } else {
    habilidades.forEach((habilidade) => {
      const item = document.createElement("li");
      item.classList.add(`habilidade--${tipoClasse}`);
      item.textContent = habilidade;
      lista.appendChild(item);
    });
  }
 
  bloco.append(rotulo, lista);
  return bloco;
}
 
function criarDestaqueMelhorVaga(melhor, recomendacao) {
  const destaque = document.createElement("div");
  destaque.classList.add("destaque-melhor-vaga");
 
  const titulo = document.createElement("h3");
  titulo.textContent = `Melhor compatibilidade: ${melhor.vaga.getRotulo()}`;
 
  const percentualEl = document.createElement("p");
  percentualEl.textContent = `${melhor.percentual}% de compatibilidade (${melhor.classificacao})`;
 
  const recomendacaoEl = document.createElement("p");
  recomendacaoEl.classList.add("recomendacao-estudo");
  recomendacaoEl.textContent = recomendacao;
 
  destaque.append(titulo, percentualEl, recomendacaoEl);
  return destaque;
}
 
// Usa a closure de motor.js (contador) para mostrar quantas análises rodaram na sessão
export function atualizarContadorAnalises(total) {
  contadorAnalises.textContent = `Análises feitas nesta sessão: ${total}`;
}
 