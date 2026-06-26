"use client";

import { useState } from "react";
import api from "@/lib/api";

const ACCENT = "#0F2D6B";

interface Tarefa {
  id: number;
  nome: string;
  concluida: boolean;
}

export interface FormDataProjeto {
  nome: string;
  descricao: string;
  status: "ATIVO" | "CONCLUIDO" | "PAUSADO";
  valor: string;
  tarefas: Tarefa[];
}

interface Props {
  onClose: () => void;
  onSalvar: (dados: FormDataProjeto) => void;
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
  tarefaRow: { display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px", background: "#f9f9f9", borderRadius: "8px", border: "0.5px solid #e8eaed", marginBottom: "6px" },
  tarefaInput: { flex: 1, background: "none", border: "none", outline: "none", fontSize: "13px", color: "#2c2c2c", fontFamily: "Inter, system-ui, sans-serif" },
  removeBtn: { background: "none", border: "none", cursor: "pointer", color: "#bbb", padding: "2px", display: "flex", alignItems: "center", flexShrink: 0 },
  iaNote: { display: "flex", alignItems: "flex-start", gap: "8px", background: "#E8EDF8", border: `0.5px solid #B8C8E8`, borderRadius: "8px", padding: "10px 12px", marginTop: "10px" },
  iaNoteText: { fontSize: "12px", color: ACCENT, lineHeight: 1.5, margin: 0 },
  footer: { borderTop: "0.5px solid #e8eaed", paddingTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" },
  progressInfo: { fontSize: "12px", color: "#999" },
  footerBtns: { display: "flex", gap: "8px" },
  btnCancel: { padding: "8px 18px", fontSize: "13px", borderRadius: "8px", border: "0.5px solid #d4d7dd", background: "transparent", color: "#888", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
  btnSalvar: { padding: "8px 20px", fontSize: "13px", fontWeight: 500, borderRadius: "8px", border: "none", background: ACCENT, color: "#fff", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
};

let nextId = 1;

export default function ModalNovoProjeto({ onClose, onSalvar }: Props) {
  const [form, setForm] = useState<FormDataProjeto>({ nome: "", descricao: "", status: "ATIVO", valor: "", tarefas: [] });
  const [novaTarefa, setNovaTarefa] = useState("");

  function setField<K extends keyof FormDataProjeto>(key: K, value: FormDataProjeto[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function adicionarTarefa() {
    const nome = novaTarefa.trim();
    if (!nome) return;
    setForm((f) => ({ ...f, tarefas: [...f.tarefas, { id: nextId++, nome, concluida: false }] }));
    setNovaTarefa("");
  }

  async function handleSalvar() {
    if (!form.nome.trim()) return;
    const res = await api.post("/api/projetos", {
      nome: form.nome,
      descricao: form.descricao,
      status: form.status,
      valor: parseFloat(form.valor) || 0,
    });
    onSalvar({ ...form, ...res.data });
    onClose();
  }

  return (
    <div style={s.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <p style={s.titulo}>Novo projeto</p>
          <button style={s.closeBtn} onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div style={s.section}>
          <span style={s.sectionLabel}>Informações do projeto</span>
          <div style={{ marginBottom: "12px" }}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Nome do projeto *</label>
              <input style={s.input} placeholder="Ex: Site Institucional" value={form.nome} onChange={(e) => setField("nome", e.target.value)} />
            </div>
          </div>
          <div style={{ ...s.grid2, marginBottom: "12px" }}>
            <div style={s.fieldGroup}>
              <label style={s.label}>Valor do contrato (R$)</label>
              <input style={s.input} placeholder="0,00" value={form.valor} onChange={(e) => setField("valor", e.target.value)} />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label}>Status</label>
              <select style={s.select} value={form.status} onChange={(e) => setField("status", e.target.value as FormDataProjeto["status"])}>
                <option value="ATIVO">Ativo</option>
                <option value="CONCLUIDO">Concluído</option>
                <option value="PAUSADO">Pausado</option>
              </select>
            </div>
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Descrição</label>
            <textarea style={s.textarea} placeholder="Descrição do projeto..." value={form.descricao} onChange={(e) => setField("descricao", e.target.value)} />
          </div>
        </div>

        <hr style={s.divider} />

        <div style={s.section}>
          <span style={s.sectionLabel}>Tarefas do projeto</span>
          {form.tarefas.map((tarefa) => (
            <div key={tarefa.id} style={s.tarefaRow}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><circle cx="12" cy="12" r="10"/></svg>
              <input style={s.tarefaInput} value={tarefa.nome} onChange={(e) => setForm((f) => ({ ...f, tarefas: f.tarefas.map((t) => t.id === tarefa.id ? { ...t, nome: e.target.value } : t) }))} />
              <button style={s.removeBtn} onClick={() => setForm((f) => ({ ...f, tarefas: f.tarefas.filter((t) => t.id !== tarefa.id) }))}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          ))}
          <div style={{ display: "flex", gap: "8px" }}>
            <input style={{ ...s.input, flex: 1 }} placeholder="Nova tarefa... (Enter para adicionar)" value={novaTarefa} onChange={(e) => setNovaTarefa(e.target.value)} onKeyDown={(e) => e.key === "Enter" && adicionarTarefa()} />
            <button style={{ ...s.btnSalvar, padding: "8px 14px" }} onClick={adicionarTarefa}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
          <div style={s.iaNote}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: "1px" }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
            <p style={s.iaNoteText}>A IA vai usar essas tarefas como base para calcular o progresso automaticamente.</p>
          </div>
        </div>

        <div style={s.footer}>
          <span style={s.progressInfo}>{form.tarefas.length > 0 ? `${form.tarefas.length} tarefa(s) cadastrada(s)` : "Nenhuma tarefa ainda"}</span>
          <div style={s.footerBtns}>
            <button style={s.btnCancel} onClick={onClose}>Cancelar</button>
            <button style={s.btnSalvar} onClick={handleSalvar}>Salvar projeto</button>
          </div>
        </div>
      </div>
    </div>
  );
}
