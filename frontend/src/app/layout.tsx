import "./globals.css";

export const metadata = {
  title: "Enterprise AI",
  description: "Enterprise AI Operations Copilot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
