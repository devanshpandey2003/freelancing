import { Suspense } from "react";
import MenuPageClient from "@/components/menu/MenuPageClient";

export const metadata = {
  title: "Menu — Haveli Restaurant",
  description: "Browse our full menu and order from your table",
};

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }
    >
      <MenuPageClient />
    </Suspense>
  );
}
