"use client";

import { useState } from "react";
import api from "@/lib/api";


export interface FormDataTransacao {
  tipo: "RECEITA" | "DESPESA";
  descricao: string;
  valor: string;
  data: string;
  categoria: string;
  observacoes: string;
}

interface Props {
  onClose: () => void;
  onSalvar: (dados: FormDataTransacao) => void;
}

const categoriasReceita = ["Projeto Web", "Manutenção", "Consultoria", "Outros"];
const categoriasDespesa = ["Ferramentas", "Marketing", "Impostos", "Outros"];

const s: Record<string, React.CSSProperties> = {
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" },
  modal: { background: "#fff", borderRadius: "14px", border: "0.5px solid #d4d7dd", width: "100%", maxWidth: "560px", maxHeight: "90vh", overflowY: "auto", padding: "1.5rem 1.75rem", fontFamily: "Inter, system-ui, sans-serif" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" },
  titulo: { fontSize: "17px", fontWeight: 500, color: "#2c2c2c", margin: 0 },
  closeBtn: { background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#999", display: "flex", alignItems: "center" },
  tipoRow: { display: "flex", gap: "8px", marginBottom: "1.25rem" },
  tipoBtn: { flex: 1, padding: "9px", fontSize: "13px", fontWeight: 500, borderRadius: "8px", border: "0.5px solid #d4d7dd", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif", transition: "all 0.15s" },
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
};

export default function ModalNovaTransacao({ onClose, onSalvar }: Props) {
  const hoje = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState<FormDataTransacao>({ tipo: "RECEITA", descricao: "", valor: "", data: hoje, categoria: "Projeto Web", observacoes: "" });

  function setField<K extends keyof FormDataTransacao>(key: K, value: FormDataTransacao[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleTipo(tipo: "RECEITA" | "DESPESA") {
    setForm((f) => ({ ...f, tipo, categoria: tipo === "RECEITA" ? "Projeto Web" : "Ferramentas" }));
  }

  async function handleSalvar() {
    if (!form.descricao.trim() || !form.valor.trim()) return;
    const res = await api.post("/api/financas", {
      descricao: form.descricao,
      tipo: form.tipo,
      valor: parseFloat(form.valor.replace(",", ".")),
      data: form.data,
    });
    onSalvar({ ...form, ...res.data });
    onClose();
  }

  const categorias = form.tipo === "RECEITA" ? categoriasReceita : categoriasDespesa;
  const corTipo = form.tipo === "RECEITA" ? "#3B6D11" : "#854F0B";

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <p style={s.titulo}>Nova transação</p>
          <button style={s.closeBtn} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={s.tipoRow}>
          {(["RECEITA", "DESPESA"] as const).map((t) => (
            <button key={t} onClick={() => handleTipo(t)} style={{
              ...s.tipoBtn,
              background: form.tipo === t ? (t === "RECEITA" ? "#EAF3DE" : "#FAEEDA") : "#f5f5f5",
              border: form.tipo === t ? `1.5px solid ${t === "RECEITA" ? "#3B6D11" : "#854F0B"}` : "0.5px solid #d4d7dd",
              color: form.tipo === t ? (t === "RECEITA" ? "#3B6D11" : "#854F0B") : "#888",
            }}>
              {t === "RECEITA" ? "↑ Receita" : "↓ Despesa"}
            </button>
          ))}
        </div>

        <div style={s.section}>
          <span style={s.sectionLabel}>Dados da transação</span>
          <div style={{ marginBottom: "12px" }}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Descrição *</label>
              <input style={s.input} placeholder="Ex: Pagamento site cliente" value={form.descricao} onChange={(e) => setField("descricao", e.target.value)} />
            </div>
          </div>
          <div style={{ ...s.grid2, marginBottom: "12px" }}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Valor (R$) *</label>
              <input style={s.input} placeholder="0,00" value={form.valor} onChange={(e) => setField("valor", e.target.value)} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Data</label>
              <input style={s.input} type="date" value={form.data} onChange={(e) => setField("data", e.target.value)} />
            </div>
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Categoria</label>
            <select style={s.select} value={form.categoria} onChange={(e) => setField("categoria", e.target.value)}>
              {categorias.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <hr style={s.divider} />

        <div style={s.section}>
          <span style={s.sectionLabel}>Observações</span>
          <textarea style={s.textarea} placeholder="Notas adicionais..." value={form.observacoes} onChange={(e) => setField("observacoes", e.target.value)} />
        </div>

        <div style={s.footer}>
          <button style={s.btnCancel} onClick={onClose}>Cancelar</button>
          <button onClick={handleSalvar} style={{ padding: "8px 20px", fontSize: "13px", fontWeight: 500, borderRadius: "8px", border: "none", background: corTipo, color: "#fff", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" }}>
            Salvar transação
          </button>
        </div>
      </div>
    </div>
  );
}
