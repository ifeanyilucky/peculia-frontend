import { AudienceCard } from "@/components/help/AudienceCard";
import { HelpSearch } from "@/components/help/HelpSearch";

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-card py-20 lg:py-32">
        <div className="container relative z-10 text-center">
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight lg:text-7xl">
            Get Support
          </h1>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground">
            Everything you need to know about Peculia. Find answers,
            troubleshoot issues, and grow your business.
          </p>
          <HelpSearch />
        </div>

        {/* Decorative background elements */}
        <div className="absolute left-1/2 top-1/2 -z-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 opacity-10 bg-[radial-gradient(circle,var(--primary)_0%,transparent_70%)]" />
      </section>

      {/* Audience Selection */}
      <section className="container py-20 lg:py-32">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <AudienceCard
            audience="customers"
            title="For Customers"
            description="Booking service, managing appointments, payments, and account settings for clients."
            image="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=800"
            href="/help/customers"
          />
          <AudienceCard
            audience="professionals"
            title="For Professionals"
            description="Manage your business, services, staff, and clients with our professional tools."
            image="https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=800"
            href="/help/professionals"
          />
        </div>
      </section>

      {/* Popular Section (Future) */}
      <section className="border-t border-border bg-muted/30 py-20">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 font-bold">How do I book an appointment?</h3>
              <p className="text-muted-foreground">
                Simply search for a professional, select a service, and pick a
                time slot that works for you.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 font-bold">Can I cancel my booking?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel appointments through your dashboard, subject
                to the professional's cancellation policy.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="mb-4 font-bold">How do payouts work?</h3>
              <p className="text-muted-foreground">
                Payouts are processed automatically to your linked bank account
                after the service is completed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
