import "./Spinner.css";

interface SpinnerProps {
  label?: string;
  size?: "small" | "medium";
}

export function Spinner({ label, size = "medium" }: SpinnerProps) {
  return (
    <div className={`spinner-wrap spinner-${size}`} role="status" aria-live="polite">
      <span className="spinner-wheel" aria-hidden="true" />
      {label && <span className="spinner-label">{label}</span>}
    </div>
  );
}
