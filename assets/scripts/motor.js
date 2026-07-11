// motor.js
// O "cérebro" do SkillMatch: só regras de negócio, nada de DOM/tela aqui.
// Reaproveita a lógica do Mini-Projeto (S02–S06), agora em módulo ES.
 
// RF07 — POO: classe base Vaga (construtor, atributos, método usando this)
export class Vaga {
  constructor({ id, empresa, cargo, requisitos, salario, modalidade }) {
    this.id = id;
    this.empresa = empresa;
    this.cargo = cargo;
    this.requisitos = requisitos; // array de strings (habilidades exigidas)
    this.salario = salario;
    this.modalidade = modalidade;
  }
 
  // RF03 — usa this.requisitos: compara com as habilidades do candidato
  // RF06 — usa filter (método de array)
  calcularCompatibilidade(habilidadesCandidato) {
    const habilidades = habilidadesCandidato.map((h) => h.toLowerCase().trim());
 
    const encontradas = this.requisitos.filter((requisito) =>
      habilidades.includes(requisito.toLowerCase().trim())
    );
    const faltantes = this.requisitos.filter(
      (requisito) => !encontradas.includes(requisito)
    );
 
    const percentual = this.requisitos.length
      ? Math.round((encontradas.length / this.requisitos.length) * 100)
      : 0;
 
    return { percentual, encontradas, faltantes };
  }
 
  // Rótulo padrão — será sobrescrito pela subclasse (RF07)
  getRotulo() {
    return `${this.cargo} · ${this.empresa}`;
  }
}
 
// RF07 — Herança com propósito: toda vaga do SkillMatch é uma vaga de front-end,
// então a subclasse acrescenta a "stack" exigida e sobrescreve o rótulo de exibição
// para deixar isso visível no card (ex.: "Front-End Júnior (React)").
export class VagaFrontEnd extends Vaga {
  constructor(dados) {
    super(dados);
    this.stack = dados.stack ?? "Front-End";
  }

   getRotulo() {
    return `${super.getRotulo()} — stack: ${this.stack}`;
  }
}
 
// RF04 — Classificação por faixa de percentual
export function classificarCompatibilidade(percentual) {
  if (percentual >= 80) return "Alta";
  if (percentual >= 50) return "Média";
  return "Baixa";
}
 
// RF05 — Melhor vaga: usa reduce (RF06) para achar o maior percentual;
// em empate, desempata pela vaga com menos habilidades faltantes.
export function encontrarMelhorVaga(resultados) {
  if (!resultados.length) return null;
 
  return resultados.reduce((melhor, atual) => {
    if (atual.percentual > melhor.percentual) return atual;
    if (
      atual.percentual === melhor.percentual &&
      atual.faltantes.length < melhor.faltantes.length
    ) {
      return atual;
    }
    return melhor;
  });
}
 
// RF05 — Recomendação de estudo: usa reduce para contar quais habilidades
// mais aparecem como "faltante" entre todas as vagas analisadas.
export function gerarRecomendacao(resultados) {
  const contagem = resultados.reduce((acumulado, resultado) => {
    resultado.faltantes.forEach((habilidade) => {
      acumulado[habilidade] = (acumulado[habilidade] ?? 0) + 1;
    });
    return acumulado;
  }, {});
 
  const ranking = Object.entries(contagem).sort((a, b) => b[1] - a[1]);
 
  if (!ranking.length) {
    return "Seu perfil já cobre todos os requisitos das vagas disponíveis. Parabéns!";
  }
 
  const [habilidadeMaisFaltante] = ranking[0];
  return `A habilidade que mais falta entre as vagas é "${habilidadeMaisFaltante}". Priorize estudar isso para subir sua compatibilidade.`;
}
 
// RF08 — Closure: "total" fica preso (encapsulado) dentro da função retornada,
// ninguém de fora consegue acessar ou zerar esse contador diretamente.
export function criarContadorDeAnalises() {
  let total = 0;
  return function contar() {
    total += 1;
    return total;
  };
}
 
// RF08 — Callback: recebe uma função (aoConcluir) e a chama ao final do processamento,
// controlando o fluxo de quem chamou (é a "ui.js" quem decide o que fazer com o resultado).
// RF06 — usa map (além do filter/reduce usados dentro das funções acima) => 3 métodos de array.
export function analisarPerfil(candidato, vagas, aoConcluir) {
  const resultados = vagas.map((vaga) => {
    const { percentual, encontradas, faltantes } = vaga.calcularCompatibilidade(
      candidato.habilidades
    );
    return {
      vaga,
      percentual,
      encontradas,
      faltantes,
      classificacao: classificarCompatibilidade(percentual),
    };
  });
 
  resultados.sort((a, b) => b.percentual - a.percentual);
 
  const melhor = encontrarMelhorVaga(resultados);
  const recomendacao = gerarRecomendacao(resultados);
 
  aoConcluir({ resultados, melhor, recomendacao });
}