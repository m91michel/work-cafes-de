import { isGerman } from "@/libs/environment";
import { Cafe, City, TranslationProps } from "@/libs/types";
import { TransHighlight } from "../../general/translation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Paths from "@/libs/paths";

interface StudyCityAboutProps extends TranslationProps {
  city: City;
  cafes: Cafe[];
}

export function StudyCityAbout({ city, cafes, t }: StudyCityAboutProps) {
  const name = isGerman ? city.name_de : city.name_en;
  const cityName = name || city.slug || "";
  const description = isGerman
    ? city.description_long_de
    : city.description_long_en;

  if (!description) {
    return null;
  }

  const uniqueCafeNames = [...new Set(cafes.map((cafe) => cafe.name))];
  const cafeName1 = uniqueCafeNames[0];
  const cafeName2 = uniqueCafeNames[1] || cafeName1;
  const cafeName3 = uniqueCafeNames[2] || cafeName2;
  const cafeName4 = uniqueCafeNames[3] || cafeName3;

  const tObject = (key: string) => {
    return t(`about.${key}`, { returnObjects: true }) as string[];
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold mb-4">
        <TransHighlight
          i18nKey="about.title"
          values={{ name: cityName }}
          namespace="study"
        />
      </h2>

      <div className="flex flex-col gap-4">
        <StudyAboutItem title={t("about.about_title", { name: cityName })}>
          {description}
        </StudyAboutItem>

        <StudyAboutItem
          title={t("about.study_culture_title", { name: cityName })}
        >
          {t("about.study_culture_description", {
            name: cityName,
            cafeName1: cafeName1 || "Study Cafe 1",
            cafeName2: cafeName2 || "Study Cafe 2",
            cafeName3: cafeName3 || "Study Cafe 3",
            cafeName4: cafeName4 || "Study Cafe 4",
          })}
        </StudyAboutItem>

        <StudyAboutItem title={t("about.wifi_title")}>
          {t("about.wifi_description")}
        </StudyAboutItem>

        <StudyAboutItem title={t("about.etiquette_title")}>
          <ul className="list-disc list-inside text-xl text-muted-foreground">
            {tObject("etiquette_items").map((_, index) => (
              <li key={index}>
                <TransHighlight
                  i18nKey={`about.etiquette_items.${index}`}
                  namespace="study"
                />
              </li>
            ))}
          </ul>
        </StudyAboutItem>

        <StudyAboutItem title={t("about.report_cafe_title")}>
          <div className="text-xl text-muted-foreground">
            <p className="mb-4">{t("about.report_cafe_description")}</p>
            <ul className="list-disc list-inside mb-4">
              {tObject("report_cafe_reasons").map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>
        </StudyAboutItem>

        <StudyAboutItem title={t("about.suggest_cafe_title")}>
          <div className="text-xl text-muted-foreground">
            <p className="mb-4">
              {t("about.suggest_cafe_description", { name: cityName })}
            </p>
            <ul className="list-disc list-inside mb-4">
              {tObject("suggest_cafe_requirements").map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
            <div className="mt-4">
              <Button variant="default">
                <Link href={Paths.submitCafe}>
                  <TransHighlight
                    i18nKey="about.suggest_cafe_button"
                    namespace="study"
                  />
                </Link>
              </Button>
            </div>
          </div>
        </StudyAboutItem>
      </div>
    </section>
  );
}

type StudyAboutItemProps = {
  title: string;
  children: React.ReactNode | React.ReactNode[];
};

function StudyAboutItem({ title, children }: StudyAboutItemProps) {
  const content =
    typeof children == "string" ? <ContentItem string={children} /> : children;
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl font-bold">{title}</h3>
      {content}
    </div>
  );
}

function ContentItem({ string }: { string: string }) {
  return <p className="text-xl text-muted-foreground">{string}</p>;
} 