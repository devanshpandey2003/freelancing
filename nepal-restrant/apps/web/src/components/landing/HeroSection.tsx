"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden bg-background"
    >
      {/* Background layers */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      {/* Gold ambient glow */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-accent/5 blur-3xl pointer-events-none" />

      <div className="container-section relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="space-y-8 animate-fade-up">
            <div className="flex items-center gap-3">
              <div className="h-px w-12 bg-accent" />
              <span className="text-accent text-sm font-medium uppercase tracking-widest">
                Fine Dining Experience
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Delicious Food &{" "}
              <span className="text-gradient-gold">Wonderful</span> Eating
              Experience
            </h1>

            <p className="text-text-muted text-lg max-w-md leading-relaxed">
              Immerse yourself in the rich flavors of authentic Nepali and
              Himalayan cuisine. Every dish tells a story of tradition and
              love for food.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/menu"
                id="hero-order-btn"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-gold text-background font-semibold hover:opacity-90 transition-all hover:shadow-gold-lg hover:scale-105 active:scale-95"
              >
                Order Now
              </Link>
              <Link
                href="#featured"
                id="hero-explore-btn"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-accent/40 text-text-primary font-semibold hover:border-accent hover:bg-accent/10 transition-all"
              >
                Explore Menu
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4">
              {[
                { value: "5+", label: "Years Serving" },
                { value: "80+", label: "Menu Items" },
                { value: "5★", label: "Rated" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-serif text-2xl font-bold text-accent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-text-muted mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Food imagery */}
          <div className="relative hidden lg:block animate-fade-in">
            <div className="relative w-full aspect-square max-w-xl ml-auto">
              {/* Main dish */}
              <div className="absolute inset-8 rounded-full border border-accent/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-80 h-80 rounded-full overflow-hidden border-4 border-accent/30 shadow-gold-lg animate-float">
                  <Image
                    src="https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=600&q=90"
                    alt="Haveli signature momo dish"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>

              {/* Floating card: Popular */}
              <div className="absolute top-8 left-0 glass rounded-2xl p-4 shadow-card animate-slide-in-left border-gold-glow">
                <div className="text-xs text-text-muted mb-1">Most Popular</div>
                <div className="text-sm font-semibold text-text-primary">Chicken Momo Jhol</div>
                <div className="text-accent font-bold mt-1">Rs. 150</div>
              </div>

              {/* Floating card: Rating */}
              <div className="absolute bottom-16 right-0 glass rounded-2xl p-4 shadow-card animate-slide-in-right border-gold-glow">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-accent text-sm">★</span>
                  ))}
                </div>
                <div className="text-xs text-text-muted">Customer Rating</div>
                <div className="text-sm font-semibold text-text-primary">4.9 / 5.0</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs text-text-muted">Scroll</span>
        <ChevronDown size={16} className="text-accent" />
      </div>
    </section>
  );
}
