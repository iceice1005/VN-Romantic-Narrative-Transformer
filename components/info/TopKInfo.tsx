
import React from 'react';

const TopKInfo: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none text-gray-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <h1 style={{ color: '#00695c' }}>Understanding Top-K Sampling</h1>
      <p><strong>Top-K</strong> sampling limits the model's choices for the next word to the <code>K</code> most probable words. This influences the breadth of vocabulary used in the romantic narrative, from conventional to more diverse expressions.</p>

      <h2 style={{ color: '#558b2f', marginTop: '1.5rem' }}>How it Works</h2>
      <p>At each step of generating the romantic narrative:</p>
      <ul>
        <li>The model identifies the <code>K</code> words with the highest probabilities.</li>
        <li>It then samples the next word only from this reduced set, further influenced by Temperature.</li>
      </ul>
      <p>For example:</p>
      <ul>
        <li>If <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>topK = 1</code> (greedy decoding): The model always picks the single most likely word, leading to deterministic but potentially repetitive or clichéd romantic phrasing.</li>
        <li>If <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>topK = 50</code>: The model considers 50 probable words, allowing for a richer selection to craft the romantic narrative.</li>
      </ul>

      <h2 style={{ color: '#558b2f', marginTop: '1.5rem' }}>Effect on Romantic Narrative Transformation</h2>
      <p>Top-K influences the diversity of language in your romantic transformation:</p>
      <ul>
        <li><strong>Low Top-K (e.g., <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>5</code> - <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>10</code>):</strong>
          <p>The resulting narrative might lean heavily on common romantic tropes and vocabulary, as the model is restricted to only the most immediately probable words. This can lead to a feeling of cliché if overused, e.g., consistently describing love as "sét đánh" (love at first sight) or hearts as "rung động" (trembling) without fresher alternatives.</p>
        </li>
        <li><strong>Medium Top-K (e.g., <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>40</code> - <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>60</code>):</strong>
          <p>This offers a good balance for romantic writing. The model has enough choices to craft more nuanced and varied descriptions of emotions and settings, moving beyond the most obvious phrases. It can find more poetic ways to express affection or depict a romantic scene, for example, describing a shared glance as "ánh mắt họ giao nhau, dệt nên một khoảnh khắc tĩnh lặng mà nồng nàn." (their eyes met, weaving a moment of silence yet full of passion).</p>
        </li>
        <li><strong>High Top-K (e.g., <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>100+</code>):</strong>
          <p>While offering the widest choice, its impact is often moderated by Top-P (if active and set lower). If Top-P is also high, this setting gives Temperature more room to introduce diverse, sometimes unexpected, romantic vocabulary. This could be beneficial for highly creative styles but might require careful system instruction to ensure relevance and maintain the desired romantic tone.</p>
        </li>
      </ul>
      <p>Top-K can complement Top-P. While Top-P dynamically chooses the word pool based on cumulative probability, Top-K uses a fixed number, providing a different way to control vocabulary breadth.</p>

      <h2 style={{ color: '#558b2f', marginTop: '1.5rem' }}>Recommendation for This App</h2>
      <p>For transforming text into engaging romantic narratives, starting with Top-K around <strong><code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>40</code> to <code style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>50</code></strong> is generally effective, especially when used alongside Top-P. The primary aim is to allow for rich, evocative language that avoids excessive repetition of common romantic phrases.</p>
      <ul>
        <li>If the romantic output seems too constrained or uses very limited vocabulary, you might try increasing Top-K.</li>
        <li>However, many find that adjusting Temperature and Top-P has a more direct and intuitive impact on achieving the desired romantic "feel" and creativity. Focus on tuning those first.</li>
      </ul>
      <p>Experiment with Top-K, but it might be a secondary parameter to tune after Temperature and Top-P for refining the romantic style.</p>
    </div>
  );
};

export default TopKInfo;
