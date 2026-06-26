"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Preencha e-mail e senha para continuar.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, senha: password });
      const { token } = res.data;
      localStorage.setItem("veldev_token", token);
      document.cookie = `veldev_token=${token}; path=/; max-age=86400`;
      router.push("/dashboard");
    } catch {
      setError("Credenciais inválidas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoRow}>
          <div style={styles.logoIcon}>
            <VelDevLogo />
          </div>
          <div>
            <p style={styles.logoName}>VelDev OS</p>
            <p style={styles.logoSub}>sistemas que não falham</p>
          </div>
        </div>

        <h1 style={styles.heading}>Acessar sistema</h1>
        <p style={styles.subheading}>Entre com suas credenciais para continuar</p>

        <form onSubmit={handleSubmit} noValidate>

          <div style={styles.fieldGroup}>
            <label htmlFor="email" style={styles.label}>E-mail</label>
            <div style={styles.inputWrapper}>
              <MailIcon />
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
                autoComplete="email"
              />
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label htmlFor="password" style={styles.label}>Senha</label>
            <div style={styles.inputWrapper}>
              <LockIcon />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ ...styles.input, paddingRight: "2.5rem" }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                style={styles.eyeBtn}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {error && <p style={styles.errorMsg}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

        </form>
      </div>

      <p style={styles.footer}>VelDev OS · acesso restrito</p>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#e8eaed",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.5rem",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "480px",
    background: "#ffffff",
    borderRadius: "14px",
    border: "0.5px solid #d4d7dd",
    padding: "3rem 2.75rem",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "2rem",
  },
  logoIcon: {
    width: "44px",
    height: "44px",
    background: "#0F2D6B",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  logoName: {
    fontSize: "17px",
    fontWeight: 600,
    color: "#0F2D6B",
    margin: 0,
    lineHeight: 1.2,
  },
  logoSub: {
    fontSize: "13px",
    color: "#999",
    margin: 0,
    lineHeight: 1.3,
  },
  heading: {
    fontSize: "24px",
    fontWeight: 500,
    color: "#2c2c2c",
    margin: "0 0 6px",
  },
  subheading: {
    fontSize: "15px",
    color: "#999",
    margin: "0 0 2rem",
  },
  fieldGroup: { marginBottom: "18px" },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: "#555",
    marginBottom: "7px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    background: "#f5f5f5",
    border: "0.5px solid #d4d7dd",
    borderRadius: "8px",
    padding: "13px 12px 13px 42px",
    fontSize: "15px",
    color: "#2c2c2c",
    outline: "none",
    boxSizing: "border-box",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    display: "flex",
    alignItems: "center",
    color: "#bbb",
  },
  errorMsg: {
    fontSize: "13px",
    color: "#c0392b",
    background: "#fdf0ef",
    border: "0.5px solid #f5c6c4",
    borderRadius: "7px",
    padding: "10px 14px",
    marginBottom: "14px",
  },
  submitBtn: {
    width: "100%",
    background: "#0F2D6B",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: 500,
    transition: "opacity 0.15s",
  },
  footer: {
    marginTop: "1.25rem",
    fontSize: "13px",
    color: "#aaa",
  },
};

function VelDevLogo() {
  return (
    <svg width="26" height="26" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="42" r="34" fill="#1E4FBF"/>
      <circle cx="38" cy="46" r="14" fill="#e8eaed"/>
      <circle cx="68" cy="30" r="8" fill="white" opacity="0.9"/>
      <ellipse cx="72" cy="44" rx="6" ry="10" fill="#1E4FBF" transform="rotate(-20 72 44)"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ position: "absolute", left: "12px" }}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      style={{ position: "absolute", left: "12px" }}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}
