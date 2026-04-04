import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    id: "momo",
    title: "Momos",
    subtitle: "Steam • Fry • Jhol • Chilly",
    image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500&q=80",
    href: "/menu?category=Chicken+Momo",
    badge: "Most Popular",
  },
  {
    id: "soup",
    title: "Soups & Thukpa",
    subtitle: "Veg • Chicken • Mushroom",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80",
    href: "/menu?category=Soup",
    badge: "Comfort Food",
  },
  {
    id: "chicken",
    title: "Chicken Dishes",
    subtitle: "Roast • Chilly • Hariyali",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&q=80",
    href: "/menu?category=Chicken",
    badge: "Chef's Pick",
  },
];

export default function CategoryGrid() {
  return (
    <section id="menu" className="py-24 bg-surface">
      <div className="container-section">
        {/* Section header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-accent" />
            <span className="text-accent text-sm font-medium uppercase tracking-widest">
              Our Specialties
            </span>
            <div className="h-px w-12 bg-accent" />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-text-primary">
            Immerse Yourself in an{" "}
            <span className="text-gradient-gold">Asian Experience</span>
          </h2>
          <p className="text-text-muted max-w-xl mx-auto leading-relaxed">
            From warming soups to perfectly crafted momos, each dish is
            prepared with care, tradition, and exceptional flavors.
          </p>
        </div>

        {/* Category cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <Link
              key={cat.id}
              href={cat.href}
              id={`category-${cat.id}`}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] border-gold-glow cursor-pointer"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Background image */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

              {/* Badge */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 backdrop-blur-sm">
                <span className="text-accent text-xs font-medium">{cat.badge}</span>
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-serif text-2xl font-bold text-text-primary mb-1">
                  {cat.title}
                </h3>
                <p className="text-text-muted text-sm mb-4">{cat.subtitle}</p>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-accent text-sm font-medium">View Menu</span>
                  <span className="text-accent">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
