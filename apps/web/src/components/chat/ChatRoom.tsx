import { ArrowLeft, CheckCircle2, Lock, Send, User } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import type { AuthSession } from '../../services/api';

interface ChatMessage {
  id: string;
  senderType: 'student' | 'counselor';
  senderPseudonym: string;
  text: string;
  timestamp: string;
  isEncrypted: boolean;
}

interface ChatRoomProps {
  sessionId: string;
  session: AuthSession;
  onBack: () => void;
}

export const ChatRoom: React.FC<ChatRoomProps> = ({ sessionId, session, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcoming message
  useEffect(() => {
    const isCounselor = session.user.role === 'counselor' || session.user.role === 'admin';
    const welcomeMessages: ChatMessage[] = [
      {
        id: 'msg-0',
        senderType: 'counselor',
        senderPseudonym: isCounselor ? session.user.pseudonym : 'Konselor Pendamping',
        text: 'Halo! Selamat datang di ruang pra-konseling aman SafeSpace UT. Ruang obrolan ini sepenuhnya terenkripsi dua arah dan tanpa penghakiman. Apa yang ingin kamu bicarakan hari ini?',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        isEncrypted: true,
      },
    ];
    setMessages(welcomeMessages);
  }, [session.user.role, session.user.pseudonym]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const isCounselor = session.user.role === 'counselor' || session.user.role === 'admin';
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderType: isCounselor ? 'counselor' : 'student',
      senderPseudonym: session.user.pseudonym,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleQuickPill = (pillText: string) => {
    setInputText(pillText);
  };

  const isUserSender = (msg: ChatMessage) => {
    const isCounselor = session.user.role === 'counselor' || session.user.role === 'admin';
    return (
      (isCounselor && msg.senderType === 'counselor') ||
      (!isCounselor && msg.senderType === 'student')
    );
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Chatroom Header */}
      <div className="p-4 bg-[#F9F9F6] border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-[#1E293B]">
                Ruang Pra-Konseling #{sessionId.slice(0, 8)}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Aktif
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-[#4A7C59]">
              <Lock className="w-3 h-3" />
              <span>Terkunci Enkripsi End-to-End (E2EE) • Double-Blind Anonim</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAFBF9]">
        {messages.map((msg) => {
          const isMe = isUserSender(msg);
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-500">
                <User className="w-3 h-3" />
                <span className="font-semibold">{msg.senderPseudonym}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>
              <div
                className={`max-w-[85%] sm:max-w-[70%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isMe
                    ? 'bg-[#4A7C59] text-white rounded-br-xs shadow-xs'
                    : 'bg-white text-[#1E293B] border border-slate-200 rounded-bl-xs shadow-2xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Pill Icebreakers for conversation flow */}
      <div className="px-4 py-2 bg-[#F9F9F6] border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-[11px] font-semibold text-slate-500 shrink-0">Pill:</span>
        <button
          type="button"
          onClick={() => handleQuickPill('Saya merasa sangat tertekan dengan tugas kuliah.')}
          className="px-2.5 py-1 bg-white hover:bg-[#E3ECE5] border border-slate-200 rounded-full text-slate-700 text-xs shrink-0 cursor-pointer"
        >
          Kewalahan tugas
        </button>
        <button
          type="button"
          onClick={() =>
            handleQuickPill('Bisakah konselor merekomendasikan ritme belajar yang tepat?')
          }
          className="px-2.5 py-1 bg-white hover:bg-[#E3ECE5] border border-slate-200 rounded-full text-slate-700 text-xs shrink-0 cursor-pointer"
        >
          Rekomendasi ritme belajar
        </button>
        <button
          type="button"
          onClick={() => handleQuickPill('Terima kasih banyak atas saran dan pendampingannya.')}
          className="px-2.5 py-1 bg-white hover:bg-[#E3ECE5] border border-slate-200 rounded-full text-slate-700 text-xs shrink-0 cursor-pointer"
        >
          Terima kasih
        </button>
      </div>

      {/* Message Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ketik pesan aman Anda di sini..."
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-[#4A7C59] focus:ring-2 focus:ring-[#4A7C59]/20 outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="px-4 py-2.5 bg-[#4A7C59] hover:bg-[#3D6649] text-white rounded-xl shadow-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
        >
          <span>Kirim</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
