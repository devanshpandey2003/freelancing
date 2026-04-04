"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, UtensilsCrossed } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const navLinks = [
  { href: "#menu", label: "Menu" },
  { href: "#about", label: "About" },
  { href: "#featured", label: "Featured" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Smooth scroll-driven background opacity — no re-renders on scroll
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [220, 520], [0, 0.88]);
  const borderOpacity = useTransform(scrollY, [220, 520], [0, 0.15]);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 220);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      {/* Scroll-driven fading background */}
      <motion.div
        className="absolute inset-0 backdrop-blur-md"
        style={{ backgroundColor: "#0a0a0a", opacity: bgOpacity }}
      />
      {/* Scroll-driven bottom border */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ backgroundColor: "#d4a853", opacity: borderOpacity }}
      />

      <nav className="container-section relative z-10 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <motion.div
            whileHover={{ rotate: 18, scale: 1.12 }}
            transition={{ type: "spring", stiffness: 320, damping: 14 }}
            className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center"
          >
            <UtensilsCrossed size={16} className="text-background" />
          </motion.div>
          <span className="font-serif text-xl font-bold text-text-primary group-hover:text-accent transition-colors">
            Haveli
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-text-secondary hover:text-accent transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/menu"
            className="px-5 py-2 rounded-full bg-gradient-gold text-background text-sm font-semibold hover:opacity-90 hover:scale-105 transition-all shadow-gold"
          >
            Order Now
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          id="mobile-menu-btn"
          className="md:hidden text-text-primary p-2"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isMobileOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="block"
              >
                <X size={24} />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="block"
              >
                <Menu size={24} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden relative z-10 bg-background/95 backdrop-blur-md border-t border-border overflow-hidden"
          >
            <ul className="flex flex-col gap-4 px-6 py-4">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-accent transition-colors"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navLinks.length * 0.06 }}
              >
                <Link
                  href="/menu"
                  className="block text-center px-5 py-2 rounded-full bg-gradient-gold text-background text-sm font-semibold"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Order Now
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
