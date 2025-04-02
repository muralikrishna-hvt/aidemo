// Client-side Gemini API client

interface ChatMessage {
  isUserMessage: boolean;
  content: string;
  timestamp: Date;
}

interface ChatCompletionRequest {
  message: string;
  userId: number;
}

export class GeminiClientError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeminiClientError";
  }
}

export async function sendMessage(message: string, userId: number): Promise<ChatMessage> {
  try {
    const response = await fetch('/api/chat/completion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, userId } as ChatCompletionRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new GeminiClientError(errorData.message || 'Failed to get response from AI');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof GeminiClientError) {
      throw error;
    }
    throw new GeminiClientError('Network error while contacting AI service');
  }
}

export async function getChatHistory(userId: number, limit?: number): Promise<ChatMessage[]> {
  try {
    const url = new URL(`/api/chat/history/${userId}`, window.location.origin);
    if (limit) {
      url.searchParams.append('limit', limit.toString());
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new GeminiClientError(errorData.message || 'Failed to get chat history');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof GeminiClientError) {
      throw error;
    }
    throw new GeminiClientError('Network error while retrieving chat history');
  }
}
