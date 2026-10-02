import "./globals.css";

export const metadata = {
  title: "The Wedding of Disa & Iqbal",
  description: "Undangan Pernikahan Digital",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-[#FCF8F1] text-gray-800">{children}</body>
    </html>
  );
}
