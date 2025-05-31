import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { Mic, MicOff, Coffee, CheckCircle, Clock, QrCode, Globe, ArrowRight, Volume2 } from 'lucide-react';

// Types
interface Order {
  id: string;
  items: string[];
  total: number;
  status: 'pending' | 'preparing' | 'ready';
  timestamp: Date;
  language: string;
}

interface VoiceInputResult {
  transcript: string;
  confidence: number;
}

type Language = 'en' | 'hi' | 'ko';

// Context for global app state
const AppContext = createContext<{
  currentLanguage: Language;
  setCurrentLanguage: (lang: Language) => void;
  currentOrder: Order | null;
  setCurrentOrder: (order: Order | null) => void;
}>({
  currentLanguage: 'en',
  setCurrentLanguage: () => {},
  currentOrder: null,
  setCurrentOrder: () => {}
});

// Translations
const translations = {
  en: {
    welcome: "Welcome to BrewBuddy",
    selectLanguage: "Select Your Language",
    startOrder: "Start Voice Order",
    speakOrder: "Press & Hold to Speak Your Order",
    listening: "Listening...",
    processing: "Processing your order...",
    orderSummary: "Order Summary",
    orderNumber: "Order #",
    total: "Total",
    yourQRCode: "Your QR Code",
    trackOrder: "Track Your Order",
    orderStatus: "Order Status",
    pending: "Order Received",
    preparing: "Preparing Your Order",
    ready: "Order Ready!",
    pickupMessage: "🎉 Your delicious coffee is ready! Please show your QR code at the counter.",
    tryAgain: "Try Again",
    newOrder: "New Order",
    backToHome: "Back to Home"
  },
  hi: {
    welcome: "ब्रूबडी में आपका स्वागत है",
    selectLanguage: "अपनी भाषा चुनें",
    startOrder: "वॉइस ऑर्डर शुरू करें",
    speakOrder: "अपना ऑर्डर बोलने के लिए दबाएं और पकड़ें",
    listening: "सुन रहे हैं...",
    processing: "आपका ऑर्डर प्रोसेस कर रहे हैं...",
    orderSummary: "ऑर्डर सारांश",
    orderNumber: "ऑर्डर #",
    total: "कुल",
    yourQRCode: "आपका QR कोड",
    trackOrder: "अपना ऑर्डर ट्रैक करें",
    orderStatus: "ऑर्डर स्थिति",
    pending: "ऑर्डर प्राप्त",
    preparing: "आपका ऑर्डर तैयार कर रहे हैं",
    ready: "ऑर्डर तैयार!",
    pickupMessage: "🎉 आपकी स्वादिष्ट कॉफी तैयार है! कृपया काउंटर पर अपना QR कोड दिखाएं।",
    tryAgain: "फिर कोशिश करें",
    newOrder: "नया ऑर्डर",
    backToHome: "होम पर वापस"
  },
  ko: {
    welcome: "브루버디에 오신 것을 환영합니다",
    selectLanguage: "언어를 선택하세요",
    startOrder: "음성 주문 시작",
    speakOrder: "주문하려면 길게 누르고 말하세요",
    listening: "듣고 있습니다...",
    processing: "주문을 처리하고 있습니다...",
    orderSummary: "주문 요약",
    orderNumber: "주문 #",
    total: "총액",
    yourQRCode: "QR 코드",
    trackOrder: "주문 추적",
    orderStatus: "주문 상태",
    pending: "주문 접수됨",
    preparing: "주문 준비 중",
    ready: "주문 완료!",
    pickupMessage: "🎉 맛있는 커피가 준비되었습니다! 카운터에서 QR 코드를 보여주세요.",
    tryAgain: "다시 시도",
    newOrder: "새 주문",
    backToHome: "홈으로"
  }
};

// Custom Hooks
const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { currentLanguage } = useContext(AppContext);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition not supported');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = currentLanguage === 'en' ? 'en-US' : 
                     currentLanguage === 'hi' ? 'hi-IN' : 'ko-KR';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setTranscript(finalTranscript);
      }
    };

    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, [currentLanguage]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setError(null);
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    isSupported: !!recognitionRef.current
  };
};

const useOrderStatus = (orderId: string | null) => {
  const [status, setStatus] = useState<Order['status']>('pending');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    setIsLoading(true);
    
    // Simulate real-time status updates
    const statusFlow = ['pending', 'preparing', 'ready'] as const;
    let currentIndex = 0;

    const updateStatus = () => {
      if (currentIndex < statusFlow.length) {
        setStatus(statusFlow[currentIndex]);
        currentIndex++;
        
        if (currentIndex < statusFlow.length) {
          setTimeout(updateStatus, 5000); // Update every 5 seconds
        } else {
          setIsLoading(false);
        }
      }
    };

    setTimeout(updateStatus, 1000);
    
    return () => setIsLoading(false);
  }, [orderId]);

  return { status, isLoading };
};

// QR Code Component (Simple implementation)
const QRCodeDisplay: React.FC<{ value: string; size?: number }> = ({ value, size = 200 }) => {
  return (
    <div 
      className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block"
      style={{ width: size + 32, height: size + 32 }}
    >
      <div 
        className="bg-black"
        style={{
          width: size,
          height: size,
          backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
            <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 25 25">
              <rect width="25" height="25" fill="white"/>
              <g fill="black">
                ${Array.from({length: 625}, (_, i) => {
                  const x = i % 25;
                  const y = Math.floor(i / 25);
                  const hash = value.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
                  return Math.abs(hash + x * 7 + y * 11) % 3 === 0 ? `<rect x="${x}" y="${y}" width="1" height="1"/>` : '';
                }).join('')}
              </g>
            </svg>
          `)}")`,
          backgroundSize: 'contain'
        }}
      />
    </div>
  );
};

// Components
const LanguageSelector: React.FC<{ onLanguageSelect: (lang: Language) => void }> = ({ onLanguageSelect }) => {
  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
  ];

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <Coffee className="w-16 h-16 text-amber-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">BrewBuddy</h1>
        <p className="text-gray-600">Select Your Language</p>
      </div>
      
      <div className="space-y-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onLanguageSelect(lang.code)}
            className="w-full p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-amber-500 hover:bg-amber-50 transition-all duration-200 flex items-center justify-between group"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{lang.flag}</span>
              <span className="text-lg font-medium text-gray-800">{lang.name}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};

const HomePage: React.FC<{ onStartOrder: () => void }> = ({ onStartOrder }) => {
  const { currentLanguage } = useContext(AppContext);
  const t = translations[currentLanguage];

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <Coffee className="w-20 h-20 text-amber-600 mx-auto mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-2">BrewBuddy</h1>
      <p className="text-xl text-gray-600 mb-8">{t.welcome}</p>
      
      <button
        onClick={onStartOrder}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
      >
        <Mic className="w-6 h-6 mr-3" />
        {t.startOrder}
      </button>
    </div>
  );
};

const OrderPage: React.FC<{ onOrderComplete: (order: Order) => void }> = ({ onOrderComplete }) => {
  const { currentLanguage } = useContext(AppContext);
  const t = translations[currentLanguage];
  const { isListening, transcript, error, startListening, stopListening, isSupported } = useVoiceInput();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOrderSubmit = async () => {
    if (!transcript.trim()) return;
    
    setIsProcessing(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const order: Order = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        items: transcript.split(',').map(item => item.trim()).filter(Boolean),
        total: Math.floor(Math.random() * 20) + 5,
        status: 'pending',
        timestamp: new Date(),
        language: currentLanguage
      };
      
      onOrderComplete(order);
    } catch (err) {
      console.error('Order submission failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="max-w-md mx-auto p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Speech recognition is not supported in your browser.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{t.speakOrder}</h2>
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
        <div className="text-center mb-6">
          <button
            onMouseDown={startListening}
            onMouseUp={stopListening}
            onTouchStart={startListening}
            onTouchEnd={stopListening}
            disabled={isProcessing}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-200 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 scale-110 shadow-lg' 
                : 'bg-amber-500 hover:bg-amber-600 shadow-md'
            } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? (
              <Volume2 className="w-12 h-12 text-white animate-pulse" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </button>
          
          <p className="text-sm text-gray-600 mt-4">
            {isListening ? t.listening : 'Press and hold to speak'}
          </p>
        </div>

        {transcript && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-gray-800">{transcript}</p>
          </div>
        )}
      </div>

      {transcript && !isProcessing && (
        <button
          onClick={handleOrderSubmit}
          className="w-full bg-green-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-600 transition-colors"
        >
          Place Order
        </button>
      )}

      {isProcessing && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-2"></div>
          <p className="text-gray-600">{t.processing}</p>
        </div>
      )}
    </div>
  );
};

const OrderConfirmation: React.FC<{ order: Order; onTrackOrder: () => void }> = ({ order, onTrackOrder }) => {
  const { currentLanguage } = useContext(AppContext);
  const t = translations[currentLanguage];

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">{t.orderSummary}</h2>
      </div>

      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-gray-800">{t.orderNumber}</span>
          <span className="text-amber-600 font-bold">{order.id}</span>
        </div>
        
        <div className="space-y-2 mb-4">
          {order.items.map((item, index) => (
            <div key={index} className="text-gray-700">• {item}</div>
          ))}
        </div>
        
        <div className="border-t pt-4 flex justify-between items-center">
          <span className="font-semibold text-gray-800">{t.total}</span>
          <span className="text-xl font-bold text-green-600">${order.total}</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t.yourQRCode}</h3>
        <QRCodeDisplay value={`BREWBUDDY-${order.id}`} />
      </div>

      <button
        onClick={onTrackOrder}
        className="w-full bg-blue-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center"
      >
        <Clock className="w-5 h-5 mr-2" />
        {t.trackOrder}
      </button>
    </div>
  );
};

const OrderTracking: React.FC<{ orderId: string; onOrderReady: () => void }> = ({ orderId, onOrderReady }) => {
  const { currentLanguage } = useContext(AppContext);
  const t = translations[currentLanguage];
  const { status } = useOrderStatus(orderId);

  useEffect(() => {
    if (status === 'ready') {
      setTimeout(onOrderReady, 1000);
    }
  }, [status, onOrderReady]);

  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="w-8 h-8 text-blue-500" />;
      case 'preparing':
        return <Coffee className="w-8 h-8 text-amber-500 animate-pulse" />;
      case 'ready':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
    }
  };

  const getStatusText = () => {
    return t[status];
  };

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-8">{t.orderStatus}</h2>
      
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-6">
        <div className="mb-6">
          {getStatusIcon()}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Order #{orderId}</h3>
        <p className="text-lg text-gray-600">{getStatusText()}</p>
        
        <div className="mt-6">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className={`bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000 ${
                status === 'pending' ? 'w-1/3' : 
                status === 'preparing' ? 'w-2/3' : 'w-full'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderReady: React.FC<{ onNewOrder: () => void }> = ({ onNewOrder }) => {
  const { currentLanguage } = useContext(AppContext);
  const t = translations[currentLanguage];

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <div className="mb-8">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-green-600 mb-4">{t.ready}</h2>
        <p className="text-lg text-gray-700 leading-relaxed">{t.pickupMessage}</p>
      </div>

      <button
        onClick={onNewOrder}
        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg"
      >
        {t.newOrder}
      </button>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [currentView, setCurrentView] = useState<'language' | 'home' | 'order' | 'confirmation' | 'tracking' | 'ready'>('language');

  const handleLanguageSelect = (lang: Language) => {
    setCurrentLanguage(lang);
    setCurrentView('home');
  };

  const handleStartOrder = () => {
    setCurrentView('order');
  };

  const handleOrderComplete = (order: Order) => {
    setCurrentOrder(order);
    setCurrentView('confirmation');
  };

  const handleTrackOrder = () => {
    setCurrentView('tracking');
  };

  const handleOrderReady = () => {
    setCurrentView('ready');
  };

  const handleNewOrder = () => {
    setCurrentOrder(null);
    setCurrentView('home');
  };

  return (
    <AppContext.Provider value={{ 
      currentLanguage, 
      setCurrentLanguage, 
      currentOrder, 
      setCurrentOrder 
    }}>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
        <div className="container mx-auto px-4 py-8">
          {currentView === 'language' && (
            <LanguageSelector onLanguageSelect={handleLanguageSelect} />
          )}
          
          {currentView === 'home' && (
            <HomePage onStartOrder={handleStartOrder} />
          )}
          
          {currentView === 'order' && (
            <OrderPage onOrderComplete={handleOrderComplete} />
          )}
          
          {currentView === 'confirmation' && currentOrder && (
            <OrderConfirmation order={currentOrder} onTrackOrder={handleTrackOrder} />
          )}
          
          {currentView === 'tracking' && currentOrder && (
            <OrderTracking orderId={currentOrder.id} onOrderReady={handleOrderReady} />
          )}
          
          {currentView === 'ready' && (
            <OrderReady onNewOrder={handleNewOrder} />
          )}
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;