
import React from 'react';

const SeedInfo: React.FC = () => {
  return (
    <div className="prose prose-lg max-w-none text-gray-800" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
      <h1 style={{ color: '#2e7d32' }}>Understanding Seed</h1>
      <p>The <strong>Seed</strong> parameter helps make the romantic narrative output more deterministic. Providing a specific seed (an integer), along with the same input text and model configurations (Temperature, Top-P, Top-K), allows the model to reproduce the same romantic transformation.</p>

      <h2 style={{ color: '#558b2f', marginTop: '1.5rem' }}>How it Works</h2>
      <p>Language models use random processes for creative text generation. The seed initializes this randomness to a specific state.</p>
      <ul>
        <li><strong>Provide a specific integer seed:</strong> The model starts its "creative process" from the same point each time, leading to consistent romantic prose.</li>
        <li><strong>Leave Seed blank:</strong> This app generates a random seed, ensuring each new transformation can explore a different stylistic nuance. This generated seed is saved in history for later reproducibility.</li>
      </ul>

      <div style={{ backgroundColor: '#e8f5e9', borderLeft: '4px solid #4caf50', padding: '1rem', marginTop: '1rem', color: '#1b5e20' }}>
        <p><strong>Important:</strong> This application ensures every transformation has a specific numerical seed recorded in history. If you leave the seed field blank, a random seed is generated by the app. You can always find the exact seed used for any past romantic narrative in its history details, allowing for precise reproduction of a favored style.</p>
      </div>

      <h2 style={{ color: '#558b2f', marginTop: '1.5rem' }}>Why is Reproducibility Useful for Romantic Narratives?</h2>
      <ul>
        <li><strong>Perfecting a Romantic Style:</strong> When fine-tuning system instructions or parameters to achieve a specific romantic tone (e.g., melancholic, passionate, whimsical), a consistent seed helps isolate the impact of your changes.</li>
        <li><strong>Revisiting a Favored Output:</strong> If a transformation yields an exceptionally beautiful romantic passage, its recorded seed lets you recreate it.</li>
        <li><strong>Iterative Refinement of Romance:</strong> Get a good romantic output, then use its seed while slightly tweaking Temperature or Top-P to explore subtle variations of that core style.</li>
        <li><strong>Sharing Your "Romantic Formula":</strong> Share the input, settings, and seed to allow others to experience the same romantic transformation.</li>
      </ul>

      <h2 style={{ color: '#558b2f', marginTop: '1.5rem' }}>Effect on Romantic Narrative Transformation</h2>
      <p>Seed helps you control and explore romantic styles:</p>
      <ul>
        <li><strong>Using a Seed (Manually or from History):</strong> If a particular transformation yields an exceptionally beautiful or fitting romantic style, reusing its seed (found in history) allows you to replicate that specific charm. You can then apply this "locked-in" romantic essence to new input texts, or experiment by subtly changing other parameters while keeping the core "creative fingerprint" of that seed.</li>
        <li><strong>Leaving Seed Blank (New Transformation):</strong> To explore the spectrum of romantic interpretations for your input text, leave the seed blank. Each attempt will likely unveil a different nuance of romantic expression – perhaps one version is more melancholic, another more passionate. The specific random seed used for each exploration will be saved in the history, so you can always return to a version you admire.</li>
      </ul>

      <h2 style={{ color: '#558b2f', marginTop: '1.5rem' }}>Recommendation for This App</h2>
      <ul>
        <li><strong>Leave blank to discover diverse romantic styles:</strong> If you're seeking inspiration or want to see multiple ways a raw text can be imbued with romance, this is the way to go. The unique seed used will be captured in the history for later reference.</li>
        <li><strong>Enter a specific number (or use one from history) to achieve consistency or refine a specific romantic output:</strong> If you've found a "perfect" romantic tone, use its seed to consistently achieve it or to make targeted adjustments to other settings while preserving that core style. For example, if seed <code style={{ backgroundColor: '#f1f8e9', color: '#33691e', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>123</code> with Temperature <code style={{ backgroundColor: '#f1f8e9', color: '#33691e', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.7</code> created a beautiful narrative, you can try seed <code style={{ backgroundColor: '#f1f8e9', color: '#33691e', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>123</code> with Temperature <code style={{ backgroundColor: '#f1f8e9', color: '#33691e', padding: '0.2rem 0.4rem', borderRadius: '4px', fontFamily: 'monospace' }}>0.75</code> to see a slight variation from the same creative starting point.</li>
      </ul>
      <p><strong>Note:</strong> While highly reliable, reproducibility with a seed might have slight variations across major model updates. For typical use, it's excellent for consistent romantic outputs with the same model version.</p>
    </div>
  );
};

export default SeedInfo;
