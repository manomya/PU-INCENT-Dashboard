interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
}

interface EventsWidgetProps {
  events: Event[];
}

export default function EventsWidget({ events }: EventsWidgetProps) {
  const displayEvents = events && events.length > 0 ? events : [
    { id: '1', title: 'VC Pitch Day 2023', date: 'OCT 25', time: '09:00 AM • Main Auditorium' },
    { id: '2', title: 'Growth Hacking Workshop', date: 'OCT 27', time: '02:30 PM • Virtual (Zoom)' },
    { id: '3', title: 'Startup Mixer & Networking', date: 'NOV 02', time: '06:00 PM • Rooftop Cafe' },
  ];

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm flex flex-col">
      <div className="p-6 border-b border-outline-variant">
        <h4 className="text-lg font-bold text-on-surface">Upcoming Events</h4>
      </div>
      <div className="p-6 space-y-6">
        {displayEvents.map((event) => {
          const [month, day] = event.date.split(' ');
          return (
            <div key={event.id} className="flex items-center gap-6">
              <div className="w-12 h-12 bg-brand-orange/10 flex flex-col items-center justify-center rounded-lg text-brand-orange">
                <span className="text-[10px] font-black uppercase">{month}</span>
                <span className="text-lg font-black">{day}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-on-surface">{event.title}</p>
                <p className="text-xs font-bold text-on-surface-variant mt-1 uppercase tracking-wider">{event.time}</p>
              </div>
              <button className="material-symbols-outlined text-on-surface-variant hover:text-brand-orange transition-colors" style={{ fontSize: '16px' }}>
                arrow_forward_ios
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
