"use client";

import { useEffect, useState } from "react";

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];
const EMPTY = Array(9).fill(null);
const ZERO = { win: 0, draw: 0, loss: 0 };
const OPTIMAL_CHANCE = { easy: 0.3, medium: 0.75, hard: 1 };

function getWinner(b) {
  for (const line of LINES) {
    const [a, c, d] = line;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { player: b[a], line };
  }
  if (b.every(Boolean)) return { player: null, line: [] }; // empate
  return null;
}

// Pontuação da posição do ponto de vista do computador (O)
function minimax(b, cpuTurn, depth) {
  const result = getWinner(b);
  if (result) return result.player === "O" ? 10 - depth : result.player === "X" ? depth - 10 : 0;
  let best = cpuTurn ? -Infinity : Infinity;
  b.forEach((v, i) => {
    if (v) return;
    b[i] = cpuTurn ? "O" : "X";
    const s = minimax(b, !cpuTurn, depth + 1);
    b[i] = null;
    best = cpuTurn ? Math.max(best, s) : Math.min(best, s);
  });
  return best;
}

function cpuMove(b, difficulty) {
  const free = b.flatMap((v, i) => (v ? [] : [i]));
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  if (Math.random() >= OPTIMAL_CHANCE[difficulty]) return pick(free);

  let best = -Infinity, moves = [];
  for (const i of free) {
    b[i] = "O";
    const s = minimax(b, false, 1);
    b[i] = null;
    if (s > best) [best, moves] = [s, [i]];
    else if (s === best) moves.push(i);
  }
  return pick(moves);
}

export default function Home() {
  const [board, setBoard] = useState(EMPTY);
  const [score, setScore] = useState(ZERO);
  const [difficulty, setDifficulty] = useState("medium");

  const result = getWinner(board);
  const cpuTurn = !result && board.filter(Boolean).length % 2 === 1;

  function saveScore(next) {
    setScore(next);
    try { localStorage.setItem("velha-score", JSON.stringify(next)); } catch {}
  }

  function play(i, mark) {
    const next = board.with(i, mark);
    setBoard(next);
    const r = getWinner(next);
    if (!r) return;
    const key = r.player === "X" ? "win" : r.player === "O" ? "loss" : "draw";
    setScore((s) => {
      const updated = { ...s, [key]: s[key] + 1 };
      try { localStorage.setItem("velha-score", JSON.stringify(updated)); } catch {}
      return updated;
    });
  }

  // Carrega o placar salvo (só no navegador)
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("velha-score"));
      if (saved) setScore(saved);
    } catch {}
  }, []);

  // Vez do computador: responde após uma pausa curta
  useEffect(() => {
    if (!cpuTurn) return;
    const timer = setTimeout(() => play(cpuMove([...board], difficulty), "O"), 400);
    return () => clearTimeout(timer);
  }, [board]); // eslint-disable-line react-hooks/exhaustive-deps

  const status = result
    ? { X: "Você venceu! 🎉", O: "Você perdeu! 🤖" }[result.player] ?? "Deu velha! Empate."
    : cpuTurn ? "Computador pensando..." : "Sua vez!";

  return (
    <main className="game">
      <h1>Jogo da Velha</h1>

      <div className="score">
        <div className="you"><span>Você (X)</span><strong>{score.win}</strong></div>
        <div className="draw"><span>Empates</span><strong>{score.draw}</strong></div>
        <div className="cpu"><span>Computador (O)</span><strong>{score.loss}</strong></div>
      </div>

      <div className="status" aria-live="polite">{status}</div>

      <div className="board">
        {board.map((v, i) => (
          <button
            key={i}
            aria-label={`Casa ${i + 1}`}
            className={`cell ${v?.toLowerCase() ?? ""} ${result?.line.includes(i) ? "win" : ""}`}
            disabled={!!result || cpuTurn || !!v}
            onClick={() => play(i, "X")}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="controls">
        <button className="action" onClick={() => setBoard(EMPTY)}>Reiniciar jogo</button>
        <select aria-label="Dificuldade" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="easy">Fácil</option>
          <option value="medium">Médio</option>
          <option value="hard">Impossível</option>
        </select>
        <button className="action secondary" onClick={() => saveScore(ZERO)}>Zerar placar</button>
      </div>
    </main>
  );
}
