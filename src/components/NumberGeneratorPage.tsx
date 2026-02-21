import { useEffect, useState } from 'react';
import './NumberGeneratorPage.css';

/**
 * Страница генератора случайных чисел от 1 до 50.
 */
export function NumberGeneratorPage() {
  const [value, setValue] = useState<number | null>(null);

  const generate = () => {
    const random = Math.floor(Math.random() * 50) + 1;
    setValue(random);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') {
        event.preventDefault();
        generate();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="number-generator-page">
      <button
        type="button"
        className="number-generator-value"
        onClick={generate}
        aria-label="Сгенерировать число"
        title="Кликните по кругу или нажмите пробел"
      >
        {value ?? ''}
      </button>
    </div>
  );
}
