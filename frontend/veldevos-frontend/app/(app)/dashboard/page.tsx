"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Dashboard() {
  const mesAtual = new Date().toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const mesCapitalizado = mesAtual.charAt(0).toUpperCase() + mesAtual.slice(1);

  const [totalClientes, setTotalClientes] = useState(0);
  const [totalProjetos, setTotalProjetos] = useState(0);
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0);

  useEffect(() => {
    api.get("/api/clientes").then((r) => setTotalClientes(r.data.length)).catch(() => {});
    api.get("/api/projetos").then((r) => {
      const ativos = r.data.filter((p: { status: string }) => p.status === "ATIVO");
      setTotalProjetos(ativos.length);
    }).catch(() => {});
    api.get("/api/financas").then((r) => {
      const receitas = r.data.filter((f: { tipo: string }) => f.tipo === "RECEITA").reduce((acc: number, f: { valor: number }) => acc + f.valor, 0);
      const despesas = r.data.filter((f: { tipo: string }) => f.tipo === "DESPESA").reduce((acc: number, f: { valor: number }) => acc + f.valor, 0);
      setTotalReceitas(receitas);
      setTotalDespesas(despesas);
    }).catch(() => {});
  }, []);

  const fmtBRL = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const lucro = totalReceitas - totalDespesas;

  return (
    <div style={s.wrap}>

      <div style={s.pageHeader}>
        <h1 style={s.pageTitle}>Visão geral</h1>
        <p style={s.pageSub}>{mesCapitalizado}</p>
      </div>

      <div className="dashboard-cards-grid" style={s.cardsGrid}>
        <MetricCard icon={<TrendingUpIcon />} label="Receita mensal" value={fmtBRL(totalReceitas)} badge={totalReceitas > 0 ? "Com receitas" : "Nenhuma receita ainda"} badgeType={totalReceitas > 0 ? "green" : "gray"} />
        <MetricCard icon={<BriefcaseIcon />} label="Projetos ativos" value={String(totalProjetos)} badge={totalProjetos > 0 ? `${totalProjetos} ativo(s)` : "Nenhum projeto ativo"} badgeType={totalProjetos > 0 ? "green" : "gray"} />
        <MetricCard icon={<UsersIcon />} label="Clientes" value={String(totalClientes)} badge={totalClientes > 0 ? `${totalClientes} cadastrado(s)` : "Nenhum cliente cadastrado"} badgeType={totalClientes > 0 ? "green" : "gray"} />
        <MetricCard icon={<CoinIcon />} label="Lucro líquido" value={fmtBRL(lucro)} badge={lucro >= 0 ? "Positivo" : "Negativo"} badgeType={lucro >= 0 ? "green" : "gray"} />
      </div>

      <div className="dashboard-bottom-grid" style={s.bottomGrid}>
        <EmptyPanel title="Projetos em andamento" message="Cadastre projetos na aba Projetos para acompanhá-los aqui." />
        <EmptyPanel title="Movimentações recentes" message="Adicione transações em Financeiro para visualizar o fluxo." />
      </div>

    </div>
  );
}

type BadgeType = "green" | "gray";

function MetricCard({ icon, label, value, badge, badgeType }: {
  icon: React.ReactNode; label: string; value: string; badge: string; badgeType: BadgeType;
}) {
  const badgeStyle = badgeType === "green" ? s.badgeGreen : s.badgeGray;
  return (
    <div style={s.metricCard}>
      <p style={s.metricLabel}>
        <span style={{ display: "flex", color: "#0F2D6B" }}>{icon}</span>
        {label}
      </p>
      <p style={s.metricValue}>{value}</p>
      <span style={{ ...s.badge, ...badgeStyle }}>{badge}</span>
    </div>
  );
}

function EmptyPanel({ title, message }: { title: string; message: string }) {
  return (
    <div style={s.panel}>
      <p style={s.panelTitle}>{title}</p>
      <div style={s.emptyState}>
        <p style={s.emptyText}>{message}</p>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { maxWidth: "1600px", margin: "0 auto", fontFamily: "Inter, system-ui, sans-serif" },
  pageHeader: { marginBottom: "1.5rem" },
  pageTitle: { fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 500, color: "#2c2c2c", margin: "0 0 4px" },
  pageSub: { fontSize: "13px", color: "#999", margin: 0 },
  cardsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "1.5rem" },
  metricCard: { background: "#fff", border: "0.5px solid #d4d7dd", borderRadius: "12px", padding: "1.25rem" },
  metricLabel: { fontSize: "12px", color: "#999", margin: "0 0 8px", display: "flex", alignItems: "center", gap: "6px" },
  metricValue: { fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 500, color: "#2c2c2c", margin: "0 0 8px" },
  badge: { fontSize: "11px", padding: "2px 8px", borderRadius: "20px", display: "inline-block" },
  badgeGreen: { background: "#EAF3DE", color: "#3B6D11" },
  badgeGray:  { background: "#F1EFE8", color: "#5F5E5A" },
  bottomGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  panel: { background: "#fff", border: "0.5px solid #d4d7dd", borderRadius: "12px", padding: "1.25rem" },
  panelTitle: { fontSize: "14px", fontWeight: 500, color: "#2c2c2c", margin: "0 0 1rem" },
  emptyState: { padding: "2rem 0", textAlign: "center" },
  emptyText: { fontSize: "13px", color: "#aaa", lineHeight: "1.5", margin: 0 },
};

function TrendingUpIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
}
function BriefcaseIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>;
}
function UsersIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}
function CoinIcon() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2M9 9h1.5a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3H9m0 0h3m-3 0v2"/></svg>;
}
