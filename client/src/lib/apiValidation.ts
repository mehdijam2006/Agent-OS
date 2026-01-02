/**
 * API Validation Module
 * Handles secure API key validation and testing for multiple AI providers
 * Design: Cyberpunk Minimalism - Luxury Terminal Aesthetic
 */

export type ModelProvider = 'openai' | 'gemini' | 'deepseek' | 'qwen';

export interface ValidationResult {
  success: boolean;
  message: string;
  provider: ModelProvider;
  timestamp: number;
}

/**
 * Test OpenAI API key with a simple completion request
 */
export async function validateOpenAIKey(apiKey: string): Promise<ValidationResult> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'Hello',
          },
        ],
        max_tokens: 10,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.error?.message || 'Invalid API key',
        provider: 'openai',
        timestamp: Date.now(),
      };
    }

    return {
      success: true,
      message: 'OpenAI API key validated successfully',
      provider: 'openai',
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      provider: 'openai',
      timestamp: Date.now(),
    };
  }
}

/**
 * Test Gemini API key with a simple generation request
 */
export async function validateGeminiKey(apiKey: string): Promise<ValidationResult> {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: 'Hello',
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.error?.message || 'Invalid API key',
        provider: 'gemini',
        timestamp: Date.now(),
      };
    }

    return {
      success: true,
      message: 'Gemini API key validated successfully',
      provider: 'gemini',
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      provider: 'gemini',
      timestamp: Date.now(),
    };
  }
}

/**
 * Test DeepSeek API key with a simple chat request
 */
export async function validateDeepSeekKey(apiKey: string): Promise<ValidationResult> {
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: 'Hello',
          },
        ],
        max_tokens: 10,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.error?.message || 'Invalid API key',
        provider: 'deepseek',
        timestamp: Date.now(),
      };
    }

    return {
      success: true,
      message: 'DeepSeek API key validated successfully',
      provider: 'deepseek',
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      provider: 'deepseek',
      timestamp: Date.now(),
    };
  }
}

/**
 * Test Qwen API key with a simple request
 */
export async function validateQwenKey(apiKey: string): Promise<ValidationResult> {
  try {
    const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'qwen-turbo',
        input: {
          messages: [
            {
              role: 'user',
              content: 'Hello',
            },
          ],
        },
        parameters: {
          top_p: 0.8,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || 'Invalid API key',
        provider: 'qwen',
        timestamp: Date.now(),
      };
    }

    return {
      success: true,
      message: 'Qwen API key validated successfully',
      provider: 'qwen',
      timestamp: Date.now(),
    };
  } catch (error) {
    return {
      success: false,
      message: `Connection error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      provider: 'qwen',
      timestamp: Date.now(),
    };
  }
}

/**
 * Main validation dispatcher
 */
export async function validateAPIKey(
  provider: ModelProvider,
  apiKey: string
): Promise<ValidationResult> {
  if (!apiKey || apiKey.trim().length === 0) {
    return {
      success: false,
      message: 'API key cannot be empty',
      provider,
      timestamp: Date.now(),
    };
  }

  switch (provider) {
    case 'openai':
      return validateOpenAIKey(apiKey);
    case 'gemini':
      return validateGeminiKey(apiKey);
    case 'deepseek':
      return validateDeepSeekKey(apiKey);
    case 'qwen':
      return validateQwenKey(apiKey);
    default:
      return {
        success: false,
        message: 'Unknown provider',
        provider,
        timestamp: Date.now(),
      };
  }
}

/**
 * Secure storage utilities for API keys in LocalStorage
 */
export const SecureStorage = {
  /**
   * Save API key to LocalStorage with provider prefix
   */
  saveKey(provider: ModelProvider, apiKey: string): void {
    try {
      const key = `agentic_os_${provider}_key`;
      localStorage.setItem(key, apiKey);
    } catch (error) {
      console.error(`Failed to save ${provider} key:`, error);
    }
  },

  /**
   * Retrieve API key from LocalStorage
   */
  getKey(provider: ModelProvider): string | null {
    try {
      const key = `agentic_os_${provider}_key`;
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to retrieve ${provider} key:`, error);
      return null;
    }
  },

  /**
   * Check if API key exists for provider
   */
  hasKey(provider: ModelProvider): boolean {
    return this.getKey(provider) !== null;
  },

  /**
   * Delete API key from LocalStorage
   */
  deleteKey(provider: ModelProvider): void {
    try {
      const key = `agentic_os_${provider}_key`;
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to delete ${provider} key:`, error);
    }
  },

  /**
   * Get all saved providers
   */
  getSavedProviders(): ModelProvider[] {
    const providers: ModelProvider[] = ['openai', 'gemini', 'deepseek', 'qwen'];
    return providers.filter(p => this.hasKey(p));
  },
};
