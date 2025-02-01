"use client";

import { Trans } from "react-i18next";
import { Gradient } from "./gradient";

type Props = {
  i18nKey: string;
  values?: Record<string, string>;
  namespace?: string;
};
export const TransHighlight = ({ i18nKey, values, namespace }: Props) => {
  return (
    <Trans
      i18nKey={i18nKey}
      values={values}
      ns={namespace}
      components={{
        highlight: <Gradient />,
      }}
    />
  );
};
