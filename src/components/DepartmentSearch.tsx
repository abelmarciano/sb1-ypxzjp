import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Check } from 'lucide-react';
import { theme } from '../constants/theme';

interface DepartmentSearchProps {
  value: string[];
  onChange: (value: string[]) => void;
  departments: string[];
}

export function DepartmentSearch({ value, onChange, departments }: DepartmentSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDepartments = departments.filter(dept => {
    const searchLower = search.toLowerCase();
    const deptLower = dept.toLowerCase();
    
    // Recherche par numéro de département
    if (deptLower.startsWith(searchLower)) return true;
    
    // Recherche par nom de département (si le format est "XX - Nom du département")
    if (dept.includes('-')) {
      const [number, name] = dept.split('-').map(s => s.trim());
      return name.toLowerCase().includes(searchLower);
    }
    
    return deptLower.includes(searchLower);
  });

  const toggleDepartment = (dept: string) => {
    const newValue = value.includes(dept)
      ? value.filter(d => d !== dept)
      : [...value, dept];
    onChange(newValue);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Départements ({value.length} sélectionné{value.length > 1 ? 's' : ''})
      </label>
      <div className="relative">
        <div 
          className="w-full border rounded px-3 py-1.5 text-sm focus:ring-1 focus:ring-primary-500 outline-none cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="flex items-center flex-wrap gap-1">
            <Search className="h-4 w-4 text-gray-400 mr-1 flex-shrink-0" />
            {value.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {value.map(dept => (
                  <span 
                    key={dept}
                    className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDepartment(dept);
                    }}
                  >
                    {dept}
                    <X className="h-3 w-3 hover:text-gray-900" />
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500">Rechercher des départements...</span>
            )}
          </div>
        </div>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full px-3 py-2 text-sm focus:outline-none"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="py-1">
              <button
                className="w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100 flex items-center justify-between"
                onClick={() => {
                  onChange([]);
                  setSearch('');
                }}
              >
                <span>Tous les départements</span>
                {value.length === 0 && <Check className="h-4 w-4 text-green-600" />}
              </button>
              
              {filteredDepartments.map((dept) => (
                <button
                  key={dept}
                  className="w-full px-3 py-1.5 text-sm text-left hover:bg-gray-100 flex items-center justify-between"
                  onClick={() => toggleDepartment(dept)}
                >
                  <span style={{
                    color: value.includes(dept) ? theme.colors.primary.main : undefined,
                    fontWeight: value.includes(dept) ? 500 : undefined
                  }}>
                    {dept}
                  </span>
                  {value.includes(dept) && <Check className="h-4 w-4 text-green-600" />}
                </button>
              ))}
              
              {filteredDepartments.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500">
                  Aucun département trouvé
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}