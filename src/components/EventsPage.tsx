import './EventsPage.css';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  city: string;
  description: string;
  link?: string;
}

interface EventsPageProps {
  events: Event[];
}

/**
 * Компонент страницы анонсов мероприятий.
 * Отображает минималистичный список предстоящих событий.
 */
export function EventsPage({ events }: EventsPageProps) {
  if (!events || events.length === 0) {
    return (
      <div className="events-page">
        <p className="events-empty">Нет предстоящих мероприятий</p>
      </div>
    );
  }

  return (
    <div className="events-page">
      <div className="events-list">
        {events.map((event) => (
          <article key={event.id} className="event-card">
            <h3 className="event-title">{event.title}</h3>
            <div className="event-meta">
              <span className="event-city">{event.city}</span>
              <span className="event-datetime">
                <span className="event-icon">⏰</span>
                {event.date} с {event.time}
              </span>
            </div>
            <p className="event-description">{event.description}</p>
            {event.link && (
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="event-link"
              >
                Далее
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
