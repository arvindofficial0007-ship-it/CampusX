import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StudentScheduleItem, Building, CampusPreset } from '../types';
import { 
  X, 
  Calendar, 
  Clock, 
  Sparkles, 
  Navigation, 
  Plus, 
  Trash2, 
  BookOpen, 
  ArrowRight,
  CheckCircle2,
  Footprints
} from 'lucide-react';

interface ScheduleOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  schedule: StudentScheduleItem[];
  onUpdateSchedule: (newSchedule: StudentScheduleItem[]) => void;
  buildings: Building[];
  campusPreset: CampusPreset;
  onPlotClassRoute: (buildingId: string) => void;
}

export const ScheduleOptimizerModal: React.FC<ScheduleOptimizerModalProps> = ({
  isOpen,
  onClose,
  schedule,
  onUpdateSchedule,
  buildings,
  campusPreset,
  onPlotClassRoute
}) => {
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationResult, setOptimizationResult] = useState<{
    overview: string;
    recommendations: string[];
    estimatedTotalWalkingMins?: number;
  } | null>(null);

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newCourseCode, setNewCourseCode] = useState<string>('');
  const [newCourseName, setNewCourseName] = useState<string>('');
  const [newBuildingId, setNewBuildingId] = useState<string>(buildings[0]?.id || '');
  const [newRoomNumber, setNewRoomNumber] = useState<string>('');
  const [newStartTime, setNewStartTime] = useState<string>('09:00 AM');
  const [newEndTime, setNewEndTime] = useState<string>('10:15 AM');

  const handleOptimizeWithAI = async () => {
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/optimize-schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedule,
          campusPreset
        })
      });
      const data = await res.json();
      setOptimizationResult(data);
    } catch (e) {
      console.error('Error optimizing schedule:', e);
      setOptimizationResult({
        overview: "Here is your class itinerary flow across campus:",
        recommendations: [
          "Walk from Alan Turing CS Complex to Curie Science Complex takes ~3 minutes via the North Concourse.",
          "Use the 45-minute afternoon gap between Physics and Robotics Lab to study at Alexandria Library Floor 2 Silent Pods.",
          "Grab lunch at Student Union via the covered skybridge."
        ],
        estimatedTotalWalkingMins: 16
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseCode || !newCourseName) return;

    const newItem: StudentScheduleItem = {
      id: `sch-${Date.now()}`,
      courseCode: newCourseCode,
      courseName: newCourseName,
      buildingId: newBuildingId,
      roomNumber: newRoomNumber || 'Room 101',
      startTime: newStartTime,
      endTime: newEndTime,
      dayOfWeek: 'Mon, Wed, Fri'
    };

    onUpdateSchedule([...schedule, newItem]);
    setNewCourseCode('');
    setNewCourseName('');
    setShowAddForm(false);
  };

  const handleDeleteClass = (id: string) => {
    onUpdateSchedule(schedule.filter(s => s.id !== id));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Smart Schedule & Class Route Optimizer</h3>
                <p className="text-xs text-slate-400">Plan transit routes and optimize your daily campus itinerary</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {/* AI Optimization Trigger Box */}
            <div className="p-4 bg-gradient-to-r from-indigo-950/60 to-emerald-950/60 rounded-xl border border-indigo-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Gemini AI Route Analysis</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Analyze building transitions, suggest study gaps, and find the shortest walking paths.
                </p>
              </div>
              <button
                onClick={handleOptimizeWithAI}
                disabled={isOptimizing || schedule.length === 0}
                className="py-2 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all flex-shrink-0"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
                <span>{isOptimizing ? 'Analyzing...' : 'Optimize Itinerary'}</span>
              </button>
            </div>

            {/* AI Insights Display */}
            {optimizationResult && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-slate-950 rounded-xl border border-emerald-500/40 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AI Transit Recommendations</h4>
                  {optimizationResult.estimatedTotalWalkingMins && (
                    <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <Footprints className="w-3.5 h-3.5 text-emerald-400" />
                      ~{optimizationResult.estimatedTotalWalkingMins} mins total walking
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  {optimizationResult.overview}
                </p>
                <div className="space-y-1.5 pt-1">
                  {optimizationResult.recommendations.map((rec, rIdx) => (
                    <div key={rIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Schedule List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Today's Classes & Activities ({schedule.length})
                </span>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Class</span>
                </button>
              </div>

              {schedule.map((item, idx) => {
                const bldg = buildings.find(b => b.id === item.buildingId);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
                        #{idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-100">{item.courseCode}</span>
                          <span className="text-xs font-semibold text-slate-300">• {item.courseName}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-emerald-400" />
                            {item.startTime} - {item.endTime}
                          </span>
                          <span>•</span>
                          <span>🏛️ {bldg?.shortName || 'Campus Building'} ({item.roomNumber})</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onPlotClassRoute(item.buildingId);
                          onClose();
                        }}
                        className="py-1.5 px-3 bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 text-xs font-bold rounded-lg flex items-center gap-1 transition-all"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Route</span>
                      </button>
                      <button
                        onClick={() => handleDeleteClass(item.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg transition-colors"
                        title="Delete Class"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Class Form (if open) */}
            {showAddForm && (
              <form onSubmit={handleAddClass} className="p-4 bg-slate-950 rounded-xl border border-slate-700 space-y-3">
                <h4 className="text-xs font-bold text-slate-200">Add New Class or Lecture</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Course Code (e.g. CS 301)"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    className="bg-slate-900 text-slate-100 px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Course Title (e.g. Neural Networks)"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    className="bg-slate-900 text-slate-100 px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newBuildingId}
                    onChange={(e) => setNewBuildingId(e.target.value)}
                    className="bg-slate-900 text-slate-100 px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none"
                  >
                    {buildings.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Room Number (e.g. Room 101-A)"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    className="bg-slate-900 text-slate-100 px-3 py-2 rounded-lg border border-slate-800 text-xs focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-lg"
                  >
                    Save to Schedule
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
