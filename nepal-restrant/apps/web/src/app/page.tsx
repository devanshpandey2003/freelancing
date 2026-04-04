import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import CategoryGrid from "@/components/landing/CategoryGrid";
import FeaturedDishes from "@/components/landing/FeaturedDishes";
import ChefSection from "@/components/landing/ChefSection";
import BlogSection from "@/components/landing/BlogSection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <CategoryGrid />
      <FeaturedDishes />
      <ChefSection />
      <BlogSection />
      <Footer />
    </main>
  );
}
