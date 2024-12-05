import React, { useState } from 'react';
import { X, Brain } from 'lucide-react';
import { ProspectStatus } from '../types/prospect';
import { STATUS_LABELS } from '../constants/status';

interface SmartSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (params: SmartSelectionParams) => void;
  totalProspects: number;
}

export interface SmartSelectionParams {
  count: number;
  status?: ProspectStatus;
  proprietaire?: boolean;
  credit?: boolean;
  selectAll?: boolean;
}

export function SmartSelectionModal({
  isOpen,
  onClose,
  onConfirm,
  totalProspects
}: SmartSelectionModalProps) {
  const [count, setCount] = useState<number>(10);
  const [status, setStatus] = useState<ProspectStatus | ''>('');
  const [proprietaire, setProprietaire] = useState<string>('');
  const [credit, setCredit] = useState<string>('');
  const [selectAll, setSelectAll] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const params: SmartSelectionParams = {
      count: selectAll ? totalProspects : count,
      ...(status && { status }),
      ...(proprietaire && { proprietaire: proprietaire === 'true' }),
      ...(credit && { credit: credit === 'true' }),
      selectAll
    };

    onConfirm(params);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl mx-4 shadow-xl">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#2665EB]/10">
              <Brain className="h-5 w-5 text-[#2665EB]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Sélection intelligente</h2>
              <p className="text-sm text-gray-500">Filtrez et sélectionnez des prospects selon vos critères</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <input
              type="checkbox"
              id="selectAll"
              checked={selectAll}
              onChange={(e) => {
                setSelectAll(e.target.checked);
                if (e.target.checked) {
                  setCount(totalProspects);
                }
              }}
              className="rounded border-gray-300 text-[#2665EB] focus:ring-[#2665EB]"
            />
            <label htmlFor="selectAll" className="text-sm font-medium text-gray-700">
              Sélectionner tous les prospects ({totalProspects})
            </label>
          </div>

          {!selectAll && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de prospects à sélectionner
              </label>
              <input
                type="number"
                min="1"
                max={totalProspects}
                value={count}
                onChange={(e) => setCount(Math.min(parseInt(e.target.value) || 1, totalProspects))}
                className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Statut
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProspectStatus)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
            >
              <option value="">Tous les statuts</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Propriétaire
            </label>
            <select
              value={proprietaire}
              onChange={(e) => setProprietaire(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
            >
              <option value="">Indifférent</option>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crédit en cours
            </label>
            <select
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#2665EB] focus:border-[#2665EB] outline-none"
            >
              <option value="">Indifférent</option>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-[#2665EB] hover:bg-[#1b4bbd] rounded-lg transition-colors"
          >
            {selectAll 
              ? `Sélectionner tous les prospects (${totalProspects})`
              : `Sélectionner ${count} prospect${count > 1 ? 's' : ''}`
            }
          </button>
        </div>
      </div>
    </div>
  );
}