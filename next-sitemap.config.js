/** @type {import('next-sitemap').IConfig} */
// docs: https://www.npmjs.com/package/next-sitemap

const isGerman = process.env.NEXT_PUBLIC_LANGUAGE === "de";
const fallbackUrl = isGerman ? "https://cafezumarbeiten.de" : "https://awifi.place";
const siteUrl = process.env.SITE_URL || fallbackUrl;

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
};
