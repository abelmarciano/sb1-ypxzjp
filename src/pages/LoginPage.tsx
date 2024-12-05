import React, { useState } from 'react';
import { Bot, Eye, EyeOff, Brain, Sparkles, Cpu, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Erreur lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await login('admin@system.com', 'admin123');
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Erreur lors de la connexion en mode démo');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Login form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-12">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#2665EB] to-[#1b4bbd] shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CRM Énergies</h1>
              <p className="text-sm text-gray-500">Propulsé par l'intelligence artificielle</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
          <p className="text-gray-500 mb-8">
            Connectez-vous pour accéder à votre espace
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 text-gray-900 border rounded-lg focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
                placeholder="admin@system.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 text-gray-900 border rounded-lg focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2.5 text-white bg-[#2665EB] hover:bg-[#1b4bbd] rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </button>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full px-4 py-2.5 text-[#2665EB] bg-[#2665EB]/10 hover:bg-[#2665EB]/20 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlayCircle className="h-5 w-5" />
                Essayer la démo
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#2665EB] items-center justify-center p-12">
        <div className="max-w-lg">
          <div className="relative">
            {/* Animated circles */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-12 -left-12 w-24 h-24 bg-white/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute top-24 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl"
            />

            {/* Main content */}
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Brain className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Intelligence Artificielle</h3>
                  <p className="text-white/80">Assistant virtuel intelligent</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                  <p>Suggestions intelligentes et personnalisées</p>
                </div>
                <div className="flex items-center gap-3">
                  <Cpu className="h-5 w-5 text-emerald-300" />
                  <p>Automatisation des tâches répétitives</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}