import type {
  ApiResponse,
  CounselingSessionSummary,
  Dass21Result,
  MoodTrackerAnalysis,
  UserRole,
  VakModality,
  VakResult,
} from '@safespace/shared';

const BASE_URL = '/api';

export interface AuthSession {
  token: string;
  user: {
    id: string;
    role: UserRole;
    pseudonym: string;
  };
}

export const api = {
  // Auth
  async loginWithGoogleToken(idToken: string): Promise<AuthSession> {
    const res = await fetch(`${BASE_URL}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });
    const json: ApiResponse<AuthSession> = await res.json();
    if (!json.success) {
      throw new Error(json.error.message || 'Gagal login melalui Google');
    }
    return json.data;
  },

  async getMe(token: string): Promise<AuthSession['user']> {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json: ApiResponse<{ user: AuthSession['user'] }> = await res.json();
    if (!json.success) {
      throw new Error(json.error.message || 'Sesi telah kedaluwarsa');
    }
    return json.data.user;
  },

  // Assessments
  async submitDass21(answers: number[], token?: string): Promise<Dass21Result> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/assessment/dass21`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ answers }),
    });
    const json: ApiResponse<Dass21Result> = await res.json();
    if (!json.success) {
      throw new Error(json.error.message || 'Gagal memproses instrumen DASS-21');
    }
    return json.data;
  },

  async submitVak(answers: VakModality[], token?: string): Promise<VakResult> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/assessment/vak`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ answers }),
    });
    const json: ApiResponse<VakResult> = await res.json();
    if (!json.success) {
      throw new Error(json.error.message || 'Gagal memproses instrumen VAK');
    }
    return json.data;
  },

  async analyzeMood(narrative: string, token?: string): Promise<MoodTrackerAnalysis> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/assessment/mood`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ narrative }),
    });
    const json: ApiResponse<MoodTrackerAnalysis> = await res.json();
    if (!json.success) {
      throw new Error(json.error.message || 'Gagal memproses Mood Tracker');
    }
    return json.data;
  },

  // Counseling Sessions / Helpdesk Tickets
  async createTicket(
    token: string,
    payload: { dass21Result?: Dass21Result; vakResult?: VakResult },
  ): Promise<CounselingSessionSummary> {
    const res = await fetch(`${BASE_URL}/sessions/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const json: ApiResponse<CounselingSessionSummary> = await res.json();
    if (!json.success) {
      throw new Error(json.error.message || 'Gagal membuat tiket pra-konseling');
    }
    return json.data;
  },

  async getMySessions(token: string): Promise<CounselingSessionSummary[]> {
    const res = await fetch(`${BASE_URL}/sessions/my`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json: ApiResponse<CounselingSessionSummary[]> = await res.json();
    if (!json.success) {
      throw new Error(json.error.message || 'Gagal memuat daftar sesi');
    }
    return json.data;
  },

  async getCounselorQueue(token: string): Promise<CounselingSessionSummary[]> {
    const res = await fetch(`${BASE_URL}/sessions/queue`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json: ApiResponse<CounselingSessionSummary[]> = await res.json();
    if (!json.success) {
      throw new Error(json.error.message || 'Gagal mengakses antrean konselor');
    }
    return json.data;
  },

  async acceptTicket(token: string, sessionId: string): Promise<CounselingSessionSummary> {
    const res = await fetch(`${BASE_URL}/sessions/${sessionId}/accept`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const json: ApiResponse<CounselingSessionSummary> = await res.json();
    if (!json.success) {
      throw new Error(json.error.message || 'Gagal menerima tiket');
    }
    return json.data;
  },
};
