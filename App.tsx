
import React, { useState, useCallback } from 'react';
import { Clip } from './types';
import { generateClips } from './services/geminiService';
import Header from './components/Header';
import URLInputForm from './components/URLInputForm';
import LoadingSpinner from './components/LoadingSpinner';
import ClipCard from './components/ClipCard';

const App: React.FC = () => {
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [clips, setClips] = useState<Clip[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);

  const handleGenerateClips = useCallback(async () => {
    if (!youtubeUrl.trim()) {
      setError('Please enter a valid YouTube URL.');
      return;
    }
    // Basic URL validation
    try {
      new URL(youtubeUrl);
    } catch (_) {
      setError('The entered URL is not valid. Please check and try again.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setClips([]);
    setHasGenerated(true);

    try {
      const generatedClips = await generateClips(youtubeUrl);
      setClips(generatedClips);
    } catch (err) {
      console.error(err);
      setError('Failed to generate clips. The AI might be busy or an error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [youtubeUrl]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8">
          <URLInputForm 
            youtubeUrl={youtubeUrl} 
            setYoutubeUrl={setYoutubeUrl} 
            onSubmit={handleGenerateClips}
            isLoading={isLoading}
          />
          
          {error && <div className="mt-6 text-center text-red-400 bg-red-900/50 p-3 rounded-lg">{error}</div>}
          
          <div className="mt-12">
            {isLoading && <LoadingSpinner />}
            
            {!isLoading && clips.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clips.map((clip, index) => (
                  <ClipCard key={index} clip={clip} index={index} />
                ))}
              </div>
            )}

            {!isLoading && hasGenerated && clips.length === 0 && !error && (
               <div className="text-center py-16 px-6 bg-gray-800/50 rounded-lg">
                <h3 className="text-2xl font-bold text-cyan-400">No Clips Generated</h3>
                <p className="mt-2 text-gray-400">The AI couldn't generate clip ideas for this topic. Please try a different URL or rephrase your request.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
