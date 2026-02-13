
import { GoogleGenAI, Type } from "@google/genai";
import { QuestionData, VisualConcept } from '../types';

const NEGATIVE_PROMPTS = `photorealism, text, numbers, modern tools, 3D rendering, UI chrome, overlays, watermarks, fantasy elements, conversation, speech bubbles`;

const createGenerateQuestionPackageSchema = (difficulty: 'easy' | 'medium' | 'hard') => ({
  type: Type.OBJECT,
  properties: {
    idea: {
        type: Type.STRING,
        description: "A short, canonical abstract description of the unique question concept. E.g., 'An artisan identifies a flaw in a ritual mirror design.'"
    },
    abstractSummary: {
        type: Type.STRING,
        description: "A one-sentence summary of the logical structure and core dilemma of the riddle."
    },
    question: {
      type: Type.STRING,
      description: "A short, intriguing question whose answer can be visually hinted at.",
    },
    answer: {
      type: Type.STRING,
      description: "The canonical short answer.",
    },
    hints: {
      type: Type.ARRAY,
      description: "An array of 1-3 textual hints, from least to most revealing.",
      items: { type: Type.STRING },
    },
    difficulty: {
      type: Type.STRING,
      description: `Must be '${difficulty}'.`,
    },
    image_prompt_description: {
        type: Type.STRING,
        description: `A list of 5-7 visual keywords for an image model describing a scene hinting at the answer.`
    },
    visualConcept: {
        type: Type.OBJECT,
        description: "A unique combination of visual elements.",
        properties: {
            cameraAngle: { type: Type.STRING },
            timeOfDay: { type: Type.STRING },
            artifactCondition: { type: Type.STRING },
            backgroundLocation: { type: Type.STRING },
            supportingProps: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["cameraAngle", "timeOfDay", "artifactCondition", "backgroundLocation", "supportingProps"]
    }
  },
  required: ["idea", "abstractSummary", "question", "answer", "hints", "difficulty", "image_prompt_description", "visualConcept"],
});


export const generateQuestion = async (
    seed: number, 
    usedConcepts: string[], 
    usedIdeas: string[], 
    questionNumber: number,
    difficulty: 'easy' | 'medium' | 'hard',
    customPrompt: string
): Promise<QuestionData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const textModel = 'gemini-3-flash-preview';
  const imageModel = 'gemini-2.5-flash-image';
  
  const usedIdeasText = usedIdeas.length > 0 ? `[${usedIdeas.join(', ')}]` : 'None yet.';
  const customPromptText = customPrompt ? `The user has provided a custom challenge: "${customPrompt}". This MUST be the central theme of the riddle.` : 'The user has not provided a custom challenge.';

  const prompt = `
      You are a master game architect. 
      
      **CORE RULE:**
      Never repeat a question, idea, concept, or logical structure. If two riddles share a similar abstract idea, they are duplicates and are FORBIDDEN.
      
      **PAST IDEAS (FORBIDDEN):**
      ${usedIdeasText}
      
      **USER CUSTOMIZATION:**
      ${customPromptText}

      Generate a JSON object for a single visual riddle. The question must be ${difficulty.toUpperCase()} to solve by looking at the generated image.
  `;

  try {
      const textResponse = await ai.models.generateContent({
          model: textModel,
          contents: prompt,
          config: {
              responseMimeType: 'application/json',
              responseSchema: createGenerateQuestionPackageSchema(difficulty),
          },
      });

      const qPkg = JSON.parse(textResponse.text || '{}');

      const imagePrompt = `
        ${qPkg.image_prompt_description}, 
        ${qPkg.visualConcept.cameraAngle}, 
        ${qPkg.visualConcept.timeOfDay}, 
        ${qPkg.visualConcept.artifactCondition}, 
        ${qPkg.visualConcept.backgroundLocation}, 
        ${qPkg.visualConcept.supportingProps.join(', ')},
        epic fantasy art, ancient Egyptian illustration, dark and gritty, high contrast, cinematic lighting, high detail --no ${NEGATIVE_PROMPTS}
      `;

      const imageResponse = await ai.models.generateContent({
          model: imageModel,
          contents: { parts: [{ text: imagePrompt }] },
          config: { imageConfig: { aspectRatio: '1:1' } },
      });
      
      // Fix: Iterate over parts to find the image part with inlineData
      let imagePart = null;
      if (imageResponse.candidates?.[0]?.content?.parts) {
          for (const part of imageResponse.candidates[0].content.parts) {
              if (part.inlineData) {
                  imagePart = part;
                  break;
              }
          }
      }
      
      if (!imagePart?.inlineData) throw new Error("No image part returned from model.");

      const imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;

      return {
          id: `q-${seed}-0`,
          seed,
          type: 'question_image',
          difficulty: qPkg.difficulty,
          imageUrl,
          question: qPkg.question,
          answer: qPkg.answer,
          hints: qPkg.hints,
          idea: qPkg.abstractSummary,
          visualConcept: qPkg.visualConcept,
          metadata: { style: 'craft_v1', color_tags: ['dark', 'gold'] },
      };

  } catch (error: any) {
    console.error(`Generation failed:`, error);
    throw error;
  }
};
