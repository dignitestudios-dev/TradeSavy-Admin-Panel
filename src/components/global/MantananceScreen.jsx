import { useState, useEffect } from 'react';
import { Wrench, Mail, Clock } from 'lucide-react';

export default function MaintenanceScreen() {
  const [dots, setDots] = useState('');

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-800 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-4xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-16 text-center border border-white/20">
          
          {/* Logo with glow effect */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <img 
                src="/logo.png" 
                alt="Trade Savvy Logo" 
                className="relative w-40 h-40 md:w-52 md:h-52 object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-blue-500/20 p-4 rounded-full backdrop-blur-sm border border-blue-400/30">
              <Wrench className="w-12 h-12 text-blue-300 animate-bounce" />
            </div>
          </div>

          {/* Main Heading with gradient text */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent animate-pulse">
            Under Maintenance
          </h1>

          {/* Animated subtitle */}
          <h2 className="text-2xl md:text-3xl font-semibold text-blue-100 mb-8">
            We'll Be Back Soon{dots}
          </h2>

          {/* Description */}
          <p className="text-blue-200 text-lg md:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
            Trade Savvy is currently undergoing scheduled maintenance to bring you 
            an even better trading experience. We're working hard to serve you better!
          </p>

          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Clock className="w-8 h-8 text-blue-300 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Expected Duration</h3>
              <p className="text-blue-200 text-sm">We aim to be back within a few hours</p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
              <Mail className="w-8 h-8 text-blue-300 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Need Help?</h3>
              <p className="text-blue-200 text-sm">support@tradesavvy.com</p>
            </div>
          </div>

          {/* Tagline */}
          <div className="inline-block bg-gradient-to-r from-blue-500/20 to-indigo-500/20 backdrop-blur-sm px-8 py-3 rounded-full border border-blue-400/30 mb-8">
            <p className="text-blue-100 italic font-medium">
              ✨ No one does it like Trade Savvy
            </p>
          </div>

          {/* Progress bar animation */}
          <div className="max-w-md mx-auto">
            <div className="bg-white/10 rounded-full h-2 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-400 to-indigo-400 h-full rounded-full animate-progress"></div>
            </div>
            <p className="text-blue-300 text-sm mt-3">Upgrading our systems...</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}