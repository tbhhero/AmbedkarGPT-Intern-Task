import "../styles/globals.css";

export const metadata = {
  title: "AmbedkarGPT",
  description: "Local RAG chat built from Ambedkar's writings",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
