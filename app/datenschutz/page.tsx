import { getSEOTags } from "@/libs/seo";
import config from "@/config/config";
import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

// CHATGPT PROMPT TO GENERATE YOUR PRIVACY POLICY — replace with your own data 👇

// 1. Go to https://chat.openai.com/
// 2. Copy paste bellow
// 3. Replace the data with your own (if needed)
// 4. Paste the answer from ChatGPT directly in the <pre> tag below

// You are an excellent lawyer.

// I need your help to write a simple privacy policy for my website. Here is some context:
// - Website: https://shipfa.st
// - Name: ShipFast
// - Description: A JavaScript code boilerplate to help entrepreneurs launch their startups faster
// - User data collected: name, email and payment information
// - Non-personal data collection: web cookies
// - Purpose of Data Collection: Order processing
// - Data sharing: we do not share the data with any other parties
// - Children's Privacy: we do not collect any data from children
// - Updates to the Privacy Policy: users will be updated by email
// - Contact information: marc@shipfa.st

// Please write a simple privacy policy for my site. Add the current date.  Do not add or explain your reasoning. Answer:

export const metadata = getSEOTags({
  title: `Datenschutz | ${config.appName}`,
  description: `Datenschutz für ${config.appName}`,
  canonicalUrlRelative: "/datenschutz",
});

const PrivacyPolicy = () => {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="max-w-7xl mx-auto px-8 py-16 md:py-32">
        <div className="max-w-2xl mx-auto p-5">
          <h1 className="text-3xl font-extrabold pb-6">
            Datenschutz für {config.appName}
          </h1>

          <pre
            className="leading-relaxed whitespace-pre-wrap"
            style={{ fontFamily: "sans-serif" }}
          >
            {`Last Updated: 2024-03-29

Welcome to ${config.appName}!

This Privacy Policy describes how ${config.appName} ("we", "us", or "our") collects, uses, and shares information when you use our website https://${config.domainName} (the "Site") and the ${config.appName} MacOS Application (the "Application"). By accessing or using the Site or Application, you agree to the terms of this Privacy Policy.

Information We Collect

We collect certain information when you use our Site or Application:

Personal Information: When you make a purchase or sign up for our services, we may collect your name, email address, and payment information for order processing purposes.

Non-Personal Information: We may also collect non-personal information through the use of web cookies. This information helps us improve your experience on our Site and Application.

Purpose of Data Collection

We collect your personal information solely for the purpose of order processing and providing you with our services. We do not use your information for any other purposes without your consent.

Data Sharing

We do not share your personal information with any third parties. Your privacy is important to us, and we take all necessary measures to protect your information.

Children's Privacy

We do not knowingly collect any personal information from children under the age of 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us at privacy@${config.domainName}, and we will promptly delete such information from our records.

Updates to the Privacy Policy

We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify users of any material changes to this Privacy Policy by email.

Contact Information

If you have any questions or concerns about our Privacy Policy or our practices regarding your personal information, please contact us at privacy@${config.domainName}.

Thank you for using ${config.appName}!`}
          </pre>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
