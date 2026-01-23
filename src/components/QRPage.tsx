import './QRPage.css';
import QRCode from '../assets/QR.svg';

interface QRPageProps {
  vkGroupUrl?: string;
  vkGroupName?: string;
}

/**
 * Компонент страницы QR-кода.
 * Отображает QR-код для перехода в группу ВК.
 */
export function QRPage({ vkGroupUrl, vkGroupName }: QRPageProps) {
  const url = vkGroupUrl || 'https://vk.com/arctictheater';
  const name = vkGroupName || 'Arctic Theater';

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
