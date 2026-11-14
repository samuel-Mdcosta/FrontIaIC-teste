import { useEffect, useState } from "react";
import { buscarQuestionarioAvaliacao, enviarAvaliacaoQuiz } from "../services/api";

// Avaliação de satisfação do quiz: uma nota de 0 a 5 para cada pergunta (obrigatórias) e um comentário
// opcional. As perguntas vêm do backend (ragiaic/config/avaliacao.php). O resultado do quiz e a análise do
// tutor só são liberados depois do envio — o backend também exige.
//
// Props:
//   quizId      — quiz avaliado
//   onConcluida — chamado depois que a avaliação foi registrada
//   textoBotao  — texto do botão de envio

export default function AvaliacaoQuiz({ quizId, onConcluida, textoBotao = "Enviar avaliação" }) {
  const [questionario, setQuestionario] = useState(null);
  const [erroCarregar, setErroCarregar] = useState(null);
  const [recarregar, setRecarregar] = useState(0);
  const [notas, setNotas] = useState({});
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);

  useEffect(() => {
    let ativo = true;
    buscarQuestionarioAvaliacao()
      .then((q) => {
        if (ativo) setQuestionario(q);
      })
      .catch((e) => {
        if (ativo) setErroCarregar(e.message);
      });
    return () => {
      ativo = false;
    };
  }, [recarregar]);

  if (erroCarregar) {
    return (
      <div role="alert" className="flex flex-wrap items-center gap-4 p-6 bg-error/5 rounded-2xl border border-error/20">
        <span className="material-symbols-outlined text-error">error</span>
        <p className="flex-1 text-sm text-on-surface">{erroCarregar}</p>
        <button
          type="button"
          onClick={() => {
            setErroCarregar(null);
            setRecarregar((n) => n + 1);
          }}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  if (!questionario) {
    return (
      <div role="status" className="flex items-center gap-3 p-6 text-sm text-on-surface-variant">
        <span className="material-symbols-outlined text-primary animate-spin">progress_activity</span>
        Carregando a avaliação...
      </div>
    );
  }

  const { perguntas, escala, comentario: aberta } = questionario;
  const valores = Array.from({ length: escala.max - escala.min + 1 }, (_, i) => escala.min + i);
  const faltam = perguntas.filter((p) => notas[p.chave] === undefined).length;

  async function enviar(evento) {
    evento.preventDefault();
    if (faltam > 0 || enviando) return;
    setEnviando(true);
    setErroEnvio(null);
    try {
      await enviarAvaliacaoQuiz(quizId, notas, comentario);
      onConcluida?.();
    } catch (e) {
      setErroEnvio(e.message);
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-5" noValidate>
      <p className="text-sm text-on-surface-variant">
        Dê uma nota de {escala.min} a {escala.max} para cada pergunta: <strong>{escala.min} = {escala.rotulo_min}</strong> e{" "}
        <strong>{escala.max} = {escala.rotulo_max}</strong>.
      </p>

      {perguntas.map((pergunta, i) => {
        const idTexto = `avaliacao-${quizId}-${pergunta.chave}`;
        return (
          <div key={pergunta.chave} className="p-5 bg-surface-container-lowest rounded-2xl border border-outline-variant/15 space-y-4">
            <p id={idTexto} className="text-sm font-medium text-on-surface leading-relaxed">
              <span className="text-primary font-headline font-semibold mr-2">{String(i + 1).padStart(2, "0")}</span>
              {pergunta.texto}
            </p>
            <div role="radiogroup" aria-labelledby={idTexto} aria-required="true" className="flex gap-2">
              {valores.map((valor) => (
                <label key={valor} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name={idTexto}
                    value={valor}
                    checked={notas[pergunta.chave] === valor}
                    onChange={() => setNotas((atuais) => ({ ...atuais, [pergunta.chave]: valor }))}
                    className="peer sr-only"
                  />
                  <span className="flex h-11 items-center justify-center rounded-xl border border-outline-variant/30 text-sm font-bold text-on-surface-variant transition-all hover:border-primary/40 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40">
                    {valor}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex justify-between text-[11px] text-on-surface-variant">
              <span>{escala.rotulo_min}</span>
              <span>{escala.rotulo_max}</span>
            </div>
          </div>
        );
      })}

      {aberta && (
        <div className="space-y-2">
          <label htmlFor={`avaliacao-${quizId}-comentario`} className="block text-sm font-medium text-on-surface">
            {aberta.texto} <span className="font-normal text-on-surface-variant">(opcional)</span>
          </label>
          <textarea
            id={`avaliacao-${quizId}-comentario`}
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            maxLength={aberta.max}
            rows={4}
            placeholder="Escreva aqui, se quiser."
            className="w-full resize-y rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-4 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="text-right text-[11px] text-on-surface-variant">
            {comentario.length}/{aberta.max}
          </p>
        </div>
      )}

      {erroEnvio && (
        <p role="alert" className="text-sm text-error text-center">
          Não foi possível enviar a avaliação: {erroEnvio}
        </p>
      )}

      <button
        type="submit"
        disabled={faltam > 0 || enviando}
        className="w-full primary-gradient text-white py-4 rounded-2xl font-headline font-bold text-base hover:shadow-lg transition-all duration-300 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {enviando ? "Enviando..." : textoBotao}
        <span className="material-symbols-outlined">arrow_forward</span>
      </button>
      {faltam > 0 && (
        <p className="text-xs text-center text-on-surface-variant">
          {faltam === 1 ? "Falta 1 pergunta" : `Faltam ${faltam} perguntas`} para liberar o envio.
        </p>
      )}
    </form>
  );
}
