
export const DEFAULT_MODEL_ID = 'gemini-2.5-flash-lite-preview-06-17';

export const AVAILABLE_TEXT_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (Preview)' },
  { id: 'gemini-2.5-flash-lite-preview-06-17', name: 'Gemini 2.5 Flash Lite (Preview - Recommended)'},
];

export const DEFAULT_SYSTEM_INSTRUCTION = `You are an expert in Vietnamese literature and classic romance novels.
Your task is to transform the provided raw Vietnamese text into a flowing, romantic narrative with the elegant flair of a classic romance novel.
Maintain the core meaning and events of the original text, but enhance the language, imagery, and emotional depth to evoke a strong romantic atmosphere.
Use rich vocabulary, metaphors, and similes characteristic of classic romance.
Ensure the output is natural-sounding Vietnamese, not a direct or stilted rephrasing.
The output should ONLY be the transformed Vietnamese narrative, without any introductory or concluding phrases from you.`;

export const DEFAULT_RANDOM_TITLE_WORDS_MIN = 3;
export const DEFAULT_RANDOM_TITLE_WORDS_MAX = 7;
export const CHAPTER_TITLE_GENERATION_TEMPERATURE = 0.6;

export const DEFAULT_CHAPTER_TITLE_PROMPT_TEMPLATE = `Dựa trên đoạn tự sự lãng mạn sau đây, hãy đề xuất một tiêu đề chương ngắn gọn và gợi cảm.
Tiêu đề không quá {{maxWords}} từ.
Tiêu đề phải bằng tiếng Việt.
Tập trung nắm bắt bản chất của đoạn văn.
Chỉ cung cấp DUY NHẤT tiêu đề, không có bất kỳ cụm từ giới thiệu, giải thích, dấu ngoặc kép hoặc bất kỳ văn bản nào khác xung quanh.

Đoạn tự sự:
---
{{narrativeText}}
---

Tiêu đề đề xuất:`;

export const DEFAULT_NOVEL_TOC_ITEM_CLASS = 'chapter-name';
