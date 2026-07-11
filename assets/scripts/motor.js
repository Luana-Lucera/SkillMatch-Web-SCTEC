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
 
