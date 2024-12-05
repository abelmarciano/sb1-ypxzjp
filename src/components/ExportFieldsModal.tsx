import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { CRM_FIELD_OPTIONS } from '../types/columnMapping';

interface ExportFieldsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedFields: string[]) => void;
}

export function ExportFieldsModal({
  isOpen,
  onClose,
  onConfirm
}: ExportFieldsModalProps) {
  const [selectedFields, setSelectedFields] = useState<Set<string>>(new Set([
    'nom', 'prenom', 'email', 'telephone', 'ville', 'status'
  ]));

  if (!isOpen) return null;

  const handleToggleField = (field: string) => {
    const newSelected = new Set(selectedFields);
    if (newSelected.has(field)) {
      newSelected.delete(field);
    } else {
      newSelected.add(field);
    }
    setSelectedFields(newSelected);
  };

  const handleSelectAll = () => {
    setSelectedFields(new Set(CRM_FIELD_OPTIONS.map(option => option.value)));
  };

  const handleDeselectAll = () => {
    setSelectedFields(new Set());
  };

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
            Sélectionner les champs à exporter
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={handleSelectAll}
              className="text-sm text-cyan-600 hover:text-cyan-700"
            >
              Tout sélectionner
            </button>
            <button
              onClick={handleDeselectAll}
              className="text-sm text-gray-500 hover:text-gray-600"
            >
              Tout désélectionner
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {CRM_FIELD_OPTIONS.map(({ value, label }) => (
              <label
                key={value}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedFields.has(value)}
                  onChange={() => handleToggleField(value)}
                  className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
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
            onClick={() => onConfirm(Array.from(selectedFields))}
            disabled={selectedFields.size === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Exporter {selectedFields.size} champ{selectedFields.size > 1 ? 's' : ''}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}