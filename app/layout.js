export const metadata = {
  title: "zl6-apitest",
  description: "ZL6 hourly data viewer"
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, background: "#f6f7f9" }}>
        {children}
      </body>
    </html>
  );
}
