export type GeneratedDocument = {
  title: string;
  sections: Array<{
    heading?: string;
    paragraphs: string[];
  }>;
  disclaimer: string;
  generatedAt: string;
};

export type DocumentSlug = "section-21";

export type DocumentConfig = {
  slug: DocumentSlug;
  name: string;
  seoTitle: string;
  seoDescription: string;
  pricePence: number;
  lastUpdated: string;
};
