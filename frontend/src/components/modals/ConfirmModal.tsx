import "./Modal.css";
import "./ConfirmModal.css";

interface ConfirmModalProps {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  danger = true,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onCancel()}>
      <div className="modal confirm-modal">
        <button className="modal-close" onClick={onCancel}>
          ×
        </button>
        <p className="eyebrow">CONFIRMAÇÃO</p>
        <h2>{title}</h2>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <button className="button button-outline" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className={danger ? "button button-outline danger" : "button"} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
