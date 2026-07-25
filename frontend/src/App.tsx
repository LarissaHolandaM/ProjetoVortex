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
import { StudentArea } from "./components/student/StudentArea";
import { Toast } from "./components/ui/Toast";
import { useAuth } from "./hooks/useAuth";
import { useFavorites } from "./hooks/useFavorites";
import { useItems } from "./hooks/useItems";
import { useNotice } from "./hooks/useNotice";
import type { AdFormState, AuthMode, Item, ModalType, ViewType } from "./types";
import "./App.css";

const categories = ["Todos", "Livros", "Engenharia", "Computação", "Casa"];

const emptyForm: AdFormState = {
  titulo: "",
  descricao: "",
  categoria: "Livros",
  preco: "",
  tipo_negociacao: "venda",
  localizacao: "",
  imagem_url: "",
  contato: "",
};

function itemToForm(item: Item): AdFormState {
  return {
    titulo: item.titulo,
    descricao: item.descricao,
    categoria: item.categoria,
    preco: String(item.preco),
    tipo_negociacao: item.tipo_negociacao,
    localizacao: item.localizacao || "",
    imagem_url: item.imagem_url || "",
    contato: item.contato || "",
  };
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function App() {
  const { user, loginUser, registerUser } = useAuth();
  const { items, filtered, category, setCategory, query, setQuery, publish, edit, remove } = useItems();
  const { isFavorite, toggleFavorite } = useFavorites(user);
  const { notice, setNotice } = useNotice();

  const [view, setView] = useState<ViewType>("home");
  const [modal, setModal] = useState<ModalType>(null);
  const [form, setForm] = useState<AdFormState>(emptyForm);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const goHome = () => setView("home");
  const openProfile = () => (user ? setView("mine") : setModal("auth"));
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
        <StatStrip />
        <MarketplaceSection
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
          query={query}
          onQueryChange={setQuery}
          items={filtered}
          onViewItem={handleViewItem}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
        />
        <Manifesto onPublish={openPublish} />
      </main>

      <Footer />
      <MobileNav onNavigateHome={goHome} onOpenPublish={openPublish} onOpenProfile={openProfile} />

      {view === "mine" && (
        <StudentArea
          user={user}
          items={items}
          onBack={goHome}
          onOpenPublish={openPublish}
          onViewItem={handleViewItem}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={isFavorite}
          onEdit={handleEditItem}
          onDelete={handleDeleteItem}
        />
      )}

      {modal === "auth" && <AuthModal onClose={() => setModal(null)} onSubmit={submitAuth} />}
      {modal === "publish" && (
        <PublishModal
          categories={categories.slice(1)}
          form={form}
          isEditing={Boolean(editingItem)}
          onChange={updateForm}
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
        />
      )}

      <Toast message={notice} onDismiss={() => setNotice("")} />
    </div>
  );
}

export default App;
