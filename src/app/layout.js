import './globals.css';

export const metadata = {
  title: 'EduVault — E-Learning & Resource Platform with Google Sheet Database',
  description: 'Pro E-Learning Platform with Tiered Subscriptions, Role-Based Access Control, and Real-time Google Sheets Database Integration.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-slate-800">
        {children}
      </body>
    </html>
  );
}
