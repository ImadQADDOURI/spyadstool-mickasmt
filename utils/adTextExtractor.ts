// utils\adTextExtractor.ts
import parse from "html-react-parser";

import { AdData, Media } from "@/types/ad";

interface ExtractedAdText {
  titles: string[];
  bodies: string[];
  pageName: string;
  cta: string[];
  caption: string;
}

export function extractText(ad: AdData): ExtractedAdText {
  const { snapshot } = ad;
  const extracted: ExtractedAdText = {
    titles: [],
    bodies: [],
    pageName: ad.page_name || snapshot.page_name || "",
    cta: [],
    caption: snapshot.caption || "",
  };

  // Extract title and body from main snapshot
  if (snapshot.title) extracted.titles.push(snapshot.title);
  if (snapshot.body?.text) extracted.bodies.push(snapshot.body.text);

  // Extract CTA from main snapshot
  if (snapshot.cta_text && snapshot.cta_type) {
    extracted.cta.push(`${snapshot.cta_text} (${snapshot.cta_type})`);
  }

  // Extract from cards if available
  if (snapshot.cards && snapshot.cards.length > 0) {
    snapshot.cards.forEach((card: Media) => {
      if (card.title && !extracted.titles.includes(card.title))
        extracted.titles.push(card.title);
      if (card.body && !extracted.bodies.includes(card.body))
        extracted.bodies.push(card.body);
      if (card.cta_text && card.cta_type) {
        const ctaCombo = `${card.cta_text} (${card.cta_type})`;
        if (!extracted.cta.includes(ctaCombo)) extracted.cta.push(ctaCombo);
      }
    });
  }

  // console.log("extracted", extracted);

  return extracted;
}

export function parseText(extractedText: ExtractedAdText): string {
  const cleanAndJoin = (arr: string[]) =>
    arr.map((item) => cleanHtml(item)).join(" | ");

  return `
Titles: ${cleanAndJoin(extractedText.titles)}
Bodies: ${cleanAndJoin(extractedText.bodies)}
Page Name: ${extractedText.pageName}
CTA: ${cleanAndJoin(extractedText.cta)}
Caption: ${cleanHtml(extractedText.caption)}
`.trim();
}

function cleanHtml(text: string): string {
  const parsedText = parse(text);
  const textContent =
    typeof parsedText === "string"
      ? parsedText
      : (Array.isArray(parsedText) ? parsedText : [parsedText])
          .map((child) => {
            if (typeof child === "string") return child;
            if (
              typeof child === "object" &&
              child !== null &&
              "props" in child &&
              typeof child.props.children === "string"
            )
              return child.props.children;
            return "";
          })
          .join(" ");
  return textContent.replace(/\s+/g, " ").trim();
}
