import Image from "next/image";
import Link from "next/link";

const posts = [
  {
    id: "post-1",
    tag: "Recipe",
    title: "The Perfect Momo: Secrets from Our Kitchen",
    excerpt:
      "From dough to filling, discover the techniques that make our momos the most loved dish on our menu.",
    image:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500&q=80",
    date: "March 20, 2025",
    readTime: "4 min read",
  },
  {
    id: "post-2",
    tag: "Culture",
    title: "Thukpa: Nepal's Soul-Warming Noodle Soup",
    excerpt:
      "The story behind Thukpa and why it remains Nepal's most comforting dish through every season.",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80",
    date: "February 12, 2025",
    readTime: "5 min read",
  },
  {
    id: "post-3",
    tag: "Guide",
    title: "Timeless Recipes to Savour & Enjoy at Home",
    excerpt:
      "Our chef shares some of Haveli's beloved recipes that you can recreate at home for friends and family.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80",
    date: "January 5, 2025",
    readTime: "6 min read",
  },
];

export default function BlogSection() {
  return (
    <section id="blog" className="py-24 bg-surface">
      <div className="container-section">
        {/* Header */}
        <div className="flex items-end justify-between gap-4 mb-16 flex-wrap">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-accent" />
              <span className="text-accent text-sm font-medium uppercase tracking-widest">
                Blog
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-text-primary">
              Restaurant Blog & Update
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-accent hover:text-accent-light transition-colors text-sm font-medium group flex items-center gap-2"
          >
            View All
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Blog grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article
              key={post.id}
              id={post.id}
              className="group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 border-gold-glow">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Meta */}
              <div className="flex items-center gap-3 mb-3">
                <span className="px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-medium">
                  {post.tag}
                </span>
                <span className="text-text-muted text-xs">{post.date}</span>
                <span className="text-text-muted text-xs">·</span>
                <span className="text-text-muted text-xs">{post.readTime}</span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl font-bold text-text-primary group-hover:text-accent transition-colors mb-2 leading-snug">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>
            </article>
          ))}
        </div>

        {/* Bottom hero image */}
        <div className="mt-20 relative aspect-[21/9] rounded-3xl overflow-hidden border-gold-glow">
          <Image
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=90"
            alt="Haveli restaurant interior"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container-section">
              <p className="text-accent text-sm font-medium mb-2">Haveli Experience</p>
              <h3 className="font-serif text-4xl font-bold text-text-primary max-w-sm">
                Timeless Recipes to Savour & Enjoy
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
