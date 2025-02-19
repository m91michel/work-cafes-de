import { isGerman } from "./environment";

type PathConfig = {
  de: string;
  en: string;
};

class Paths {
  private static getPath(config: PathConfig): string {
    return isGerman ? config.de : config.en;
  }

  // Static paths (same in both languages)
  static home = "/";
  static cafes = "/cafes";
  static cities = "/cities";
  static suggestCity = "/cities/suggest";
  static roadmap = "/roadmap";

  // Localized paths
  static about = Paths.getPath({
    de: "/ueber-uns",
    en: "/about",
  });

  static contribute = Paths.getPath({
    de: "/helfe-uns",
    en: "/contribute",
  });

  static privacy = Paths.getPath({
    de: "/datenschutz",
    en: "/privacy",
  });

  static imprint = Paths.getPath({
    de: "/impressum",
    en: "/imprint",
  });

  static country(name: string) {
    return `/cities?country=${encodeURIComponent(name)}`;
  }

  // Dynamic paths
  static cafe(slug: string) {
    return `/cafes/${slug}`;
  }

  static city(slug: string) {
    return `/cities/${slug}`;
  }
}

export default Paths; 