"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: <DashboardIcon /> },
  { label: "Clientes",  href: "/clientes",  icon: <ClientesIcon /> },
  { label: "Projetos",  href: "/projetos",  icon: <ProjetosIcon /> },
  { label: "Financeiro",href: "/financeiro",icon: <FinanceiroIcon /> },
  { label: "IA",        href: "/ia",        icon: <IAIcon /> },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("veldev_token");
    document.cookie = "veldev_token=; path=/; max-age=0";
    router.push("/login");
  }

  return (
    <header style={styles.header}>

      <Link href="/dashboard" style={styles.logo}>
        <Image
          src="/LogoVelDevRBG.png"
          alt="VelDev"
          width={52}
          height={42}
          style={{ borderRadius: "8px", display: "block" }}
        />
      </Link>

      <nav style={styles.nav}>
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...styles.navItem,
                background: active ? "#E8EDF8" : "transparent",
              }}
              title={item.label}
            >
              <span style={{ color: active ? "#0F2D6B" : "#888", display: "flex", flexShrink: 0 }}>
                {item.icon}
              </span>
              <span
                className="nav-label-hide"
                style={{
                  ...styles.navLabel,
                  color: active ? "#0F2D6B" : "#888",
                  fontWeight: active ? 500 : 400,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <button onClick={handleLogout} style={styles.avatar} title="Sair">
        <span style={styles.avatarLetter}>M</span>
      </button>

    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    width: "100%",
    height: "56px",
    background: "#ffffff",
    borderBottom: "0.5px solid #e0e2e6",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1rem",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
    zIndex: 100,
    overflow: "hidden",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    flexShrink: 0,
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    flex: 1,
    justifyContent: "center",
    overflow: "hidden",
    padding: "0 8px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    padding: "6px 8px",
    borderRadius: "7px",
    textDecoration: "none",
    transition: "background 0.15s",
    flexShrink: 0,
  },
  navLabel: {
    fontSize: "13px",
    whiteSpace: "nowrap" as const,
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    background: "#E8EDF8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    cursor: "pointer",
    border: "none",
  },
  avatarLetter: {
    fontSize: "12px",
    fontWeight: 500,
    color: "#0F2D6B",
  },
};

function DashboardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function ClientesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function ProjetosIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function FinanceiroIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v2m0 8v2M9 9h1.5a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3H9m0 0h3m-3 0v2" />
    </svg>
  );
}

function IAIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a8 8 0 0 1 8 8v1a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-1a8 8 0 0 1 8-8z" />
      <path d="M9 17v2a3 3 0 0 0 6 0v-2" />
      <circle cx="9" cy="10" r="1" fill="currentColor" />
      <circle cx="15" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}