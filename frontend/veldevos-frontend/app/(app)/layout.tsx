import Header from "../components/Header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main
        style={{
          padding: "clamp(1rem, 4vw, 2.5rem) clamp(1rem, 4vw, 3rem)",
          maxWidth: "1400px",
          margin: "0 auto",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        {children}
      </main>
    </>
  );
}
