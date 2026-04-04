"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

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

const cardVariants = {
  hidden: { opacity: 0, y: 48, scale: 0.94 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      delay: i * 0.14,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function CategoryGrid() {
  return (
    <section id="menu" className="py-24 bg-surface">
      <div className="container-section">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-16 space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-px w-12 bg-accent origin-right"
            />
            <span className="text-accent text-sm font-medium uppercase tracking-widest">
              Our Specialties
            </span>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="h-px w-12 bg-accent origin-left"
            />
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-text-primary">
            Immerse Yourself in an{" "}
            <span className="text-gradient-gold">Asian Experience</span>
          </h2>
          <p className="text-text-muted max-w-xl mx-auto leading-relaxed">
            From warming soups to perfectly crafted momos, each dish is
            prepared with care, tradition, and exceptional flavors.
          </p>
        </motion.div>

        {/* Category cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Link
                href={cat.href}
                id={`category-${cat.id}`}
                className="group relative overflow-hidden rounded-2xl aspect-[3/4] border-gold-glow cursor-pointer block"
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
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.14 }}
                  className="absolute top-4 left-4 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 backdrop-blur-sm"
                >
                  <span className="text-accent text-xs font-medium">{cat.badge}</span>
                </motion.div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-serif text-2xl font-bold text-text-primary mb-1">
                    {cat.title}
                  </h3>
                  <p className="text-text-muted text-sm mb-4">{cat.subtitle}</p>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-accent text-sm font-medium">View Menu</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="text-accent"
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
