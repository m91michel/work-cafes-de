import { Cafe } from "@/libs/types";
import { parseUrls } from "@/libs/utils";
import { FacebookIcon, GlobeIcon, InstagramIcon, YoutubeIcon } from "lucide-react";
import Link from "next/link";

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
        {link}
      </Link>
    </li>
  );
}

function getLinkType(link: string) {
  if (link.includes("instagram")) {
    return "instagram";
  } else if (link.includes("tiktok")) {
    return "tiktok";
  } else if (link.includes("facebook")) {
    return "facebook";
  } else if (link.includes("youtube")) {
    return "youtube";
  } else if (link.includes("tripadvisor")) {
    return "tripadvisor";
  } else if (link.includes("yelp")) {
    return "yelp";
  } else if (link.includes("pinterest")) {
    return "pinterest";
  } else {
    return "website";
  }
}

function getLinkIcon(type: string, className?: string) {
  switch (type) {
    case "instagram":
      return <InstagramIcon className={className} />;
    case "tiktok":
      return <FacebookIcon className={className} />;
    case "facebook":
      return <FacebookIcon className={className} />;
    case "youtube":
      return <YoutubeIcon className={className} />;
    default:
      return <GlobeIcon className={className} />;
  }
}