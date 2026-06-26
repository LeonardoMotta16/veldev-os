"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import ModalNovoCliente, { FormDataCliente } from "@/app/components/ModalNovoCliente";
import ModalDetalheCliente, { Cliente } from "@/app/components/ModalDetalheCliente";

const ACCENT = "#0F2D6B";
const ACCENT_LIGHT = "#E8EDF8";

function getIniciais(nome: string): string {
  const partes = nome.trim().split(" ").filter(Boolean);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  useEffect(() => {
    api.get("/api/clientes")
      .then((r) => { setClientes(r.data); setCarregando(false); })
      .catch(() => setCarregando(false));
  }, []);

  function handleSalvarNovo(dados: FormDataCliente) {
    const novoCliente: Cliente = {
      id: Date.now(),
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      cpfCnpj: dados.cpfCnpj,
      contrato: dados.contrato,
      status: dados.status,
      observacoes: dados.observacoes,
    };
    setClientes((prev) => [novoCliente, ...prev]);
  }

  function handleSalvarEdicao(clienteAtualizado: Cliente) {
    setClientes((prev) => prev.map((c) => c.id === clienteAtualizado.id ? clienteAtualizado : c));
  }

  function handleDeletar(id: number) {
    api.delete(`/api/clientes/${id}`);
    setClientes((prev) => prev.filter((c) => c.id !== id));
    setClienteSelecionado(null);
  }

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <div>
          <p style={s.pageTitle}>Clientes</p>
          <p style={s.pageSub}>{clientes.length} clientes cadastrados</p>
        </div>
        <button style={s.btnNew} onClick={() => setModalNovoAberto(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Novo cliente
        </button>
      </div>

      <div className="cards-grid-3" style={s.grid}>
        {carregando ? (
          <div style={{ gridColumn: "1/-1", ...s.emptyState }}>
            <p style={s.emptyText}>Carregando clientes...</p>
          </div>
        ) : clientes.length === 0 ? (
          <div style={{ gridColumn: "1/-1", ...s.emptyState }}>
            <p style={s.emptyText}>Nenhum cliente cadastrado ainda.</p>
            <p style={s.emptySubText}>Clique em "+ Novo cliente" para começar.</p>
          </div>
        ) : clientes.map((cliente) => (
          <div key={cliente.id} style={s.card} onClick={() => setClienteSelecionado(cliente)}>
            <div style={s.cardTop}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <div style={s.avatar}>{getIniciais(cliente.nome)}</div>
                <div>
                  <p style={s.cardName}>{cliente.nome}</p>
                  <p style={s.cardEmail}>{cliente.email || "—"}</p>
                </div>
              </div>
              <span style={{
                fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "20px",
                background: cliente.status === "Ativo" ? "#EAF3DE" : cliente.status === "Inativo" ? "#FAEEDA" : ACCENT_LIGHT,
                color: cliente.status === "Ativo" ? "#3B6D11" : cliente.status === "Inativo" ? "#854F0B" : ACCENT,
              }}>{cliente.status}</span>
            </div>
            <hr style={s.divider} />
            <div style={s.row}>
              <span style={s.lbl}>Telefone</span>
              <span style={s.val}>{cliente.telefone || "—"}</span>
            </div>
          </div>
        ))}

        <div style={s.newCard} onClick={() => setModalNovoAberto(true)}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span style={s.newCardLabel}>Novo cliente</span>
        </div>
      </div>

      {modalNovoAberto && (
        <ModalNovoCliente
          onClose={() => setModalNovoAberto(false)}
          onSalvar={(dados) => { handleSalvarNovo(dados); setModalNovoAberto(false); }}
        />
      )}

      {clienteSelecionado && (
        <ModalDetalheCliente
          cliente={clienteSelecionado}
          onClose={() => setClienteSelecionado(null)}
          onSalvar={handleSalvarEdicao}
          onDeletar={handleDeletar}
        />
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
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" },
  card: { background: "#fff", border: "0.5px solid #d4d7dd", borderRadius: "12px", padding: "1rem 1.1rem", cursor: "pointer" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  avatar: { width: "36px", height: "36px", borderRadius: "50%", background: ACCENT_LIGHT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, color: ACCENT, flexShrink: 0 },
  cardName: { fontSize: "14px", fontWeight: 500, color: "#2c2c2c", margin: "0 0 2px" },
  cardEmail: { fontSize: "12px", color: "#999", margin: 0 },
  divider: { border: "none", borderTop: "0.5px solid #e8eaed", margin: "10px 0" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  lbl: { fontSize: "11px", color: "#999" },
  val: { fontSize: "12px", color: "#2c2c2c", fontWeight: 500 },
  newCard: { background: "#fff", border: "1.5px dashed #d4d7dd", borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", minHeight: "160px", cursor: "pointer" },
  newCardLabel: { fontSize: "13px", color: "#bbb" },
  emptyState: { padding: "3rem 1rem", textAlign: "center" },
  emptyText: { fontSize: "14px", color: "#999", margin: "0 0 4px" },
  emptySubText: { fontSize: "13px", color: "#bbb", margin: 0 },
};
