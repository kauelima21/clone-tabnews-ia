import Confete from "./confete";

// Página estática regenerada em segundo plano (ISR) a cada 60 segundos:
// o visitante recebe o HTML pronto, sem esperar a API do TabNews.
export const revalidate = 60;

// Tempo máximo de espera pela API antes de desistir e mostrar o fallback
const TEMPO_LIMITE_API_MS = 3000;

const URL_API_CONTEUDOS =
  "https://www.tabnews.com.br/api/v1/contents?strategy=new&per_page=1";

async function buscarTotalDeConteudos() {
  try {
    const resposta = await fetch(URL_API_CONTEUDOS, {
      next: { revalidate },
      signal: AbortSignal.timeout(TEMPO_LIMITE_API_MS),
    });
    if (!resposta.ok) return null;
    const total = Number(resposta.headers.get("x-pagination-total-rows"));
    return Number.isFinite(total) ? total : null;
  } catch {
    return null;
  }
}

export default async function Home() {
  const total = await buscarTotalDeConteudos();

  return (
    <main className="em-construcao">
      <Confete />
      <h1>🚧 Em Construção 🚧</h1>
      <p className="frase">
        Estamos neste exato momento reconstruindo o TabNews, um lugar na
        internet para quem trabalha com tecnologia e precisa consumir conteúdos
        com valor concreto.
      </p>
      <p className="total">
        {total !== null ? (
          <>
            <strong>{total.toLocaleString("pt-BR")}</strong> conteúdos
            publicados no TabNews
          </>
        ) : (
          "Não foi possível carregar o total de conteúdos publicados no TabNews."
        )}
      </p>
      <a
        href="https://www.tabnews.com.br"
        target="_blank"
        rel="noopener noreferrer"
      >
        Acesse o TabNews oficial →
      </a>
    </main>
  );
}
