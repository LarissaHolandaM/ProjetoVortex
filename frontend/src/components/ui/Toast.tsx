import "./Toast.css";

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  if (!message) return null;
  return (
    <div className="toast">
      {message}
      <button onClick={onDismiss}>×</button>
    </div>
  );
}
