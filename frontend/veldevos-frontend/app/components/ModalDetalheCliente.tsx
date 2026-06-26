"use client";

import { useState } from "react";
import api from "@/lib/api";

const ACCENT = "#0F2D6B";
const ACCENT_LIGHT = "#E8EDF8";

export interface Cliente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj?: string;
  contrato?: string;
  status: "Ativo" | "Inativo" | "Prospecto";
  observacoes?: string;
}

interface Props {
  cliente: Cliente;
  onClose: () => void;
  onSalvar: (cliente: Cliente) => void;
  onDeletar: (id: number) => void;
}

const statusConfig = {
  Ativo:     { bg: "#EAF3DE", color: "#3B6D11" },
  Inativo:   { bg: "#FAEEDA", color: "#854F0B" },
  Prospecto: { bg: ACCENT_LIGHT, color: ACCENT },
};

const s: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" },
  modal: { background: "#fff", borderRadius: "14px", border: "0.5px solid #d4d7dd", width: "100%", maxWidth: "540px", maxHeight: "90vh", overflowY: "auto", fontFamily: "Inter, system-ui, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "1.25rem 1.5rem 1rem" },
  titulo: { fontSize: "17px", fontWeight: 500, color: "#2c2c2c", margin: "0 0 6px" },
  tituloEdit: { fontSize: "17px", fontWeight: 500, color: "#2c2c2c", margin: "0 0 6px", background: "#f5f5f5", border: "0.5px solid #d4d7dd", borderRadius: "6px", padding: "4px 8px", outline: "none", fontFamily: "Inter, system-ui, sans-serif", width: "100%", boxSizing: "border-box" as const },
  headerBtns: { display: "flex", gap: "8px", alignItems: "center", flexShrink: 0, marginLeft: "12px" },
  btnEditar: { display: "flex", alignItems: "center", gap: "5px", background: ACCENT, color: "#fff", border: "none", borderRadius: "8px", padding: "7px 14px", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
  btnSalvar: { display: "flex", alignItems: "center", gap: "5px", background: "#3B6D11", color: "#fff", border: "none", borderRadius: "8px", padding: "7px 14px", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
  btnExcluir: { display: "flex", alignItems: "center", gap: "5px", background: "#FAEEDA", color: "#854F0B", border: "none", borderRadius: "8px", padding: "7px 14px", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
  btnFechar: { background: "none", border: "none", cursor: "pointer", color: "#999", display: "flex", alignItems: "center", padding: "4px" },
  btnCancelar: { padding: "7px 16px", fontSize: "12px", borderRadius: "8px", border: "0.5px solid #d4d7dd", background: "transparent", color: "#888", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
  divider: { borderTop: "0.5px solid #e8eaed", margin: 0 },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "0.5px solid #e8eaed" },
  infoCellBorderRight: { padding: "0.9rem 1.5rem", borderRight: "0.5px solid #e8eaed" },
  infoCell: { padding: "0.9rem 1.5rem" },
  infoLabel: { fontSize: "11px", color: "#999", margin: "0 0 3px" },
  infoValor: { fontSize: "13px", fontWeight: 500, color: "#2c2c2c", margin: 0 },
  infoInput: { fontSize: "13px", fontWeight: 500, color: "#2c2c2c", background: "#f5f5f5", border: "0.5px solid #d4d7dd", borderRadius: "6px", padding: "4px 8px", outline: "none", fontFamily: "Inter, system-ui, sans-serif", width: "100%", boxSizing: "border-box" as const },
  infoSelect: { fontSize: "13px", fontWeight: 500, color: "#2c2c2c", background: "#f5f5f5", border: "0.5px solid #d4d7dd", borderRadius: "6px", padding: "4px 8px", outline: "none", fontFamily: "Inter, system-ui, sans-serif", width: "100%", boxSizing: "border-box" as const, cursor: "pointer" },
  obsSection: { padding: "0.9rem 1.5rem", borderBottom: "0.5px solid #e8eaed" },
  obsSectionLabel: { fontSize: "11px", fontWeight: 500, color: "#999", textTransform: "uppercase" as const, letterSpacing: "0.06em", margin: "0 0 8px" },
  obsTexto: { fontSize: "13px", color: "#555", margin: 0, lineHeight: 1.6, whiteSpace: "pre-wrap" as const },
  obsTextarea: { width: "100%", padding: "8px 10px", fontSize: "13px", borderRadius: "8px", border: "0.5px solid #d4d7dd", background: "#f5f5f5", color: "#2c2c2c", outline: "none", boxSizing: "border-box" as const, fontFamily: "Inter, system-ui, sans-serif", resize: "vertical" as const, minHeight: "72px" },
  footer: { borderTop: "0.5px solid #e8eaed", padding: "0.9rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" },
};

export default function ModalDetalheCliente({ cliente, onClose, onSalvar, onDeletar }: Props) {
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState<Cliente>({ ...cliente });
  const [confirmandoDelete, setConfirmandoDelete] = useState(false);

  const sc = statusConfig[form.status] ?? statusConfig.Ativo;

  async function handleSalvar() {
    await api.put(`/api/clientes/${form.id}`, { nome: form.nome, email: form.email, telefone: form.telefone });
    onSalvar(form);
    setEditando(false);
  }

  function handleCancelar() { setForm({ ...cliente }); setEditando(false); }

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>

        <div style={s.header}>
          <div style={{ flex: 1 }}>
            {editando ? (
              <input style={s.tituloEdit} value={form.nome} onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))} />
            ) : (
              <p style={s.titulo}>{form.nome}</p>
            )}
            {editando ? (
              <select style={{ ...s.infoSelect, width: "auto", marginTop: "4px" }} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Cliente["status"] }))}>
                <option>Ativo</option><option>Inativo</option><option>Prospecto</option>
              </select>
            ) : (
              <span style={{ fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "20px", background: sc.bg, color: sc.color }}>{form.status}</span>
            )}
          </div>
          <div style={s.headerBtns}>
            {editando ? (
              <>
                <button style={s.btnCancelar} onClick={handleCancelar}>Cancelar</button>
                <button style={s.btnSalvar} onClick={handleSalvar}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Salvar
                </button>
              </>
            ) : (
              <button style={s.btnEditar} onClick={() => setEditando(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                Editar
              </button>
            )}
            <button style={s.btnFechar} onClick={onClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div style={s.divider} />

        <div style={s.infoGrid}>
          <div style={s.infoCellBorderRight}>
            <p style={s.infoLabel}>Email</p>
            {editando ? <input style={s.infoInput} type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} /> : <p style={s.infoValor}>{form.email || "—"}</p>}
          </div>
          <div style={s.infoCell}>
            <p style={s.infoLabel}>Telefone</p>
            {editando ? <input style={s.infoInput} value={form.telefone} onChange={(e) => setForm((f) => ({ ...f, telefone: e.target.value }))} /> : <p style={s.infoValor}>{form.telefone || "—"}</p>}
          </div>
          <div style={{ ...s.infoCellBorderRight, borderTop: "0.5px solid #e8eaed" }}>
            <p style={s.infoLabel}>CPF / CNPJ</p>
            {editando ? <input style={s.infoInput} value={form.cpfCnpj || ""} onChange={(e) => setForm((f) => ({ ...f, cpfCnpj: e.target.value }))} /> : <p style={s.infoValor}>{form.cpfCnpj || "—"}</p>}
          </div>
          <div style={{ ...s.infoCell, borderTop: "0.5px solid #e8eaed" }}>
            <p style={s.infoLabel}>Nº do contrato</p>
            {editando ? <input style={s.infoInput} value={form.contrato || ""} onChange={(e) => setForm((f) => ({ ...f, contrato: e.target.value }))} /> : <p style={{ ...s.infoValor, color: ACCENT }}>{form.contrato || "—"}</p>}
          </div>
        </div>

        <div style={s.obsSection}>
          <p style={s.obsSectionLabel}>Observações</p>
          {editando ? (
            <textarea style={s.obsTextarea} value={form.observacoes || ""} onChange={(e) => setForm((f) => ({ ...f, observacoes: e.target.value }))} placeholder="Informações adicionais..." />
          ) : (
            <p style={s.obsTexto}>{form.observacoes || "Nenhuma observação cadastrada."}</p>
          )}
        </div>

        <div style={s.footer}>
          {confirmandoDelete ? (
            <>
              <span style={{ fontSize: "12px", color: "#854F0B" }}>Confirmar exclusão?</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button style={s.btnCancelar} onClick={() => setConfirmandoDelete(false)}>Não</button>
                <button style={{ ...s.btnExcluir, background: "#993C1D", color: "#fff" }} onClick={() => { onDeletar(cliente.id); onClose(); }}>Sim, excluir</button>
              </div>
            </>
          ) : (
            <>
              <button style={s.btnExcluir} onClick={() => setConfirmandoDelete(true)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                Excluir
              </button>
              <button style={s.btnCancelar} onClick={onClose}>Fechar</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
