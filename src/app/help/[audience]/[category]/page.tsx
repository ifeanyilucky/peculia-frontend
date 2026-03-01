import { HELP_CATEGORIES, HELP_ARTICLES } from "@/constants/help-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ audience: string; category: string }>;
}) {
  const { audience, category: categorySlug } = await params;

  const category = HELP_CATEGORIES.find(
    (cat) => cat.slug === categorySlug && cat.audience === audience,
  );

  if (!category) {
    return notFound();
  }

  const articles = HELP_ARTICLES.filter(
    (art) => art.categoryId === category.id,
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12">
        <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/help" className="hover:text-primary transition-colors">
            Support
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/help/${audience}`}
            className="capitalize hover:text-primary transition-colors"
          >
            {audience}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-foreground">{category.title}</span>
        </nav>

        <header className="mb-16">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {category.title}
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            {category.description}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/help/${audience}/${categorySlug}/${article.slug}`}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{article.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    Updated {article.lastUpdated}
                  </p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}

          {articles.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center">
              <p className="text-lg text-muted-foreground">
                No articles in this category yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
