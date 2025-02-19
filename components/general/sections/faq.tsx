"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/libs/utils";
import { useCTranslation } from "@/hooks/use-translation";
import { TransHighlight } from "../translation";


const accordionTriggerStyles = cn(
  "flex flex-1 items-center justify-between py-4 px-2 text-sm font-medium transition-all",
  "hover:text-primary focus-visible:text-primary focus-visible:outline-none",
  "hover:underline [&[data-state=open]>svg]:rotate-180"
);

const accordionContentStyles = cn(
  "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
  "px-2 pb-4"
);

type Props = {
  faqsIds?: string[];
  namespace?: string;
  values?: Record<string, string>;
};
const defaultIds = ['criteria', 'update', 'suggest', 'notAllCities', 'remove'];

export function FAQSection({ faqsIds = defaultIds, namespace = 'home', values = {} }: Props) {
  const { t } = useCTranslation(namespace);

  return (
    <section className="w-full max-w-3xl mx-auto py-12 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        <TransHighlight i18nKey={`${namespace}:faq.title`} />
      </h2>
      <p className="text-lg md:text-xl text-center text-muted-foreground mb-8">
        {t(`${namespace}:faq.description`)}
      </p>
      <Accordion type="single" collapsible className="w-full">
        {faqsIds.map((faqId, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-b border-gray-200 transition-all duration-200 ease-in-out"
          >
            <AccordionTrigger
              className={accordionTriggerStyles}
              data-umami-event="faq-item-clicked"
              data-umami-event-element={faqId}
            >
              {t(`faq.${faqId}.question`, values)}
            </AccordionTrigger>
            <AccordionContent className={accordionContentStyles}>
              {t(`faq.${faqId}.answer`, values)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
