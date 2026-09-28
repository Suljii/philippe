import type { APIRoute } from "astro";
import { sanityClient } from "../lib/sanity";

// SSR : le sitemap inclut toujours les galeries à jour (contenu CMS).
export const prerender = false;

export const GET: APIRoute = async ({ site }) => {
  const base = (site?.href ?? "https://philippemuraro.fr/").replace(/\/$/, "");

  // Galeries de premier niveau (pages canoniques navigables)
  const galeries: { slug?: string }[] = await sanityClient.fetch(
    `*[_type == "galerie" && !defined(parent) && defined(slug.current)]{ "slug": slug.current }`,
  );

  const paths = [
    "/",
    "/galeries",
    "/textimages",
    "/bio",
    "/contact",
    "/mentions-legales",
    "/confidentialite",
    ...galeries.map((g) => `/galeries/${g.slug}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((p) => `  <url><loc>${base}${p}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
