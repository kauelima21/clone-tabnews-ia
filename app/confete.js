"use client";

import dynamic from "next/dynamic";
import { useState, useSyncExternalStore } from "react";

// Carrega a biblioteca sob demanda, fora do bundle inicial da página
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

const CONSULTA_MOVIMENTO_REDUZIDO = "(prefers-reduced-motion: reduce)";

function assinarRedimensionamento(callback) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

// Usada quando a animação termina: não precisa mais acompanhar a janela
function semAssinatura() {
  return () => {};
}

function assinarMovimentoReduzido(callback) {
  const consulta = window.matchMedia(CONSULTA_MOVIMENTO_REDUZIDO);
  consulta.addEventListener("change", callback);
  return () => consulta.removeEventListener("change", callback);
}

export default function Confete() {
  const [concluido, setConcluido] = useState(false);
  const assinar = concluido ? semAssinatura : assinarRedimensionamento;

  // No servidor (e durante a hidratação) os valores são nulos,
  // então nada é renderizado até conhecer a janela do navegador
  const largura = useSyncExternalStore(
    assinar,
    () => window.innerWidth,
    () => null,
  );
  const altura = useSyncExternalStore(
    assinar,
    () => window.innerHeight,
    () => null,
  );

  // Respeita quem prefere menos animações
  const movimentoReduzido = useSyncExternalStore(
    assinarMovimentoReduzido,
    () => window.matchMedia(CONSULTA_MOVIMENTO_REDUZIDO).matches,
    () => true,
  );

  // Desmonta o canvas quando a animação termina
  if (largura === null || altura === null || movimentoReduzido || concluido) {
    return null;
  }

  return (
    <Confetti
      width={largura}
      height={altura}
      recycle={false}
      numberOfPieces={400}
      onConfettiComplete={() => setConcluido(true)}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
    />
  );
}
