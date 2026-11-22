import "./globals.css";

export const metadata = { title: "Clone Tabnews" };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
