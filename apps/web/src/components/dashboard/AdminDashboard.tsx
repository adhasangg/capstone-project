import type { UserRole } from '@safespace/shared';
import {
  AlertCircle,
  CheckCircle2,
  Lock,
  RefreshCw,
  Shield,
  ShieldAlert,
  UserCheck,
  Users,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { type AuthSession, api } from '../../services/api';

interface AdminDashboardProps {
  readonly session: AuthSession;
}

interface ManagedUser {
  readonly id: string;
  readonly role: UserRole;
  readonly pseudonym: string;
  readonly createdAt: string;
}

interface UserTableRowProps {
  readonly user: ManagedUser;
  readonly isCurrentUser: boolean;
  readonly isUpdating: boolean;
  readonly onRoleChange: (userId: string, targetRole: UserRole) => void;
}

function UserRoleBadgeCell({ role }: { readonly role: UserRole }) {
  if (role === 'admin') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
        Sysadmin
      </span>
    );
  }
  if (role === 'counselor') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
        Konselor / Dosen BK
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
      Mahasiswa PJJ
    </span>
  );
}

function UserRoleActionButtons({
  user,
  isCurrentUser,
  isUpdating,
  onRoleChange,
}: UserTableRowProps) {
  if (user.role === 'admin') {
    return (
      <span className="text-[11px] font-medium text-slate-400 italic">
        Akun Terproteksi (Tidak Dapat Diubah)
      </span>
    );
  }

  return (
    <>
      {user.role !== 'counselor' && !isCurrentUser && (
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => onRoleChange(user.id, 'counselor')}
          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-pointer disabled:opacity-50"
        >
          Jadikan Konselor/Dosen
        </button>
      )}
      {user.role !== 'student' && !isCurrentUser && (
        <button
          type="button"
          disabled={isUpdating}
          onClick={() => onRoleChange(user.id, 'student')}
          className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
        >
          Ubah ke Mahasiswa
        </button>
      )}
      <button
        type="button"
        disabled={isUpdating}
        onClick={() => onRoleChange(user.id, 'admin')}
        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors cursor-pointer disabled:opacity-50"
      >
        Jadikan Sysadmin
      </button>
    </>
  );
}

function UserTableRow(props: UserTableRowProps) {
  const { user, isCurrentUser } = props;
  return (
    <tr className="hover:bg-slate-50/70 transition-colors">
      <td className="py-3.5 px-4 font-bold text-slate-800">
        <div className="flex items-center gap-2">
          <span>{user.pseudonym}</span>
          {isCurrentUser && (
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              Anda
            </span>
          )}
        </div>
      </td>
      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">{user.id}</td>
      <td className="py-3.5 px-4">
        <UserRoleBadgeCell role={user.role} />
      </td>
      <td className="py-3.5 px-4 text-right space-x-2">
        <UserRoleActionButtons {...props} />
      </td>
    </tr>
  );
}

export function AdminDashboard({ session }: AdminDashboardProps) {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const data = await api.getAdminUsers(session.token);
      setUsers(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal memuat pengguna';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsLoading(false);
    }
  }, [session.token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId: string, targetRole: UserRole) => {
    setUpdatingUserId(userId);
    setMessage(null);
    try {
      await api.updateUserRole(session.token, userId, targetRole);
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: targetRole } : u)));
      setMessage({
        type: 'success',
        text: `Peran pengguna berhasil diperbarui menjadi ${targetRole.toUpperCase()}`,
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal mengubah peran';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setUpdatingUserId(null);
    }
  };

  const studentCount = users.filter((u) => u.role === 'student').length;
  const counselorCount = users.filter((u) => u.role === 'counselor').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
              <Shield className="w-3.5 h-3.5" />
              Sysadmin Dashboard
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100 text-emerald-800">
              <Lock className="w-3 h-3" /> Two-Way Anonymity Aktif
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">
            Pusat Kendali Sistem &amp; Manajemen Peran
          </h1>
          <p className="text-xs text-slate-500">
            Mengelola elevasi peran konselor/dosen pembimbing, memantau integritas akun, dan
            supervisi layanan SafeSpace.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchUsers}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#4A7C59] hover:bg-[#3D6649] text-white text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Segarkan Data
          </button>
        </div>
      </div>

      {/* Notifikasi Status */}
      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Total Pengguna</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-slate-800 mt-2">{users.length}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Identitas terhash SHA-256</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Mahasiswa PJJ</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-2">{studentCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Akses Asesmen &amp; Tiket</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Konselor &amp; Dosen</span>
            <Shield className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-2">{counselorCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Akses Triage &amp; Chat</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Administrator</span>
            <ShieldAlert className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-purple-700 mt-2">{adminCount}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Elevasi &amp; Kontrol Penuh</p>
        </div>
      </div>

      {/* Tabel Manajemen Pengguna */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Daftar Akun Pengguna &amp; Penetapan Peran
            </h3>
            <p className="text-xs text-slate-500">
              Two-Way Anonymity menjamin email asli dan NIM tidak disimpan; Sysadmin mengelola akun
              via Pseudonim &amp; UUID.
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start">
            Total {users.length} Akun
          </span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#4A7C59] mb-2" />
            Memuat daftar pengguna dari database...
          </div>
        ) : users.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Belum ada pengguna terdaftar di sistem.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Pseudonim</th>
                  <th className="py-3 px-4">ID Akun (UUID)</th>
                  <th className="py-3 px-4">Peran Saat Ini</th>
                  <th className="py-3 px-4 text-right">Aksi Elevasi Peran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <UserTableRow
                    key={u.id}
                    user={u}
                    isCurrentUser={u.id === session.user.id}
                    isUpdating={updatingUserId === u.id}
                    onRoleChange={handleRoleChange}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Informasi Parameter Keamanan Sistem */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-xs text-slate-600 space-y-2">
        <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-[#4A7C59]" />
          Konfigurasi Lingkungan &amp; Kebijakan Keamanan
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
            <span className="font-semibold text-slate-700 block">Sysadmin Pre-approved (.env)</span>
            <p className="text-[11px] text-slate-500">
              Email resmi administrator dikonfigurasi melalui variabel lingkungan peladen{' '}
              <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-700">
                ADMIN_EMAILS
              </code>
              . Akun terdaftar otomatis menerima hak akses penuh saat masuk melalui Google OAuth.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
            <span className="font-semibold text-slate-700 block">
              Two-Way Anonymity &amp; E2EE Protocol
            </span>
            <p className="text-[11px] text-slate-500">
              Database tidak menyimpan nama, NIM, atau teks percakapan terbuka. Ruang chat
              dienkripsi menggunakan AES-GCM-256 berbasis Web Crypto API langsung pada peramban
              pengguna.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
