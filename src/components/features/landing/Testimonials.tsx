import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      name: "Tinuade S.",
      role: "Regular Client",
      text: "Glamyad made finding a reliable hairstylist so easy. I love the verified reviews; I knew exactly what to expect before I even stepped into the salon!",
      rating: 5,
    },
    {
      name: "Chiamaka A.",
      role: "Bridesmaid",
      text: "The deposit protection gave me great peace of mind. The makeup artist was professional, punctual, and did an incredible job. Highly recommend!",
      rating: 5,
    },
    {
      name: "Ibrahim K.",
      role: "Premium Member",
      text: "Best booking experience I've had. The interface is clean, and the quality of professionals on this platform is top-notch. My go-to for wellness experts.",
      rating: 5,
    },
  ];

  return (
    <section className="bg-glam-ivory py-24 px-6 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="font-peculiar text-4xl font-bold text-glam-plum">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-lg text-foreground">
            Trusted by thousands of beauty and wellness enthusiasts.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="relative rounded-3xl bg-white p-8 border border-glam-blush transition-all hover:border-glam-gold/50 shadow-sm"
            >
              <Quote className="absolute top-6 right-8 h-12 w-12 text-glam-gold/20" />
              <div className="flex gap-1">
                {[...Array(t.rating)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="fill-glam-gold text-glam-gold"
                  />
                ))}
              </div>
              <p className="mt-6 text-lg italic leading-relaxed text-glam-charcoal">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-8 pt-8 border-t border-glam-blush">
                <p className="font-peculiar font-bold text-glam-plum">
                  {t.name}
                </p>
                <p className="text-sm text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
