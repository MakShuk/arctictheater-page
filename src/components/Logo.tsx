import logoSvg from '../assets/logo.svg';
import './Logo.css';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
  className?: string;
}

/**
 * Компонент логотипа Arctic Theater.
 * Поддерживает 3 размера и кастомный onClick.
 */
export function Logo({ size = 'medium', onClick, className = '' }: LogoProps) {
  const sizeClasses = {
    small: 'logo--small',
    medium: 'logo--medium',
    large: 'logo--large',
  };

  return (
    <img
      src={logoSvg}
      alt="Arctic Theater Logo"
      className={`logo ${sizeClasses[size]} ${className}`.trim()}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    />
  );
}
