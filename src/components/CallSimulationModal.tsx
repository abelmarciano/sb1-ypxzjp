import React, { useState, useEffect } from 'react';
import { X, Phone, CheckCircle2, Clock, UserX } from 'lucide-react';
import { Prospect } from '../types/prospect';
import { motion, AnimatePresence } from 'framer-motion';

interface CallSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prospects: Prospect[];
  onComplete: (results: {
    leads: number;
    notInterested: number;
    noAnswer: number;
    total: number;
  }) => void;
}

export function CallSimulationModal({
  isOpen,
  onClose,
  prospects,
  onComplete
}: CallSimulationModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState({
    leads: 0,
    notInterested: 0,
    noAnswer: 0,
    total: prospects.length
  });

  useEffect(() => {
    if (!isOpen) {
      setCurrentIndex(0);
      setProgress(0);
      setResults({
        leads: 0,
        notInterested: 0,
        noAnswer: 0,
        total: prospects.length
      });
      return;
    }

    const interval = setInterval(() => {
      if (currentIndex >= prospects.length - 1) {
        clearInterval(interval);
        onComplete(results);
        return;
      }

      setCurrentIndex(prev => {
        if (prev >= prospects.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });

      const outcome = Math.random();
      setResults(prev => {
        const newResults = {
          ...prev,
          ...(outcome < 0.4 ? { leads: prev.leads + 1 } :
              outcome < 0.7 ? { notInterested: prev.notInterested + 1 } :
                            { noAnswer: prev.noAnswer + 1 })
        };
        return newResults;
      });

      setProgress(prev => prev + (100 / prospects.length));
    }, 1500);

    return () => clearInterval(interval);
  }, [isOpen, prospects.length, currentIndex]);

  if (!isOpen) return null;

  const currentProspect = prospects[currentIndex];
  const isComplete = currentIndex >= prospects.length - 1;

  return (
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
        className="bg-white rounded-xl w-full max-w-lg mx-4 shadow-xl"
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Simulation d'appels en cours
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          {!isComplete ? (
            <>
              <div className="flex items-center justify-center mb-8">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-[#2665EB]/10 flex items-center justify-center animate-pulse">
                    <Phone className="h-8 w-8 text-[#2665EB]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {currentIndex + 1}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {currentProspect.nom} {currentProspect.prenom}
                </h3>
                <p className="text-gray-500">
                  {currentProspect.telephone} • {currentProspect.ville}
                </p>
              </div>

              <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-2 rounded-full bg-gradient-to-r from-[#2665EB] to-[#1b4bbd]"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
                  <div className="text-lg font-semibold text-emerald-600">
                    {results.leads}
                  </div>
                  <div className="text-xs text-emerald-600">Leads</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <UserX className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                  <div className="text-lg font-semibold text-gray-600">
                    {results.notInterested}
                  </div>
                  <div className="text-xs text-gray-600">Non intéressés</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                  <div className="text-lg font-semibold text-orange-600">
                    {results.noAnswer}
                  </div>
                  <div className="text-xs text-orange-600">Sans réponse</div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Campagne d'appels terminée
              </h3>
              <p className="text-gray-500 mb-6">
                {prospects.length} prospects appelés
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <div className="text-lg font-semibold text-emerald-600">
                    {results.leads}
                  </div>
                  <div className="text-xs text-emerald-600">Leads</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-600">
                    {results.notInterested}
                  </div>
                  <div className="text-xs text-gray-600">Non intéressés</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-semibold text-orange-600">
                    {results.noAnswer}
                  </div>
                  <div className="text-xs text-orange-600">Sans réponse</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-[#2665EB] hover:bg-[#1b4bbd] rounded-lg transition-colors"
          >
            {isComplete ? 'Terminer' : 'Annuler'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}