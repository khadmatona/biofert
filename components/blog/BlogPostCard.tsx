import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/types";

export function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.handle}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-cream">
        <Image
          src={post.image.src}
          alt={post.image.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute start-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink">
          {post.category}
        </span>
        <span className="absolute bottom-3 end-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-medium text-cream">
          {post.readingTime}
        </span>
      </div>
      <h3 className="font-display text-base font-medium leading-snug">
        {post.title}
      </h3>
      <p className="text-xs text-ink/60">{post.excerpt}</p>
    </Link>
  );
}
