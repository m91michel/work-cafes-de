
export const domainName = "work-cafes.de";
export const baseUrl = `https://${domainName}`;
export const appName = "Work Cafes";

const config = {
    // REQUIRED
    appName: appName,
    // REQUIRED: a short description of your app for SEO tags (can be overwritten)
    appDescription:
      "Find the perfect coworking space for your needs. Discover locations, amenities, and reviews to make your work experience more enjoyable.",
    // REQUIRED (no https://, not trialing slash at the end, just the naked domain)
    domainName: domainName,
    founderName: "Mathias",
    crisp: {
      enabled: false,
      // Crisp website ID. IF YOU DON'T USE CRISP: just remove this => Then add a support email in this config file (mailgun.supportEmail) otherwise customer support won't work.
      id: "9bab3f20-1a2a-4134-9695-02c1667994c3",
      // Hide Crisp by default, except on route "/". Crisp is toggled with <ButtonSupport/>. If you want to show Crisp on every routes, just remove this below
      onlyShowOnRoutes: ["/"],
    },
    stripe: {
      portalUrl: "https://billing.stripe.com/p/login/bIYdUVc87ad72Wc4gg",
      // Create multiple plans in your Stripe dashboard, then add them here. You can add as many plans as you want, just make sure to add the priceId
      plans: [],
    },
    aws: {
      // If you use AWS S3/Cloudfront, put values in here
      bucket: "bucket-name",
      bucketUrl: `https://bucket-name.s3.amazonaws.com/`,
      cdn: "https://cdn-id.cloudfront.net/",
    },
    mailgun: {
      // subdomain to use when sending emails, if you don't have a subdomain, just remove it. Highly recommended to have one (i.e. mg.yourdomain.com or mail.yourdomain.com)
      subdomain: "mg",
      // REQUIRED — Email 'From' field to be used when sending magic login links
      fromNoReply: `${appName} <noreply@mail.${domainName}>`,
      // REQUIRED — Email 'From' field to be used when sending other emails, like abandoned carts, updates etc..
      fromAdmin: `Mathias at ${appName} <mathias@${domainName}>`,
      // Email shown to customer if need support. Leave empty if not needed => if empty, set up Crisp above, otherwise you won't be able to offer customer support."
      supportEmail: `support@${domainName}`,
      // When someone replies to supportEmail sent by the app, forward it to the email below (otherwise it's lost). If you set supportEmail to empty, this will be ignored.
      forwardRepliesTo: "work91michel@gmail.com",
    },
    colors: {
      // REQUIRED — The DaisyUI theme to use (added to the main layout.js). Leave blank for default (light & dark mode). If you any other theme than light/dark, you need to add it in config.tailwind.js in daisyui.themes.
      theme: "black",
      // REQUIRED — This color will be reflected on the whole app outside of the document (loading bar, Chrome tabs, etc..). By default it takes the primary color from your DaisyUI theme (make sure to update your the theme name after "data-theme=")
      // OR you can just do this to use a custom color: main: "#f37055". HEX only.
      main: "#f37055",
      // main: themes["dark"]["primary"],
    },
    auth: {
      // REQUIRED — the path to log in users. It's use to protect private routes (like /dashboard). It's used in apiClient (/libs/api.js) upon 401 errors from our API
      loginUrl: "/signin",
      // REQUIRED — the path you want to redirect users after successful login (i.e. /dashboard, /private). This is normally a private page for users to manage their accounts. It's used in apiClient (/libs/api.js) upon 401 errors from our API & in ButtonSignin.js
      callbackUrl: "/dashboard",
    },
  };
  
  export default config;