export interface ProcessedNews {
  originalTitle: string;
  originalContent: string;
  translatedTitle: string;
  translatedContent: string;
  publishedAt: string; // YYYY-MM-DD | YYYY-MM-01 | YYYY-01-01 | Not Found
  sourceUrl: string;
  category: string;
  artistName: string; // Identified by AI, "Not Found" if not found
  koreanArtistName: string; // Identified by AI, "Not Found" if not found
}
