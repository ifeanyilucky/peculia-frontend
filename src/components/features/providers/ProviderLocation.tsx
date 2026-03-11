import { Provider } from "@/types/provider.types";
import { MapPin, Clock, ExternalLink } from "lucide-react";
import { WeeklySchedule, DaySchedule } from "@/utils/time.utils";

interface ProviderLocationProps {
  provider: Provider;
  schedule?: WeeklySchedule;
}

export default function ProviderLocation({
  provider,
  schedule,
}: ProviderLocationProps) {
  const address =
    provider.location?.address ||
    `${provider.location?.city}, ${provider.location?.state}`;
  const mapQuery = encodeURIComponent(address);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const embedUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const formatHours = (daySchedule?: DaySchedule) => {
    if (
      !daySchedule ||
      !daySchedule.isOpen ||
      !daySchedule.slots ||
      daySchedule.slots.length === 0
    ) {
      return "Closed";
    }
    // Assuming slots are sorted and we show the full range
    const start = daySchedule.slots[0].startTime;
    const end = daySchedule.slots[daySchedule.slots.length - 1].endTime;
    return `${start} - ${end}`;
  };

  return (
    <section className="space-y-10">
      <div className="flex flex-col gap-8 lg:items-start">
        {/* Map Section */}
        <div className="w-full space-y-4">
          <h3 className="font-peculiar text-2xl font-bold text-slate-900">
            Location
          </h3>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <iframe
              width="100%"
              height="350"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={embedUrl}
              className="grayscale contrast-[1.1]"
              title="Provider Location Map"
            />
            <div className="bg-slate-50 p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-white p-3 text-rose-500 border border-slate-200">
                  <MapPin size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-slate-900 leading-tight">
                    {provider.businessName ||
                      `${provider.userId.firstName} ${provider.userId.lastName}`}
                  </p>
                  <p className="mt-1 text-slate-500 font-medium">{address}</p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-rose-600 font-bold hover:text-rose-700 transition-colors group"
                  >
                    <span>Get directions</span>
                    <ExternalLink
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Opening Hours Section */}
        <div className="w-full space-y-6">
          <div className="flex items-center gap-2">
            <Clock size={24} className="text-rose-500" />
            <h3 className="font-peculiar text-2xl font-bold text-slate-900">
              Opening Hours
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <ul className="space-y-4">
              {days.map((day) => {
                const daySchedule = schedule?.schedule?.[day];
                const hours = formatHours(daySchedule);
                const isToday =
                  new Date()
                    .toLocaleDateString("en-US", { weekday: "long" })
                    .toLowerCase() === day;

                return (
                  <li
                    key={day}
                    className={`flex justify-between items-center text-sm ${isToday ? "bg-rose-50 -mx-3 px-3 py-2 rounded-lg" : ""}`}
                  >
                    <span
                      className={`capitalize font-bold ${isToday ? "text-rose-600" : "text-slate-900"}`}
                    >
                      {day}
                      {isToday && (
                        <span className="ml-2 text-[10px] uppercase tracking-wider text-rose-400">
                          Today
                        </span>
                      )}
                    </span>
                    <span
                      className={`font-medium ${hours === "Closed" ? "text-slate-400" : "text-slate-600"}`}
                    >
                      {hours}
                    </span>
                  </li>
                );
              })}
              {!schedule?.schedule && (
                <p className="text-center text-sm text-slate-400 py-4 italic">
                  Complete schedule not available
                </p>
              )}
            </ul>
          </div>

          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
            <p className="text-xs text-slate-500 leading-relaxed text-center">
              Hours may vary on holidays. Please check with the professional
              before visiting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
