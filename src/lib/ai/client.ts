import OpenAI from 'openai';

let openaiInstance: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error(
        'Missing OpenAI API key. Please set OPENAI_API_KEY environment variable.'
      );
    }
    
    openaiInstance = new OpenAI({ apiKey });
  }
  
  return openaiInstance;
}

export const DEFAULT_MODEL = 'gpt-4o-mini';
export const MAX_TOKENS = 4000;
export const TEMPERATURE = 0.1;

export interface OpenAICallOptions {
  model?: string;
  maxTokens?: number;
  temperature?: number;
  responseFormat?: { type: 'json_object' };
}

export async function callOpenAI<T>(
  systemPrompt: string,
  userPrompt: string,
  options: OpenAICallOptions = {}
): Promise<{ data: T | null; error: string | null; tokensUsed: number }> {
  try {
    const openai = getOpenAIClient();
    
    const response = await openai.chat.completions.create({
      model: options.model || DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_tokens: options.maxTokens || MAX_TOKENS,
      temperature: options.temperature ?? TEMPERATURE,
      response_format: options.responseFormat || { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      return {
        data: null,
        error: 'Empty response from OpenAI',
        tokensUsed: response.usage?.total_tokens || 0,
      };
    }

    try {
      const parsedData = JSON.parse(content) as T;
      return {
        data: parsedData,
        error: null,
        tokensUsed: response.usage?.total_tokens || 0,
      };
    } catch (parseError) {
      return {
        data: null,
        error: `Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
        tokensUsed: response.usage?.total_tokens || 0,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown OpenAI error';
    return {
      data: null,
      error: errorMessage,
      tokensUsed: 0,
    };
  }
}
