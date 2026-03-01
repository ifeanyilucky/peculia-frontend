import { HELP_CATEGORIES, HELP_ARTICLES } from "@/constants/help-data";
import { ArticleLayout } from "@/components/help/ArticleLayout";
import { notFound } from "next/navigation";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ audience: string; category: string; slug: string }>;
}) {
  const { audience, category: categorySlug, slug } = await params;

  const article = HELP_ARTICLES.find(
    (art) => art.slug === slug && art.audience === audience,
  );

  const category = HELP_CATEGORIES.find((cat) => cat.slug === categorySlug);

  if (!article || !category) {
    return notFound();
  }

  return (
    <ArticleLayout article={article} category={category}>
      <div className="space-y-6">
        <p className="text-xl text-muted-foreground leading-relaxed">
          This is a detailed guide on <strong>{article.title}</strong>. Our
          platform is designed to make this process as smooth as possible for
          both clients and professionals.
        </p>

        <h2 id="overview">Overview</h2>
        <p>
          Regardless of whether you are a new user or a seasoned professional,
          understanding how Peculia handles
          {category.title.toLowerCase()} is key to a great experience. This
          article covers the essential steps and internal policies that govern
          this feature.
        </p>

        <h2 id="key-steps">Key Steps</h2>
        <ol className="list-decimal pl-6 space-y-4">
          <li>Navigate to your dashboard and locate the relevant section.</li>
          <li>
            Select the option corresponding to {article.title.toLowerCase()}.
          </li>
          <li>Review the information provided and confirm your changes.</li>
          <li>
            Wait for the confirmation notification to appear on your screen.
          </li>
        </ol>

        <div className="rounded-xl bg-muted p-8 my-12 border-l-4 border-primary">
          <p className="font-bold text-lg mb-2">Pro Tip:</p>
          <p className="text-muted-foreground">
            Always double-check your notification settings to ensure you receive
            real-time updates about your bookings and account activity.
          </p>
        </div>

        <h2 id="troubleshooting">Troubleshooting</h2>
        <p>
          If you encounter any issues during this process, try refreshing your
          page or checking your internet connection. Most common errors are
          resolved by ensuring your profile information is up to date.
        </p>

        <h2 id="next-steps">Next Steps</h2>
        <p>
          Once you've completed this, you might want to check out related
          articles in the
          <strong> {category.title}</strong> category to further optimize your
          workflow.
        </p>
      </div>
    </ArticleLayout>
  );
}
