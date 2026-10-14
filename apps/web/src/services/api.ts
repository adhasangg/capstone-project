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
  async getAuthConfig(): Promise<{ enableSandbox: boolean; googleClientId: string }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/config`);
      if (!res.ok) throw new Error('Failed to fetch auth config');
      const json: ApiResponse<{ enableSandbox: boolean; googleClientId: string }> =
        await res.json();
      if (!json.success || !json.data) throw new Error('Invalid auth config response');
      return json.data;
    } catch {
      return {
        enableSandbox: false,
        googleClientId: '917155815665-km4ltep9rafa9ogn3noc56oa55j5bhd7.apps.googleusercontent.com',
      };
    }
  },

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
    payload: {
      dass21Score?: Dass21Result;
      dass21Result?: Dass21Result;
      vakResult?: VakResult;
    },
  ): Promise<CounselingSessionSummary> {
    const res = await fetch(`${BASE_URL}/sessions/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        dass21Score: payload.dass21Score ?? payload.dass21Result,
        dass21Result: payload.dass21Result ?? payload.dass21Score,
        vakResult: payload.vakResult,
      }),
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

  async getCounselorHistory(token: string): Promise<CounselingSessionSummary[]> {
    const res = await fetch(`${BASE_URL}/sessions/counselor/history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json: ApiResponse<CounselingSessionSummary[]> = await res.json();
    if (!json.success) {
      throw new Error(json.error.message || 'Gagal memuat histori pendampingan konselor');
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

  // Chat / Messages (E2EE)
  async sendChatMessage(
    token: string,
    sessionId: string,
    encryptedContent: string,
    iv?: string,
  ): Promise<{
    id: string;
    sessionId: string;
    senderType: string;
    encryptedContent: string;
    iv?: string | null;
    timestamp: string;
  }> {
    const res = await fetch(`${BASE_URL}/chat/${sessionId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ encryptedContent, iv }),
    });
    const json: ApiResponse<{
      id: string;
      sessionId: string;
      senderType: string;
      encryptedContent: string;
      iv?: string | null;
      timestamp: string;
    }> = await res.json();
    if (!json.success) {
      throw new Error(json.error.message || 'Gagal mengirim pesan');
    }
    return json.data;
  },

  async getChatMessages(
    token: string,
    sessionId: string,
  ): Promise<
    Array<{
      id: string;
      sessionId: string;
      senderType: 'student' | 'counselor' | 'system';
      encryptedContent: string;
      iv?: string | null;
      timestamp: string;
    }>
  > {
    const res = await fetch(`${BASE_URL}/chat/${sessionId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json: ApiResponse<
      Array<{
        id: string;
        sessionId: string;
        senderType: 'student' | 'counselor' | 'system';
        encryptedContent: string;
        iv?: string | null;
        timestamp: string;
      }>
    > = await res.json();
    if (!json.success) {
      throw new Error(json.error.message || 'Gagal memuat pesan');
    }
    return json.data;
  },

  // Admin / Sysadmin Management
  async getAdminUsers(
    token: string,
  ): Promise<Array<{ id: string; role: UserRole; pseudonym: string; createdAt: string }>> {
    const res = await fetch(`${BASE_URL}/auth/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const json: ApiResponse<
      Array<{ id: string; role: UserRole; pseudonym: string; createdAt: string }>
    > = await res.json();
    if (!json.success) {
      throw new Error(json.error.message || 'Gagal memuat daftar pengguna');
    }
    return json.data;
  },

  async updateUserRole(
    token: string,
    userId: string,
    role: UserRole,
  ): Promise<{ id: string; role: UserRole; pseudonym: string }> {
    const res = await fetch(`${BASE_URL}/auth/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ role }),
    });
    const json: ApiResponse<{ id: string; role: UserRole; pseudonym: string }> = await res.json();
    if (!json.success) {
      throw new Error(json.error.message || 'Gagal memperbarui peran pengguna');
    }
    return json.data;
  },
};
