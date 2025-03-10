"use client";

import React, { PropsWithChildren } from "react";
import { I18nextProvider } from "react-i18next";
import { createInstance } from "i18next";
import initTranslations from "@/libs/i18n/config";

interface TranslationProviderProps {
  locale: string;
  namespaces: string[];
  resources: any;
}

const TranslationProvider = React.memo<
  PropsWithChildren<TranslationProviderProps>
>(({ children, locale, namespaces, resources }) => {
  const i18n = createInstance();

  initTranslations(namespaces, locale, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
});

TranslationProvider.displayName = "TranslationProvider";

export default TranslationProvider;
