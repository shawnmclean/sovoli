"use client";

import { Accordion, AccordionItem } from "@sovoli/ui/components/accordion";

const faqs = [
  {
    question: "How long does it take to see results?",
    answer:
      "Most schools see their first qualified leads within 2-3 weeks of launching the Growth System. Full results typically appear within 60-90 days as your digital presence builds momentum.",
  },
  {
    question: "What if my school already has a website?",
    answer:
      "Perfect! We'll audit your existing website and optimize it for better performance. If needed, we can rebuild it to work seamlessly with our lead capture and advertising systems.",
  },
  {
    question: "Do I need any technical knowledge?",
    answer:
      "Not at all. The Growth System is designed for school owners and administrators. We handle all the technical setup and provide training on how to use the dashboard.",
  },
  {
    question: "How much does the Growth System cost?",
    answer:
      "Pricing varies based on your school's size and specific needs. We offer flexible packages starting from $297/month. Contact us for a customized quote based on your enrollment goals.",
  },
  {
    question: "What makes this different from hiring a marketing agency?",
    answer:
      "Unlike generic marketing agencies, we specialize in private schools in the Caribbean. Our system is purpose-built for education and includes ongoing support from our team who understand your specific challenges.",
  },
  {
    question: "Can this work for schools outside Guyana?",
    answer:
      "Absolutely! While we specialize in Guyana, the Growth System works for private schools across the Caribbean. We adapt our strategies to local markets and parent behavior patterns.",
  },
  {
    question: "What happens if I'm not satisfied?",
    answer:
      "We offer a 30-day money-back guarantee. If you're not seeing results or satisfied with the system, we'll refund your investment, no questions asked.",
  },
  {
    question: "How do you measure success?",
    answer:
      "We track key metrics like website traffic, lead generation, cost per lead, and enrollment conversion rates. You'll receive monthly reports showing your growth and ROI.",
  },
];

export function Answers() {
  return (
    <section className="py-8 px-4 sm:py-16 bg-default-50">
      <div className="mx-auto max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-default-600 px-4">
            Everything you need to know about the Growth System and how it can
            help your school grow.
          </p>
        </div>

        <div className="bg-background rounded-xl shadow-lg border border-default-200">
          <Accordion>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} title={faq.question}>
                {faq.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
