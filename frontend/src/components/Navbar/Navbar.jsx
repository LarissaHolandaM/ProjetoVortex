import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">EcoCampus</h2>

      <ul className="menu">
        <li>Início</li>
        <li>Categorias</li>
        <li>Anunciar</li>
        <li>Entrar</li>
      </ul>
    </nav>
  );
}

export default Navbar;