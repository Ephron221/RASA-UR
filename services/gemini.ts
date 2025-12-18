
import { GoogleGenAI } from "@google/genai";

// Always use the process.env.API_KEY directly for initialization as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRasaAssistantResponse = async (userPrompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction: `You are the RASA UR-Nyarugenge Assistant. 
        RASA stands for Rwanda Anglican Students Association. 
        It was founded in 1997 at UNR Butare. 
        Motto: Agakiza (Salvation), Urukundo (Love), and Umurimo (Work).
        Key Scripture: Eph 4:13.
        You provide spiritual guidance, info about RASA history, and help members navigate the portal.
        Keep responses professional, spiritual, and friendly.`,
        temperature: 0.7,
      },
    });
    // Access the generated text directly using the .text property
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting right now. How else can I help you with RASA info?";
  }
};
