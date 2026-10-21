import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Send,
  Sparkles,
  UtensilsCrossed,
  CalendarHeart,
  ShoppingBag,
  ShieldAlert,
  Bot,
  User,
  Heart,
  Check,
  RefreshCw,
} from 'lucide-react';
import { NestyMascot } from '../common/NestyMascot';

interface ChatMessage {
  id: string;
  sender: 'nesty' | 'user';
  text: string;
  timestamp: string;
  quickAction?: { label: string; url: string };
}

export const NestyChatScreen: React.FC = () => {
  const { profile, phaseInfo, calculateBmi, setIsNotificationOpen } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm-1',
      sender: 'nesty',
      text: `Peep peep! 🐣 Hi ${profile.name.split(' ')[0]}! I'm Nesty, your 24/7 wellness companion. I see you're currently in Day ${phaseInfo.cycleDay} (${phaseInfo.currentPhase} phase) with ${profile.skinType.toLowerCase()} skin and ${profile.hairType.toLowerCase()} hair. What can I help you nourish or soothe today?`,
      timestamp: 'Just now',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const suggestedQuestions = [
    `What should I eat during my ${phaseInfo.currentPhase} phase?`,
    `How can I soothe my ${profile.skinConcerns[0] || 'skin breakouts'}?`,
    `What routine helps my ${profile.hairConcerns[0] || 'hair thinning'}?`,
    'How is my BMI calculated from my height & weight?',
    'What do I do if I experience severe sudden cramps?',
  ];

  const generateNestyResponse = (userPrompt: string): { text: string; action?: { label: string; url: string } } => {
    const q = userPrompt.toLowerCase();
    const bmiData = calculateBmi(profile.heightCm, profile.weightKg);

    if (q.includes('eat') || q.includes('food') || q.includes('diet') || q.includes('phase') || q.includes('follicular') || q.includes('luteal')) {
      return {
        text: `During your ${phaseInfo.currentPhase} phase, your estrogen and metabolism are adjusting. I recommend focusing on ${phaseInfo.selfCareTip}. Check out our Warm Cinnamon Golden Chia bowl or Ayurvedic Kitchari in the Diet Lab!`,
        action: { label: 'Explore Diet Lab Recipes', url: '/healing-plan' },
      };
    }

    if (q.includes('skin') || q.includes('breakout') || q.includes('acne') || q.includes('pore')) {
      return {
        text: `For your ${profile.skinType} skin and ${profile.skinConcerns.join(', ')}, barrier repair is key! Avoid harsh scrubs. Use our Centella & Ceramide Milky Emulsion along with broad-spectrum SPF 50+.`,
        action: { label: 'Browse Skin Care in WellStore', url: '/store' },
      };
    }

    if (q.includes('hair') || q.includes('scalp') || q.includes('thinning') || q.includes('frizz') || q.includes('dandruff')) {
      return {
        text: `With a ${profile.scalpType} scalp and ${profile.hairType} texture, regular Shiroabhyanga massage using cold-pressed rosemary and pumpkin seed oil boosts microcirculation to follicle roots. Try our 4-minute scalp acupressure routine!`,
        action: { label: 'Start 4m Scalp Massage Timer', url: '/healing-plan' },
      };
    }

    if (q.includes('bmi') || q.includes('weight') || q.includes('height')) {
      return {
        text: `Based on your height (${profile.heightCm} cm) and weight (${profile.weightKg} kg), your live BMI is ${bmiData.bmi} (${bmiData.category}). ${bmiData.advice}`,
        action: { label: 'Review Biometrics Profile', url: '/welcome' },
      };
    }

    if (q.includes('cramp') || q.includes('pain') || q.includes('emergency') || q.includes('sos') || q.includes('doctor') || q.includes('bleeding')) {
      return {
        text: `For acute or sudden pelvic pain, please rest, use warm compress patches, and do not hesitate to contact a doctor. You can find nearby emergency hospitals, on-duty OB-GYNs, or call 112 directly through our SOS hub.`,
        action: { label: 'Open Emergency SOS Hub', url: '/sos' },
      };
    }

    return {
      text: `That's a wonderful wellness question, ${profile.name.split(' ')[0]}! Remember that hormonal balance, consistent hydration, and restorative sleep work synergistically. I'm always right here in your nest whenever you need tips or guidance!`,
      action: { label: 'Check Prediction Dashboard', url: '/dashboard' },
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const res = generateNestyResponse(text);
      const nestyMsg: ChatMessage = {
        id: 'nst-' + Date.now(),
        sender: 'nesty',
        text: res.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickAction: res.action,
      };
      setMessages((prev) => [...prev, nestyMsg]);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 h-[calc(100vh-5rem)] flex flex-col space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-violet-600 via-pink-600 to-amber-500 text-white shadow-md flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <NestyMascot mood="happy" size="sm" animate={true} />
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold tracking-tight">Ask Nesty AI</h1>
              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-white/20">
                SC6 • 24/7 Companion
              </span>
            </div>
            <p className="text-[11px] text-pink-100">
              Personalized guidance grounded in your profile: Day {phaseInfo.cycleDay} • {profile.skinType} skin • {profile.scalpType} scalp
            </p>
          </div>
        </div>

        {/* Quick links */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold">
          <Link
            to="/healing-plan"
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Diet Lab
          </Link>
          <Link
            to="/store"
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            Well Store
          </Link>
          <Link
            to="/sos"
            className="px-3 py-1.5 rounded-xl bg-red-500/80 hover:bg-red-500 transition"
          >
            SOS Help
          </Link>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-sm border border-pink-100/80 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {!isUser ? (
                <div className="shrink-0 mt-1">
                  <NestyMascot mood="happy" size="sm" animate={false} />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-pink-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                  {profile.name[0] || 'U'}
                </div>
              )}

              <div className={`max-w-[85%] sm:max-w-md ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white rounded-tr-none'
                      : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* If response has quick action link */}
                  {msg.quickAction && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200">
                      <Link
                        to={msg.quickAction.url}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-pink-600 font-bold text-xs shadow-xs hover:bg-pink-50 transition"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{msg.quickAction.label}</span>
                      </Link>
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block px-1">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <NestyMascot mood="thinking" size="sm" animate={true} />
            <div className="p-3 rounded-2xl bg-slate-100 text-slate-500 text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
              <span>Nesty is thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
          Try asking:
        </span>
        {suggestedQuestions.map((sq, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSendMessage(sq)}
            className="px-3 py-1.5 rounded-full bg-white border border-pink-100 text-[11px] font-semibold text-slate-600 hover:text-pink-600 hover:border-pink-300 hover:bg-pink-50/50 whitespace-nowrap transition shadow-xs"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 shrink-0 bg-white p-2 rounded-2xl border border-pink-200 shadow-sm"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Nesty about symptoms, diet recipes, skin or cycle tips..."
          className="flex-1 px-3 py-2 text-xs sm:text-sm font-medium focus:outline-none"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className={`p-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md hover:opacity-95 transition ${
            !inputText.trim() || isTyping ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
