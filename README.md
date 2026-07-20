# SkillMatch Web

Aplicação web (HTML, CSS e JavaScript puro) que evolui o motor de compatibilidade do Mini-Projeto SkillMatch JS (que rodava só no console) para uma interface real: o usuário preenche seu perfil, o sistema compara com um catálogo de vagas de front-end e mostra o percentual de compatibilidade, as habilidades que faltam e uma recomendação de estudo.

## Problema que resolve

Times de RH e candidatos não vão abrir o console do navegador para saber se o perfil combina com uma vaga. O SkillMatch Web dá uma interface simples para isso: preencha uma vez, veja o
resultado, e o perfil fica salvo para a próxima visita.

## Tecnologias utilizadas

- **HTML5 semântico** — landmarks (`header`, `nav`, `main`, `section`, `footer`), um único `h1`,
  formulário acessível (`label`/`for`, `aria-describedby`).
- **CSS3** — Flexbox, mobile-first, variáveis CSS, media queries.
- **JavaScript (ES2020+, módulos ES)** — sem framework, sem build, sem TypeScript.
- **Fetch API** + `async/await` para carregar o catálogo de vagas (`assets/dados/vagas.json`).
- **localStorage** para lembrar o perfil do candidato entre visitas.

### Estrutura de pastas

```
skillmatch-web/
├── index.html
├── README.md
└── assets/
    ├── styles/
    │   └── index.style.css
    ├── scripts/
    │   ├── main.js    
    │   ├── motor.js     
    │   ├── ui.js         
    │   └── dados.js      
    ├── dados/
    │   └── vagas.json
    └── img/
        └── logo.svg
```

## Como executar

1. Abra a pasta no VS Code.
2. Instale a extensão **Live Server**.
3. Clique com o botão direito em `index.html` → **Open with Live Server**.
4. O navegador abre em algo como `http://127.0.0.1:5500`.

## Funcionalidades

- Formulário de perfil (nome, área, habilidades, meses de experiência) com validação e  mensagens de erro acessíveis.
- Cálculo de compatibilidade por vaga (habilidades encontradas × faltantes).
- Classificação automática: **Alta** (80–100%), **Média** (50–79%), **Baixa** (0–49%).
- Destaque da vaga mais compatível + recomendação de estudo baseada na habilidade que mais falta entre as vagas analisadas.
- Cards gerados dinamicamente por JavaScript, em grade responsiva (Flexbox).
- Estados de carregamento, vazio e erro no `fetch` das vagas.
- Perfil salvo em `localStorage` — na próxima visita, o formulário já vem preenchido.
- Contador de análises feitas na sessão (closure).

## Kanban do projeto

https://trello.com/b/mfvz6PB0/skillmatch-web


## GitHub

https://github.com/Luana-Lucera/SkillMatch-Web-SCTEC


## Vídeo de apresentação

https://drive.google.com/file/d/1IRBJCFGXNU2Tey2b67Xj_tUu6ywb0lYG/view?usp=sharing


## Observação

Como havia a necessidade do vídeo ser mais enxuto, a pedido do professor, não fiquei explicando cada linha de código, e sim o funcionamento do site Skillmatch-web. 