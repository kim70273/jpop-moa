import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
  GenerativeModel,
  GenerateContentResult,
} from '@google/generative-ai';
import { ProcessedNews } from './interfaces/processed-news.interface';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly geminiModel: GenerativeModel;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      this.logger.error('GEMINI_API_KEY is not set in environment variables.');
      throw new Error('GEMINI_API_KEY is not set.');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.geminiModel = this.genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });
  }

  async extractAndTranslateNews(
    htmlContent: string,
  ): Promise<ProcessedNews | null> {
    const prompt = `
      You are an AI assistant specialized in extracting and translating J-pop news.
      Your response MUST be a valid JSON object, and contain nothing else.
      Do NOT include any conversational text, markdown outside the JSON block, or any other non-JSON content.

      Given the following HTML content from a news article or a concert listing, please perform the following tasks:

      1.  **Extract Information**:
          -   **Original Title**: The original title of the news article or concert. For concert listings, combine the concert title and ticket open schedule date if available.
          -   **Original Content**: The main body/content of the news article. For concert listings, combine the concert title and ticket open schedule date if available.
          -   **Published Date**: The date the article was published or the concert registration date. Extract in 'YYYY-MM-DD' format. If only a year or month is available, use 'YYYY-MM-01' or 'YYYY-01-01'. If not found, state "Not Found".
          -   **Source URL**: The canonical URL of the article. If not explicitly found in the HTML, state "Not Found".
          -   **Category**: Classify the news into one of these categories: "Concert", "Goods", "New Song", "Official Announcement", "Media Appearance", "Other".
          -   **Artist Name**: Identify the primary J-pop artist mentioned in the article or concert. If multiple artists are mentioned, pick the most prominent one. If no specific artist is mentioned, state "Not Found".
          -   **Korean Artist Name**: If 'Artist Name' is English, use the same name. If 'Artist Name' is Japanese, provide the common Korean name if known, otherwise provide the Hangul transliteration of the Japanese pronunciation. If 'Artist Name' is "Not Found", state "Not Found".
      2.  **Translate**:
          -   **Translated Title**: Translate the "Original Title" into natural and fluent Korean.
          -   **Translated Content**: Translate the "Original Content" into natural and fluent Korean.

      3.  **Output Format**: Return the extracted and translated information as a JSON object. Ensure the JSON is valid and strictly adheres to the following structure:

      \`\`\`json
      {
        "originalTitle": "...",
        "originalContent": "...",
        "translatedTitle": "...",
        "translatedContent": "...",
        "publishedAt": "YYYY-MM-DD | YYYY-MM-01 | YYYY-01-01 | Not Found",
        "sourceUrl": "...",
        "category": "Concert | Goods | New Song | Official Announcement | Media Appearance | Other",
        "artistName": "...",
        "koreanArtistName": "..."
      }
      \`\`\`

      **Special Instruction for Concert Listings (e.g., Melon Ticket):**
      If the HTML content appears to be a concert listing, specifically identify if it is a concert by a **Japanese artist** performing **in Korea**. If it is not a Japanese artist's concert in Korea, then set "artistName" and "koreanArtistName" to "Not Found".

      Here is the HTML content:
      ${htmlContent}
    `;

    try {
      this.logger.log(`Sending prompt to Gemini for HTML content`);
      const result: GenerateContentResult =
        await this.geminiModel.generateContent(prompt);
      const response = result.response;
      const text: string = response.text(); // Explicitly cast to string

      // Gemini sometimes includes markdown code block in its response
      const jsonString = text.replace(/```json\n|```/g, '').trim();
      return JSON.parse(jsonString) as ProcessedNews;
    } catch (error: unknown) {
      // Explicitly type error as unknown
      if (error instanceof Error) {
        this.logger.error(
          `Failed to extract and translate news: ${error.message}`,
          error.stack,
        );
      } else {
        this.logger.error(
          `Failed to extract and translate news: An unknown error occurred`,
          error,
        );
      }
      return null;
    }
  }
}
