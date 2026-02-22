import { Calendar, Clock } from "lucide-react";

export default function ProviderAvailabilityPreview() {
  const schedule = [
    { day: "Monday", hours: "9:00 AM - 6:00 PM", active: true },
    { day: "Tuesday", hours: "9:00 AM - 6:00 PM", active: true },
    { day: "Wednesday", hours: "9:00 AM - 6:00 PM", active: true },
    { day: "Thursday", hours: "10:00 AM - 8:00 PM", active: true },
    { day: "Friday", hours: "9:00 AM - 6:00 PM", active: true },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM", active: true },
    { day: "Sunday", hours: "Closed", active: false },
  ];

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3 text-rose-600">
        <Calendar size={24} />
        <h3 className="font-peculiar text-xl font-bold text-slate-900">
          Weekly Schedule
        </h3>
      </div>

      <div className="space-y-4">
        {schedule.map((item) => (
          <div
            key={item.day}
            className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0"
          >
            <span className="text-sm font-medium text-slate-700">
              {item.day}
            </span>
            <div className="flex items-center gap-2">
              {item.active ? (
                <>
                  <Clock size={12} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">
                    {item.hours}
                  </span>
                </>
              ) : (
                <span className="text-xs font-bold text-slate-400 italic">
                  Closed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl bg-rose-50 p-4 text-center">
        <p className="text-xs font-medium text-rose-600 leading-tight">
          Times vary by service and provider availability. Book to see specific
          time slots.
        </p>
      </div>
    </div>
  );
}
