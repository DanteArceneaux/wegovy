import { Calendar, ChevronLeft, MapPin, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Shot } from '../../types';
import { Card } from '../common/Card';
import { formatDateReadable } from '../../utils/dateHelpers';

interface InjectionTimelineProps {
    shots: Shot[];
    onClose: () => void;
}

export const InjectionTimeline = ({ shots, onClose }: InjectionTimelineProps) => {
    const sortedShots = [...shots].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Site map coordinates/paths
    const sites = [
        { id: 'left_stomach', label: 'Left Stomach', x: '40%', y: '50%' },
        { id: 'right_stomach', label: 'Right Stomach', x: '60%', y: '50%' },
        { id: 'left_thigh', label: 'Left Thigh', x: '42%', y: '75%' },
        { id: 'right_thigh', label: 'Right Thigh', x: '58%', y: '75%' },
        { id: 'left_arm', label: 'Left Arm', x: '30%', y: '35%' },
        { id: 'right_arm', label: 'Right Arm', x: '70%', y: '35%' },
    ];

    const getSiteCount = (label: string) => shots.filter(s => s.site === label).length;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed inset-0 bg-[#F8FAFC] z-50 overflow-y-auto scrollbar-hide"
        >
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-xl z-10 border-b border-slate-100 px-6 py-5 flex items-center justify-between">
                <button onClick={onClose} className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-500" /> Injection History
                </h2>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            <div className="p-6 space-y-8 pb-12">
                {/* Site Rotation Map */}
                <section>
                    <div className="flex justify-between items-center mb-6 px-1">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Site Map</h3>
                        <div className="h-px flex-grow mx-4 bg-slate-100"></div>
                    </div>

                    <Card className="p-8 relative min-h-[400px] flex items-center justify-center border-white shadow-premium">
                        {/* Simple Body Silhouette SVG */}
                        <svg viewBox="0 0 200 400" className="w-full max-w-[200px] h-auto text-slate-100 fill-current opacity-40">
                            <path d="M100,20 C110,20 120,30 120,45 C120,60 110,70 100,70 C90,70 80,60 80,45 C80,30 90,20 100,20 Z" /> {/* Head */}
                            <path d="M70,80 C60,80 50,90 45,110 L30,200 C25,220 35,230 45,225 L60,150 L60,280 L70,380 C75,395 90,395 95,380 L100,320 L105,380 C110,395 125,395 130,380 L140,280 L140,150 L155,225 C165,230 175,220 170,200 L155,110 C150,90 140,80 130,80 L70,80 Z" /> {/* Body */}
                        </svg>

                        {/* Hotspots */}
                        {sites.map((site) => {
                            const count = getSiteCount(site.label);
                            const lastShot = shots.find(s => s.site === site.label); // Note: sorting needed for actual "last"
                            const isRecent = lastShot && sortedShots[0]?.id === lastShot.id;

                            return (
                                <div
                                    key={site.id}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                                    style={{ left: site.x, top: site.y }}
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className={`relative p-1.5 rounded-full border-2 transition-all ${isRecent ? 'bg-indigo-500 border-indigo-200' : count > 0 ? 'bg-indigo-100 border-indigo-50' : 'bg-white border-slate-100 opacity-30'
                                            }`}
                                    >
                                        {isRecent && (
                                            <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                            </span>
                                        )}
                                        <MapPin className={`w-3.5 h-3.5 ${isRecent ? 'text-white' : count > 0 ? 'text-indigo-600' : 'text-slate-300'}`} />
                                    </motion.div>
                                    {count > 0 && (
                                        <div className="absolute top-1/2 left-full ml-2 whitespace-nowrap bg-white/90 backdrop-blur shadow-sm border border-slate-100 rounded-lg px-2 py-0.5 text-[9px] font-black text-slate-500">
                                            {count} shots
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </Card>
                </section>

                {/* Timeline List */}
                <section className="space-y-6">
                    <div className="flex justify-between items-center px-1">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Timeline</h3>
                        <div className="h-px flex-grow mx-4 bg-slate-100"></div>
                    </div>

                    <div className="space-y-4">
                        {sortedShots.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 font-medium italic bg-white rounded-[2rem] border border-dashed border-slate-200">
                                No history recorded yet.
                            </div>
                        ) : (
                            sortedShots.map((shot, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={shot.id}
                                    className="relative pl-8 group"
                                >
                                    {/* Vertical Line Connector */}
                                    {i < sortedShots.length - 1 && (
                                        <div className="absolute left-[13px] top-6 bottom-[-10px] w-0.5 bg-slate-100 group-last:hidden"></div>
                                    )}

                                    {/* Dot */}
                                    <div className={`absolute left-0 top-1.5 w-[28px] h-[28px] rounded-xl flex items-center justify-center z-10 border-2 ${i === 0 ? 'bg-indigo-600 border-indigo-200' : 'bg-white border-slate-100'
                                        }`}>
                                        <Activity className={`w-3.5 h-3.5 ${i === 0 ? 'text-white' : 'text-slate-400'}`} />
                                    </div>

                                    <Card className={`p-5 transition-premium ${i === 0 ? 'bg-white border-indigo-100 shadow-indigo-100/20' : 'border-white'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="text-sm font-black text-slate-900 leading-tight">
                                                    {shot.dosage} Dose
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                    {formatDateReadable(shot.date)}
                                                </div>
                                            </div>
                                            <div className="bg-slate-50 px-3 py-1 rounded-xl text-[10px] font-black text-slate-500 flex items-center gap-1.5 uppercase">
                                                <MapPin className="w-3 h-3 text-indigo-500" /> {shot.site}
                                            </div>
                                        </div>
                                        {shot.notes && (
                                            <p className="text-[11px] text-slate-500 font-medium mt-3 italic bg-slate-50/50 p-2 rounded-lg">
                                                "{shot.notes}"
                                            </p>
                                        )}
                                    </Card>
                                </motion.div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </motion.div>
    );
};
