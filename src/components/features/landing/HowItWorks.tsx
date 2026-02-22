import { Search, CreditCard, CalendarCheck } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: <Search className="text-rose-600" size={32} />,
      title: "Discover Pros",
      description:
        "Search for top-rated beauty and wellness professionals near you. Filter by specialty, rating, or price.",
    },
    {
      icon: <CreditCard className="text-rose-600" size={32} />,
      title: "Book & Pay",
      description:
        "Secure your appointment with a deposit. Our platform ensures your payments are safe and tracked.",
    },
    {
      icon: <CalendarCheck className="text-rose-600" size={32} />,
      title: "Elevate Your Look",
      description:
        "Show up for your appointment and enjoy premium service. Leave a review to help others find great pros.",
    },
  ];

  return (
    <section className="bg-slate-50 py-24 px-6 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="font-peculiar text-4xl font-bold tracking-tight text-slate-900">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Three simple steps to your best look yet.
          </p>
        </div>

        <div className="relative grid gap-12 md:grid-cols-3">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-0 right-0 h-px -translate-y-[100px] border-t border-dashed border-rose-200 hidden md:block" />

          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl shadow-slate-200 transition-transform hover:scale-110">
                {step.icon}
              </div>
              <h3 className="font-peculiar text-xl font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-4 leading-relaxed text-slate-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
