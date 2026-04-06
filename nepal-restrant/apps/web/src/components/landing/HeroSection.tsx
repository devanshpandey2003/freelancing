"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";

const textContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.25 } },
};

const textItem = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const statItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mouseAreaRef = useRef<HTMLDivElement>(null);

  // Track scroll progress within the hero section only
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // --- Scroll-driven 3D transforms ---
  const dishY        = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const dishRotateX  = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const dishScale    = useTransform(scrollYProgress, [0, 1], [1, 0.68]);
  const dishOpacity  = useTransform(scrollYProgress, [0, 0.72], [1, 0]);

  // Text moves slower → creates depth separation
  const textY        = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const textOpacity  = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Floating cards at different parallax speeds
  const card1Y       = useTransform(scrollYProgress, [0, 1], [0, -130]);
  const card2Y       = useTransform(scrollYProgress, [0, 1], [0, -90]);

  // Outer dashed ring tilts differently from dish
  const outerRingRotateX = useTransform(scrollYProgress, [0, 1], [0, 14]);

  // --- Mouse-follow 3D tilt ---
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  // Springs smooth out the mouse movement
  const tiltX = useSpring(useTransform(rawMouseX, [-220, 220], [10, -10]), {
    stiffness: 130,
    damping: 22,
  });
  const tiltY = useSpring(useTransform(rawMouseY, [-220, 220], [-10, 10]), {
    stiffness: 130,
    damping: 22,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rawMouseX.set(e.clientX - (rect.left + rect.width / 2));
    rawMouseY.set(e.clientY - (rect.top + rect.height / 2));
  };
  const handleMouseLeave = () => {
    rawMouseX.set(0);
    rawMouseY.set(0);
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
    >
      {/* Background */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl pointer-events-none animate-gold-pulse" />

      <div className="container-section relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

          {/* ── Left: Text with scroll parallax ── */}
          <motion.div
            style={{ y: textY, opacity: textOpacity }}
            className="space-y-8"
            variants={textContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={textItem} className="flex items-center gap-3">
              <div className="h-px w-12 bg-accent" />
              <span className="text-accent text-sm font-medium uppercase tracking-widest">
                Fine Dining Experience
              </span>
            </motion.div>

            <motion.h1
              variants={textItem}
              className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
            >
              Delicious Food &{" "}
              <span className="text-gradient-gold">Wonderful</span> Eating
              Experience
            </motion.h1>

            <motion.p
              variants={textItem}
              className="text-text-muted text-base sm:text-lg max-w-md leading-relaxed"
            >
              Immerse yourself in the rich flavors of authentic Nepali and
              Himalayan cuisine. Every dish tells a story of tradition and love
              for food.
            </motion.p>

            <motion.div variants={textItem} className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                href="/menu"
                id="hero-order-btn"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-gradient-gold text-background font-semibold hover:opacity-90 transition-all hover:shadow-gold-lg hover:scale-105 active:scale-95 text-sm sm:text-base"
              >
                Order Now
              </Link>
              <Link
                href="#featured"
                id="hero-explore-btn"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-accent/40 text-text-primary font-semibold hover:border-accent hover:bg-accent/10 transition-all text-sm sm:text-base"
              >
                Explore Menu
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="visible"
              className="flex gap-8 pt-4"
            >
              {[
                { value: "5+", label: "Years Serving" },
                { value: "80+", label: "Menu Items" },
                { value: "5★", label: "Rated" },
              ].map((stat) => (
                <motion.div key={stat.label} variants={statItem}>
                  <div className="font-serif text-2xl font-bold text-accent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-text-muted mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: 3D dish ── */}
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ y: dishY, opacity: dishOpacity, scale: dishScale }}
            className="relative block"
          >
            {/* Perspective root — all 3D transforms need this ancestor */}
            <div
              className="relative w-full aspect-square max-w-xs sm:max-w-sm lg:max-w-xl mx-auto lg:ml-auto"
              style={{ perspective: "1100px", perspectiveOrigin: "50% 50%" }}
            >

              {/* ── Outer dashed ring — tilts on scroll ── */}
              <motion.div
                style={{
                  rotateX: outerRingRotateX,
                  transformStyle: "preserve-3d",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-accent/10 border-dashed"
              />

              {/* ── Static inner ring ── */}
              <div className="absolute inset-8 rounded-full border border-accent/20" />

              {/* ── 3D scroll tilt wrapper ── */}
              <motion.div
                style={{
                  rotateX: dishRotateX,
                  transformStyle: "preserve-3d",
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {/* ── Mouse-follow tilt wrapper ── */}
                <motion.div
                  ref={mouseAreaRef}
                  style={{
                    rotateX: tiltY,
                    rotateY: tiltX,
                    transformStyle: "preserve-3d",
                  }}
                  className="relative w-80 h-80 flex items-center justify-center"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {/* Glow disc behind the dish — sits at z=0 */}
                  <div
                    className="absolute inset-0 rounded-full bg-accent/10 blur-2xl"
                    style={{ transform: "translateZ(-20px) scale(1.15)" }}
                  />

                  {/* The dish — elevated toward viewer */}
                  <div
                    className="w-80 h-80 rounded-full overflow-hidden border-4 border-accent/30 shadow-gold-lg animate-float"
                    style={{ transform: "translateZ(50px)" }}
                  >
                    <Image
                      src="https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=600&q=90"
                      alt="Haveli signature momo dish"
                      fill
                      className="object-cover hover:scale-110 transition-transform duration-700"
                      priority
                    />
                  </div>

                  {/* Orbiting dot — small decorative element at Z=30 */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-accent shadow-gold" />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* ── Floating card: Popular — parallaxes faster ── */}
              <motion.div
                initial={{ opacity: 0, x: -40, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ y: card1Y }}
                whileHover={{ scale: 1.05 }}
                className="absolute top-8 left-0 glass rounded-2xl p-4 shadow-card border-gold-glow cursor-default"
              >
                <div className="text-xs text-text-muted mb-1">Most Popular</div>
                <div className="text-sm font-semibold text-text-primary">
                  Chicken Momo Jhol
                </div>
                <div className="text-accent font-bold mt-1">Rs. 150</div>
              </motion.div>

              {/* ── Floating card: Rating — parallaxes slower ── */}
              <motion.div
                initial={{ opacity: 0, x: 40, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{ y: card2Y }}
                whileHover={{ scale: 1.05 }}
                className="absolute bottom-16 right-0 glass rounded-2xl p-4 shadow-card border-gold-glow cursor-default"
              >
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.3 + i * 0.07 }}
                      className="text-accent text-sm"
                    >
                      ★
                    </motion.span>
                  ))}
                </div>
                <div className="text-xs text-text-muted">Customer Rating</div>
                <div className="text-sm font-semibold text-text-primary">4.9 / 5.0</div>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce"
      >
        <span className="text-xs text-text-muted">Scroll</span>
        <ChevronDown size={16} className="text-accent" />
      </motion.div>
    </section>
  );
}
