import { type ChangeEvent, type FormEvent, useState } from "react";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { MobileNav } from "./components/layout/MobileNav";
import { HeroSection } from "./components/home/HeroSection";
import { StatStrip } from "./components/home/StatStrip";
import { Manifesto } from "./components/home/Manifesto";
import { MarketplaceSection } from "./components/marketplace/MarketplaceSection";
import { AuthModal } from "./components/modals/AuthModal";
import { PublishModal } from "./components/modals/PublishModal";
import { ItemDetailModal } from "./components/modals/ItemDetailModal";
import { HelpModal } from "./components/modals/HelpModal";
import { StudentArea } from "./components/student/StudentArea";
import { Toast } from "./components/ui/Toast";
import { useAuth } from "./hooks/useAuth";
import { useFavorites } from "./hooks/useFavorites";
import { useItems } from "./hooks/useItems";
import { useNotice } from "./hooks/useNotice";
import { CATEGORIAS } from "./types";
import type { AdFormState, AuthMode, Item, ModalType, ProfileFormState, ViewType } from "./types";
import "./App.css";

const emptyForm: AdFormState = {
  titulo: "",
  descricao: "",
  categorias: [],
  preco: "",
  tipo_negociacao: "venda",
  condicao: "novo",
  localizacao: "",
  imagem_url: "",
  contato: "",
};

function itemToForm(item: Item): AdFormState {
  return {
    titulo: item.titulo,
    descricao: item.descricao,
    categorias: item.categorias?.length ? item.categorias : [item.categoria],
    preco: String(item.preco),
    tipo_negociacao: item.tipo_negociacao,
    condicao: item.condicao || "novo",
    localizacao: item.localizacao || "",
    imagem_url: item.imagem_url || "",
    contato: item.contato || "",
  };
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function App() {
  const { user, loginUser, registerUser, logout, updateUser } = useAuth();
  const {
    filtered,
    total,
    loading,
    categorias,
    toggleCategoria,
    query,
    setQuery,
    tipoNegociacao,
    setTipoNegociacao,
    condicaoFiltro,
    setCondicaoFiltro,
    localizacao,
    setLocalizacao,
    precoMin,
    setPrecoMin,
    precoMax,
    setPrecoMax,
    ordenacao,
    setOrdenacao,
    sellerName,
    viewSellerItems,
    clearSellerFilter,
    clearFilters,
    publish,
    edit,
    remove,
  } = useItems();
  const { isFavorite, toggleFavorite } = useFavorites(user);
  const { notice, setNotice } = useNotice();

  const [view, setView] = useState<ViewType>("home");
  const [modal, setModal] = useState<ModalType>(null);
  const [form, setForm] = useState<AdFormState>(emptyForm);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [meusRefreshKey, setMeusRefreshKey] = useState(0);

  const goHome = () => setView("home");
  const openProfile = () => (user ? setView("mine") : setModal("auth"));
  const openHelp = () => setModal("help");
  const handleLogout = () => {
    logout();
    setView("home");
    setNotice("Você saiu da sua conta.");
  };
  const openPublish = () => {
    if (!user) {
      setModal("auth");
      return;
    }
    setEditingItem(null);
    setForm(emptyForm);
    setModal("publish");
  };
  const scrollToId = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const updateForm = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [event.target.name]: event.target.value });

  function toggleCategoriaForm(categoria: string) {
    setForm((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(categoria)
        ? prev.categorias.filter((item) => item !== categoria)
        : [...prev.categorias, categoria],
    }));
  }

  async function submitAuth(mode: AuthMode, nome: string, email: string, senha: string) {
    try {
      const nextUser = mode === "login" ? await loginUser(email, senha) : await registerUser(nome, email, senha);
      setModal(null);
      setNotice(`Bem-vindo, ${nextUser.nome.split(" ")[0]}!`);
    } catch (error) {
      setNotice(errorMessage(error, mode === "login" ? "Não foi possível entrar." : "Não foi possível criar sua conta."));
    }
  }

  async function submitAd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    if (!form.categorias.length) {
      setNotice("Selecione ao menos uma categoria.");
      return;
    }
    try {
      if (editingItem) {
        await edit(editingItem.id, form);
        setNotice("Anúncio atualizado com sucesso.");
      } else {
        await publish(form, user);
        setNotice("Anúncio publicado com sucesso.");
      }
      setForm(emptyForm);
      setEditingItem(null);
      setModal(null);
      setMeusRefreshKey((prev) => prev + 1);
    } catch (error) {
      setNotice(errorMessage(error, "Não foi possível salvar o anúncio."));
    }
  }

  function handleViewItem(item: Item) {
    setSelectedItem(item);
  }

  function handleEditItem(item: Item) {
    setSelectedItem(null);
    setEditingItem(item);
    setForm(itemToForm(item));
    setModal("publish");
  }

  async function handleDeleteItem(item: Item) {
    const confirmed = window.confirm(`Remover "${item.titulo}"? Essa ação não pode ser desfeita.`);
    if (!confirmed) return;
    try {
      await remove(item.id);
      setSelectedItem(null);
      setNotice("Anúncio removido com sucesso.");
      setMeusRefreshKey((prev) => prev + 1);
    } catch (error) {
      setNotice(errorMessage(error, "Não foi possível remover o anúncio."));
    }
  }

  async function handleToggleFavorite(item: Item) {
    if (!user) {
      setModal("auth");
      return;
    }
    try {
      await toggleFavorite(item);
    } catch {
      setNotice("Não foi possível atualizar seus favoritos.");
    }
  }

  function handleViewSellerItems(item: Item) {
    setSelectedItem(null);
    setView("home");
    viewSellerItems(item);
    setTimeout(() => scrollToId("marketplace"), 50);
  }

  async function handleUpdateProfile(dados: Partial<ProfileFormState>) {
    await updateUser(dados);
  }

  return (
    <div className="app-shell">
      <Header
        user={user}
        onNavigateHome={goHome}
        onScrollToHowItWorks={() => scrollToId("how-it-works")}
        onOpenProfile={openProfile}
        onOpenPublish={openPublish}
      />

      <main>
        <HeroSection onExplore={() => scrollToId("marketplace")} onPublish={openPublish} />
        <StatStrip totalItens={total} totalCategorias={CATEGORIAS.length} />
        <MarketplaceSection
          categorias={categorias}
          onToggleCategoria={toggleCategoria}
          query={query}
          onQueryChange={setQuery}
          tipoNegociacao={tipoNegociacao}
          onTipoNegociacaoChange={setTipoNegociacao}
          condicao={condicaoFiltro}
          onCondicaoChange={setCondicaoFiltro}
          localizacao={localizacao}
          onLocalizacaoChange={setLocalizacao}
          precoMin={precoMin}
          onPrecoMinChange={setPrecoMin}
          precoMax={precoMax}
          onPrecoMaxChange={setPrecoMax}
          ordenacao={ordenacao}
          onOrdenacaoChange={setOrdenacao}
          sellerName={sellerName}
          onClearSellerFilter={clearSellerFilter}
          onClearFilters={clearFilters}
          items={filtered}
          loading={loading}
          onViewItem={handleViewItem}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />
        <Manifesto onPublish={openPublish} />
      </main>

      <Footer onOpenHelp={openHelp} />
      <MobileNav onNavigateHome={goHome} onOpenPublish={openPublish} onOpenProfile={openProfile} />

      {view === "mine" && (
        <StudentArea
          user={user}
          onBack={goHome}
          onOpenPublish={openPublish}
          onViewItem={handleViewItem}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          refreshKey={meusRefreshKey}
          onUpdateProfile={handleUpdateProfile}
          onLogout={handleLogout}
        />
      )}

      {modal === "auth" && <AuthModal onClose={() => setModal(null)} onSubmit={submitAuth} />}
      {modal === "help" && <HelpModal onClose={() => setModal(null)} />}
      {modal === "publish" && (
        <PublishModal
          form={form}
          isEditing={Boolean(editingItem)}
          onChange={updateForm}
          onToggleCategoria={toggleCategoriaForm}
          onClose={() => {
            setModal(null);
            setEditingItem(null);
          }}
          onSubmit={submitAd}
        />
      )}

      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          isOwner={user?.id === selectedItem.usuario_id}
          isFavorite={isFavorite(selectedItem)}
          onClose={() => setSelectedItem(null)}
          onToggleFavorite={handleToggleFavorite}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
          onViewSellerItems={handleViewSellerItems}
        />
      )}

      <Toast message={notice} onDismiss={() => setNotice("")} />
    </div>
  );
}

export default App;
