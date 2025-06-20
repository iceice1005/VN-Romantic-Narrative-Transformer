
import React from 'react';

const TopPInfo: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none text-gray-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <h1 style={{ color: '#1565c0' }}>Understanding Top-P (Nucleus Sampling)</h1>
      <p><strong>Top-P</strong> (Nucleus Sampling) controls the diversity of the generated romantic narrative. It selects from the smallest set of most probable next words whose cumulative probability exceeds <code>P</code>, effectively shaping the "vocabulary palette" for the romantic prose.</p>

      <h2 style={{ color: '#6a1b9a', marginTop: '1.5rem' }}>How it Works</h2>
      <p>Instead of considering all possible next words or a fixed number (like Top-K), Top-P dynamically adjusts the number of words considered:</p>
      <ul>
        <li>The model sorts possible next words by probability.</li>
        <li>It accumulates these probabilities until the sum is greater than or equal to <code>P</code>. This set forms the "nucleus."</li>
        <li>The model samples the next word only from this nucleus, influencing the range of expressions used in the romantic narrative.</li>
      </ul>
      <p>For example, if <code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>topP = 0.9</code>, the model considers the most likely words that together make up 90% of the probability for the next word, filtering out very unlikely or potentially jarring terms for a romantic context.</p>

      <h2 style={{ color: '#6a1b9a', marginTop: '1.5rem' }}>Effect on Romantic Narrative Transformation</h2>
      <p>Top-P helps control the "focus" and "stylistic consistency" of the romantic narrative:</p>
      <ul>
        <li><strong>Lower Top-P (e.g., <code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.8</code>):</strong>
          <p>The model favors more common romantic vocabulary and sentence structures. This ensures the narrative remains stylistically consistent and avoids unexpected turns of phrase, leading to a more classic, perhaps 'safer', romantic feel. For example, descriptions of a lover's eyes might consistently use terms like "long lanh" (sparkling) or "biết nói" (expressive) rather than more unconventional metaphors.</p>
        </li>
        <li><strong>Higher Top-P (e.g., <code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.95</code> - <code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>1.0</code>):</strong>
          <p>The model explores a broader palette of words, potentially leading to more unique and imaginative romantic descriptions. This can make the narrative feel fresher and more distinctive. For instance, a lover's eyes might be described with less common but evocative imagery, like "sâu thẳm như đêm huyền bí, ẩn chứa cả một trời nhung nhớ" (as deep as a mysterious night, holding a sky full of longing), adding depth to the romantic portrayal.</p>
        </li>
      </ul>
      <p>Compared to Temperature (which reshapes probabilities), Top-P dynamically limits the *pool* of candidate words, ensuring they remain appropriate for a romantic tone.</p>

      <h2 style={{ color: '#6a1b9a', marginTop: '1.5rem' }}>Recommendation for This App</h2>
      <p>A Top-P value between <strong><code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.9</code> and <code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.95</code></strong> is a good starting point for romantic narratives. This allows for creativity in expression while maintaining thematic coherence and romantic elegance.</p>
      <ul>
        <li>If you desire more daring or unconventional romantic prose with richer vocabulary, consider a slightly higher Top-P (e.g., <code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.98</code>).</li>
        <li>If the narrative includes terms that feel out of place for a romance or too generic, try a slightly lower Top-P (e.g., <code style={{ backgroundColor: '#e3f2fd', color: '#0d47a1', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.85</code>) to narrow the focus to more classic romantic expressions.</li>
      </ul>
      <p>Adjust Top-P in conjunction with Temperature to fine-tune the narrative's blend of creativity and romantic style.</p>
    </div>
  );
};

export default TopPInfo;
