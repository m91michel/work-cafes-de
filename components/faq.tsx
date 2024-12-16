"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/libs/utils"

const accordionTriggerStyles = cn(
  "flex flex-1 items-center justify-between py-4 px-2 text-sm font-medium transition-all",
  "hover:text-primary focus-visible:text-primary focus-visible:outline-none",
  "hover:underline [&[data-state=open]>svg]:rotate-180"
)

const accordionContentStyles = cn(
  "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
  "px-2 pb-4"
)

type FAQ = {
  id?: string;
  question: string;
  answer: string;
}
type Props = {  
  faqs: FAQ[];
}

export function FAQSection({ faqs = [] }: Props) {
  return (
    <section className="w-full max-w-3xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">Häufig gestellte Fragen</h2>
      <p className="text-lg text-center text-muted-foreground mb-8">
        Hier findest du Antworten auf die häufigsten Fragen zu Café zum Arbeiten.
      </p>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem 
            key={index} 
            value={`item-${index}`}
            className="border-b border-gray-200 transition-all duration-200 ease-in-out"
          >
            <AccordionTrigger className={accordionTriggerStyles} data-umami-event="faq-item" data-umami-event-question={faq.question}>
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className={accordionContentStyles}>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

