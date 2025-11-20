import { useState, useRef, useEffect } from 'react';
import { Send, X, Minimize2, Maximize2, Sparkles, Globe, Building2, ShoppingCart, Code2, Clock, CheckCircle2, User, Briefcase, Rocket, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { env, features } from '../utils/env';

// Service data structure matching Services.tsx
interface Service {
  icon: React.ReactNode;
  name: string;
  price: string;
  totalAmount?: number;
  description: string;
  features: string[];
  timeline: string;
  ctaText: string;
  depositAmount?: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  serviceCards?: Service[]; // Add service cards to messages
  isStreaming?: boolean; // Flag for streaming animation
}

interface ChatState {
  isOpen: boolean;
  isWelcome: boolean;
  isMinimized: boolean;
}

// Services data - matches Services.tsx
const SERVICES_DATA: Service[] = [
  {
    icon: <Globe className="w-6 h-6" />,
    name: 'Landing Page',
    price: '₹15,000',
    totalAmount: 15000,
    description: '1-2 page website, modern design, mobile responsive',
    features: ['Responsive Design', 'Contact Form', 'Google Analytics', 'SSL Certificate', 'Fast Loading', 'Basic SEO'],
    timeline: '1-2 weeks',
    ctaText: 'Book Now - Pay ₹5,000 Deposit',
    depositAmount: 5000,
  },
  {
    icon: <User className="w-6 h-6" />,
    name: 'Portfolio Website',
    price: '₹20,000',
    totalAmount: 20000,
    description: 'Professional portfolio for freelancers, designers & developers',
    features: ['Project Gallery', 'About & Skills', 'Resume Download', 'Contact Form', 'Testimonials', 'Mobile Responsive'],
    timeline: '2-3 weeks',
    ctaText: 'Book Now - Pay ₹7,000 Deposit',
    depositAmount: 7000,
  },
  {
    icon: <Building2 className="w-6 h-6" />,
    name: 'Business Website',
    price: '₹30,000',
    totalAmount: 30000,
    description: '5-10 pages, professional design, CMS integration',
    features: ['5-10 Pages', 'CMS Integration', 'Blog Section', 'Advanced Analytics', 'SEO Optimization', 'Contact Forms'],
    timeline: '3-4 weeks',
    ctaText: 'Book Now - Pay ₹10,000 Deposit',
    depositAmount: 10000,
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    name: 'Personal Brand Website',
    price: '₹25,000',
    totalAmount: 25000,
    description: 'Build your personal brand for coaches & consultants',
    features: ['About & Services', 'Blog/Articles', 'Email Newsletter', 'Social Media Integration', 'Booking/Calendar', 'SEO & Analytics'],
    timeline: '3 weeks',
    ctaText: 'Book Now - Pay ₹8,000 Deposit',
    depositAmount: 8000,
  },
  {
    icon: <ShoppingCart className="w-6 h-6" />,
    name: 'E-Commerce Store',
    price: '₹50,000',
    totalAmount: 50000,
    description: 'Complete online store with payment gateway & admin panel',
    features: ['Product Catalog', 'Shopping Cart', 'Razorpay/PayPal', 'Inventory Management', 'Order Tracking', 'Admin Dashboard'],
    timeline: '4-6 weeks',
    ctaText: 'Book Now - Pay ₹15,000 Deposit',
    depositAmount: 15000,
  },
  {
    icon: <Rocket className="w-6 h-6" />,
    name: 'SaaS Product',
    price: '₹75,000+',
    totalAmount: 75000,
    description: 'Full-featured SaaS platform with subscriptions',
    features: ['User Authentication', 'Subscription Billing', 'Admin & User Dashboards', 'API Integration', 'Database Design', 'Scalable Architecture'],
    timeline: '6-10 weeks',
    ctaText: 'Book Now - Pay ₹20,000 Deposit',
    depositAmount: 20000,
  },
  {
    icon: <Layers className="w-6 h-6" />,
    name: 'Web Application',
    price: '₹60,000+',
    totalAmount: 60000,
    description: 'Custom web applications with complex features',
    features: ['Custom Requirements', 'Database & Backend', 'User Management', 'Real-time Features', 'Third-party Integrations', 'Responsive Design'],
    timeline: '5-8 weeks',
    ctaText: 'Book Now - Pay ₹18,000 Deposit',
    depositAmount: 18000,
  },
  {
    icon: <Code2 className="w-6 h-6" />,
    name: 'Custom Development',
    price: '₹500-₹1000/hour',
    description: 'Hourly-based custom projects & maintenance',
    features: ['Custom Requirements', 'Full-stack Development', 'API Integration', 'Bug Fixes & Updates', 'Code Reviews', 'Ongoing Support'],
    timeline: 'Flexible',
    ctaText: 'Get Quote - Discuss Project',
  },
];

// Intent detection - detects if user is asking about services, pricing, or specific categories
const detectIntent = (message: string): { showCards: boolean; filteredServices?: Service[] } => {
  const lowerMessage = message.toLowerCase();

  // Specific service type queries
  if (lowerMessage.match(/portfolio|personal.*(website|site)/i)) {
    return { showCards: true, filteredServices: SERVICES_DATA.filter(s => s.name.includes('Portfolio') || s.name.includes('Personal Brand')) };
  }
  if (lowerMessage.match(/ecommerce|e-commerce|online store|shop/i)) {
    return { showCards: true, filteredServices: SERVICES_DATA.filter(s => s.name.includes('E-Commerce')) };
  }
  if (lowerMessage.match(/saas|software.*service|subscription/i)) {
    return { showCards: true, filteredServices: SERVICES_DATA.filter(s => s.name.includes('SaaS')) };
  }
  if (lowerMessage.match(/business.*(website|site)/i)) {
    return { showCards: true, filteredServices: SERVICES_DATA.filter(s => s.name.includes('Business')) };
  }
  if (lowerMessage.match(/landing.*page|simple.*(website|site)/i)) {
    return { showCards: true, filteredServices: SERVICES_DATA.filter(s => s.name.includes('Landing')) };
  }

  // General service/pricing queries
  if (lowerMessage.match(/service|what.*offer|pricing|price|cost|how much|package|plan/i)) {
    return { showCards: true, filteredServices: SERVICES_DATA.slice(0, 4) }; // Show top 4 popular services
  }

  // Show all services
  if (lowerMessage.match(/show.*all|view.*all|see.*all.*service/i)) {
    return { showCards: true, filteredServices: SERVICES_DATA };
  }

  return { showCards: false };
};

// Streaming effect for typewriter animation
const useStreamingText = (finalText: string, isActive: boolean, speed: number = 15) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!isActive || !finalText) {
      setDisplayedText(finalText);
      setIsComplete(true);
      return;
    }

    setDisplayedText('');
    setIsComplete(false);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < finalText.length) {
        setDisplayedText(finalText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [finalText, isActive, speed]);

  return { displayedText, isComplete };
};

// Service Card Component - Mini version for chat
const ServiceCardInChat = ({ service }: { service: Service }) => {
  const handleBooking = () => {
    // Scroll to services section on main page
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
      // Close chat to show services
      window.dispatchEvent(new CustomEvent('close-ai-chat'));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-slate-800/90 p-4 rounded-xl border border-slate-600/50 hover:border-cyan-500/50 transition-all shadow-lg backdrop-blur-sm"
    >
      {/* Icon & Title */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
          {service.icon}
        </div>
        <div>
          <h4 className="font-bold text-white text-sm">{service.name}</h4>
          <p className="text-cyan-400 font-bold text-lg">{service.price}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-300 text-xs mb-3 leading-relaxed">{service.description}</p>

      {/* Timeline */}
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-3 h-3 text-cyan-400" />
        <span className="text-xs text-slate-400">{service.timeline}</span>
      </div>

      {/* Features (show only 3) */}
      <ul className="space-y-1 mb-3">
        {service.features.slice(0, 3).map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
        {service.features.length > 3 && (
          <li className="text-xs text-slate-400 ml-5">+{service.features.length - 3} more features</li>
        )}
      </ul>

      {/* CTA Button */}
      <button
        onClick={handleBooking}
        className="w-full py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
      >
        {service.ctaText}
      </button>
    </motion.div>
  );
};

// Message Bubble Component with Streaming
const MessageBubble = ({ message, isStreaming }: { message: Message; isStreaming: boolean }) => {
  const { displayedText } = useStreamingText(message.content, isStreaming, 15);
  const contentToShow = isStreaming ? displayedText : message.content;

  return (
    <div className="space-y-3">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
      >
        <motion.div
          className={`max-w-xs md:max-w-sm px-4 py-3 rounded-2xl ${
            message.role === 'user'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-lg'
              : 'bg-slate-700/80 text-slate-100 rounded-bl-none border border-slate-600/50 backdrop-blur-sm'
          }`}
        >
          <div className="text-sm md:text-base leading-relaxed break-words">
            {message.role === 'user' ? (
              <p className="whitespace-pre-wrap">{message.content}</p>
            ) : (
              <div>
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 last:mb-0 text-slate-100">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-bold text-white">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-slate-50">{children}</em>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc list-inside mb-2 space-y-1 text-slate-100">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="list-decimal list-inside mb-2 space-y-1 text-slate-100">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => <li className="ml-2">{children}</li>,
                    code: ({ children, ...props }: any) =>
                      props.inline ? (
                        <code className="bg-slate-800/50 px-2 py-0.5 rounded text-cyan-300 font-mono text-xs">
                          {children}
                        </code>
                      ) : (
                        <code className="block bg-slate-800/50 px-3 py-2 rounded my-2 text-cyan-300 font-mono text-xs overflow-x-auto">
                          {children}
                        </code>
                      ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-cyan-500 pl-3 my-2 italic text-slate-300">
                        {children}
                      </blockquote>
                    ),
                    h1: ({ children }) => <h1 className="text-lg font-bold mt-2 mb-1">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-base font-bold mt-2 mb-1">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-bold mt-2 mb-1">{children}</h3>,
                    a: ({ children, href }) => (
                      <a
                        href={href}
                        className="text-cyan-400 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {contentToShow}
                </ReactMarkdown>
                {isStreaming && <span className="inline-block w-1 h-4 bg-cyan-400 ml-1 animate-pulse" />}
              </div>
            )}
          </div>
          <p
            className={`text-xs mt-2.5 ${
              message.role === 'user' ? 'text-cyan-100' : 'text-slate-400'
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </motion.div>
      </motion.div>

      {/* Render Service Cards if present */}
      {message.serviceCards && message.serviceCards.length > 0 && !isStreaming && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 gap-3 ml-0"
        >
          {message.serviceCards.map((service, idx) => (
            <ServiceCardInChat key={idx} service={service} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default function AIChatbot() {
  const [chatState, setChatState] = useState<ChatState>({
    isOpen: false,
    isWelcome: true,
    isMinimized: false,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleOpenChat = () => {
    setChatState({
      isOpen: true,
      isWelcome: true,
      isMinimized: false,
    });
  };

  const handleCloseChat = () => {
    setChatState({
      isOpen: false,
      isWelcome: true,
      isMinimized: false,
    });
  };

  const handleStartChat = () => {
    setChatState((prev) => ({
      ...prev,
      isWelcome: false,
    }));
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userInput = inputValue;
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Detect intent before API call
    const intent = detectIntent(userInput);

    try {
      // Check if AI chat feature is available
      if (!features.hasAIChat) {
        throw new Error('AI chat system is not configured');
      }

      const apiUrl = `${env.SUPABASE_URL}/functions/v1/ai-chatbot`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          message: userInput,
          // Only send last 6 messages for better context (Gemini Flash handles this well)
          conversationHistory: messages.slice(-6).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();

      if (data.success && data.message) {
        const assistantMessageId = (Date.now() + 1).toString();
        const assistantMessage: Message = {
          id: assistantMessageId,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          serviceCards: intent.showCards ? intent.filteredServices : undefined,
          isStreaming: true,
        };

        // Add message and start streaming effect
        setMessages((prev) => [...prev, assistantMessage]);
        setStreamingMessageId(assistantMessageId);

        // Stop streaming after text is done
        setTimeout(() => {
          setStreamingMessageId(null);
          setMessages(prev => prev.map(msg =>
            msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
          ));
        }, data.message.length * 15 + 100); // Calculate based on text length

      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I encountered a temporary issue. Please try again in a moment.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Connection error. Please check your internet and try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {!chatState.isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={handleOpenChat}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 w-16 h-16 md:w-20 md:h-20 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, #0891b2 0%, #0284c7 50%, #0369a1 100%)',
              boxShadow: '0 20px 50px rgba(8, 145, 178, 0.4), 0 0 60px rgba(8, 145, 178, 0.2)',
            }}
          >
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(8, 145, 178, 0.5)',
                  '0 0 40px rgba(8, 145, 178, 0.8)',
                  '0 0 20px rgba(8, 145, 178, 0.5)',
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
            />

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border border-transparent"
              style={{
                borderImage: 'linear-gradient(135deg, transparent, rgba(255,255,255,0.3), transparent) 1',
              }}
            />

            <div className="relative flex flex-col items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </motion.div>
              <span className="text-xs font-bold text-white mt-1">Elite AI</span>
            </div>

            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full shadow-lg"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              className="absolute -bottom-1 -right-1 w-3 h-3 bg-cyan-300 rounded-full shadow-lg"
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatState.isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-8 z-50 w-[calc(100%-2rem)] sm:w-96 md:max-w-md overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-700 flex flex-col"
            style={{
              height: 'min(calc(100vh - 8rem), 600px)',
              maxHeight: 'calc(100vh - 2rem)',
              background: 'linear-gradient(135deg, #0f172a 0%, #1a1f35 50%, #111827 100%)',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(8, 145, 178, 0.15)',
            }}
          >
            <motion.div
              className="relative overflow-hidden p-4 md:p-6"
              style={{
                background: 'linear-gradient(135deg, #0891b2 0%, #0284c7 50%, #0369a1 100%)',
              }}
            >
              <motion.div
                animate={{ x: [-100, 100] }}
                transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
                className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage:
                    'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                }}
              />

              <div className="relative flex items-center justify-between">
                <div className="space-y-1">
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg md:text-xl font-bold text-white flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Elite AI Assistant
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-xs md:text-sm text-cyan-100"
                  >
                    Premium Expertise • Instant Insights
                  </motion.p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setChatState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }))}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {chatState.isMinimized ? (
                      <Maximize2 className="w-5 h-5 text-white" />
                    ) : (
                      <Minimize2 className="w-5 h-5 text-white" />
                    )}
                  </button>
                  <button
                    onClick={handleCloseChat}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>

            {chatState.isMinimized && (
              <div className="flex-1 flex items-center justify-center bg-slate-800/50">
                <p className="text-slate-300 text-center px-4 text-sm">Expand to continue conversation</p>
              </div>
            )}

            {!chatState.isMinimized && chatState.isWelcome && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center space-y-4 sm:space-y-6 bg-gradient-to-b from-slate-900/50 via-slate-800 to-slate-900"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, type: 'spring' }}
                  className="relative"
                >
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(8, 145, 178, 0.3)',
                        '0 0 50px rgba(8, 145, 178, 0.6)',
                        '0 0 20px rgba(8, 145, 178, 0.3)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl"
                  >
                    <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2 sm:space-y-3"
                >
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Premium Consultation
                  </h3>
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                    Experience elite expertise in web development, SaaS, e-commerce & digital solutions.
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Sudharsan's AI delivers exceptional insights tailored to your needs.
                  </p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.08, boxShadow: '0 20px 40px rgba(8, 145, 178, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartChat}
                  className="mt-6 sm:mt-8 px-6 sm:px-8 md:px-10 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl shadow-lg transition-all text-xs sm:text-sm md:text-base"
                >
                  Start Premium Chat
                </motion.button>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xs text-slate-400 mt-3 sm:mt-4"
                >
                  ✓ Instant responses • ✓ Expert insights • ✓ 24/7
                </motion.p>
              </motion.div>
            )}

            {!chatState.isMinimized && !chatState.isWelcome && (
              <>
                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                  {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-center space-y-3"
                      >
                        <div className="text-4xl">💬</div>
                        <p className="text-slate-400 text-sm">Start a conversation</p>
                      </motion.div>
                    </div>
                  )}

                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isStreaming={message.isStreaming && streamingMessageId === message.id}
                    />
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-slate-700/80 text-slate-100 px-5 py-4 rounded-2xl rounded-bl-none border border-slate-600/50 backdrop-blur-sm flex items-center gap-3">
                        <div className="flex gap-2">
                          <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                            className="w-2 h-2 bg-cyan-400 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                            className="w-2 h-2 bg-cyan-400 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-cyan-400 rounded-full"
                          />
                        </div>
                        <span className="text-xs text-slate-400 ml-2">Thinking...</span>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                <div
                  className="border-t p-3 sm:p-4 md:p-6 backdrop-blur-lg"
                  style={{
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                    borderTopColor: 'rgba(8, 145, 178, 0.2)',
                  }}
                >
                  <div className="flex gap-2 sm:gap-3 mb-2">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything..."
                      disabled={isLoading}
                      className="flex-1 bg-slate-700/60 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-slate-600/50 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all text-sm placeholder-slate-500 disabled:opacity-50 backdrop-blur-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={handleSendMessage}
                      disabled={isLoading || !inputValue.trim()}
                      className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex-shrink-0"
                    >
                      <Send className="w-5 h-5" />
                    </motion.button>
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-slate-500 px-1"
                  >
                    ↵ Enter to send • Powered by Gemini AI
                  </motion.p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}