"use client";

const ACCENT = "#0F2D6B";

export default function IAPage() {
  return (
    <div style={s.page}>
      <div style={s.stripeTop} />

      <div style={s.center}>
        <div style={s.lockWrap}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <p style={s.eyebrow}>ACESSO RESTRITO</p>
        <h1 style={s.title}>Em desenvolvimento</h1>
        <div style={s.titleUnderline} />

        <p style={s.desc}>
          Esta área está reservada para funcionalidades de inteligência artificial.<br />
          Em breve disponível.
        </p>

        <div style={s.badge}>
          <span style={s.badgeDot} />
          Em planejamento
        </div>
      </div>

      <div style={s.stripeBottom} />
    </div>
  );
}

const STRIPE = `repeating-linear-gradient(
  -45deg,
  ${ACCENT} 0px,
  ${ACCENT} 18px,
  #E8EDF8 18px,
  #E8EDF8 36px
)`;

const s: Record<string, React.CSSProperties> = {
  page: { fontFamily: "Inter, system-ui, sans-serif", minHeight: "calc(100vh - 56px)", display: "flex", flexDirection: "column", alignItems: "stretch", background: "#fafafa", userSelect: "none" },
  stripeTop: { height: "28px", background: STRIPE, opacity: 0.7, flexShrink: 0 },
  center: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 1.5rem", textAlign: "center" },
  lockWrap: { width: "72px", height: "72px", borderRadius: "16px", background: "#fff", border: "0.5px solid #e0e2e6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  eyebrow: { fontSize: "10px", letterSpacing: "0.14em", fontWeight: 600, color: "#fff", margin: "0 0 10px", background: ACCENT, padding: "3px 12px", borderRadius: "4px" },
  title: { fontSize: "36px", fontWeight: 600, color: "#1a1a1a", margin: "0 0 10px", letterSpacing: "-0.02em", lineHeight: 1.1 },
  titleUnderline: { width: "48px", height: "4px", background: ACCENT, borderRadius: "2px", margin: "0 auto 1.5rem" },
  desc: { fontSize: "14px", color: "#888", lineHeight: 1.7, margin: "0 0 2rem", maxWidth: "340px" },
  badge: { display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "12px", fontWeight: 500, color: "#1a1a1a", background: "#fff", border: "0.5px solid #e0e2e6", borderRadius: "20px", padding: "6px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" },
  badgeDot: { width: "7px", height: "7px", borderRadius: "50%", background: ACCENT, display: "inline-block", flexShrink: 0, boxShadow: `0 0 0 2px rgba(15,45,107,0.2)` },
  stripeBottom: { height: "28px", background: STRIPE, opacity: 0.7, flexShrink: 0 },
};
