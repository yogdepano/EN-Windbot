import OpenAI from 'openai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const aiService = {
  async verifyScreenshot(imageUrl: string, requirement: string) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: `This is a screenshot from a game called 'Where Winds Meet'. 
              The user needs to prove they met this requirement: "${requirement}".
              Please look at the image and tell me:
              1. Can you see the 'Week Activity Point' or 'Activity' number?
              2. What is the number?
              3. Does it meet the requirement?
              
              Format your response as a JSON object:
              {
                "detected": boolean,
                "value": number,
                "meets_requirement": boolean,
                "reason": "string"
              }` },
              {
                type: "image_url",
                image_url: {
                  "url": imageUrl,
                },
              },
            ],
          },
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content || '{}');
    } catch (error) {
      console.error('AI Verification Error:', error);
      return { detected: false, error: 'AI Service Unavailable' };
    }
  }
};
