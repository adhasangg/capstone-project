import { Info, Lock } from 'lucide-react';
import type React from 'react';

export const AnonymousBanner: React.FC = () => {
  return (
    <div className="bg-[#E3ECE5]/70 border-b border-[#C7D9CC] py-2 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs text-[#31523A]">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#4A7C59] shrink-0" />
          <span>
            <strong>Jaminan Privasi Penuh:</strong> Identitas asli (NIM/Email) Anda disanitasi
            secara satu arah via SHA-256 kriptografis. Konselor hanya melihat nama samaran Anda.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-[#4A7C59]">
          <Info className="w-3.5 h-3.5" />
          <span>Protokol Double-Blind</span>
        </div>
      </div>
    </div>
  );
};
