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
  static submitCafe = "/cafes/submit";
  static bestStudy = "/best-study-places";

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

  
  // Dynamic paths
  static country(name?: string | null) {
    if (!name) {
      return Paths.cities;
    }
    return `/cities?country=${encodeURIComponent(name)}`;
  }
  static cafe(slug?: string | null) {
    if (!slug) {
      return Paths.cafes;
    }
    return `/cafes/${slug}`;
  }

  static city(slug?: string | null) {
    if (!slug) {
      return Paths.cities;
    }
    return `/cities/${slug}`;
  }

  static cafeReport(slug?: string | null, name?: string | null) {
    const params = new URLSearchParams();
    if (slug) {
      params.set('slug', slug);
    }
    if (name) {
      params.set('name', name);
    }
    return `/cafes/report?${params.toString()}`;
  }

  static studyCity(slug?: string | null) {
    if (!slug) {
      return Paths.bestStudy;
    }
    return `${Paths.bestStudy}/in/${slug}`;
  }

  static cafeEdit(slug?: string | null) {
    if (!slug) {
      return Paths.cafes;
    }
    return `/cafes/${slug}/edit`;
  }
}

export default Paths; 