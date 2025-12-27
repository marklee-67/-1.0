
import { GoogleGenAI, Type } from "@google/genai";

// API Key는 환경변수에서 직접 가져옵니다.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  /**
   * 약봉투/처방전 이미지 분석 (OCR)
   */
  async analyzePrescription(base64Image: string) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { inlineData: { data: base64Image, mimeType: 'image/jpeg' } },
              { text: "이 이미지에서 식별 가능한 모든 약의 이름과 복용법(횟수, 시간)을 추출해줘. 한국어로 JSON 형식으로 답변해." }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              medicines: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    frequency: { type: Type.STRING },
                    instruction: { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      });
      const text = response.text;
      return JSON.parse(text || '{"medicines":[]}');
    } catch (error) {
      console.error("OCR Analysis Error:", error);
      return { medicines: [] };
    }
  },

  /**
   * 약물 간 상호작용 및 위험도 분석
   */
  async checkInteractions(medList: string[]) {
    try {
      const prompt = `다음 약물 및 영양제 리스트를 분석하여 상호작용 위험도를 알려줘: ${medList.join(', ')}. 
      1. 전반적인 위험 등급(Safe, Caution, Danger)
      2. 구체적인 주의사항
      3. 함께 먹으면 좋은 음식/나쁜 음식
      답변은 친절한 약사 말투로 작성해줘.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 2000 }
        }
      });
      return response.text;
    } catch (error) {
      return "분석 중 오류가 발생했습니다. 약사나 의사와 상의하세요.";
    }
  },

  /**
   * 맞춤 건강 팁 생성
   */
  async getDailyHealthTip(userName: string, medCount: number) {
    try {
      const prompt = `${userName}님은 현재 ${medCount}개의 약을 복용 중입니다. 오늘의 날씨나 계절에 맞는 짧은 건강 관리 팁 1가지만 알려줘.`;
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      return response.text;
    } catch (error) {
      return "오늘도 규칙적인 복약으로 건강을 지키세요!";
    }
  }
};
