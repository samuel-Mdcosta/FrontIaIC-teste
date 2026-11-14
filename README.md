# Tutor Virtual de Neurociências — Front

Interface web do Tutor Virtual de Neurociências (Iniciação Científica, Uniderp). O aluno pratica com questões de
múltipla escolha baseadas em livros didáticos, vê o gabarito com justificativas e acompanha o próprio desempenho. O
professor acompanha os alunos e exporta dados em CSV.

React 19 + Vite + Tailwind CSS 3 + React Router 7. Sem backend próprio: tudo vem da API do
[ragiaic](https://github.com/samuel-Mdcosta/ragiaic) (Laravel), que por sua vez usa o
[motor de IA](https://github.com/samuel-Mdcosta/Iniciacao-Cientifica_Tutor_Virtual-main) (Python) só para gerar o feedback.

## Telas

| Rota | Tela | Quem acessa |
|---|---|---|
| `/` | Login e cadastro | todos |
| `/inicio` | Início | aluno |
| `/perguntas` | Escolha dos temas e da modalidade (com ou sem feedback) | aluno |
| `/perguntas/quizz/:tema` | Quiz, avaliação de satisfação e resultado com gabarito | aluno |
| `/desempenho` | Desempenho por tema e feedback gerado pela IA | aluno |
| `/perfil` | Perfil e dados do aluno | aluno |
| `/admin` | Painel do Professor | só admin |

As rotas protegidas exigem login; `/admin` exige perfil de administrador.

## Como o aluno estuda

- **Quiz por tema:** 10 questões de um dos 8 temas, 30% fáceis, 50% intermediárias e 20% difíceis. O gabarito não vem do
  backend até a resposta ser registrada, e a primeira resposta é a que vale.
- **Simulado:** marcando 2 ou mais temas (ou todos, pelo botão "Simulado misto") o aluno faz 20 questões só com os temas
  escolhidos. O desempenho conta para o tema real de cada questão.
- **Modalidade:** "Com feedback" mostra a explicação após cada resposta; "Sem feedback" deixa a revisão completa para o final.
- **Avaliação de satisfação:** obrigatória ao concluir o quiz, antes de ver o resultado. As perguntas vêm do backend.
- **Feedback de desempenho (IA):** na tela de desempenho o botão "Gerar feedback" pede a análise. Há limite de 10 por
  dia e só vale com tentativas novas. O pedido entra numa fila no backend, que mostra a espera e tenta de novo
  sozinho se o serviço de IA estiver ocupado.

## Painel do Professor

Lista os alunos com exercícios feitos, taxa de acerto e erros, e abre o detalhe por tema. Dois botões baixam CSV:

- **Telemetria:** um registro por quiz (aluno, tema, temas escolhidos, modo, acertos, início, fim e duração).
- **Feedback:** as avaliações de satisfação dos quizzes, uma nota por linha, com o comentário.

O download usa o token do professor (`fetch` com `Authorization`), por isso não é um link simples.

## Rodando localmente

Requisitos: Node 20.19+ (ou 22.12+), exigido pelo Vite 8, e a API do ragiaic no ar. O `package.json` não fixa a versão do Node (não há `engines`).

```bash
npm install
npm run dev        # http://localhost:5173
```

Por padrão o `vite.config.js` encaminha `/api` para `http://127.0.0.1:8000`. Se a API estiver em outra porta, ajuste o
`proxy` desse arquivo.

Outros comandos:

```bash
npm run lint       # ESLint
npm run build      # gera dist/
npm run preview    # serve o build
```

## Configuração

| Onde | O quê |
|---|---|
| `VITE_API_URL` | Endereço base da API. Em produção, defina no ambiente de build (ex.: `https://sua-api.onrender.com`). Em desenvolvimento pode ficar vazio, pois o proxy do Vite cuida do `/api`. |
| `src/config/recursos.js` | Liga e desliga recursos. `RECURSOS.chat` está `false`: o chat fica escondido (menu, tela inicial, perfil e coluna do admin) sem apagar código. Mude para `true` para voltá-lo. |
| `src/data/temasQuiz.js` | Os 8 temas e o simulado. Os títulos devem ser **idênticos, byte a byte,** à lista de `config/temas.php` e a `quiz.simulado.nome` (`config/quiz.php`) no ragiaic. |

## Deploy

Hospedagem estática (Vercel). O `vercel.json` reescreve todas as rotas para `/index.html`, necessário para o React Router.
Defina `VITE_API_URL` apontando para a API e rode `npm run build`.

## Estrutura

```
src/
  pages/        telas (Login, Inicio, Perguntas, Quiz, Desempenho, Perfil, Admin, Chat)
  components/   Header, FeedbackDesempenho, QuizResultado e outros
  hooks/        lógica das telas (useQuiz, usePerguntas, useDesempenho, useFeedbackDesempenho, useAdmin...)
  services/     api.js: todas as chamadas à API
  data/         temasQuiz.js
  config/       recursos.js
  utils/        funções de apoio (ex.: textos do desempenho)
```
