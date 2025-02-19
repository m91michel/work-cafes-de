import { Card } from "@/components/ui/card";
import { Clock, ExternalLink, LinkIcon, MapPin, Utensils, Coffee, LaptopMinimalCheck, ContactRound } from "lucide-react";
import { Cafe } from "@/libs/types";
import { CafeLinks } from "../links";
import { directionLink } from "@/libs/google-maps";
import { TranslationProps } from "@/libs/types";
import { MLink } from "../../general/link";
import { isGerman } from "@/libs/environment";

interface CafeDetailsProps extends TranslationProps {
  cafe: Cafe;
}

export function CafeDetails({ cafe, t }: CafeDetailsProps) {
  const openingHours = cafe.open_hours?.split("\n").map((hours, index) => (
    <div key={index} className="text-sm">
      {hours}
      {hours.length == 0 && <br />}
    </div>
  ));
  const googleMapsLink = directionLink(cafe.name, cafe.google_place_id);

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-6">{t("details.title")}</h2>

      <div className="grid gap-6">
        <ContentItem
          title={t("details.about.title")}
          icon={<ContactRound className="h-5 w-5 text-muted-foreground mt-1" />}
        >
          {getContent(cafe.about_content) || t("details.about.no_content")}
        </ContentItem>

        <ContentItem
          title={t("details.food.title")}
          icon={<Utensils className="h-5 w-5 text-muted-foreground mt-1" />}
        >
          {getContent(cafe.food_contents) || t("details.food.no_content")}
        </ContentItem>

        <ContentItem
          title={t("details.drinks.title")}
          icon={<Coffee className="h-5 w-5 text-muted-foreground mt-1" />}
        >
          {getContent(cafe.drinks_content) || t("details.drinks.no_content")}
        </ContentItem>

        <ContentItem
          title={t("details.work_friendly.title")}
          icon={<LaptopMinimalCheck className="h-5 w-5 text-muted-foreground mt-1" />}
        >
          {getContent(cafe.work_friendly_content) ||
            t("details.work_friendly.no_content")}
        </ContentItem>

        <ContentItem
          title={t("details.hours.title")}
          icon={<Clock className="h-5 w-5 text-muted-foreground mt-1" />}
        >
          {openingHours || t("details.hours.no_content")}
        </ContentItem>

        <ContentItem
          title={t("details.address")}
          icon={<MapPin className="h-5 w-5 text-muted-foreground mt-1" />}
        >
          <p className="text-muted-foreground">
          {cafe.address}{" "}
              <MLink
                href={googleMapsLink}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                {t("details.directions")}{" "}
              <ExternalLink className="w-4 h-4 inline" />
            </MLink>
          </p>
        </ContentItem>

        <ContentItem
          title={t("details.links")}
          icon={<LinkIcon className="h-5 w-5 text-muted-foreground mt-1" />}
        >
          <CafeLinks cafe={cafe} />
        </ContentItem>
      </div>
    </Card>
  );
}

type ContentItemProps = {
  title: string;
  icon: React.ReactNode;
  children?: string | React.ReactNode;
};

function ContentItem({ title, children, icon }: ContentItemProps) {
  const content = typeof children === "string" ? <p className="text-muted-foreground">{children}</p> : children;

  return (
    <div className="flex items-start gap-3">
      <div className="w-5">{icon}</div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        {content}
      </div>
    </div>
  );
}

function getContent(contentObject?: any) {
  if (!contentObject) {
    return null;
  }

  const content = isGerman
    ? contentObject?.["de" as string]
    : contentObject?.["en" as string];

  if (content === "NO_INFO") {
    return null;
  }
  return content;
}
