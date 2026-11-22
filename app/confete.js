"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Carrega a biblioteca sob demanda, fora do bundle inicial da página
const Confetti = dynamic(() => import("react-confetti"), { ssr: false });

export default function Confete() {
  const [tamanho, setTamanho] = useState(null);
  const [concluido, setConcluido] = useState(false);

  useEffect(() => {
    // Animação encerrada: não precisa mais acompanhar o tamanho da janela
    if (concluido) return;

    // Respeita quem prefere menos animações
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setConcluido(true);
      return;
    }

    function atualizarTamanho() {
      setTamanho({ largura: window.innerWidth, altura: window.innerHeight });
    }
    atualizarTamanho();
    window.addEventListener("resize", atualizarTamanho);
    return () => window.removeEventListener("resize", atualizarTamanho);
  }, [concluido]);

  // Só renderiza no navegador, depois de conhecer o tamanho da janela,
  // e desmonta o canvas quando a animação termina
  if (!tamanho || concluido) return null;

  return (
    <Confetti
      width={tamanho.largura}
      height={tamanho.altura}
      recycle={false}
      numberOfPieces={400}
      onConfettiComplete={() => setConcluido(true)}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
    />
  );
}
