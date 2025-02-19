"use client";

import { Trans as TransComponent } from "react-i18next";
import { Gradient } from "./gradient";
import { ComponentProps } from "react";

type Props = {
  i18nKey: string;
  values?: Record<string, string>;
  namespace?: string;
};
export const TransHighlight = ({ i18nKey, values, namespace }: Props) => {
  return (
    <TransComponent
      i18nKey={i18nKey}
      values={values}
      ns={namespace}
      components={{
        highlight: <Gradient />,
      }}
    />
  );
};

export const Trans = (props: ComponentProps<typeof TransComponent>) => {
  return <TransComponent {...props} />;
};
