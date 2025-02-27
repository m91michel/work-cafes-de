import { TransHighlight } from "@/components/general/translation";
import { isGerman } from "@/libs/environment";
import Image from "next/image";

export function FeaturedSection() {
  if (isGerman) {
    return null;
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 mb-12">
      <h2 className="text-2xl font-bold mb-4 text-center">
        <TransHighlight i18nKey="featured.title" namespace="home" />
      </h2>
      <div className="flex justify-center gap-4 flex-wrap">
        <a href="https://twelve.tools" target="_blank">
          <Image
            src="https://twelve.tools/badge0-white.svg"
            alt="Featured on Twelve Tools"
            width="200"
            height="54"
          />
        </a>
        <a href="https://indievoice.app" target="_blank">
          <Image
            src="/images/featured/indie-voice.png"
            alt="IndieVoice Embed Badge"
            width="250"
            height="60"
            style={{
              imageRendering: "-webkit-optimize-contrast",
            }}
          />
        </a>
        <a
          href="https://startupfa.me/s/a-wifiplace?utm_source=awifi.place"
          target="_blank"
        >
          <Image
            src="https://startupfa.me/badges/featured-badge.webp"
            alt="A Wifi.Place - Find work-friendly cafes in your city | Startup Fame"
            width="171"
            height="54"
          />
        </a>
        <a href="https://dang.ai/" target="_blank">
          <Image
            src="https://cdn.prod.website-files.com/63d8afd87da01fb58ea3fbcb/6487e2868c6c8f93b4828827_dang-badge.png"
            alt="Dang.ai"
            style={{
              width: "150px",
              height: "54px",
            }}
            width="150"
            height="54"
          />
        </a>
      </div>
    </section>
  );
}
