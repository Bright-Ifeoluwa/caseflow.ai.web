import { GoogleGenAI, Type } from "@google/genai";

// Support both AI Studio's process.env and Vite's import.meta.env for Vercel
const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export const legalDomainSchema = {
  type: Type.OBJECT,
  properties: {
    domain: {
      type: Type.STRING,
      description: "The legal domain identified (e.g., constitutional_law, criminal_law, etc.)",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score from 0 to 1",
    },
    reasoning: {
      type: Type.STRING,
      description: "Brief reasoning for the domain selection",
    }
  },
  required: ["domain", "confidence"]
};

export const legalAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    issue: { type: Type.STRING },
    relevantLaw: { type: Type.STRING },
    authorities: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of cases or statutes cited"
    },
    legalReasoning: { type: Type.STRING },
    conclusion: { type: Type.STRING }
  },
  required: ["issue", "relevantLaw", "authorities", "legalReasoning", "conclusion"]
};

export async function routeLegalDomain(query: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: `Identify the legal domain for this query in the context of Nigerian Law: "${query}". 
    Possible domains: constitutional_law, criminal_law, civil_litigation, labour_law, electoral_law, administrative_law.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: legalDomainSchema,
      systemInstruction: "You are a Nigerian Legal Domain Router. Your job is to classify legal queries into specific domains of Nigerian jurisprudence."
    }
  });
  return JSON.parse(response.text);
}

export async function generateLegalAnalysis(query: string, domain: string, context: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Query: "${query}"\nDomain: ${domain}\nContext: ${context}\n\nProvide a structured legal analysis following Nigerian jurisprudence. Use Google Search to find the most recent cases or statutory amendments if necessary.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: legalAnalysisSchema,
      tools: [{ googleSearch: {} }],
      systemInstruction: "You are CaseFlow AI, a Senior Legal Counsel in Nigeria. Provide rigorous, authority-weighted legal reasoning. Cite specific Nigerian cases and statutes. If you use information from Google Search, ensure it is from reputable legal sources like the Supreme Court of Nigeria, Policy and Legal Advocacy Centre (PLAC), or LawCareNigeria."
    }
  });
  
  const text = response.text;
  const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
  
  return {
    ...JSON.parse(text),
    sources: groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title,
      uri: chunk.web?.uri
    })).filter((s: any) => s.title && s.uri) || []
  };
}

export async function analyzeDocument(base64Data: string, mimeType: string, prompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType } },
        { text: prompt }
      ]
    },
    config: {
      systemInstruction: "You are an expert Nigerian Legal Document Analyst. Review the provided document (contract, judgment, or brief) and respond to the user's prompt with precise legal analysis, identifying risks, loopholes, or key holdings."
    }
  });
  return response.text;
}

export async function draftCourtProcess(processType: string, details: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Draft a ${processType} based on the following details:\n\n${details}`,
    config: {
      systemInstruction: "You are a Senior Litigation Draftsman in Nigeria. Draft formal court processes (e.g., Motion on Notice, Affidavit, Statement of Claim) strictly adhering to the High Court Civil Procedure Rules. Use appropriate legal formatting, headings, and formal language. Format the output in Markdown."
    }
  });
  return response.text;
}

export async function fetchRealStatuteData(actName: string, query?: string) {
  const prompt = query 
    ? `Fetch real, accurate sections from the Nigerian "${actName}" related to: "${query}". Provide the exact text of the sections.\n\nReturn ONLY a valid JSON array of objects with these keys: id (string), actName (string), chapter (string), section (string), subsection (string), title (string), content (string), legalDomain (string). Do not include markdown formatting like \`\`\`json. If you cannot find the exact text, provide a highly accurate summary of the section based on your knowledge of Nigerian law, but YOU MUST RETURN IT IN THE EXACT JSON FORMAT.`
    : `Fetch the first 10 most important or foundational sections from the Nigerian "${actName}". Provide the exact text of the sections.\n\nReturn ONLY a valid JSON array of objects with these keys: id (string), actName (string), chapter (string), section (string), subsection (string), title (string), content (string), legalDomain (string). Do not include markdown formatting like \`\`\`json. If you cannot find the exact text, provide a highly accurate summary of the section based on your knowledge of Nigerian law, but YOU MUST RETURN IT IN THE EXACT JSON FORMAT.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", // Use flash for much faster statute retrieval
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a Nigerian Legal Database. Your job is to retrieve the exact, real text of Nigerian statutes and the Constitution. Never hallucinate laws. If you are unsure, use Google Search to find the exact wording of the sections requested. Return the data ONLY as a raw JSON array of objects."
      }
    });
    
    const text = response.text || "[]";
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e: any) {
    console.error("Failed to fetch statute data", e);
    if (e?.status === 429 || e?.message?.includes('429') || e?.message?.includes('quota')) {
      throw new Error("AI Quota Exceeded. Please try again later or check your API plan.");
    }
    return [];
  }
}

export async function semanticLegalSearch(query: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `User Query: "${query}"\n\nProvide a comprehensive legal answer based on Nigerian law. You MUST use the IRAC (Issue, Rule, Application, Conclusion) methodology. Cite relevant cases, statutes, and regulatory guidelines (e.g., CBN, SEC, NITDA, NCC). Include "Citation Intelligence" by noting if cited cases have been Followed, Distinguished, or Overruled. If the query involves conflicting regulations, analyze the hierarchy of laws and specific jurisdictional boundaries.`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a Nigerian Legal Research Assistant and Senior Counsel. Translate the user's query into legal concepts, explain the position of the law using strict IRAC methodology, and cite relevant Nigerian cases, statutes, and regulatory frameworks. Use Google Search to find recent authorities, regulatory circulars, and verify citation status (Followed/Overruled). Pay special attention to intersecting regulatory bodies like CBN, NITDA, and NCC."
      }
    });
    
    const text = response.text;
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    
    return {
      text,
      sources: groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        title: chunk.web?.title,
        uri: chunk.web?.uri
      })).filter((s: any) => s.title && s.uri) || []
    };
  } catch (e: any) {
    console.error("Semantic search failed", e);
    if (e?.status === 429 || e?.message?.includes('429') || e?.message?.includes('quota')) {
      throw new Error("AI Quota Exceeded. Please try again later or check your API plan.");
    }
    throw e;
  }
}

export const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    winProbability: { type: Type.NUMBER, description: "Estimated probability of success (0-100)" },
    predictedOutcome: { type: Type.STRING, description: "The likely judgment or outcome" },
    keyPrecedents: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of controlling Supreme Court or Court of Appeal cases"
    },
    riskFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Weaknesses or risks in the fact pattern"
    },
    reasoning: { type: Type.STRING, description: "Detailed IRAC-based reasoning for the prediction" }
  },
  required: ["winProbability", "predictedOutcome", "keyPrecedents", "riskFactors", "reasoning"]
};

export async function predictCaseOutcome(facts: string, domain: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Facts of the Case:\n${facts}\n\nLegal Domain: ${domain}\n\nAnalyze these facts under Nigerian Law and predict the likely outcome. Identify key precedents, risk factors, and provide a win probability.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: predictionSchema,
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are an expert Nigerian Appellate Judge and Litigation Strategist. Analyze the facts objectively, apply binding Nigerian precedent (stare decisis), and predict the outcome. Be realistic about risks and probabilities."
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (e: any) {
    console.error("Prediction failed", e);
    throw new Error("Failed to generate prediction. Please try again.");
  }
}
