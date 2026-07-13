"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import ModalNovoProjeto, { FormDataProjeto, ProjetoExistente } from "@/app/components/ModalNovoProjeto";

const ACCENT = "#0F2D6B";
const ACCENT_LIGHT = "#E8EDF8";

interface Projeto {
  id: number;
  nome: string;
  descricao: string;
  status: string;
  valor: number;
  cliente?: { id: number; nome: string };
}

type Filtro = "Todos" | "ATIVO" | "CONCLUIDO" | "PAUSADO";
const filtros: { label: string; value: Filtro }[] = [
  { label: "Todos", value: "Todos" },
  { label: "Ativo", value: "ATIVO" },
  { label: "Concluído", value: "CONCLUIDO" },
  { label: "Pausado", value: "PAUSADO" },
];

const statusConfig: Record<string, { bg: string; color: string; label: string }> = {
  ATIVO:     { bg: ACCENT_LIGHT, color: ACCENT, label: "Ativo" },
  CONCLUIDO: { bg: "#EAF3DE", color: "#3B6D11", label: "Concluído" },
  PAUSADO:   { bg: "#FAEEDA", color: "#854F0B", label: "Pausado" },
};

function fmtBRL(v: number) { return v?.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) ?? "—"; }

// 👇 Converte o Projeto (usado na listagem) para o formato que o ModalNovoProjeto espera
function paraProjetoExistente(p: Projeto): ProjetoExistente {
  return {
    id: p.id,
    nome: p.nome,
    descricao: p.descricao,
    status: p.status as FormDataProjeto["status"],
    valor: String(p.valor),
    tarefas: [], // a listagem não carrega as tarefas; o modal parte vazio na edição
  };
}

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [filtroAtivo, setFiltroAtivo] = useState<Filtro>("Todos");
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState<Projeto | null>(null);
  const [projetoEmEdicao, setProjetoEmEdicao] = useState<Projeto | null>(null); // 👈 novo estado

  useEffect(() => {
    api.get("/api/projetos")
      .then((r) => { setProjetos(r.data); setCarregando(false); })
      .catch(() => setCarregando(false));
  }, []);

  const projetosFiltrados = filtroAtivo === "Todos" ? projetos : projetos.filter((p) => p.status === filtroAtivo);

  function handleSalvarNovo(dados: FormDataProjeto) {
    const novoProjeto: Projeto = {
      id: Date.now(),
      nome: dados.nome,
      descricao: dados.descricao,
      status: dados.status,
      valor: parseFloat(dados.valor) || 0,
    };
    setProjetos((prev) => [novoProjeto, ...prev]);
  }

  // 👇 novo: atualiza o projeto editado na lista local
  function handleEditar(id: number, dados: FormDataProjeto) {
    setProjetos((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, nome: dados.nome, descricao: dados.descricao, status: dados.status, valor: parseFloat(dados.valor) || 0 }
          : p
      )
    );
  }

  async function handleDeletar(id: number) {
    await api.delete(`/api/projetos/${id}`);
    setProjetos((prev) => prev.filter((p) => p.id !== id));
    setProjetoSelecionado(null);
  }

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <div>
          <p style={s.pageTitle}>Projetos</p>
          <p style={s.pageSub}>{projetos.length} projetos cadastrados</p>
        </div>
        <button style={s.btnNew} onClick={() => setModalAberto(true)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Novo projeto
        </button>
      </div>

      <div style={s.filters}>
        {filtros.map((f) => (
          <button key={f.value} style={filtroAtivo === f.value ? s.filterBtnActive : s.filterBtn} onClick={() => setFiltroAtivo(f.value)}>
            {f.label}
          </button>
        ))}
      </div>

      <div className="cards-grid-3" style={s.grid}>
        {carregando ? (
          <div style={{ gridColumn: "1/-1", ...s.emptyState }}><p style={s.emptyText}>Carregando projetos...</p></div>
        ) : projetosFiltrados.length === 0 ? (
          <div style={{ gridColumn: "1/-1", ...s.emptyState }}>
            <p style={s.emptyText}>Nenhum projeto encontrado.</p>
            <p style={s.emptySubText}>Clique em &quot;+ Novo projeto&quot; para começar.</p>
          </div>
        ) : projetosFiltrados.map((projeto) => {
          const sc = statusConfig[projeto.status] ?? statusConfig.ATIVO;
          return (
            <div key={projeto.id} style={s.card} onClick={() => setProjetoSelecionado(projeto)}>
              <div style={s.cardTop}>
                <div>
                  <p style={s.cardName}>{projeto.nome}</p>
                  <p style={s.cardClient}>{projeto.cliente?.nome || "Sem cliente"}</p>
                </div>
                <span style={{ ...s.badge, background: sc.bg, color: sc.color }}>{sc.label}</span>
              </div>
              <hr style={s.divider} />
              <div style={s.row}>
                <span style={s.lbl}>Valor</span>
                <span style={{ ...s.val, color: ACCENT }}>{fmtBRL(projeto.valor)}</span>
              </div>
              {projeto.descricao && (
                <p style={{ fontSize: "12px", color: "#aaa", margin: "8px 0 0", lineHeight: 1.4 }}>
                  {projeto.descricao.slice(0, 80)}{projeto.descricao.length > 80 ? "..." : ""}
                </p>
              )}
            </div>
          );
        })}

        <div style={s.newCard} onClick={() => setModalAberto(true)}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span style={s.newCardLabel}>Novo projeto</span>
        </div>
      </div>

      {/* Modal de criação */}
      {modalAberto && (
        <ModalNovoProjeto
          onClose={() => setModalAberto(false)}
          onSalvar={(dados) => { handleSalvarNovo(dados); setModalAberto(false); }}
        />
      )}

      {/* Modal de edição — reaproveita o mesmo componente, em modo edit */}
      {projetoEmEdicao && (
        <ModalNovoProjeto
          projetoExistente={paraProjetoExistente(projetoEmEdicao)}
          onClose={() => setProjetoEmEdicao(null)}
          onSalvar={(dados) => { handleEditar(projetoEmEdicao.id, dados); setProjetoEmEdicao(null); }}
        />
      )}

      {/* Modal detalhe projeto (inline) */}
      {projetoSelecionado && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <p style={s.modalTitle}>{projetoSelecionado.nome}</p>
                <span style={{ fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "20px", background: statusConfig[projetoSelecionado.status]?.bg, color: statusConfig[projetoSelecionado.status]?.color }}>
                  {statusConfig[projetoSelecionado.status]?.label}
                </span>
              </div>
              <button onClick={() => setProjetoSelecionado(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#999" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <p style={{ fontSize: "13px", color: "#999", margin: "0 0 8px" }}>{projetoSelecionado.descricao || "Sem descrição"}</p>
            <p style={{ fontSize: "13px", color: "#555", margin: "0 0 4px" }}>Valor: <strong style={{ color: ACCENT }}>{fmtBRL(projetoSelecionado.valor)}</strong></p>
            <div style={s.modalActions}>
              <button style={{ ...s.btnCancel, color: ACCENT, borderColor: ACCENT }} onClick={() => { setProjetoEmEdicao(projetoSelecionado); setProjetoSelecionado(null); }}>Editar</button>
              <button style={{ ...s.btnCancel, color: "#c0392b", borderColor: "#c0392b" }} onClick={() => handleDeletar(projetoSelecionado.id)}>Excluir</button>
              <button style={s.btnCancel} onClick={() => setProjetoSelecionado(null)}>Fechar</button>
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
  filters: { display: "flex", gap: "8px", marginBottom: "1.25rem", flexWrap: "wrap" },
  filterBtn: { background: "#fff", border: "0.5px solid #d4d7dd", borderRadius: "20px", padding: "5px 16px", fontSize: "13px", color: "#888", cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
  filterBtnActive: { background: ACCENT_LIGHT, border: `0.5px solid ${ACCENT}`, borderRadius: "20px", padding: "5px 16px", fontSize: "13px", color: ACCENT, fontWeight: 500, cursor: "pointer", fontFamily: "Inter, system-ui, sans-serif" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" },
  card: { background: "#fff", border: "0.5px solid #d4d7dd", borderRadius: "12px", padding: "1rem 1.1rem", cursor: "pointer" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  cardName: { fontSize: "14px", fontWeight: 500, color: "#2c2c2c", margin: 0 },
  cardClient: { fontSize: "12px", color: "#999", margin: "2px 0 0" },
  badge: { display: "inline-block", fontSize: "11px", fontWeight: 500, padding: "3px 10px", borderRadius: "20px", whiteSpace: "nowrap" },
  divider: { border: "none", borderTop: "0.5px solid #e8eaed", margin: "10px 0" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  lbl: { fontSize: "11px", color: "#999" },
  val: { fontSize: "12px", color: "#2c2c2c", fontWeight: 500 },
  newCard: { background: "#fff", border: "1.5px dashed #d4d7dd", borderRadius: "12px", padding: "1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", minHeight: "200px", cursor: "pointer" },
  newCardLabel: { fontSize: "13px", color: "#bbb" },
  emptyState: { padding: "3rem 1rem", textAlign: "center" },
  emptyText: { fontSize: "14px", color: "#999", margin: "0 0 4px" },
  emptySubText: { fontSize: "13px", color: "#bbb", margin: 0 },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 },
  modal: { background: "#fff", borderRadius: "14px", padding: "2rem", width: "100%", maxWidth: "440px" },
  modalTitle: { fontSize: "18px", fontWeight: 500, color: "#2c2c2c", margin: "0 0 6px" },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "1.5rem" },
  btnCancel: { background: "#fff", border: "0.5px solid #d4d7dd", borderRadius: "8px", padding: "9px 18px", fontSize: "14px", cursor: "pointer", color: "#555" },
};