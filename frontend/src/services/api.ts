import { ApiResponse } from '../types';
import {
  MOCK_ARTICLES,
  MOCK_CATEGORIES,
  MOCK_DAILY_BRIEF,
  MOCK_GLOSSARY,
  MOCK_ANALYTICS,
  MOCK_USER,
  MOCK_PREFERENCES,
} from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  code?: string;
  details?: any;
  constructor(message: string, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.details = details;
  }
}

// Client-side fallback handler for static hosting (GitHub Pages)
function getMockFallback<T>(endpoint: string, options: RequestInit = {}): T {
  const method = (options.method || 'GET').toUpperCase();
  const urlPath = endpoint.split('?')[0];

  // 1. Articles list / filter
  if (urlPath === '/news' || urlPath === '/api/news') {
    return {
      articles: MOCK_ARTICLES,
      total: MOCK_ARTICLES.length,
      page: 1,
      total_pages: 1,
    } as unknown as T;
  }

  // 2. Categories
  if (urlPath.includes('/categories')) {
    return MOCK_CATEGORIES as unknown as T;
  }

  // 3. Single Article
  if (urlPath.includes('/article/')) {
    const parts = urlPath.split('/');
    const id = Number(parts[parts.length - 1]);
    const art = MOCK_ARTICLES.find((a) => a.id === id) || MOCK_ARTICLES[0];
    return art as unknown as T;
  }

  // 4. Daily Brief
  if (urlPath.includes('/daily-brief') && !urlPath.includes('/pdf')) {
    return MOCK_DAILY_BRIEF as unknown as T;
  }

  // 5. Contextual Chat
  if (urlPath.includes('/chat')) {
    return {
      answer: 'Analysis shows that market sentiment is predominantly sustained by hyperscale infrastructure capex and cooling headline inflation, supporting cross-asset valuation multiples.',
      is_in_scope: true,
      suggested_followups: ['What is the expected EBITDA impact?', 'How does this affect bond yields?'],
    } as unknown as T;
  }

  // 6. Glossary
  if (urlPath.includes('/glossary')) {
    return MOCK_GLOSSARY as unknown as T;
  }

  // 7. Analytics
  if (urlPath.includes('/analytics')) {
    return MOCK_ANALYTICS as unknown as T;
  }

  // 8. User Profile & Preferences
  if (urlPath.includes('/user/profile') || urlPath.includes('/auth/me')) {
    return MOCK_USER as unknown as T;
  }
  if (urlPath.includes('/user/preferences')) {
    return MOCK_PREFERENCES as unknown as T;
  }

  // 9. Auth Login / Register
  if (urlPath.includes('/auth/login') || urlPath.includes('/auth/register')) {
    return {
      access_token: 'demo_analyst_token_' + Date.now(),
      refresh_token: 'demo_refresh_token',
      user: MOCK_USER,
    } as unknown as T;
  }

  // 10. Bookmarks
  if (urlPath.includes('/bookmarks') && !urlPath.includes('/pdf')) {
    if (method === 'POST') {
      return { id: Date.now(), article_id: 1, folder: 'General' } as unknown as T;
    }
    if (method === 'DELETE') {
      return { success: true } as unknown as T;
    }
    return [
      { id: 1, article_id: 1, folder: 'Macro & AI', article: MOCK_ARTICLES[0] },
      { id: 2, article_id: 2, folder: 'Monetary Policy', article: MOCK_ARTICLES[1] },
    ] as unknown as T;
  }

  // 11. Company
  if (urlPath.includes('/company')) {
    return (MOCK_ARTICLES[0].company || {}) as unknown as T;
  }

  return {} as unknown as T;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('fintech_access_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Handle PDF report downloads (with fallback to bundled static PDFs on GitHub Pages)
  if (endpoint.includes('/pdf')) {
    try {
      const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, { ...options, headers });
      const contentType = response.headers.get('content-type');
      if (response.ok && contentType && contentType.includes('application/pdf')) {
        return (await response.blob()) as unknown as T;
      }
    } catch {
      // fallback to static public PDF
    }
    // Fetch bundled static PDF from public assets
    const basePath = import.meta.env.BASE_URL || '/';
    const fallbackPdfUrl = `${basePath.endsWith('/') ? basePath : basePath + '/'}Executive_Daily_Brief.pdf`;
    const staticResp = await fetch(fallbackPdfUrl);
    if (staticResp.ok) {
      return (await staticResp.blob()) as unknown as T;
    }
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If server responded with valid JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const json: ApiResponse<T> = await response.json();
      if (response.ok && json.success) {
        return json.data;
      }
    }
  } catch (netErr) {
    // Network failed or offline (e.g. static GitHub Pages deployment)
  }

  // Seamless fallback for GitHub Pages and offline client mode
  return getMockFallback<T>(endpoint, options);
}

export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
