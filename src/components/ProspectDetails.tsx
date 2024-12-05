import React, { useState, useRef } from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  User, Mail, Phone, MapPin, Building, Calendar, 
  Tag, Clock, Home, MapPinned, Flame, Wallet,
  CreditCard, Lightbulb, X, Save, DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Prospect } from '../types/prospect';
import { STATUS_LABELS } from '../constants/status';
import { useCampaigns } from '../hooks/useCampaigns';
import toast from 'react-hot-toast';

interface ProspectDetailsProps {
  prospect: Prospect;
  onClose: () => void;
  onUpdate: (prospect: Prospect) => void;
}

export function ProspectDetails({ prospect, onClose, onUpdate }: ProspectDetailsProps) {
  const [editedProspect, setEditedProspect] = useState<Prospect>(prospect);
  const [hasChanges, setHasChanges] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { campaigns } = useCampaigns();

  const handleFieldChange = (field: keyof Prospect, value: any) => {
    setEditedProspect(prev => {
      const updated = { ...prev, [field]: value };
      
      // Handle special case for VENDU status
      if (field === 'status' && value === 'VENDU') {
        const campaign = campaigns.find(c => c.id === updated.campagne);
        updated.dateSold = new Date().toISOString();
        updated.leadPrice = campaign?.pricePerLead || 0;
      } else if (field === 'status' && value !== 'VENDU') {
        updated.dateSold = undefined;
        updated.leadPrice = undefined;
      }

      // Handle numeric fields
      if (field === 'leadPrice' || field === 'prospectPrice' || field === 'montantElectricite' || field === 'revenus') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          updated[field] = numValue;
        }
      }

      return updated;
    });
    setHasChanges(true);
  };

  const handleSaveAll = async () => {
    try {
      await onUpdate(editedProspect);
      setHasChanges(false);
      toast.success('Modifications enregistrées');
    } catch (error) {
      console.error('Error saving prospect:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  const InfoField = ({ 
    icon: Icon, 
    label, 
    field, 
    type = 'text',
    required = false
  }: { 
    icon: any, 
    label: string, 
    field: keyof Prospect,
    type?: 'text' | 'number' | 'email' | 'tel' | 'select',
    required?: boolean
  }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempValue, setTempValue] = useState<string>(() => {
      const value = editedProspect[field];
      if (value === undefined || value === null) return '';
      return value.toString();
    });

    const handleBlur = () => {
      handleFieldChange(field, tempValue);
      setIsEditing(false);
    };

    return (
      <div className="group relative flex items-start gap-3 py-2 px-3 hover:bg-gray-50 transition-colors duration-200">
        <Icon className="h-5 w-5 mt-1.5 flex-shrink-0 text-gray-400" />
        <div className="flex-1 min-w-0">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
          
          <div className="mt-1">
            {type === 'select' && field === 'status' ? (
              <select
                value={editedProspect[field] as string}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                className="w-full bg-transparent text-gray-900 focus:outline-none focus:ring-0 border-0 p-0 cursor-pointer"
              >
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            ) : (
              <div 
                className="relative group cursor-text"
                onClick={() => setIsEditing(true)}
              >
                {isEditing ? (
                  <input
                    type={type}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleBlur();
                      }
                    }}
                    autoFocus
                    className="w-full bg-white border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[#2665EB]"
                  />
                ) : (
                  <div className="py-1 group-hover:bg-gray-100 rounded px-2 transition-colors duration-200">
                    {(field === 'leadPrice' || field === 'prospectPrice' || field === 'montantElectricite' || field === 'revenus') && editedProspect[field] ? 
                      `${editedProspect[field]}€` : 
                      editedProspect[field] || '-'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-y-0 right-0 w-[400px] bg-white shadow-xl border-l z-50 flex flex-col"
    >
      <div className="p-4 border-b flex items-center justify-between bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900">
          {editedProspect.nom} {editedProspect.prenom}
        </h2>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <button
              onClick={handleSaveAll}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-[#2665EB] hover:bg-[#1b4bbd] rounded-lg transition-colors"
            >
              <Save className="h-4 w-4" />
              Enregistrer
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <section>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Informations principales</h3>
            <div className="bg-white rounded-lg border divide-y">
              <InfoField icon={User} label="Nom" field="nom" required />
              <InfoField icon={User} label="Prénom" field="prenom" />
              <InfoField icon={Mail} label="Email" field="email" type="email" />
              <InfoField icon={Phone} label="Téléphone" field="telephone" type="tel" />
              <InfoField icon={MapPin} label="Ville" field="ville" />
              <InfoField icon={Building} label="Campagne" field="campagne" />
              <InfoField icon={DollarSign} label="Prix prospect" field="prospectPrice" type="number" />
            </div>
          </section>

          <section>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Statut et dates</h3>
            <div className="bg-white rounded-lg border divide-y">
              <InfoField icon={Tag} label="Statut" field="status" type="select" />
              {editedProspect.status === 'VENDU' && (
                <InfoField 
                  icon={DollarSign} 
                  label="Prix du lead" 
                  field="leadPrice" 
                  type="number"
                />
              )}
              <div className="px-3 py-2 flex items-start gap-3">
                <Calendar className="h-5 w-5 mt-1.5 text-gray-400" />
                <div>
                  <label className="text-sm font-medium text-gray-700">Date d'import</label>
                  <div className="mt-1 text-gray-900">
                    {format(new Date(editedProspect.dateCreation), 'dd/MM/yyyy HH:mm', { locale: fr })}
                  </div>
                </div>
              </div>
              {editedProspect.dernierAppel && (
                <div className="px-3 py-2 flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-1.5 text-gray-400" />
                  <div>
                    <label className="text-sm font-medium text-gray-700">Dernier appel</label>
                    <div className="mt-1 text-gray-900">
                      {format(new Date(editedProspect.dernierAppel), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Situation</h3>
            <div className="bg-white rounded-lg border divide-y">
              <InfoField icon={Home} label="Propriétaire" field="proprietaire" type="text" />
              <InfoField icon={MapPinned} label="Code postal" field="codePostal" />
              <InfoField icon={MapPinned} label="Département" field="departement" />
              <InfoField icon={Flame} label="Mode de chauffage" field="modeChauffage" />
              <InfoField icon={Wallet} label="Montant électricité" field="montantElectricite" type="number" />
              <InfoField icon={Wallet} label="Revenus" field="revenus" type="number" />
              <InfoField icon={CreditCard} label="Crédit en cours" field="credit" type="text" />
              <InfoField icon={Lightbulb} label="Solution" field="solution" />
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}