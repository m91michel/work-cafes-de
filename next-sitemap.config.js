/** @type {import('next-sitemap').IConfig} */
// docs: https://www.npmjs.com/package/next-sitemap

const siteUrl = process.env.SITE_URL || "https://cafezumarbeiten.de";

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
    "/dashboard/*",
  ],
  // robotsTxtOptions: {
  //   additionalSitemaps: [
  //     `${siteUrl}/server-sitemap.xml`, // generated sitemap for all videos
  //   ],
  // },
};
