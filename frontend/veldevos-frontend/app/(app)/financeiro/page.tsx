"use client";

import { useState, useEffect, useMemo } from "react";
import api from "@/lib/api";
import ModalNovaTransacao, { FormDataTransacao } from "@/app/components/ModalNovaTransacao";

const ACCENT = "#0F2D6B";
const ACCENT_LIGHT = "#E8EDF8";

interface Financa {
  id: number;
  descricao: string;
  tipo: "RECEITA" | "DESPESA";
  valor: number;
  data: string;
  projeto?: { id: number; nome: string };
}

type FiltroTipo = "Todos" | "RECEITA" | "DESPESA";
type FiltroPeriodo = "Este mês" | "Trimestre" | "Este ano" | "Tudo";

function fmtBRL(v: number) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }
function fmtData(d: string) {
  if (!d) return "—";
  const [y, m, dd] = d.split("-");
  return `${dd}/${m}/${y}`;
}

export default function FinanceiroPage() {
  const [financas, setFinancas] = useState<Financa[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>("Todos");
  const [filtroPeriodo, setFiltroPeriodo] = useState<FiltroPeriodo>("Este mês");
  const [modalAberto, setModalAberto] = useState(false);
  const [selecionada, setSelecionada] = useState<Financa | null>(null);

  useEffect(() => {
    api.get("/api/financas")
      .then((r) => { setFinancas(r.data); setCarregando(false); })
      .catch(() => setCarregando(false));
  }, []);

  const hoje = new Date();

  function dentroPeriodo(data: string) {
    const d = new Date(data + "T00:00:00");
    if (filtroPeriodo === "Este mês") return d.getMonth() === hoje.getMonth() && d.getFullYear() === hoje.getFullYear();
    if (filtroPeriodo === "Trimestre") {
      const diff = (hoje.getFullYear() - d.getFullYear()) * 12 + hoje.getMonth() - d.getMonth();
      return diff >= 0 && diff < 3;
    }
    if (filtroPeriodo === "Este ano") return d.getFullYear() === hoje.getFullYear();
    return true;
  }

  const filtradas = useMemo(() =>
    financas.filter((f) => {
      const tipoOk = filtroTipo === "Todos" || f.tipo === filtroTipo;
      return tipoOk && dentroPeriodo(f.data);
    }),
    [financas, filtroTipo, filtroPeriodo]
  );

  const totalReceitas = filtradas.filter((f) => f.tipo === "RECEITA").reduce((acc, f) => acc + f.valor, 0);
  const totalDespesas = filtradas.filter((f) => f.tipo === "DESPESA").reduce((acc, f) => acc + f.valor, 0);
  const saldo = totalReceitas - totalDespesas;

  function handleSalvarNova(dados: FormDataTransacao) {
    const nova: Financa = {
      id: Date.now(),
      descricao: dados.descricao,
      tipo: dados.tipo,
      valor: parseFloat(dados.valor.replace(",", ".")) || 0,
      data: dados.data,
    };
    setFinancas((prev) => [nova, ...prev]);
  }

  async function handleExcluir(id: number) {
    await api.delete(`/api/financas/${id}`);
    setFinancas((prev) => prev.filter((f) => f.id !== id));
    setSelecionada(null);
  }

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <div>
          <p style={s.pageTitle}>Financeiro</p>
          <p style={s.pageSub}>{filtradas.length} transações no período</p>
        </div>
        <button style={s.btnNew} onClick={() => setModalAberto(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nova transação
        </button>
      </div>

      <div style={s.filters}>
        {(["Todos", "RECEITA", "DESPESA"] as FiltroTipo[]).map((f) => (
          <button key={f} style={filtroTipo === f ? s.filterBtnActive : s.filterBtn} onClick={() => setFiltroTipo(f)}>
            {f === "RECEITA" ? "Receita" : f === "DESPESA" ? "Despesa" : "Todos"}
          </button>
        ))}
        <div style={s.sep} />
        {(["Este mês", "Trimestre", "Este ano", "Tudo"] as FiltroPeriodo[]).map((f) => (
          <button key={f} style={filtroPeriodo === f ? s.filterBtnActive : s.filterBtn} onClick={() => setFiltroPeriodo(f)}>{f}</button>
        ))}
      </div>

      <div style={s.cardsRow}>
        <div style={s.card}>
          <p style={s.cardLabel}>Receitas</p>
          <p style={{ ...s.cardValor, color: "#3B6D11" }}>{fmtBRL(totalReceitas)}</p>
        </div>
        <div style={s.card}>
          <p style={s.cardLabel}>Despesas</p>
          <p style={{ ...s.cardValor, color: "#854F0B" }}>{fmtBRL(totalDespesas)}</p>
        </div>
        <div style={s.card}>
          <p style={s.cardLabel}>Saldo</p>
          <p style={{ ...s.cardValor, color: saldo >= 0 ? ACCENT : "#854F0B" }}>{fmtBRL(saldo)}</p>
        </div>
      </div>

      <div style={s.tableBox}>
        <div style={s.tableHeader}>
          <span style={s.tableHeaderCell}>Data</span>
          <span style={s.tableHeaderCell}>Descrição</span>
          <span style={s.tableHeaderCell}>Tipo</span>
          <span style={{ ...s.tableHeaderCell, textAlign: "right" }}>Valor</span>
        </div>

        {carregando ? (
          <div style={s.tableEmpty}>Carregando transações...</div>
        ) : filtradas.length === 0 ? (
          <div style={s.tableEmpty}>Nenhuma transação no período selecionado.</div>
        ) : (
          [...filtradas].sort((a, b) => b.data.localeCompare(a.data)).map((f) => {
            const isReceita = f.tipo === "RECEITA";
            return (
              <div key={f.id} style={s.tableRow} onClick={() => setSelecionada(f)}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <span style={{ ...s.tableCell, color: "#999" }}>{fmtData(f.data)}</span>
                <span style={s.tableCell}>{f.descricao}</span>
                <span style={s.tableCell}>
                  <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "20px", background: isReceita ? "#EAF3DE" : "#FAEEDA", color: isReceita ? "#3B6D11" : "#854F0B", fontWeight: 500 }}>
                    {isReceita ? "Receita" : "Despesa"}
                  </span>
                </span>
                <span style={{ ...s.tableCell, textAlign: "right", fontWeight: 600, color: isReceita ? "#3B6D11" : "#854F0B" }}>
                  {isReceita ? "+" : "−"} {fmtBRL(f.valor)}
                </span>
              </div>
            );
          })
        )}
      </div>

      {modalAberto && (
        <ModalNovaTransacao
          onClose={() => setModalAberto(false)}
          onSalvar={(dados) => { handleSalvarNova(dados); setModalAberto(false); }}
        />
      )}

      {selecionada && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <p style={s.modalTitle}>{selecionada.descricao}</p>
              <button onClick={() => setSelecionada(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#999" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "#555", margin: "0 0 4px" }}>Tipo: {selecionada.tipo === "RECEITA" ? "Receita" : "Despesa"}</p>
            <p style={{ fontSize: "13px", color: "#555", margin: "0 0 4px" }}>Valor: <strong>{fmtBRL(selecionada.valor)}</strong></p>
            <p style={{ fontSize: "13px", color: "#555", margin: 0 }}>Data: {fmtData(selecionada.data)}</p>
            <div style={s.modalActions}>
              <button style={{ ...s.btnCancel, color: "#c0392b", borderColor: "#c0392b" }} onClick={() => handleExcluir(selecionada.id)}>Excluir</button>
              <button style={s.btnCancel} onClick={() => setSelecionada(null)}>Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { fontFamily: "Inter, system-ui, sans-serif" },
  topBar: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "1.5rem" },
  pageTitle: { fontSize: "26px", fontWeight: 500, color: "#2c2c2c", margin: "0 0 4px" },
  pageSub: { fontSize: "13px", color: "#999", margin: 0 },
  btnNew: { background: ACCENT, color: "#fff", border: "none", borderRadius: "8px", padding: "9px 18px", fontSize: "14px", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "Inter, system-ui, sans-serif" },
  filters: { display: "flex", gap: "8px", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" },
  filterBtn: { background: "#fff", border: "0.5px solid #d4d7dd", borderRadius: "20px", padding: "5px 16px", fontSize: "13px", color: "#888", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
  filterBtnActive: { background: ACCENT_LIGHT, border: `0.5px solid ${ACCENT}`, borderRadius: "20px", padding: "5px 16px", fontSize: "13px", color: ACCENT, fontWeight: 500, cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
  sep: { width: "1px", height: "24px", background: "#e8eaed", margin: "0 4px" },
  cardsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "1.25rem" },
  card: { background: "#fff", border: "0.5px solid #d4d7dd", borderRadius: "12px", padding: "1rem 1.25rem" },
  cardLabel: { fontSize: "11px", color: "#999", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em" },
  cardValor: { fontSize: "22px", fontWeight: 600, margin: 0 },
  tableBox: { background: "#fff", border: "0.5px solid #d4d7dd", borderRadius: "12px", overflow: "hidden" },
  tableHeader: { display: "grid", gridTemplateColumns: "90px 1fr 120px 110px", padding: "10px 1.25rem", borderBottom: "0.5px solid #e8eaed", gap: "12px" },
  tableHeaderCell: { fontSize: "11px", color: "#999", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.04em" },
  tableRow: { display: "grid", gridTemplateColumns: "90px 1fr 120px 110px", padding: "12px 1.25rem", borderBottom: "0.5px solid #f0f0f0", gap: "12px", cursor: "pointer", alignItems: "center", transition: "background 0.1s" },
  tableCell: { fontSize: "13px", color: "#2c2c2c" },
  tableEmpty: { padding: "2rem", textAlign: "center", color: "#bbb", fontSize: "13px" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
  modal: { background: "#fff", borderRadius: "14px", padding: "2rem", width: "100%", maxWidth: "440px" },
  modalTitle: { fontSize: "18px", fontWeight: 500, color: "#2c2c2c", margin: 0 },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "1.5rem" },
  btnCancel: { background: "#fff", border: "0.5px solid #d4d7dd", borderRadius: "8px", padding: "9px 18px", fontSize: "14px", cursor: "pointer", color: "#555" },
};
