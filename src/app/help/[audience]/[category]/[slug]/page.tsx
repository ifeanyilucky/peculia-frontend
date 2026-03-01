import { helpService } from "@/services/help.service";
import { ArticleLayout } from "@/components/help/ArticleLayout";
import { notFound } from "next/navigation";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ audience: string; category: string; slug: string }>;
}) {
  const { audience, slug } = await params;

  const article = await helpService.getArticleBySlug(slug, audience);

  if (!article) {
    return notFound();
  }

  // Ensure category matches for breadcrumbs
  const category = article.categoryId;

  return (
    <ArticleLayout
      article={{
        ...article,
        lastUpdated: new Date(article.lastUpdated).toLocaleDateString(),
      }}
      category={category}
    >
      <div
        className="space-y-6 article-content"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </ArticleLayout>
  );
}
