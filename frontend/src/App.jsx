import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const categories = ["Todos", "Livros", "Engenharia", "Computação", "Casa"];
const seedItems = [];

function App() {
  const [items, setItems] = useState(seedItems);
  const [category, setCategory] = useState("Todos");
  const [query, setQuery] = useState("");
  const [view, setView] = useState("home");
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState("");
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("vortex-user") || "null"));
  const [form, setForm] = useState({ titulo: "", descricao: "", categoria: "Livros", preco: "", tipo_negociacao: "venda", localizacao: "", imagem_url: "" });

  useEffect(() => { fetch(`${API_URL}/anuncios/?limit=20`).then((response) => response.ok ? response.json() : Promise.reject()).then((data) => setItems(data.items || [])).catch(() => {}); }, []);
  useEffect(() => { if (!notice) return undefined; const timeout = setTimeout(() => setNotice(""), 3500); return () => clearTimeout(timeout); }, [notice]);
  const filtered = items.filter((item) => (category === "Todos" || item.categoria?.toLowerCase() === category.toLowerCase()) && (!query || `${item.titulo} ${item.descricao} ${item.categoria}`.toLowerCase().includes(query.toLowerCase())));
  const updateForm = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const openPublish = () => user ? setModal("publish") : setModal("auth");
  const submitAuth = async (event) => {
    event.preventDefault();
    const credentials = { nome: event.target.nome.value, email: event.target.email.value, senha: "vortex-demo-2026" };
    try {
      let response = await fetch(`${API_URL}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: credentials.email, senha: credentials.senha }) });
      if (!response.ok) response = await fetch(`${API_URL}/auth/register`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(credentials) });
      if (!response.ok) throw new Error();
      const data = await response.json();
      localStorage.setItem("vortex-token", data.access_token);
      const nextUser = data.usuario || { id: Date.now(), nome: credentials.nome, email: credentials.email };
      localStorage.setItem("vortex-user", JSON.stringify(nextUser)); setUser(nextUser); setModal(null); setNotice(`Bem-vindo, ${nextUser.nome.split(" ")[0]}!`);
    } catch {
      const nextUser = { id: Date.now(), nome: credentials.nome, email: credentials.email };
      localStorage.setItem("vortex-user", JSON.stringify(nextUser)); setUser(nextUser); setModal(null); setNotice(`Modo demonstração: bem-vindo, ${nextUser.nome.split(" ")[0]}!`);
    }
  };
  const submitAd = async (event) => {
    event.preventDefault();
    const payload = { ...form, preco: form.tipo_negociacao === "doacao" ? 0 : Number(form.preco) };
    try { const response = await fetch(`${API_URL}/anuncios/`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("vortex-token") || "demo"}` }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error(); setItems([(await response.json()), ...items]); } catch { setItems([{ ...payload, id: `local-${Date.now()}`, usuario_id: user.id, imagem_url: payload.imagem_url || seedItems[0].imagem_url }, ...items]); }
    setForm({ titulo: "", descricao: "", categoria: "Livros", preco: "", tipo_negociacao: "venda", localizacao: "", imagem_url: "" }); setModal(null); setNotice("Anúncio publicado com sucesso.");
  };
  const Card = ({ item }) => <article className="item-card"><div className="item-image"><img src={item.imagem_url || seedItems[0].imagem_url} alt={item.titulo} /><span className={item.tipo_negociacao === "doacao" ? "tag donation" : "tag"}>{item.tipo_negociacao === "doacao" ? "Doação" : "À venda"}</span><button className="heart" aria-label="Salvar item">♡</button></div><div className="item-content"><p className="item-category">{item.categoria} · {item.localizacao || "Campus"}</p><h3>{item.titulo}</h3><p className="item-description">{item.descricao}</p><div className="item-footer"><strong>{item.tipo_negociacao === "doacao" || Number(item.preco) === 0 ? "Grátis" : `R$ ${Number(item.preco).toFixed(2).replace(".", ",")}`}</strong><button onClick={() => setNotice("Em breve você poderá conversar com o anunciante.")}>Ver item ↗</button></div></div></article>;
  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setView("home")} aria-label="Ir para o início"><span className="brand-mark">↻</span><span>vortex<span className="brand-dot">.</span></span></button>
        <nav className="desktop-nav" aria-label="Navegação principal">
          <button onClick={() => setView("home")}>Explorar</button><button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}>Como funciona</button><button onClick={() => user ? setView("mine") : setModal("auth")}>Meus anúncios</button>
        </nav>
        <div className="top-actions"><button className="text-button" onClick={() => user ? setView("mine") : setModal("auth")}>{user ? user.nome.split(" ")[0] : "Entrar"}</button><button className="button button-small" onClick={openPublish}>+ Anunciar</button></div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy"><p className="eyebrow">ECONOMIA CIRCULAR NO CAMPUS <span>●</span></p><h1>O que você não usa mais pode <em>mudar</em> o dia de alguém.</h1><p className="hero-lead">Um marketplace feito por estudantes, para estudantes. Encontre materiais, dê novos destinos e faça a vida acadêmica circular.</p><div className="hero-actions"><button className="button" onClick={() => document.getElementById("marketplace")?.scrollIntoView({ behavior: "smooth" })}>Explorar itens ↗</button><button className="link-button" onClick={openPublish}>Quero anunciar ↗</button></div></div><div className="hero-visual"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="hero-card card-lime"><span>01</span><strong>Reutilizar</strong><small>é transformar</small></div><div className="hero-card card-white"><span>02</span><strong>Compartilhar</strong><small>é conectar</small></div><div className="hero-sticker">feito no<br /><b>campus</b></div></div>
        </section>
        <section className="stat-strip"><div><strong>+2.4k</strong><span>itens circulando</span></div><div><strong>86%</strong><span>encontram um novo lar</span></div><div><strong>12</strong><span>categorias para explorar</span></div><p>Menos desperdício.<br /><b>Mais possibilidades.</b></p></section>
        <section className="marketplace-section" id="marketplace"><div className="section-heading"><div><p className="eyebrow">A VITRINE DO CAMPUS</p><h2>Encontre o próximo<br /><em>capítulo</em> do seu item.</h2></div><div className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="O que você está procurando?" /></div></div><div className="category-row">{categories.map((item) => <button className={category === item ? "category active" : "category"} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="item-grid">{filtered.map((item) => <Card item={item} key={item.id} />)}</div>{!filtered.length && <div className="empty-state">Nenhum item encontrado. Tente outro termo.</div>}</section>
        <section className="manifesto" id="how-it-works"><div className="manifesto-number">/ 03</div><div><p className="eyebrow">POR QUE VORTEX?</p><h2>O campus fica melhor quando as coisas <em>continuam</em> circulando.</h2></div><div className="manifesto-copy"><p>De livros a jalecos, cada item parado pode ser exatamente o que outra pessoa precisa agora.</p><button className="link-button" onClick={openPublish}>Faça parte do movimento ↗</button></div></section>
      </main>
      <footer><div className="brand"><span className="brand-mark">↻</span><span>vortex<span className="brand-dot">.</span></span></div><p>Um novo ciclo começa com você.</p><span>© 2026 Vortex Marketplace</span></footer>
      <div className="mobile-nav"><button onClick={() => setView("home")}>⌂<span>Explorar</span></button><button onClick={openPublish}>＋<span>Anunciar</span></button><button onClick={() => user ? setView("mine") : setModal("auth")}>◯<span>Perfil</span></button></div>
      {view === "mine" && <div className="overlay-page"><div className="mine-header"><button className="back-button" onClick={() => setView("home")}>← Voltar</button><p className="eyebrow">ÁREA DO ESTUDANTE</p><h2>Meus anúncios</h2><button className="button button-small" onClick={openPublish}>+ Novo anúncio</button></div><div className="mine-grid">{items.filter((item) => item.usuario_id === user?.id).map((item) => <Card item={item} key={item.id} />)}{!items.some((item) => item.usuario_id === user?.id) && <div className="empty-state">Você ainda não publicou nenhum item.</div>}</div></div>}
      {modal && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setModal(null)}><div className="modal"><button className="modal-close" onClick={() => setModal(null)}>×</button>{modal === "auth" ? <><p className="eyebrow">BEM-VINDO AO VORTEX</p><h2>Entre para fazer<br /><em>circular.</em></h2><form onSubmit={submitAuth}><label>Seu nome<input name="nome" placeholder="Como podemos te chamar?" required /></label><label>E-mail acadêmico<input name="email" type="email" placeholder="voce@universidade.edu" required /></label><button className="button" type="submit">Continuar ↗</button></form><small>Simulação local para a demonstração.</small></> : <><p className="eyebrow">NOVO ANÚNCIO</p><h2>Dê um novo <em>destino</em><br /> ao seu item.</h2><form onSubmit={submitAd} className="publish-form"><label>Título<input name="titulo" value={form.titulo} onChange={updateForm} placeholder="Ex.: Livro de Cálculo I" required /></label><label>Descrição<textarea name="descricao" value={form.descricao} onChange={updateForm} placeholder="Conte um pouco sobre o estado do item" required /></label><div className="form-row"><label>Categoria<select name="categoria" value={form.categoria} onChange={updateForm}>{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select></label><label>Negociação<select name="tipo_negociacao" value={form.tipo_negociacao} onChange={updateForm}><option value="venda">À venda</option><option value="doacao">Doação</option></select></label></div><div className="form-row"><label>Preço (R$)<input name="preco" value={form.preco} onChange={updateForm} type="number" min="0" disabled={form.tipo_negociacao === "doacao"} placeholder="0,00" /></label><label>Localização<input name="localizacao" value={form.localizacao} onChange={updateForm} placeholder="Ex.: Bloco B" required /></label></div><label>URL da imagem<input name="imagem_url" value={form.imagem_url} onChange={updateForm} type="url" placeholder="https://... (opcional)" /></label><button className="button" type="submit">Publicar anúncio ↗</button></form></>}</div></div>}
      {notice && <div className="toast">{notice}<button onClick={() => setNotice("")}>×</button></div>}
    </div>
  );
}

export default App;