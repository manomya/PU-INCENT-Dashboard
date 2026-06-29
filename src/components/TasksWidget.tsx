interface Task {
  id: string;
  title: string;
  status: string;
}

interface TasksWidgetProps {
  tasks: Task[];
}

export default function TasksWidget({ tasks }: TasksWidgetProps) {
  // Using mock data similar to HTML if props tasks are empty
  const displayTasks = tasks && tasks.length > 0 ? tasks : [
    { id: '1', title: 'Review AgroTech Q3 Deck', status: 'High', priority: 'High', due: 'Tomorrow', icon: 'report' },
    { id: '2', title: 'Mentor Matching Session', status: 'Medium', priority: 'Medium', due: 'Oct 28', icon: 'assignment' },
    { id: '3', title: 'Update Funding Portal', status: 'Low', priority: 'Low', due: 'Oct 30', icon: 'schedule' }
  ];

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant shadow-sm flex flex-col">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center">
        <h4 className="text-lg font-bold text-on-surface">Pending Tasks</h4>
        <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange rounded text-[10px] font-black uppercase tracking-widest">
          {displayTasks.length} Urgent
        </span>
      </div>
      <div className="p-6 space-y-4">
        {displayTasks.map((task: any) => (
          <div key={task.id} className="flex items-start gap-4 p-4 border border-outline-variant rounded-lg hover:border-brand-orange/50 transition-all cursor-pointer bg-surface-variant/30">
            <span className={`material-symbols-outlined ${task.status === 'High' ? 'text-brand-orange' : 'text-on-surface-variant'}`}>{task.icon || 'assignment'}</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-on-surface">{task.title}</p>
              <p className="text-xs font-bold text-on-surface-variant mt-1 uppercase tracking-wider">
                Priority: {task.priority || task.status} • Due: {task.due || 'TBD'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
