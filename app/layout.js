export const metadata = {
  title: 'Устабор — Классификатор заявок',
  description: 'AI определение категории заявки для call-центра Устабор',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, background: '#0a0a0f' }}>{children}</body>
    </html>
  );
}