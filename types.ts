
export interface TransformationEntry {
  id: string;
  originalText: string;
  transformedText: string;
  timestamp: Date;
  durationMs?: number; 
  modelId?: string; 
  modelName?: string; 
  temperature?: number;
  topP?: number;
  topK?: number;
  seed?: number; 
  customTitlePrefix?: string; // Added for editable history item titles
}