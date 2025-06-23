
import React from 'react';

const ModelSelectionInfo: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none text-gray-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <h1 style={{ color: '#4a148c' }}>Understanding Model Selection</h1>
      <p>This setting allows you to choose which Google Gemini model is used for the romantic narrative transformation. Different models possess distinct strengths in creative text generation, impacting the style, nuance, and quality of the resulting romantic prose.</p>

      <h2 style={{ color: '#7b1fa2', marginTop: '1.5rem' }}>Models Selectable in This Application</h2>
      <p>This application offers a curated selection of text generation models optimized for transforming raw text into elegant romantic narratives:</p>
      <ul>
        <li>
          <strong><code style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>gemini-2.5-flash-lite-preview-06-17</code> (Gemini 2.5 Flash Lite - Preview - Recommended):</strong>
          This is the default and highly recommended model for the Romantic Narrative Transformer. It offers a cost-efficient alternative while still supporting high throughput and excellent creative text generation capabilities. It's ideal for transforming texts into romantic narratives, particularly if you're processing a large volume of text or seeking a balance of efficiency and quality romantic prose.
        </li>
        <li>
          <strong><code style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>gemini-2.5-flash-preview-04-17</code> (Gemini 2.5 Flash - Preview):</strong>
          This model is fast, versatile, and also excels at creative text generation. It's a strong choice for transforming raw text into flowing, elegant romantic prose, offering a slightly different profile to the Flash Lite model. It's well-suited for achieving the desired literary flair and sophisticated language characteristic of classic romance.
        </li>
      </ul>
      
      <div style={{ backgroundColor: '#e8f5e9', borderLeft: '4px solid #4caf50', padding: '1rem', marginTop: '1rem', color: '#1b5e20' }}>
        <p><strong>Recommendation for This App:</strong> For crafting captivating romantic narratives with this tool, <strong><code style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>gemini-2.5-flash-lite-preview-06-17</code></strong> is the strongly recommended starting point. It's optimized for the kind of creative and stylistic transformation this app aims to achieve, balancing sophisticated language generation with efficiency to produce high-quality romantic prose.</p>
      </div>

      <h2 style={{ color: '#7b1fa2', marginTop: '1.5rem' }}>Free Tier Considerations</h2>
      <p>The models available in this application are chosen with free-tier usage in mind, based on current Google Generative AI guidelines. Both <code style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>gemini-2.5-flash-lite-preview-06-17</code> and <code style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>gemini-2.5-flash-preview-04-17</code> are generally available under the free tier, subject to Google's usage limits.</p>
      <p>It's important to be aware of the following:</p>
      <ul>
        <li><strong>Usage Limits:</strong> Free tiers often come with limitations on the number of requests you can make per minute or per day. If you exceed these limits, you might encounter errors.</li>
        <li><strong>Model Availability:</strong> Model names, availability, and their inclusion in free tiers can change over time as Google updates its offerings. The "preview" in a model name indicates it might be subject to changes.</li>
      </ul>

      <h2 style={{ color: '#7b1fa2', marginTop: '1.5rem' }}>Other Gemini Models (General Information)</h2>
      <p>The Gemini family includes a diverse range of models. While not all are selectable in this application to maintain focus on high-quality romantic narrative generation, here are examples of other text-input/text-output models in the broader Gemini ecosystem:</p>
      <ul>
        <li><code style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>gemini-2.0-flash</code> and <code style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>gemini-2.0-flash-lite</code>: Part of the Gemini 2.0 series, also focused on speed and efficiency.</li>
        <li><code style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>gemini-2.5-pro</code>: Optimized for enhanced thinking and reasoning, capable of handling more complex tasks.</li>
      </ul>
      <p>The Gemini API also supports models for other modalities (not used in this specific text-focused application):</p>
      <ul>
        <li>Image generation (e.g., <code style={{ backgroundColor: '#f3e5f5', color: '#6a1b9a', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>imagen-3.0-generate-002</code>)</li>
        <li>Audio processing and generation</li>
        <li>Video understanding and generation</li>
        <li>Text embeddings</li>
      </ul>
      <div style={{ backgroundColor: '#e3f2fd', borderLeft: '4px solid #2196f3', padding: '1rem', marginTop: '1rem', color: '#1e3a8a' }}>
        <p><strong>Note:</strong> This "Romantic Narrative Transformer" application is specifically designed for <strong>text-to-text transformation</strong> to create romantic narratives. Therefore, models for other modalities are not applicable or selectable within this tool's current functionality.</p>
      </div>
      
      <p>Always refer to the official Google Cloud documentation for the most up-to-date information on Gemini models, their capabilities, pricing, and free tier details.</p>
    </div>
  );
};

export default ModelSelectionInfo;