import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Sparkles, X, Check, Plus, PencilLine, Trash2 } from 'lucide-react';
import BackButton from '../components/ui/BackButton';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import { useCycle } from '../contexts/CycleContext';
import { PHASES } from '../data/phases';
import { RECIPE_LOADERS } from '../data/recipeLoaders';
import { buildDailyMenu } from '../data/dailyMenu';
import { buildRequiredTags } from '../data/recipeFilters';
import { toast } from '../lib/toast';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// Page « Mes courses » : la liste organisée par recette (choix de Margaux).
// Chaque recette ajoutée forme un bloc avec ses ingrédients à cocher ;
// « Mes ajouts » accueille les articles libres ; « Générer depuis mon menu »
// ajoute d'un coup les repas du menu du jour.
export default function Courses() {
  const { shoppingList, dispatch, cycleInfo, dietPreferences, healthIssues, allergies, cookingLevel, cookingTime } = useCycle();
  const [newItem, setNewItem] = useState('');
  const [generating, setGenerating] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const phase = cycleInfo?.phase || 'follicular';
  const phaseData = PHASES[phase];

  const remaining = shoppingList.reduce((n, b) => n + b.items.filter((it) => !it.checked).length, 0);
  const hasChecked = shoppingList.some((b) => b.items.some((it) => it.checked));

  // Blocs recettes d'abord, « Mes ajouts » toujours en dernier
  const blocks = [
    ...shoppingList.filter((b) => b.id !== 'ajouts'),
    ...shoppingList.filter((b) => b.id === 'ajouts'),
  ];

  const generateFromMenu = async () => {
    if (generating) return;
    setGenerating(true);
    try {
      const recipes = await RECIPE_LOADERS[phase]();
      const menu = buildDailyMenu(recipes, phaseData, {
        requiredTags: buildRequiredTags(dietPreferences, healthIssues),
        allergies: allergies || [],
        cookingLevel,
        cookingTime,
      });
      let added = 0;
      menu.forEach((m) => {
        if (!shoppingList.some((b) => b.id !== 'ajouts' && b.name === m.recipe.name)) {
          dispatch({
            type: 'ADD_SHOPPING_RECIPE',
            payload: { name: m.recipe.name, ingredients: m.recipe.ingredients, emoji: m.recipe.emoji, source: 'menu' },
          });
          added += 1;
        }
      });
      toast(added > 0
        ? `${added} recette${added > 1 ? 's' : ''} du menu ajoutée${added > 1 ? 's' : ''} 🛒`
        : 'Ton menu du jour est déjà dans la liste ✓');
    } finally {
      setGenerating(false);
    }
  };

  const addCustom = () => {
    const name = newItem.trim();
    if (!name) return;
    dispatch({ type: 'ADD_SHOPPING_CUSTOM_ITEM', payload: name });
    setNewItem('');
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4 pb-6">
      <BackButton />

      {/* En-tête */}
      <motion.div variants={item}>
        <h1 className="font-display text-[28px] text-luna-text leading-tight">Mes courses</h1>
        <p className="text-sm font-body text-luna-text-muted mt-1">
          {remaining === 0
            ? (shoppingList.length === 0 ? 'Ta liste est vide pour l\'instant.' : 'Tout est dans le panier ✓')
            : `${remaining} article${remaining > 1 ? 's' : ''} restant${remaining > 1 ? 's' : ''}`}
        </p>
      </motion.div>

      {/* Générer depuis le menu du jour */}
      <motion.div variants={item}>
        <button
          onClick={generateFromMenu}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-[14px] font-body font-bold text-white active:scale-[0.99] transition-transform"
          style={{ backgroundColor: '#B09ACB', boxShadow: '0 8px 22px #B09ACB40', opacity: generating ? 0.6 : 1 }}
        >
          <Sparkles size={16} />
          {generating ? 'Un instant…' : 'Générer depuis mon menu'}
        </button>
      </motion.div>

      {/* État vide */}
      {shoppingList.length === 0 && (
        <motion.div variants={item} className="bg-white rounded-[24px] px-6 py-10 text-center" style={{ boxShadow: '0 8px 26px rgba(45,34,38,0.05)' }}>
          <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F3EEF8' }}>
            <ShoppingCart size={24} style={{ color: '#7D6A96' }} />
          </div>
          <p className="text-sm font-body text-luna-text-body leading-relaxed">
            Ajoute une recette depuis sa fiche,<br />ou génère ta liste depuis ton menu du jour.
          </p>
        </motion.div>
      )}

      {/* Blocs par recette */}
      <AnimatePresence>
        {blocks.map((block) => {
          const isCustom = block.id === 'ajouts';
          const left = block.items.filter((it) => !it.checked).length;
          return (
            <motion.div
              key={block.id}
              variants={item}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-[20px] px-4 py-3.5"
              style={{ boxShadow: '0 6px 22px rgba(45,34,38,0.05)' }}
            >
              {/* Entête du bloc */}
              <div className="flex items-center gap-3 mb-1.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-base"
                  style={{ backgroundColor: isCustom ? '#EDF5F8' : phaseData.bgColor }}
                >
                  {isCustom ? <PencilLine size={16} style={{ color: '#7BAAB8' }} /> : (block.emoji || '🍽️')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-body font-bold text-luna-text leading-tight truncate">{block.name}</p>
                  <p className="text-[11px] font-body text-luna-text-hint">
                    {isCustom
                      ? 'Tes articles libres'
                      : block.source === 'menu'
                        ? 'Depuis ton menu du jour'
                        : left === 0 ? 'Tout est coché ✓' : `${left} restant${left > 1 ? 's' : ''} sur ${block.items.length}`}
                  </p>
                </div>
                {!isCustom && (
                  <button
                    onClick={() => dispatch({ type: 'REMOVE_SHOPPING_RECIPE', payload: block.id })}
                    aria-label={`Retirer ${block.name}`}
                    className="w-9 h-9 -mr-1.5 rounded-full flex items-center justify-center text-luna-text-hint active:scale-90 transition-transform flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Ingrédients à cocher */}
              {block.items.map((it, i) => (
                <button
                  key={`${it.name}-${i}`}
                  onClick={() => dispatch({ type: 'TOGGLE_SHOPPING_ITEM', payload: { blockId: block.id, index: i, itemName: it.name } })}
                  className="w-full flex items-center gap-3 py-3 text-left"
                  style={{ borderTop: '0.5px solid #F5EEF0' }}
                >
                  {it.checked ? (
                    <span className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#C4727F' }}>
                      <Check size={13} className="text-white" />
                    </span>
                  ) : (
                    <span className="w-[22px] h-[22px] rounded-full flex-shrink-0" style={{ border: '2px solid #E8A5AE' }} />
                  )}
                  <span
                    className={`flex-1 text-[13px] font-body ${it.checked ? 'line-through text-luna-text-hint' : 'text-luna-text-body'}`}
                  >
                    {it.name}
                  </span>
                </button>
              ))}

              {/* Champ d'ajout libre (bloc Mes ajouts) */}
              {isCustom && (
                <div className="flex items-center gap-2 pt-2.5" style={{ borderTop: '0.5px solid #F5EEF0' }}>
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCustom()}
                    placeholder="Ajouter un article…"
                    className="flex-1 text-[13px] font-body bg-luna-cream rounded-[12px] px-3.5 py-2.5 outline-none text-luna-text placeholder:text-luna-text-hint"
                  />
                  <button
                    onClick={addCustom}
                    aria-label="Ajouter"
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
                    style={{ backgroundColor: '#FDE8EB' }}
                  >
                    <Plus size={17} style={{ color: '#C4727F' }} />
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Champ d'ajout libre quand le bloc Mes ajouts n'existe pas encore */}
      {shoppingList.length > 0 && !shoppingList.some((b) => b.id === 'ajouts') && (
        <motion.div variants={item} className="bg-white rounded-[20px] px-4 py-3.5" style={{ boxShadow: '0 6px 22px rgba(45,34,38,0.05)' }}>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addCustom()}
              placeholder="Ajouter un article libre…"
              className="flex-1 text-[13px] font-body bg-luna-cream rounded-[12px] px-3.5 py-2.5 outline-none text-luna-text placeholder:text-luna-text-hint"
            />
            <button
              onClick={addCustom}
              aria-label="Ajouter"
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
              style={{ backgroundColor: '#FDE8EB' }}
            >
              <Plus size={17} style={{ color: '#C4727F' }} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Actions bas de page : vider les cochés / tout effacer */}
      {shoppingList.length > 0 && (
        <motion.div variants={item} className="flex flex-col items-center gap-0.5 pt-1">
          {hasChecked && (
            <button
              onClick={() => dispatch({ type: 'CLEAR_CHECKED_SHOPPING' })}
              className="text-[13px] font-body font-semibold text-luna-text-muted py-2 px-4"
            >
              Vider les articles cochés
            </button>
          )}
          <button
            onClick={() => setConfirmClear(true)}
            className="flex items-center gap-1.5 text-[13px] font-body font-semibold text-red-400 py-2 px-4 active:scale-95 transition-transform"
          >
            <Trash2 size={14} /> Tout effacer
          </button>
        </motion.div>
      )}

      <ConfirmDialog
        open={confirmClear}
        title="Vider toute la liste ?"
        message="Toutes tes recettes et articles seront retirés de ta liste de courses. Cette action est définitive."
        confirmLabel="Tout effacer"
        cancelLabel="Annuler"
        danger
        Icon={Trash2}
        onConfirm={() => {
          dispatch({ type: 'CLEAR_ALL_SHOPPING' });
          setConfirmClear(false);
          toast('Ta liste de courses a été vidée');
        }}
        onCancel={() => setConfirmClear(false)}
      />
    </motion.div>
  );
}
