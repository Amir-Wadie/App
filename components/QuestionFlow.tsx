
import React, { useState, useCallback } from 'react';
import { QuestionData, VisualConcept } from '../types';
import { generateQuestion } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { EyeOfHorusIcon } from './icons';

interface QuestionFlowProps {
  seed: number;
  usedConcepts: string[];
  usedIdeas: string[];
  onNewQuestionGenerated: (concept: VisualConcept, idea: string) => void;
  questionNumber: number;
  onRegenerate: () => void;
}

type GenerationState = 'idle' | 'generating' | 'generated' | 'error';
type Difficulty = 'easy' | 'medium' | 'hard';

const QuestionFlow: React.FC<QuestionFlowProps> = (props) => {
  const [generationState, setGenerationState] = useState<GenerationState>('idle');
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [customChallenge, setCustomChallenge] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleGenerate = useCallback(async () => {
    setGenerationState('generating');
    setError(null);
    setShowHint(false);
    setShowAnswer(false);

    try {
      const data = await generateQuestion(props.seed, props.usedConcepts, props.usedIdeas, props.questionNumber, difficulty, customChallenge);
      setQuestionData(data);
      props.onNewQuestionGenerated(data.visualConcept, data.idea);
      setGenerationState('generated');
// Fix: Add curly braces to the catch block to fix syntax error
    } catch (e: any) {
      const errorMessage = e.message || 'An unknown error occurred.';
      console.error("Question generation failed:", e);
      setError(`Failed to generate question: ${errorMessage}`);
      setGenerationState('error');
    }
  }, [props, difficulty, customChallenge]);

  const handleNewChallenge = () => {
      props.onRegenerate();
      setGenerationState('idle');
  }

  if (generationState === 'generating') {
    return <LoadingSpinner />;
  }
  
  if (generationState === 'generated' && questionData) {
    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-amber-300 mb-6 px-4">{questionData.question}</h2>
            <div className="w-full aspect-square bg-black rounded-lg overflow-hidden border-2 border-amber-600/50 shadow-lg mb-4">
                 <img src={questionData.imageUrl} alt="Visual riddle" className="w-full h-full object-cover" />
            </div>
            
            <div className="w-full text-center mb-4">
                <button onClick={() => setShowHint(!showHint)} className="text-[#65A30D] text-lg font-semibold">
                    show HINT
                </button>
            </div>

            <div className={`w-full bg-gray-800/50 rounded-lg p-4 mb-4 flex items-center space-x-4 transition-opacity duration-300 ${showHint ? 'opacity-100' : 'opacity-0 h-0 p-0 m-0 overflow-hidden'}`}>
                <EyeOfHorusIcon />
                <p className="text-white/80">{questionData.hints[0]}</p>
            </div>

            <div className="flex w-full space-x-4 mb-4">
                <button onClick={() => setShowHint(true)} className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600">HINT</button>
                <button onClick={() => setShowAnswer(true)} className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-lg hover:bg-gray-600">Answer</button>
            </div>
            {showAnswer && <p className="text-amber-400 text-2xl font-bold mb-4 animate-fade-in">Answer: {questionData.answer}</p>}
            <button onClick={handleNewChallenge} className="w-full bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-500">New challenge</button>
        </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center">
        <div className="w-full border-2 border-[#D98B21] rounded-2xl p-6 mb-6">
            <label className="text-lg font-semibold text-[#65A30D] mb-3 block">
                Choose the hard level
            </label>
            <div className="flex w-full bg-black/50 border-2 border-gray-700 rounded-xl p-1">
                {(['easy', 'medium', 'hard'] as Difficulty[]).map(level => (
                    <button 
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`flex-1 font-bold py-2 rounded-lg transition-all text-2xl capitalize ${difficulty === level ? 'bg-[#D98B21] text-white shadow-lg' : 'text-gray-500'}`}
                    >
                        {level}
                    </button>
                ))}
            </div>
        </div>
        
        <div className="w-full border-2 border-[#D98B21] rounded-2xl p-6 flex flex-col items-center">
            <textarea
                value={customChallenge}
                onChange={(e) => setCustomChallenge(e.target.value)}
                placeholder="Customize your challenge"
                className="w-full h-40 bg-transparent border-2 border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 mb-6"
            />
            <button
                onClick={handleGenerate}
                className="bg-[#D98B21] text-white font-bold py-4 px-20 rounded-xl text-2xl hover:bg-amber-500"
            >
                Generate
            </button>
            {generationState === 'error' && error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    </div>
  );
};

export default QuestionFlow;
