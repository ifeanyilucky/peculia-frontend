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
    <section className="space-y-10 pt-4">
      <div className="flex flex-col gap-12 lg:items-start">
        {/* Map Section */}
        <div className="w-full space-y-4">
          <h3 className="font-peculiar text-3xl font-black text-glam-plum">
            Location
          </h3>
          <div className="overflow-hidden rounded-[2rem] border border-glam-blush shadow-sm">
            <iframe
              width="100%"
              height="400"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={embedUrl}
              className="grayscale contrast-[1.1] brightness-[0.9]"
              title="Provider Location Map"
            />
            <div className="bg-white p-8">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-glam-blush/30 p-4 text-glam-plum border border-glam-blush shadow-sm">
                  <MapPin size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-xl font-black text-glam-plum leading-tight">
                    {provider.businessName ||
                      `${provider.userId.firstName} ${provider.userId.lastName}`}
                  </p>
                  <p className="mt-2 text-glam-charcoal/60 font-medium leading-relaxed">
                    {address}
                  </p>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-glam-plum font-black hover:opacity-80 transition-all group"
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
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-glam-blush/30 flex items-center justify-center text-glam-plum">
              <Clock size={20} />
            </div>
            <h3 className="font-peculiar text-3xl font-black text-glam-plum">
              Opening Hours
            </h3>
          </div>

          <div className="rounded-[2rem] border border-glam-blush bg-white p-8 shadow-sm">
            <ul className="space-y-5">
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
                    className={`flex justify-between items-center text-sm ${isToday ? "bg-glam-blush/40 -mx-4 px-4 py-3 rounded-2xl ring-1 ring-glam-blush/60" : ""}`}
                  >
                    <span
                      className={`capitalize font-black ${isToday ? "text-glam-plum" : "text-glam-charcoal/60"}`}
                    >
                      {day}
                      {isToday && (
                        <span className="ml-3 text-[10px] font-black uppercase tracking-widest text-glam-gold">
                          Today
                        </span>
                      )}
                    </span>
                    <span
                      className={`font-black ${hours === "Closed" ? "text-glam-charcoal/20" : "text-glam-plum"}`}
                    >
                      {hours}
                    </span>
                  </li>
                );
              })}
              {!schedule?.schedule && (
                <p className="text-center text-sm text-glam-charcoal/40 py-4 italic font-medium">
                  Complete schedule not available
                </p>
              )}
            </ul>
          </div>

          <div className="rounded-2xl bg-glam-blush/20 border border-glam-blush/40 p-5">
            <p className="text-[11px] text-glam-charcoal/40 leading-relaxed text-center font-black uppercase tracking-widest">
              Hours may vary on holidays. Please check with the professional
              before visiting.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
