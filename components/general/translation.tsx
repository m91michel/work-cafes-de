"use client";

import { Trans as TransComponent } from "react-i18next";
import { Gradient } from "./gradient";
import { ComponentProps } from "react";

type Props = {
  i18nKey: string;
  values?: Record<string, string | number>;
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
        br: <br />,
        mdBr: <br className="hidden md:inline" />,
        lgBr: <br className="hidden lg:inline" />,
      }}
    />
  );
};

export const Trans = (props: ComponentProps<typeof TransComponent>) => {
  return <TransComponent {...props} />;
};
