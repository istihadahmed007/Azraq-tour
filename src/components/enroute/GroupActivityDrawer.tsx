import React, { useState } from 'react';
import { useEnRoute } from '../../context/EnRouteContext';
import { MessageSquare, Send, Radio, Shield, Sparkles, Check, AlertTriangle } from 'lucide-react';

export const GroupActivityDrawer: React.FC = () => {
  const { activityMessages, sendChatMessage, currentUser, isGoldenPathRunning, runGoldenPathDemo } = useEnRoute();
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    sendChatMessage(inputText.trim(), 'chat');
    setInputText('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-white p-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-sky-400 animate-pulse" />
            <h2 className="text-base font-extrabold text-white tracking-tight">Real-Time Sync Stream</h2>
          </div>
          <p className="text-xs text-slate-400">WebSocket Target Latency: &lt;300ms</p>
        </div>

        <button
          onClick={runGoldenPathDemo}
          disabled={isGoldenPathRunning}
          className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 active:scale-95 text-slate-950 text-xs font-extrabold px-3 py-1.5 rounded-xl shadow-lg transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isGoldenPathRunning ? 'Running MVP...' : '1-Tap Golden Path'}</span>
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl p-3 overflow-y-auto space-y-2.5 mb-3">
        {activityMessages.map((msg) => {
          const isMe = msg.senderId === currentUser.userId;
          const isSystem = msg.type === 'system';
          const isDetour = msg.type === 'detour_proposal';
          const isSafety = msg.type === 'safety_alert';
          const isVote = msg.type === 'vote_update';

          const cardBg = isDetour
            ? 'bg-red-950/40 border-red-800/80 text-red-200'
            : isSafety
            ? 'bg-amber-950/40 border-amber-800/80 text-amber-200'
            : isVote
            ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
            : isSystem
            ? 'bg-slate-800/60 border-slate-700/50 text-slate-300'
            : isMe
            ? 'bg-sky-950/50 border-sky-800/50 text-sky-100 ml-auto'
            : 'bg-slate-800/80 border-slate-700/60 text-slate-200 mr-auto';

          return (
            <div
              key={msg.id}
              className={`p-2.5 rounded-xl border text-xs ${cardBg} max-w-[90%] shadow-sm`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 font-bold">
                  {msg.senderAvatar && (
                    <img src={msg.senderAvatar} className="w-4 h-4 rounded-full object-cover" alt="" />
                  )}
                  <span className="text-[11px] text-slate-300">{msg.senderName}</span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">{msg.timestamp}</span>
              </div>
              <p className="leading-relaxed text-[11px]">{msg.text}</p>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message group or broadcast alert..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
        />
        <button
          type="submit"
          className="bg-sky-600 hover:bg-sky-500 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center shadow-lg"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
