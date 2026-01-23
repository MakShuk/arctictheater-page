import './Spinner.css';

interface SpinnerProps {
  size?: number;
  color?: string;
}

/**
 * Компонент спиннера загрузки.
 * Использует CSS keyframes для анимации.
 */
export function Spinner({ size = 48, color }: SpinnerProps) {
  return (
    <div className="spinner-container">
      <div
        className="spinner"
        style={{
          width: size,
          height: size,
          borderColor: color
            ? `${color} transparent transparent transparent`
            : undefined,
        }}
      />
    </div>
  );
}
