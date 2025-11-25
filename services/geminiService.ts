import { GoogleGenAI, Type } from "@google/genai";
import { NodeData, EdgeData } from "../types";

const apiKey = process.env.API_KEY || '';

// We will recreate the instance on each call if needed, or check validity.
// Since we can't force user input in a simple function without UI, we assume env is set.
// But for robustness in this demo, if no key, we return mocked data or error.

export const analyzeWorkflow = async (nodes: NodeData[], edges: EdgeData[]) => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const workflowDescription = JSON.stringify({ nodes, edges }, null, 2);
  
  const prompt = `
    You are an expert in Data Mining and the Orange3 Python library.
    Analyze the following visual programming workflow (nodes and edges).
    
    1. Summarize what this data mining pipeline does.
    2. Generate the equivalent Python code using 'import Orange'.
    3. Provide 3 key insights or suggestions for this workflow.

    Workflow JSON:
    ${workflowDescription}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          pythonCode: { type: Type.STRING },
          insights: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      }
    }
  });

  return JSON.parse(response.text || '{}');
};
