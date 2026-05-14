export default function UrgencyModal({ level, onConfirm, onCancel }) {
  const config = {
    emergency: {
      emoji: '🚨',
      title: 'Emergency call-out',
      description: 'You selected an emergency service. A professional will be dispatched as soon as possible.',
      surcharge: 50,
      color: 'bg-red-500',
      badge: 'bg-red-100 text-red-700',
      btnColor: 'bg-red-600 hover:bg-red-700',
      examples: ['Burst pipe', 'Locked out', 'No electricity', 'Flooding'],
    },
    urgent: {
      emoji: '⚡',
      title: 'Urgent same-day service',
      description: 'You need someone today. We\'ll prioritise your booking and find the first available pro.',
      surcharge: 25,
      color: 'bg-orange-500',
      badge: 'bg-orange-100 text-orange-700',
      btnColor: 'bg-orange-500 hover:bg-orange-600',
      examples: ['Urgent repair', 'Can\'t wait', 'Today only'],
    },
  };

  const c = config[level] || config.urgent;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-pop">

        {/* Top banner */}
        <div className={`${c.color} p-6 text-white text-center`}>
          <div className="text-5xl mb-2">{c.emoji}</div>
          <h2 className="text-2xl font-extrabold">{c.title}</h2>
          <p className="text-white/80 text-sm mt-1">{c.description}</p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Surcharge callout */}
          <div className={`${c.badge} rounded-2xl p-4 text-center mb-6`}>
            <p className="text-sm font-semibold mb-1">Additional call-out fee</p>
            <p className="text-4xl font-extrabold">+{c.surcharge}%</p>
            <p className="text-xs mt-1 opacity-70">added to the final price estimate</p>
          </div>

          {/* What this means */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-sm text-gray-600 space-y-2">
            <p className="font-semibold text-gray-800">What this includes:</p>
            <div className="flex items-center gap-2"><span>✅</span> Priority dispatch</div>
            <div className="flex items-center gap-2"><span>✅</span> Provider goes out of normal schedule</div>
            <div className="flex items-center gap-2"><span>✅</span> Faster response time</div>
          </div>

          {/* Buttons */}
          <div className="space-y-3">
            <button
              onClick={onConfirm}
              className={`w-full ${c.btnColor} text-white font-bold py-3.5 rounded-2xl transition-colors text-base`}
            >
              I understand — continue with {level === 'emergency' ? 'emergency' : 'urgent'} service
            </button>
            <button
              onClick={onCancel}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-2xl transition-colors text-sm"
            >
              Go back and change my answer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
