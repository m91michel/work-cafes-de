import { Cafe } from "@/libs/types";
import { parseUrls } from "@/libs/utils";
import { GlobeIcon } from "lucide-react";
import Link from "next/link";
import { SiFacebook, SiInstagram, SiTiktok, SiTripadvisor, SiYelp, SiYoutube } from "@icons-pack/react-simple-icons";

type Props = {
  cafe: Cafe;
};

export function CafeLinks({ cafe }: Props) {
  const links = parseUrls(cafe.links || "");

  return (
    <ul>
      {links.map((link) => (
        <CafeLink key={link} link={link} />
      ))}
    </ul>
  );
}

export function CafeLink({ link }: { link: string }) {
  const external = link.startsWith("http");
  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const type = getLinkType(link);
  const icon = getLinkIcon(type, "w-4 h-4");

  return (
    <li key={link}>
      <Link href={link} {...externalProps} className="flex items-center gap-2">
        {icon}
        {formatLinkName(link)}
      </Link>
    </li>
  );
}

function getLinkType(link: string) {
  if (link.includes("instagram")) {
    return "instagram";
  } else if (link.includes("tripadvisor")) {
    return "tripadvisor";
  } else if (link.includes("yelp")) {
    return "yelp";
  } else if (link.includes("facebook")) {
    return "facebook";
  } else if (link.includes("tiktok")) {
    return "tiktok";
  } else if (link.includes("youtube")) {
    return "youtube";
  } else if (link.includes("pinterest")) {
    return "pinterest";
  } else {
    return "website";
  }
}

function formatLinkName(link: string) {
  if (link.includes("instagram")) {
    const handle = link.split("instagram.com/")[1];
    return `@${handle.replace("/", "")}`;
  } else if (link.includes("facebook")) {
    const handle = link.split("facebook.com/")[1];
    return `@${handle}`;
  }

  return link
    .replace(/https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, ""); // keeping the trailing slash removal
}

function getLinkIcon(type: string, className?: string) {
  switch (type) {
    case "instagram":
      return <SiInstagram className={className} />;
    case "tripadvisor":
      return <SiTripadvisor className={className} />;
    case "yelp":
      return <SiYelp className={className} />;
    case "facebook":
      return <SiFacebook className={className} />;
    case "tiktok":
      return <SiTiktok className={className} />;
    case "youtube":
      return <SiYoutube className={className} />;
    default:
      return <GlobeIcon className={className} />;
  }
}