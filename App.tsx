
import React, { useState, useEffect, useCallback } from 'react';
import { GameFlow, VisualConcept } from './types';
import LandingScreen from './components/LandingScreen';
import DiceFlow from './components/DiceFlow';
import QuestionFlow from './components/QuestionFlow';
import FateRoll from './components/FateRoll';
import Header from './components/Header';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [appState, setAppState] = useState<'landing' | 'fating' | 'dice' | 'question'>('landing');
  const [sessionSeed, setSessionSeed] = useState<number>(0);
  const [usedQuestionConcepts, setUsedQuestionConcepts] = useState<string[]>([]);
  const [usedQuestionIdeas, setUsedQuestionIdeas] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const resetSession = useCallback(() => {
    setCurrentQuestionIndex(0);
    setUsedQuestionConcepts([]);
    setUsedQuestionIdeas([]);
    const newSeed = Date.now() + Math.floor(Math.random() * 10000);
    setSessionSeed(newSeed);
    setAppState('landing');
  }, []);

  useEffect(() => {
    resetSession();
  }, [resetSession]);

  const handleStartFate = () => {
    setAppState('fating');
  };

  const handleFateComplete = (roll: number) => {
    const isOdd = roll % 2 !== 0;
    setAppState(isOdd ? 'question' : 'dice');
  };

  const handleNewQuestionGenerated = useCallback((concept: VisualConcept, idea: string) => {
    setUsedQuestionConcepts(prevConcepts => [...prevConcepts, JSON.stringify(concept)]);
    setUsedQuestionIdeas(prevIdeas => [...prevIdeas, idea]);
  }, []);

  const handleRegenerateChallenge = useCallback(() => {
    setCurrentQuestionIndex(prev => prev + 1);
  }, []);

  const renderContent = () => {
    switch (appState) {
      case 'landing':
        return <LandingScreen onStart={handleStartFate} />;
      case 'fating':
        return <FateRoll seed={sessionSeed} onFateRevealed={handleFateComplete} />;
      case 'dice':
        return <DiceFlow />;
      case 'question':
        return (
          <QuestionFlow 
            seed={sessionSeed} 
            usedConcepts={usedQuestionConcepts}
            usedIdeas={usedQuestionIdeas}
            onNewQuestionGenerated={handleNewQuestionGenerated}
            questionNumber={currentQuestionIndex}
            onRegenerate={handleRegenerateChallenge}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1A1A1A] min-h-screen text-white flex flex-col antialiased">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col flex-grow">
        <Header />
        <main className="flex-grow flex flex-col items-center justify-center py-8">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;