import React from 'react';
import { MapPin, Calendar, Search } from 'lucide-react';
import { Button } from '../atoms/Button';

interface SearchBarProps {
  searchLocation: string;
  setSearchLocation: (val: string) => void;
  searchDate: string;
  setSearchDate: (val: string) => void;
  onSearch: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchLocation,
  setSearchLocation,
  searchDate,
  setSearchDate,
  onSearch
}) => {
  return (
    <div className="max-w-4xl mx-auto bg-slate-900/50 p-2 sm:p-4 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-2xl flex flex-col sm:flex-row gap-3">
      <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus-within:border-emerald-500 transition-colors">
        <MapPin className="text-slate-500 w-5 h-5 mr-3" />
        <input
          type="text"
          placeholder="Qual bairro ou cidade?"
          className="bg-transparent w-full outline-none text-white placeholder-slate-500"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
      </div>
      <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 focus-within:border-emerald-500 transition-colors">
        <Calendar className="text-slate-500 w-5 h-5 mr-3" />
        <input
          type="date"
          className="bg-transparent w-full outline-none text-slate-300 [color-scheme:dark]"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
      </div>
      <Button onClick={onSearch} className="px-8 py-3 rounded-xl gap-2">
        <Search className="w-5 h-5" />
        Buscar Quadras
      </Button>
    </div>
  );
};
