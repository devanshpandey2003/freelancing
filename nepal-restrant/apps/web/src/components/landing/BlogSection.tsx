"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const posts = [
  {
    id: "post-1",
    tag: "Recipe",
    title: "The Perfect Momo: Secrets from Our Kitchen",
    excerpt:
      "From dough to filling, discover the techniques that make our momos the most loved dish on our menu.",
    image: "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=500&q=80",
    date: "March 20, 2025",
    readTime: "4 min read",
  },
  {
    id: "post-2",
    tag: "Culture",
    title: "Thukpa: Nepal's Soul-Warming Noodle Soup",
    excerpt:
      "The story behind Thukpa and why it remains Nepal's most comforting dish through every season.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80",
    date: "February 12, 2025",
    readTime: "5 min read",
  },
  {
    id: "post-3",
    tag: "Guide",
    title: "Timeless Recipes to Savour & Enjoy at Home",
    excerpt:
      "Our chef shares some of Haveli's beloved recipes that you can recreate at home for friends and family.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=500&q=80",
    date: "January 5, 2025",
    readTime: "6 min read",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.13, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function BlogSection() {
  return (
    <section id="blog" className="py-24 bg-surface">
      <div className="container-section">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-end justify-between gap-4 mb-16 flex-wrap"
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
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              →
            </motion.span>
          </Link>
        </motion.div>

        {/* Blog grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              id={post.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 border-gold-glow">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-600 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-background/20 group-hover:bg-transparent transition-colors duration-300" />
                {/* Gold shimmer overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-accent/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
              <h3 className="font-serif text-xl font-bold text-text-primary group-hover:text-accent transition-colors duration-300 mb-2 leading-snug">
                {post.title}
              </h3>

              {/* Excerpt */}
              <p className="text-text-muted text-sm leading-relaxed line-clamp-2">
                {post.excerpt}
              </p>

              {/* Read more arrow */}
              <div className="mt-4 flex items-center gap-2 text-accent text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span>Read more</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  →
                </motion.span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Bottom banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-20 relative aspect-[21/9] rounded-3xl overflow-hidden border-gold-glow group"
        >
          <Image
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=90"
            alt="Haveli restaurant interior"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="container-section"
            >
              <p className="text-accent text-sm font-medium mb-2">Haveli Experience</p>
              <h3 className="font-serif text-4xl font-bold text-text-primary max-w-sm">
                Timeless Recipes to Savour & Enjoy
              </h3>
              <Link
                href="/menu"
                className="mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-full bg-gradient-gold text-background font-semibold text-sm hover:opacity-90 hover:scale-105 transition-all shadow-gold"
              >
                Explore Menu
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
