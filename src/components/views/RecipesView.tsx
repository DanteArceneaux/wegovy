import { MapPin, List, RefreshCw, Clock, CheckCircle2, Circle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { RECIPES, STAPLES } from '../../constants';
import { Recipe } from '../../types';
import { Card } from '../common/Card';

interface RecipesViewProps {
  boughtItems: Record<string, boolean>;
  onToggleGroceryItem: (item: string) => void;
  onResetGroceryList: () => void;
  onOpenRecipe: (recipe: Recipe) => void;
  onFoodQuickAdd: (name: string, calories: number, protein: number) => void;
}

export const RecipesView = ({
  boughtItems,
  onToggleGroceryItem,
  onResetGroceryList,
  onOpenRecipe,
  onFoodQuickAdd
}: RecipesViewProps) => {
  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-4 pt-6"
      >
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Driver's Kitchen</h1>
        <p className="text-slate-500 text-sm font-medium">Fuel for the road, optimized for Wegovy.</p>
      </motion.div>

      {/* Seattle Tips */}
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-emerald-50/50 backdrop-blur-md border border-emerald-100 p-5 rounded-[2rem]"
        >
          <h3 className="text-xs font-black text-emerald-800 flex items-center gap-2 mb-3 uppercase tracking-widest">
            <MapPin className="w-4 h-4" /> Seattle Budget Intel
          </h3>
          <ul className="text-[11px] text-emerald-700 space-y-2 font-medium">
            <li className="flex gap-2">
              <span className="font-black text-emerald-400">•</span>
              <span><strong>WinCo Foods:</strong> Cheapest bulk nuts & oats in the area.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-black text-emerald-400">•</span>
              <span><strong>Grocery Outlet:</strong> Best for high-protein bars & snacks.</span>
            </li>
            <li className="flex gap-2">
              <span className="font-black text-emerald-400">•</span>
              <span><strong>Safeway:</strong> Use the app for digital "Just for U" protein deals.</span>
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Visual Menu */}
      <div className="px-4 space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Fuel Menu</h3>
          <div className="h-px flex-grow mx-4 bg-slate-100"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {RECIPES.map((r, i) => (
            <motion.div
              layout
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group relative"
            >
              <div
                onClick={() => onOpenRecipe(r)}
                className="glass rounded-[2rem] overflow-hidden cursor-pointer h-full flex flex-col transition-premium group-active:scale-[0.98] border-white/50"
              >
                <div className="h-32 relative overflow-hidden">
                  <img
                    src={r.img}
                    alt={r.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=400&q=80`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-black text-slate-700 shadow-sm flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {r.prep}
                  </div>
                  <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-black text-white flex items-center gap-1">
                    {r.cost}
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <div className="font-bold text-slate-800 text-sm leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{r.title}</div>
                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{r.type}</span>
                    <span className="text-[10px] font-black text-emerald-600 ml-auto bg-emerald-50 px-1.5 py-0.5 rounded-md">
                      {r.protein}g P
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Log Action */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFoodQuickAdd(r.title, r.calories, r.protein);
                }}
                className="absolute bottom-2 right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 active:scale-90 transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label={`Log ${r.title}`}
              >
                <Zap className="w-4 h-4 fill-current" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Grocery List */}
      <div className="px-4 space-y-4 pt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <List className="w-4 h-4" /> Master List
          </h3>
          <button
            onClick={onResetGroceryList}
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 hover:text-red-500 transition-colors"
          >
            <RefreshCw className="w-3 h-3" /> Reset
          </button>
        </div>

        {STAPLES.map((cat, i) => (
          <Card key={i} className="p-0 overflow-hidden border-white/50" delay={0.2 + (i * 0.1)}>
            <div className="h-24 relative overflow-hidden">
              <img
                src={cat.img}
                className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
                alt={cat.cat}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
              <div className="absolute inset-0 flex items-end p-5">
                <h4 className="font-black text-white text-lg tracking-tight uppercase">
                  {cat.cat}
                </h4>
              </div>
            </div>
            <div className="p-5 flex flex-wrap gap-2.5">
              {cat.items.map(item => {
                const isBought = boughtItems[item];
                return (
                  <button
                    key={item}
                    onClick={() => onToggleGroceryItem(item)}
                    className={`px-3.5 py-2 rounded-xl text-[11px] font-bold border transition-all flex items-center gap-2 active:scale-95 ${isBought
                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700 line-through opacity-60'
                      : 'bg-white border-slate-100 text-slate-700 hover:border-indigo-200 hover:text-indigo-600'
                      }`}
                  >
                    {isBought ? (
                      <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 flex-shrink-0 text-slate-200" />
                    )}
                    {item}
                  </button>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};


