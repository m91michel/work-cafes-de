const { createClient } = require('@supabase/supabase-js');

/** @type {import('next-sitemap').IConfig} */
// docs: https://www.npmjs.com/package/next-sitemap

const isGerman = process.env.NEXT_PUBLIC_LANGUAGE === "de";
const fallbackUrl = isGerman ? "https://cafezumarbeiten.de" : "https://awifi.place";
const siteUrl = process.env.SITE_URL || fallbackUrl;

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const excludeLocaleSpecificRoutes = isGerman
  ? ["/privacy", "/imprint", "/about", "/help-us"]
  : ["/datenschutz", "/impressum", "/ueber-uns", "/helfe-uns"];

module.exports = {
  // REQUIRED: add your own domain name here
  siteUrl,
  generateRobotsTxt: true,
  // use this to exclude routes from the sitemap (i.e. a user dashboard). By default, NextJS app router metadata files are excluded (https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
  exclude: [
    "/twitter-image.*",
    "/opengraph-image.*",
    "/apple-icon.*",
    "/icon.*",
    "/server-sitemap.xml",
    "/manifest*",
    "/signin",
    "/api/*",
    "/unsubscribe",
    "/app/*",
    "/dashboard",
    "/dashboard/*",
    ...excludeLocaleSpecificRoutes,
  ],
  // robotsTxtOptions: {
  //   additionalSitemaps: [
  //     `${siteUrl}/server-sitemap.xml`, // generated sitemap for all videos
  //   ],
  // },
  additionalPaths: async (config) => {
    const paths = [];
    const pageSize = 1000;
    let offset = 0;

    while (true) {
      const { data: cafes, error } = await supabase
        .from('cafes')
        .select('slug, updated_at')
        .range(offset, offset + pageSize - 1);

      if (error) {
        console.error('Error fetching cafes:', error);
        break;
      }

      if (!cafes || cafes.length === 0) {
        break;
      }

      // Add cafe paths
      cafes.forEach((cafe) => {
        paths.push({
          loc: `/cafes/${cafe.slug}`,
          lastmod: cafe.updated_at,
          changefreq: 'weekly',
          priority: 0.7,
        });
      });

      if (cafes.length < pageSize) {
        break;
      }

      offset += pageSize;
    }

    console.log(`Generated sitemap with ${paths.length} cafe entries`);
    return paths;
  },
};
