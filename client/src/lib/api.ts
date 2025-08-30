// Prefer env-provided base URL; fall back to same-origin "/api" (works with Vite proxy),
// then localhost for safety in non-browser contexts.
const API_BASE_URL: string =
  (import.meta as any)?.env?.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location?.origin
    ? `${window.location.origin}/api`
    : 'http://localhost:5000/api');

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Document analysis
  async analyzeDocument(file: File): Promise<{ analysis: { summary: string; keyPoints: string[]; confidence: number }; documentText: string }> {
    const form = new FormData();
    form.append('file', file);
    const response = await fetch(`${this.baseURL}/analyze`, {
      method: 'POST',
      body: form,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Chat with context
  async chat(question: string, documentText: string): Promise<{ answer: string }> {
    return this.request<{ answer: string }>(`/chat`, {
      method: 'POST',
      body: JSON.stringify({ question, documentText }),
    });
  }

  // Analyze two PDFs
  async analyzeCompare(fileA: File, fileB: File): Promise<{ comparison: { summary: string; keyDifferences: string[]; confidence: number }, leftText: string, rightText: string, differencesText: string }> {
    const form = new FormData();
    form.append('fileA', fileA);
    form.append('fileB', fileB);
    const response = await fetch(`${this.baseURL}/analyze-compare`, {
      method: 'POST',
      body: form,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Chat about differences
  async chatCompare(question: string, leftText: string, rightText: string, differencesText: string): Promise<{ answer: string }> {
    return this.request<{ answer: string }>(`/chat-compare`, {
      method: 'POST',
      body: JSON.stringify({ question, leftText, rightText, differencesText }),
    });
  }

  // Conversations
  async createConversation(payload: { title: string; type?: 'single' | 'compare'; context?: any; initialMessages?: Array<{ role: string; content: string }> }): Promise<{ id: string }> {
    return this.request<{ id: string }>(`/conversations`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async listConversations(): Promise<Array<{ id: string; title: string; type: string; createdAt: string; updatedAt: string }>> {
    return this.request(`/conversations`);
  }

  async getConversation(id: string): Promise<{ id: string; title: string; type: string; context: any; messages: Array<{ role: string; content: string; createdAt: string }>; createdAt: string; updatedAt: string }>{
    return this.request(`/conversations/${id}`);
  }

  async appendMessages(id: string, paired: Array<{ role: 'user' | 'bot'; content: string }>): Promise<{ ok: boolean }>{
    return this.request(`/conversations/${id}/messages`, {
      method: 'POST',
      body: JSON.stringify({ paired }),
    });
  }
  // Authentication methods
  async login(data: LoginData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/auth/profile');
  }

  // Health check
  async healthCheck(): Promise<{ message: string; timestamp: string }> {
    return this.request<{ message: string; timestamp: string }>('/health');
  }
}

export const apiService = new ApiService(); 