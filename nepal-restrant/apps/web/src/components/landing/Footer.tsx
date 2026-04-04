import Link from "next/link";
import { UtensilsCrossed, MapPin, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react";

const footerLinks = {
  Menu: [
    { label: "Soups & Thukpa", href: "/menu?category=Soup" },
    { label: "Chicken Dishes", href: "/menu?category=Chicken" },
    { label: "Momos", href: "/menu?category=Chicken+Momo" },
    { label: "Veg Items", href: "/menu?category=Veg+Items" },
    { label: "Drinks", href: "/menu?category=Soft+Drinks" },
  ],
  "Quick Links": [
    { label: "About Us", href: "#about" },
    { label: "Blog", href: "#blog" },
    { label: "Order Online", href: "/menu" },
    { label: "Admin Panel", href: "/admin" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-black border-t border-border">
      <div className="container-section py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-5 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full bg-gradient-gold flex items-center justify-center">
                <UtensilsCrossed size={18} className="text-background" />
              </div>
              <span className="font-serif text-2xl font-bold text-text-primary group-hover:text-accent transition-colors">
                Haveli
              </span>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed">
              Authentic Himalayan and Nepali cuisine crafted with tradition,
              love, and the finest ingredients.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-text-muted hover:text-accent hover:border-accent transition-colors"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="space-y-5">
              <h4 className="text-text-primary font-semibold text-sm uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-text-muted text-sm hover:text-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="space-y-5">
            <h4 className="text-text-primary font-semibold text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-4">
              {[
                {
                  icon: MapPin,
                  text: "Haveli Restaurant, Kathmandu, Nepal",
                },
                { icon: Phone, text: "+977 98XXXXXXXX" },
                { icon: Mail, text: "hello@haveli.com.np" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <Icon size={16} className="text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-text-muted text-sm">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Gold divider */}
        <div className="gold-divider my-12" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <span>© {currentYear} Haveli Restaurant. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
