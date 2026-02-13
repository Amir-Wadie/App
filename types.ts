
export enum GameFlow {
  DICE = 'DICE',
  QUESTION = 'QUESTION',
}

export interface DiceData {
  type: 'dice';
  seed: number;
  roll: number;
}

export type ImageSize = '1K' | '2K' | '4K';

export interface VisualConcept {
  cameraAngle: string;
  timeOfDay: string;
  artifactCondition: string;
  backgroundLocation: string;
  supportingProps: string[];
}

export interface QuestionData {
  id: string;
  seed: number;
  type: 'question_image';
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl: string;
  question: string;
  answer: string;
  hints: string[];
  idea: string; // A short description of the question's core concept
  visualConcept: VisualConcept;
  metadata: {
    style: string;
    color_tags: string[];
  };
}

export interface GroundingSource {
    web?: {
      uri: string;
      title: string;
    }
}
