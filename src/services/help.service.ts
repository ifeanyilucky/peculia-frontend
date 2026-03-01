const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const helpService = {
  async getCategories(audience?: string) {
    const url = new URL(`${BASE_URL}/help/categories`);
    if (audience) url.searchParams.append("audience", audience);

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    const json = await res.json();
    return json.data || [];
  },

  async getArticlesByCategory(categoryId: string, audience?: string) {
    const url = new URL(`${BASE_URL}/help/categories/${categoryId}/articles`);
    if (audience) url.searchParams.append("audience", audience);

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    const json = await res.json();
    return json.data || [];
  },

  async getArticleBySlug(slug: string, audience?: string) {
    const url = new URL(`${BASE_URL}/help/articles/${slug}`);
    if (audience) url.searchParams.append("audience", audience);

    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    const json = await res.json();
    return json.data;
  },

  async searchArticles(query: string, audience?: string) {
    const url = new URL(`${BASE_URL}/help/articles/search`);
    url.searchParams.append("q", query);
    if (audience) url.searchParams.append("audience", audience);

    const res = await fetch(url.toString());
    const json = await res.json();
    return json.data || [];
  },
};
