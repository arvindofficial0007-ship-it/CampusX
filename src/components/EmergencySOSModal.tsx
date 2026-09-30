import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Building, MapNode } from '../types';
import { 
  X, 
  ShieldAlert, 
  Phone, 
  MapPin, 
  Navigation, 
  HelpCircle, 
  Activity, 
  AlertCircle,
  Users
} from 'lucide-react';

interface EmergencySOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToHealth: () => void;
  onNavigateToTransitEscort: () => void;
}

export const EmergencySOSModal: React.FC<EmergencySOSModalProps> = ({
  isOpen,
  onClose,
  onNavigateToHealth,
  onNavigateToTransitEscort
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg bg-slate-900 border border-rose-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Modal Header */}
          <div className="p-4 bg-rose-950/80 border-b border-rose-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold shadow-lg shadow-rose-500/30">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Campus Emergency & Safety Services</h3>
                <p className="text-xs text-rose-200">24/7 Police, Urgent Care & Night Safe-Walk Escort</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-rose-200 hover:text-white hover:bg-rose-900/60 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Urgent Hotline Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-rose-900/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">CAMPUS POLICE SOS</span>
                  <h4 className="text-sm font-bold text-slate-100 mt-0.5">Emergency Dispatch</h4>
                  <p className="text-xs text-slate-400 mt-1">Direct to University 24/7 Command Center</p>
                </div>
                <a
                  href="tel:911"
                  className="mt-3 py-2 px-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-rose-900/30"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call (555) 019-9111</span>
                </a>
              </div>

              <div className="p-3.5 bg-slate-950 rounded-xl border border-teal-900/60 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">NIGHT ESCORT</span>
                  <h4 className="text-sm font-bold text-slate-100 mt-0.5">Safe Walk Patrol</h4>
                  <p className="text-xs text-slate-400 mt-1">Student & officer walking companion service</p>
                </div>
                <a
                  href="tel:1111"
                  className="mt-3 py-2 px-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call (555) 019-1111</span>
                </a>
              </div>
            </div>

            {/* Quick Map Routing to Medical & Safety Facilities */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Direct Emergency Navigation
              </span>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Health & Urgent Care Center</h5>
                    <p className="text-[11px] text-slate-400">Ground floor triage & medical clinic (Code: HLT)</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onNavigateToHealth();
                    onClose();
                  }}
                  className="py-1.5 px-3 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold rounded-lg flex items-center gap-1 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Route</span>
                </button>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Safe Escort Dispatch Station</h5>
                    <p className="text-[11px] text-slate-400">West Transit Structure & Shuttle Bay (Code: TRN)</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onNavigateToTransitEscort();
                    onClose();
                  }}
                  className="py-1.5 px-3 bg-teal-500/20 hover:bg-teal-500 text-teal-300 hover:text-slate-950 border border-teal-500/40 text-xs font-bold rounded-lg flex items-center gap-1 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Route</span>
                </button>
              </div>
            </div>

            {/* Blue Light Station Info */}
            <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-800/40 text-xs text-blue-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Blue Light Emergency Towers:</strong> Over 45 illuminated blue light emergency telephone poles are stationed along all campus pathways every 50 meters. Pressing the red button instantly dispatches campus police.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
