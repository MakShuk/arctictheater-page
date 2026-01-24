import { useState, useEffect, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import './EmotionsPage.css';

interface EmotionsPageProps {
  pageId: number;
  emotions: string[];
}

/**
 * Компонент страницы генератора случайных эмоций.
 * Генерирует случайную эмоцию из списка, не повторяя уже выпавшие.
 */
export function EmotionsPage({ pageId, emotions }: EmotionsPageProps) {
  const config = useAppStore(s => s.config);
  const generateEmotion = useAppStore(s => s.generateEmotion);
  const resetEmotions = useAppStore(s => s.resetEmotions);

  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Получаем список уже сгенерированных эмоций
  const page = config?.pages.find(p => p.id === pageId);
  const generatedEmotions = (page?.content as any)?.generatedEmotions || [];

  // Вычисляем оставшиеся эмоции
  const remainingEmotions = emotions.filter(e => !generatedEmotions.includes(e));
  const canGenerate = remainingEmotions.length > 0 && !isAnimating;

  /**
   * Обработчик генерации эмоции при клике на поле
   */
  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;

    setIsAnimating(true);

    // Анимация длится ~1.5 секунды
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Выбираем случайную эмоцию из оставшихся
    const randomIndex = Math.floor(Math.random() * remainingEmotions.length);
    const selectedEmotion = remainingEmotions[randomIndex];

    // Сохраняем в store
    generateEmotion(pageId, selectedEmotion);
    setCurrentEmotion(selectedEmotion);

    setIsAnimating(false);
  }, [canGenerate, remainingEmotions, generateEmotion, pageId]);

  /**
   * Обработчик сброса истории
   */
  const handleReset = () => {
    resetEmotions(pageId);
    setCurrentEmotion(null);
  };

  /**
   * Обработчик нажатия клавиши пробел
   */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Генерируем эмоцию при нажатии пробела
      if (e.code === 'Space' && canGenerate) {
        e.preventDefault(); // Предотвращаем прокрутку страницы
        handleGenerate();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [canGenerate, handleGenerate]);

  return (
    <div className="emotions-page">
      <div className="emotions-container">
        {/* Кликабельное поле для генерации */}
        <div 
          className={`emotion-display ${canGenerate ? 'clickable' : 'disabled'}`}
          onClick={handleGenerate}
        >
          {/* Незаметный крестик сброса */}
          {generatedEmotions.length > 0 && (
            <button 
              type="button" 
              className="btn-reset-subtle"
              onClick={(e) => {
                e.stopPropagation(); // Предотвращаем клик по полю
                handleReset();
              }}
              title="Сбросить эмоции"
            >
              ×
            </button>
          )}

          {isAnimating ? (
            <div className="emotion-loader">
              <div className="shimmer"></div>
              <p className="loader-text">Генерируем эмоцию...</p>
            </div>
          ) : currentEmotion ? (
            <div className="emotion-result">
              <h2 className="emotion-text">{currentEmotion}</h2>
            </div>
          ) : (
            <div className="emotion-placeholder">
              <p>Нажмите на поле, чтобы сгенерировать эмоцию</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
