import "./Modal.css";
import "./HelpModal.css";

interface HelpModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: HelpModalProps) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal help-modal">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        <div className="help-modal-body">
          <img
            className="help-modal-image"
            src="/images/homens-trabalhando.jpg"
            alt="Ilustração de um funcionário exausto trabalhando no computador"
          />
          <p className="eyebrow">CENTRAL DE AJUDA</p>
          <h2>
            Seção <em>indisponível</em>...
          </h2>
          <p className="help-modal-text">Homens trabalhando.</p>
          <p className="help-modal-subtext">
            Nossa equipe (uma pessoa e um café) está construindo essa página. Volte outra hora!
          </p>
          <button className="button button-small" onClick={onClose}>
            Entendi, vou esperar ↗
          </button>
        </div>
      </div>
    </div>
  );
}
