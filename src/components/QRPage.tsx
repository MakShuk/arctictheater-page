import './QRPage.css';
import QRCode from '../assets/QR.svg';

/**
 * Компонент страницы QR-кода.
 * Отображает QR-код для перехода в группу ВК.
 */
export function QRPage() {
  return (
    <div className="qr-page">
      <div className="qr-container">
        <img src={QRCode} alt="QR-код группы ВКонтакте" className="qr-image" />
      </div>
      
      <div className="qr-info">
        <h2 className="qr-title">Наша группа ВКонтакте</h2>
      </div>
    </div>
  );
}
