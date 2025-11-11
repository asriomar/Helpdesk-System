
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiSuggestion, TicketPriority } from '../types';

const getGeminiSuggestion = async (description: string): Promise<GeminiSuggestion | null> => {
  try {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      Analyze the following helpdesk ticket description and provide a concise one-sentence summary and a suggested priority level.
      The priority can be one of: "Low", "Medium", "High", "Urgent".
      Base the priority on keywords indicating urgency, impact on productivity, and number of affected users (if mentioned).
      For example, words like "urgent", "cannot work", "deadline" suggest "Urgent" priority. "Slow performance" might be "Medium". A simple question could be "Low".

      Ticket Description:
      "${description}"

      Return the response in the specified JSON format.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A concise one-sentence summary of the user's issue."
            },
            priority: {
              type: Type.STRING,
              description: `The suggested priority level. Must be one of: "Low", "Medium", "High", "Urgent".`,
              enum: [TicketPriority.Low, TicketPriority.Medium, TicketPriority.High, TicketPriority.Urgent],
            }
          },
          required: ["summary", "priority"],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString) as GeminiSuggestion;

    // Validate priority value
    if (Object.values(TicketPriority).includes(result.priority)) {
        return result;
    } else {
        console.error("Invalid priority value received from Gemini:", result.priority);
        // Fallback or correction logic
        return { ...result, priority: TicketPriority.Medium };
    }

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
};

export { getGeminiSuggestion };
