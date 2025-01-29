export const isProd = process.env.NODE_ENV === "production";
export const isDev = process.env.NODE_ENV === "development";

export const language = process.env.NEXT_PUBLIC_LANGUAGE || "de";
export const locale = language === "de" ? "de_DE" : "en_US";
export const isGerman = language === "de";
export const isEnglish = language === "en";

export const localhost = "http://localhost:3010";