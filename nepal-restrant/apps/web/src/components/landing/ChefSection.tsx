"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";

const stats = [
  { raw: 80, suffix: "+", label: "Menu Items" },
  { raw: 5, suffix: "★", label: "Rating" },
  { raw: 100, suffix: "%", label: "Fresh Ingredients" },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate(v) {
        node.textContent = Math.round(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix]);

  return (
    <span ref={ref}>
      0{suffix}
    </span>
  );
}

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
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative"
          >
            <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0">
              {/* Decorative border */}
              <motion.div
                initial={{ opacity: 0, x: 12, y: 12 }}
                whileInView={{ opacity: 1, x: 4, y: 4 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute inset-0 border border-accent/20 rounded-3xl"
              />
              <div className="relative h-full rounded-3xl overflow-hidden border border-accent/30">
                <Image
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&q=90"
                  alt="Haveli head chef"
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
                {/* Overlay shimmer */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Experience badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, type: "spring", stiffness: 180, damping: 12 }}
                whileHover={{ scale: 1.05 }}
                className="absolute -bottom-8 -right-4 md:right-0 glass rounded-2xl p-5 border-gold-glow shadow-gold"
              >
                <div className="font-serif text-4xl font-bold text-gradient-gold">5+</div>
                <div className="text-sm text-text-muted">Years of</div>
                <div className="text-sm font-semibold text-text-secondary">Excellence</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="space-y-8 pt-8 lg:pt-0"
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
                  Our Story
                </span>
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-text-primary leading-tight">
                Authentic Himalayan Cuisine, Expertly Crafted with Care,
                Tradition, and Exceptional Flavors
              </h2>
            </div>

            <p className="text-text-muted leading-relaxed text-lg">
              At Haveli, every dish is a celebration of Nepal's rich culinary
              heritage. Our chefs blend time-honored recipes with fresh,
              locally sourced ingredients to bring you an unforgettable dining
              experience.
            </p>

            <motion.blockquote
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="border-l-2 border-accent pl-6 italic text-text-secondary text-lg"
            >
              "Food is not just sustenance — it's culture, memory, and love
              on a plate."
              <footer className="text-sm text-accent mt-2 not-italic font-medium">
                — Chef Devraj, Head Chef at Haveli
              </footer>
            </motion.blockquote>

            {/* Stat counters */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 rounded-xl bg-surface-2 border border-border hover:border-accent/30 transition-colors"
                >
                  <div className="font-serif text-2xl font-bold text-gradient-gold">
                    <CountUp to={stat.raw} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-text-muted mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
