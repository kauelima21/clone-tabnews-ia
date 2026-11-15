import "./globals.css";

export const metadata = { title: "Jogo da Velha" };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
