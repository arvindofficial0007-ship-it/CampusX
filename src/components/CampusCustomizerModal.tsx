import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CampusPreset } from '../types';
import { ALTERNATIVE_CAMPUS_PRESETS } from '../data/campusData';
import { 
  X, 
  Settings, 
  Sparkles, 
  Check, 
  Building2, 
  MapPin, 
  GraduationCap,
  Edit3
} from 'lucide-react';

interface CampusCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPreset: CampusPreset;
  onSelectPreset: (preset: CampusPreset) => void;
  onUpdateCustomName: (name: string, shortName: string, location: string) => void;
}

export const CampusCustomizerModal: React.FC<CampusCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentPreset,
  onSelectPreset,
  onUpdateCustomName
}) => {
  const [customName, setCustomName] = useState<string>(currentPreset.name);
  const [customShortName, setCustomShortName] = useState<string>(currentPreset.shortName);
  const [customLocation, setCustomLocation] = useState<string>(currentPreset.location);

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCustomName(customName, customShortName, customLocation);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Modal Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Campus Setup & College Switcher</h3>
                <p className="text-xs text-slate-400">Configure or rename the navigation agent for your college</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* Presets List */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2.5">
                Choose Sample University Campus
              </span>
              <div className="space-y-2">
                {ALTERNATIVE_CAMPUS_PRESETS.map(preset => {
                  const isCurrent = currentPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => onSelectPreset(preset)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        isCurrent
                          ? 'bg-emerald-950/40 border-emerald-500/60 shadow-md'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                          isCurrent ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}>
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-100">{preset.name}</h4>
                          <p className="text-[11px] text-slate-400">{preset.location}</p>
                        </div>
                      </div>
                      {isCurrent && <Check className="w-5 h-5 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom College Name Editor */}
            <form onSubmit={handleSaveCustom} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Rename to Your Custom College</span>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Full College / University Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g. Stanford University or City College"
                  className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Short Name / Moniker</label>
                  <input
                    type="text"
                    value={customShortName}
                    onChange={(e) => setCustomShortName(e.target.value)}
                    placeholder="e.g. Stanford"
                    className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Campus Location</label>
                  <input
                    type="text"
                    value={customLocation}
                    onChange={(e) => setCustomLocation(e.target.value)}
                    placeholder="e.g. Main Quad Campus"
                    className="w-full bg-slate-900 text-slate-100 px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-lg shadow-md transition-all active:scale-95 mt-2"
              >
                Apply Custom College Details
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
