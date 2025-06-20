
import React from 'react';

const TemperatureInfo: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none text-gray-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <h1 style={{ color: '#d32f2f' }}>Understanding Temperature</h1>
      <p>The <strong>Temperature</strong> parameter controls the randomness and creativity of the model's output. It influences how "imaginative" or "surprising" the generated romantic narrative will be.</p>

      <h2 style={{ color: '#7b1fa2', marginTop: '1.5rem' }}>How it Works</h2>
      <p>When generating text, the model assigns probabilities to possible next words. Temperature adjusts these probabilities:</p>
      <ul>
        <li><strong>Lower Temperature (e.g., 0.1 - 0.5):</strong> Makes the output more deterministic and focused. The model is more likely to pick the most probable words, resulting in text that is often more predictable, consistent, and adheres to conventional romantic styles.</li>
        <li><strong>Higher Temperature (e.g., 0.7 - 1.0):</strong> Makes the output more random and creative. The model is encouraged to consider less likely words, leading to more diverse, surprising, and potentially novel-sounding romantic prose. However, if too high, it can also lead to less coherent or overly florid output.</li>
      </ul>

      <h2 style={{ color: '#7b1fa2', marginTop: '1.5rem' }}>Effect on Romantic Narrative Transformation</h2>
      <p>In the context of transforming text into a romantic narrative:</p>
      <ul>
        <li><strong>Low Temperature (e.g., <code style={{ backgroundColor: '#fce4ec', color: '#ad1457', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.3</code>):</strong>
          <p>The transformation will likely adhere to well-trodden paths of romantic expression, producing classic but perhaps predictable prose. For instance, an input like "Họ yêu nhau" (They loved each other) might become "Trái tim họ đã chung một nhịp đập, giản dị mà son sắt." (Their hearts beat as one, simple yet faithful.) – reliable, but perhaps less imaginative.</p>
        </li>
        <li><strong>Medium Temperature (e.g., <code style={{ backgroundColor: '#fce4ec', color: '#ad1457', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.6</code> - <code style={{ backgroundColor: '#fce4ec', color: '#ad1457', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.75</code>):</strong>
          <p>This often strikes the ideal chord for romantic narratives, allowing for graceful embellishments and evocative language. The same "Họ yêu nhau" could blossom into "Tình yêu của họ tựa như một bản tình ca du dương, với những nốt trầm bổng của nhớ thương và hy vọng, khơi gợi những rung động sâu thẳm nhất." (Their love was like a melodious love song, with high and low notes of longing and hope, evoking the deepest emotions.)</p>
        </li>
        <li><strong>High Temperature (e.g., <code style={{ backgroundColor: '#fce4ec', color: '#ad1457', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.9</code>):</strong>
          <p>The narrative might soar into highly poetic or metaphorical realms. "Họ yêu nhau" could become "Ái tình đã giăng một sợi tơ vô hình, buộc chặt hai linh hồn họ vào một vũ điệu của đam mê dưới ánh trăng huyền ảo, nơi mỗi cái chạm là một vần thơ." (Love had spun an invisible silk thread, binding their two souls into a dance of passion under the mystical moonlight, where every touch was a verse of poetry.) – potentially very unique, but could risk becoming overly ornate or less grounded if the system instruction isn't strong.</p>
        </li>
      </ul>

      <h2 style={{ color: '#7b1fa2', marginTop: '1.5rem' }}>Recommendation for This App</h2>
      <p>For crafting elegant romantic narratives, begin with a Temperature around <strong><code style={{ backgroundColor: '#fce4ec', color: '#ad1457', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.6</code> to <code style={{ backgroundColor: '#fce4ec', color: '#ad1457', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.75</code></strong>. This range usually fosters creativity and rich vocabulary suitable for romance. If the narrative feels too conventional, gently increase the temperature. If it becomes too abstract or loses coherence, a slight decrease is advisable. The goal is to find a balance that produces prose that is both enchanting and clear, capturing the essence of a classic romance novel.</p>
    </div>
  );
};

export default TemperatureInfo;
