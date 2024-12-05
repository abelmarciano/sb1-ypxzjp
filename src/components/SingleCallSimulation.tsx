import React, { useState, useEffect } from 'react';
import { Phone, X, CheckCircle2, Clock, UserX } from 'lucide-react';
import { Prospect } from '../types/prospect';
import { motion, AnimatePresence } from 'framer-motion';

interface SingleCallSimulationProps {
  isOpen: boolean;
  onClose: () => void;
  prospect: Prospect;
  onComplete: (result: 'LEADS' | 'PAS_INTERESSE' | 'NRP_1') => void;
}

export function SingleCallSimulation({
  isOpen,
  onClose,
  prospect,
  onComplete
}: SingleCallSimulationProps) {
  const [stage, setStage] = useState<'dialing' | 'talking' | 'complete'>('dialing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    // Reset state when modal opens
    setStage('dialing');
    setProgress(0);

    // Simulate call stages
    const dialingTimer = setTimeout(() => {
      setStage('talking');
      setProgress(50);

      // Simulate call completion after 2-3 seconds
      const talkingDuration = 2000 + Math.random() * 1000;
      const completionTimer = setTimeout(() => {
        setStage('complete');
        setProgress(100);

        // Randomly determine call outcome
        const outcome = Math.random();
        if (outcome < 0.4) onComplete('LEADS');
        else if (outcome < 0.7) onComplete('PAS_INTERESSE');
        else onComplete('NRP_1');
      }, talkingDuration);

      return () => clearTimeout(completionTimer);
    }, 1500);

    return () => clearTimeout(dialingTimer);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl w-full max-w-md mx-4 shadow-xl"
        >
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Appel en cours
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-cyan-100 flex items-center justify-center animate-pulse">
                  <Phone className="h-8 w-8 text-cyan-600" />
                </div>
                {stage === 'talking' && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse">
                    <span className="text-xs font-bold text-white">
                      {Math.floor(Math.random() * 60)}s
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                {prospect.nom} {prospect.prenom}
              </h3>
              <p className="text-gray-500">
                {prospect.telephone} • {prospect.ville}
              </p>
            </div>

            <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600"
              />
            </div>

            <div className="text-center text-sm text-gray-500">
              {stage === 'dialing' && 'Numérotation en cours...'}
              {stage === 'talking' && 'Conversation en cours...'}
              {stage === 'complete' && 'Appel terminé'}
            </div>
          </div>

          <div className="p-4 border-t flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors"
            >
              {stage === 'complete' ? 'Terminer' : 'Annuler'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}