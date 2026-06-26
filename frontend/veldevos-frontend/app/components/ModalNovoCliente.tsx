"use client";

import { useState } from "react";
import api from "@/lib/api";

const ACCENT = "#0F2D6B";

export interface FormDataCliente {
  nome: string;
  email: string;
  telefone: string;
  cpfCnpj: string;
  contrato: string;
  status: "Ativo" | "Inativo" | "Prospecto";
  observacoes: string;
}

interface Props {
  onClose: () => void;
  onSalvar: (dados: FormDataCliente) => void;
}

const s: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" },
  modal: { background: "#fff", borderRadius: "14px", border: "0.5px solid #d4d7dd", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto", padding: "1.5rem 1.75rem", fontFamily: "Inter, system-ui, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" },
  titulo: { fontSize: "17px", fontWeight: 500, color: "#2c2c2c", margin: 0 },
  closeBtn: { background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#999", display: "flex", alignItems: "center" },
  section: { marginBottom: "1rem" },
  sectionLabel: { fontSize: "11px", fontWeight: 500, color: "#999", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginBottom: "10px", display: "block" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  fieldGroup: { display: "flex", flexDirection: "column" as const, gap: "5px" },
  label: { fontSize: "12px", fontWeight: 500, color: "#555" },
  input: { width: "100%", padding: "8px 10px", fontSize: "13px", borderRadius: "8px", border: "0.5px solid #d4d7dd", background: "#f5f5f5", color: "#2c2c2c", outline: "none", boxSizing: "border-box" as const, fontFamily: "Inter, system-ui, sans-serif" },
  select: { width: "100%", padding: "8px 10px", fontSize: "13px", borderRadius: "8px", border: "0.5px solid #d4d7dd", background: "#f5f5f5", color: "#2c2c2c", outline: "none", boxSizing: "border-box" as const, fontFamily: "Inter, system-ui, sans-serif", cursor: "pointer" },
  textarea: { width: "100%", padding: "8px 10px", fontSize: "13px", borderRadius: "8px", border: "0.5px solid #d4d7dd", background: "#f5f5f5", color: "#2c2c2c", outline: "none", boxSizing: "border-box" as const, fontFamily: "Inter, system-ui, sans-serif", resize: "vertical" as const, minHeight: "72px" },
  divider: { border: "none", borderTop: "0.5px solid #e8eaed", margin: "1rem 0" },
  footer: { borderTop: "0.5px solid #e8eaed", paddingTop: "1rem", display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "0.5rem" },
  btnCancel: { padding: "8px 18px", fontSize: "13px", borderRadius: "8px", border: "0.5px solid #d4d7dd", background: "transparent", color: "#888", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
  btnSalvar: { padding: "8px 20px", fontSize: "13px", fontWeight: 500, borderRadius: "8px", border: "none", background: ACCENT, color: "#fff", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
};

export default function ModalNovoCliente({ onClose, onSalvar }: Props) {
  const [form, setForm] = useState<FormDataCliente>({ nome: "", email: "", telefone: "", cpfCnpj: "", contrato: "", status: "Ativo", observacoes: "" });

  function setField<K extends keyof FormDataCliente>(key: K, value: FormDataCliente[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSalvar() {
    if (!form.nome.trim()) return;
    const res = await api.post("/api/clientes", {
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
    });
    onSalvar({ ...form, ...res.data });
    onClose();
  }

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <p style={s.titulo}>Novo cliente</p>
          <button style={s.closeBtn} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={s.section}>
          <span style={s.sectionLabel}>Dados do cliente</span>
          <div style={{ marginBottom: "12px" }}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Nome *</label>
              <input style={s.input} placeholder="Ex: Real Refrigeração" value={form.nome} onChange={(e) => setField("nome", e.target.value)} />
            </div>
          </div>
          <div style={{ ...s.grid2, marginBottom: "12px" }}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Email</label>
              <input style={s.input} type="email" placeholder="contato@empresa.com" value={form.email} onChange={(e) => setField("email", e.target.value)} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Telefone</label>
              <input style={s.input} placeholder="(11) 99999-9999" value={form.telefone} onChange={(e) => setField("telefone", e.target.value)} />
            </div>
          </div>
          <div style={s.grid2}>
            <div style={s.fieldGroup}>
              <label style={s.label}>CPF / CNPJ</label>
              <input style={s.input} placeholder="00.000.000/0001-00" value={form.cpfCnpj} onChange={(e) => setField("cpfCnpj", e.target.value)} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Nº do contrato</label>
              <input style={s.input} placeholder="Ex: CTR-2026-001" value={form.contrato} onChange={(e) => setField("contrato", e.target.value)} />
            </div>
          </div>
        </div>

        <hr style={s.divider} />

        <div style={s.section}>
          <span style={s.sectionLabel}>Status e observações</span>
          <div style={{ marginBottom: "12px" }}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Status</label>
              <select style={s.select} value={form.status} onChange={(e) => setField("status", e.target.value as FormDataCliente["status"])}>
                <option>Ativo</option>
                <option>Inativo</option>
                <option>Prospecto</option>
              </select>
            </div>
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Observações</label>
            <textarea style={s.textarea} placeholder="Informações adicionais..." value={form.observacoes} onChange={(e) => setField("observacoes", e.target.value)} />
          </div>
        </div>

        <div style={s.footer}>
          <button style={s.btnCancel} onClick={onClose}>Cancelar</button>
          <button style={s.btnSalvar} onClick={handleSalvar}>Salvar cliente</button>
        </div>
      </div>
    </div>
  );
}
