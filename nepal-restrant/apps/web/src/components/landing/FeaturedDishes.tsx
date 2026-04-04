"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const featuredSections = [
  {
    id: "momo-section",
    tag: "Fan Favourite",
    title: "Famous Momos",
    image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=700&q=90",
    imageAlt: "Steamed momos with chutney",
    imageLeft: false,
    items: [
      { name: "Chicken Momo Steam", price: 130, desc: "Tender steamed momos with tomato chutney" },
      { name: "Chicken Momo Jhol", price: 150, desc: "Momos in spiced sesame broth" },
      { name: "Chicken Momo Chilly", price: 170, desc: "Crispy stir-fried with chilly sauce" },
      { name: "Chicken Momo Kothey", price: 180, desc: "Pan-fried with crispy bottom" },
    ],
  },
  {
    id: "chicken-section",
    tag: "Chef's Pick",
    title: "Signature Chicken",
    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=700&q=90",
    imageAlt: "Signature chicken dishes",
    imageLeft: true,
    items: [
      { name: "Chicken Hariyali", price: 300, desc: "Green herb marinade, tender & aromatic" },
      { name: "Lollipop Chilly", price: 350, desc: "Crispy lollipop in tangy chilly sauce" },
      { name: "Chicken Sukuti", price: 280, desc: "Traditional dried smoked chicken" },
      { name: "Chicken 65", price: 270, desc: "South-Asian spiced crispy chicken" },
    ],
  },
];

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function FeaturedDishes() {
  return (
    <section id="featured" className="py-24 bg-background">
      <div className="container-section space-y-32">
        {featuredSections.map((section) => (
          <div
            key={section.id}
            id={section.id}
            className={`grid lg:grid-cols-2 gap-16 items-center`}
          >
            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: section.imageLeft ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`space-y-8 ${section.imageLeft ? "lg:order-2" : "lg:order-1"}`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="h-px w-8 bg-accent origin-left"
                  />
                  <span className="text-accent text-sm font-medium uppercase tracking-widest">
                    {section.tag}
                  </span>
                </div>
                <h2 className="font-serif text-4xl md:text-5xl font-bold text-text-primary">
                  {section.title}
                </h2>
              </div>

              {/* Item list */}
              <div className="space-y-4">
                {section.items.map((item, i) => (
                  <motion.div
                    key={item.name}
                    custom={i}
                    variants={menuItemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-40px" }}
                    className="group flex items-start justify-between gap-4 pb-4 border-b border-border hover:border-accent/30 transition-colors"
                  >
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <motion.div
                          whileHover={{ scale: 1.6 }}
                          className="w-1.5 h-1.5 rounded-full bg-accent/60 group-hover:bg-accent transition-colors"
                        />
                        <span className="font-medium text-text-primary group-hover:text-accent transition-colors">
                          {item.name}
                        </span>
                      </div>
                      <p className="text-sm text-text-muted pl-3.5">{item.desc}</p>
                    </div>
                    <span className="text-accent font-bold text-lg whitespace-nowrap">
                      Rs. {item.price}
                    </span>
                  </motion.div>
                ))}
              </div>

              <Link
                href="/menu"
                id={`${section.id}-view-all`}
                className="inline-flex items-center gap-2 text-accent hover:text-accent-light transition-colors group"
              >
                <span className="text-sm font-medium">View Full Menu</span>
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                >
                  →
                </motion.span>
              </Link>
            </motion.div>

            {/* Image side */}
            <motion.div
              initial={{ opacity: 0, x: section.imageLeft ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`relative ${section.imageLeft ? "lg:order-1" : "lg:order-2"}`}
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-gold-glow group">
                <Image
                  src={section.image}
                  alt={section.imageAlt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Gold corner accents */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-accent/50 rounded-tr-xl" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-accent/50 rounded-bl-xl" />
                {/* Shimmer on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Price bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 14 }}
                whileHover={{ scale: 1.06 }}
                className="absolute -bottom-6 -right-6 md:right-6 glass rounded-2xl p-4 shadow-gold border-gold-glow"
              >
                <div className="text-2xl font-bold text-accent font-serif">
                  Rs. {Math.min(...section.items.map((i) => i.price))}+
                </div>
                <div className="text-xs text-text-muted">Starting from</div>
              </motion.div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
}
