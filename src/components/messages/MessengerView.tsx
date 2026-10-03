import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  Video,
  Info,
  Send,
  Smile,
  Image as ImageIcon,
  Mic,
  MicOff,
  Check,
  Search,
  MoreVertical,
  Play,
  Pause,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Conversation, Message, User } from '../../types';
import { NotesBar } from '../notes/NotesBar';
import { playMessageSentSound, playPopSound } from '../../utils/soundEffects';

interface MessengerViewProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onSendMessage: (conversationId: string, message: Partial<Message>) => void;
  onStartCall: (participant: User, type: 'audio' | 'video') => void;
  currentUser: User;
  users: User[];
  onOpenCreateNote: () => void;
  onReplyToNote: (recipient: User, text: string) => void;
}

export const MessengerView: React.FC<MessengerViewProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onSendMessage,
  onStartCall,
  currentUser,
  users,
  onOpenCreateNote,
  onReplyToNote
}) => {
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEmojiBar, setShowEmojiBar] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const recordingTimerRef = useRef<number | null>(null);

  const activeConv =
    conversations.find((c) => c.id === activeConversationId) || conversations[0];

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  // Voice recording simulation timer
  useEffect(() => {
    if (isRecordingVoice) {
      setRecordingSeconds(0);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    }
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, [isRecordingVoice]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    playMessageSentSound();
    onSendMessage(activeConv.id, {
      senderId: currentUser.id,
      text: inputText.trim(),
      timestamp: 'Just now'
    });
    setInputText('');
    setShowEmojiBar(false);
  };

  const handleFinishVoiceRecord = () => {
    if (!activeConv) return;
    setIsRecordingVoice(false);
    playMessageSentSound();
    onSendMessage(activeConv.id, {
      senderId: currentUser.id,
      isAudio: true,
      audioDuration: Math.max(recordingSeconds, 3),
      timestamp: 'Just now'
    });
  };

  const handleAddReaction = (messageId: string, reactionEmoji: string) => {
    playPopSound();
    if (!activeConv) return;
    const msg = activeConv.messages.find((m) => m.id === messageId);
    if (msg) {
      msg.reaction = msg.reaction === reactionEmoji ? undefined : reactionEmoji;
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex h-[calc(100vh-3.5rem)] md:h-screen overflow-hidden bg-white dark:bg-neutral-900">
      {/* LEFT: Conversation List */}
      <div
        className={`w-full md:w-80 lg:w-96 border-r border-neutral-200 dark:border-neutral-800 flex flex-col shrink-0 ${
          mobileShowChat ? 'hidden md:flex' : 'flex'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-neutral-200/80 dark:border-neutral-800/80">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Messages
            </h2>
            <button
              onClick={onOpenCreateNote}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              + Note
            </button>
          </div>

          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats or friends..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Embedded Notes Tray in Messenger (IG / Messenger style) */}
        <NotesBar
          currentUser={currentUser}
          users={users}
          onOpenCreateNote={onOpenCreateNote}
          onReplyToNote={onReplyToNote}
        />

        {/* Chat List Items */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/50">
          {filteredConversations.map((conv) => {
            const isSelected = activeConv?.id === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => {
                  onSelectConversation(conv.id);
                  setMobileShowChat(true);
                }}
                className={`w-full flex items-center gap-3 p-3.5 text-left transition-colors ${
                  isSelected
                    ? 'bg-neutral-100/80 dark:bg-neutral-800/80'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.participant.avatar}
                    alt={conv.participant.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conv.participant.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                      {conv.participant.name}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-medium shrink-0 ml-2">
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      {conv.lastMessage}
                    </p>
                    {conv.unreadCount > 0 && (
                      <span className="ml-2 w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: Active Chat View */}
      {activeConv ? (
        <div
          className={`flex-1 flex flex-col h-full bg-neutral-50/50 dark:bg-neutral-950/50 ${
            !mobileShowChat ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Active Chat Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileShowChat(false)}
                className="md:hidden p-1.5 -ml-1 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="relative">
                <img
                  src={activeConv.participant.avatar}
                  alt={activeConv.participant.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                />
                {activeConv.participant.isOnline && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
                  {activeConv.participant.name}
                </h3>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  {activeConv.participant.isOnline
                    ? 'Active now'
                    : `Active ${activeConv.participant.lastSeen || 'recently'}`}
                </span>
              </div>
            </div>

            {/* Calling Affordances */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onStartCall(activeConv.participant, 'audio')}
                className="p-2.5 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 active:scale-95 transition-all"
                title="Start Voice Call"
                aria-label="Start Voice Call"
              >
                <Phone className="w-5 h-5 stroke-[2.2]" />
              </button>

              <button
                onClick={() => onStartCall(activeConv.participant, 'video')}
                className="p-2.5 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 active:scale-95 transition-all"
                title="Start Video Call"
                aria-label="Start Video Call"
              >
                <Video className="w-5 h-5 stroke-[2.2]" />
              </button>

              <button
                className="p-2 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                aria-label="Chat information"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* Conversation Introduction */}
            <div className="flex flex-col items-center text-center py-6">
              <img
                src={activeConv.participant.avatar}
                alt={activeConv.participant.name}
                referrerPolicy="no-referrer"
                className="w-18 h-18 rounded-full object-cover shadow-md mb-2"
              />
              <h4 className="font-bold text-neutral-900 dark:text-white text-base">
                {activeConv.participant.name}
              </h4>
              <p className="text-xs text-neutral-500 max-w-xs mt-0.5">
                {activeConv.participant.bio || `@${activeConv.participant.username} · webop`}
              </p>
            </div>

            {/* Messages */}
            {activeConv.messages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col group ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div className="relative max-w-[78%] md:max-w-[65%]">
                    {/* Voice Note Bubble */}
                    {msg.isAudio ? (
                      <div
                        className={`px-4 py-3 rounded-2xl flex items-center gap-3 shadow-sm ${
                          isMe
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-sm'
                            : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 rounded-bl-sm'
                        }`}
                      >
                        <button
                          onClick={() => {
                            setPlayingAudioId(playingAudioId === msg.id ? null : msg.id);
                          }}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-95 ${
                            isMe
                              ? 'bg-white text-indigo-600'
                              : 'bg-indigo-600 text-white dark:bg-indigo-500'
                          }`}
                        >
                          {playingAudioId === msg.id ? (
                            <Pause className="w-4 h-4 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </button>

                        <div className="flex-1">
                          {/* Animated Voice Waveform */}
                          <div className="flex items-center gap-0.5 h-6">
                            {[10, 16, 22, 14, 20, 24, 18, 12, 22, 16, 8, 18, 24, 12].map(
                              (height, i) => (
                                <div
                                  key={i}
                                  className={`w-1 rounded-full ${
                                    isMe ? 'bg-white/70' : 'bg-neutral-400 dark:bg-neutral-500'
                                  } ${playingAudioId === msg.id ? 'animate-pulse' : ''}`}
                                  style={{
                                    height: `${height}px`,
                                    animationDelay: `${i * 60}ms`
                                  }}
                                />
                              )
                            )}
                          </div>
                          <span className="text-[10px] opacity-80 font-mono">
                            0:{msg.audioDuration?.toString().padStart(2, '0') || '15'}
                          </span>
                        </div>
                      </div>
                    ) : (
                      /* Text Message Bubble */
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm break-words ${
                          isMe
                            ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-br-sm'
                            : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700/80 rounded-bl-sm'
                        }`}
                      >
                        {msg.text}
                      </div>
                    )}

                    {/* Reaction Badge on Message */}
                    {msg.reaction && (
                      <div className="absolute -bottom-2.5 right-2 px-1.5 py-0.5 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs shadow-sm flex items-center">
                        {msg.reaction}
                      </div>
                    )}

                    {/* Hover Reaction Trigger */}
                    <div
                      className={`hidden group-hover:flex items-center gap-1 absolute top-1/2 -translate-y-1/2 ${
                        isMe ? '-left-20' : '-right-20'
                      }`}
                    >
                      {['❤️', '🔥', '👍'].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleAddReaction(msg.id, emoji)}
                          className="w-6 h-6 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs flex items-center justify-center hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <span className="text-[10px] text-neutral-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Voice Recording Active Banner */}
          {isRecordingVoice && (
            <div className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 border-t border-rose-200 dark:border-rose-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                  Recording audio note... 0:{recordingSeconds.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRecordingVoice(false)}
                  className="text-xs font-medium text-neutral-500 hover:text-neutral-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFinishVoiceRecord}
                  className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-500"
                >
                  Send Voice Note
                </button>
              </div>
            </div>
          )}

          {/* Quick Reaction Emoji Bar */}
          {showEmojiBar && (
            <div className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 flex items-center gap-2 overflow-x-auto">
              {['❤️', '🔥', '😂', '😮', '😍', '👏', '✨', '🙌', '💯'].map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setInputText((prev) => prev + emoji);
                  }}
                  className="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-neutral-700 flex items-center justify-center text-lg active:scale-95 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Chat Message Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 shrink-0"
          >
            <button
              type="button"
              onClick={() => setShowEmojiBar(!showEmojiBar)}
              className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => {
                onSendMessage(activeConv.id, {
                  senderId: currentUser.id,
                  text: 'Check out this aesthetic photography! 📸',
                  timestamp: 'Just now'
                });
              }}
              className="p-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title="Attach Photo"
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {inputText.trim() ? (
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white active:scale-95 transition-all shadow-md shadow-indigo-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRecordingVoice(!isRecordingVoice)}
                className={`p-2.5 rounded-full transition-all ${
                  isRecordingVoice
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-neutral-500 hover:text-indigo-600 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
                title="Record Voice Message"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
      ) : (
        <div className="flex-1 hidden md:flex flex-col items-center justify-center text-center p-6 bg-neutral-50/50 dark:bg-neutral-950/50">
          <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
            <Send className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Your Messages</h3>
          <p className="text-xs text-neutral-500 max-w-xs mt-1">
            Send private photos, audio notes, make HD voice & video calls, and reply to friends’ notes.
          </p>
        </div>
      )}
    </div>
  );
};
