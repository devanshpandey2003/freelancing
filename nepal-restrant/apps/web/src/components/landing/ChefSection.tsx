import Image from "next/image";

export default function ChefSection() {
  return (
    <section
      id="about"
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a0a0a 0%, #1a1208 50%, #0a0a0a 100%)",
      }}
    >
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full bg-repeat"
          style={{
            backgroundImage:
              "radial-gradient(circle, #d4a853 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Gold ambient */}
      <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />

      <div className="container-section relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0">
              {/* Decorative border */}
              <div className="absolute inset-0 border border-accent/20 rounded-3xl translate-x-4 translate-y-4" />
              <div className="relative h-full rounded-3xl overflow-hidden border border-accent/30">
                <Image
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=90"
                  alt="Haveli head chef"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Experience badge */}
              <div className="absolute -bottom-8 -right-4 md:right-0 glass rounded-2xl p-5 border-gold-glow shadow-gold">
                <div className="font-serif text-4xl font-bold text-gradient-gold">
                  5+
                </div>
                <div className="text-sm text-text-muted">Years of</div>
                <div className="text-sm font-semibold text-text-secondary">Excellence</div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-8 pt-8 lg:pt-0">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-px w-8 bg-accent" />
                <span className="text-accent text-sm font-medium uppercase tracking-widest">
                  Our Story
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-text-primary leading-tight">
                Authentic Sushi and Rolls, Expertly Crafted with Care,
                Tradition, and Exceptional Flavors
              </h2>
            </div>

            <p className="text-text-muted leading-relaxed text-lg">
              At Haveli, every dish is a celebration of Nepal's rich culinary
              heritage. Our chefs blend time-honored recipes with fresh,
              locally sourced ingredients to bring you an unforgettable dining
              experience.
            </p>

            <blockquote className="border-l-2 border-accent pl-6 italic text-text-secondary text-lg">
              "Food is not just sustenance — it's culture, memory, and love
              on a plate."
              <footer className="text-sm text-accent mt-2 not-italic font-medium">
                — Chef Devraj, Head Chef at Haveli
              </footer>
            </blockquote>

            <div className="grid grid-cols-3 gap-6 pt-4">
              {[
                { value: "80+", label: "Menu Items" },
                { value: "5★", label: "Rating" },
                { value: "100%", label: "Fresh Ingredients" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-xl bg-surface-2 border border-border"
                >
                  <div className="font-serif text-2xl font-bold text-gradient-gold">
                    {stat.value}
                  </div>
                  <div className="text-xs text-text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
