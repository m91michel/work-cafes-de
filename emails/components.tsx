import config, { appName, domainName } from "@/config/config";
import { emailStyle } from "./email-styling";
import { Hr, Link, Text } from "@react-email/components";


const baseUrl = `https://${domainName}`; // replace with local host when testing locally

export const FounderName = ({ utmTags }: { utmTags: string }) => {
  const appLink = `${baseUrl}${utmTags}`;
  return (
    <Text style={emailStyle.paragraph}>
      — {config.founderName} from{" "}
      <Link href={appLink} style={emailStyle.anchor}>
        {appName}
      </Link>
    </Text>
  );
};

export const Footer = () => {
  return (
    <>
      <Hr style={emailStyle.hr} />
      <Text style={emailStyle.footer}>
        Feel free to reply to this email if you have any questions.
      </Text>
    </>
  );
};