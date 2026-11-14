// Recursos do sistema que podem ser ligados ou desligados sem apagar código.
//
// chat: desativado por enquanto (ninguém o usa). Com `false` o aluno não vê a aba "Chat" no menu,
// os botões e o cartão da tela inicial, o contador de sessões do perfil nem a coluna "Tempo no Chat"
// do admin, e o endereço /chat redireciona para a tela inicial. O código da página e do backend continua
// intacto: para o chat voltar, basta mudar para `true`.
export const RECURSOS = {
  chat: false,
};
