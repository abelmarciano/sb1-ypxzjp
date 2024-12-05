import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProspects } from '../../hooks/useProspects';
import { useSearch } from '../../hooks/useSearch';

export function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const { prospects } = useProspects();
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { searchQuery, setSearchQuery, filteredItems: searchResults } = useSearch(
    prospects,
    ['nom', 'prenom', 'email', 'telephone', 'ville']
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsResultsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchFocus = () => {
    setIsExpanded(true);
    setIsResultsOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setIsResultsOpen(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsResultsOpen(false);
  };

  const handleSelectProspect = (id: string) => {
    navigate(`/prospects?id=${id}`);
    setIsResultsOpen(false);
    setSearchQuery('');
  };

  return (
    <div ref={wrapperRef} className="relative hidden md:block">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={handleSearchFocus}
          placeholder="Rechercher un prospect..."
          className={`pl-9 pr-8 py-1.5 text-sm border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none
            transition-all duration-200 ${isExpanded ? 'w-64' : 'w-48'}`}
        />
        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isResultsOpen && searchQuery && (
        <div className="absolute mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            searchResults.slice(0, 8).map((prospect) => (
              <button
                key={prospect.id}
                onClick={() => handleSelectProspect(prospect.id)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
              >
                <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-cyan-700">
                    {prospect.nom.charAt(0)}{prospect.prenom.charAt(0)}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {prospect.nom} {prospect.prenom}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {prospect.email || prospect.telephone}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">
              Aucun résultat trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
}