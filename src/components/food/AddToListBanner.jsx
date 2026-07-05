import { ShoppingCart, Check, Plus } from 'lucide-react';
import { useCycle } from '../../contexts/CycleContext';
import { toast } from '../../lib/toast';

// Bannière douce « Ajouter aux courses » — affichée dans les fiches recette,
// entre la description et les ingrédients. Rose quand la recette n'est pas
// dans la liste, verte sauge « Dans ta liste » (avec Retirer) quand elle y est.
export default function AddToListBanner({ recipe, source = 'recette' }) {
  const { shoppingList, dispatch } = useCycle();
  if (!recipe?.ingredients?.length) return null;

  const inList = shoppingList.some((b) => b.id !== 'ajouts' && b.name === recipe.name);

  const add = () => {
    dispatch({
      type: 'ADD_SHOPPING_RECIPE',
      payload: { name: recipe.name, ingredients: recipe.ingredients, emoji: recipe.emoji, source },
    });
    toast('Ajoutée à ta liste de courses 🛒');
  };
  const remove = () => dispatch({ type: 'REMOVE_SHOPPING_RECIPE', payload: recipe.name });

  if (inList) {
    return (
      <button
        onClick={remove}
        className="w-full flex items-center gap-3 rounded-[14px] px-4 py-2.5 text-left active:scale-[0.99] transition-transform"
        style={{ backgroundColor: '#EDF5ED' }}
      >
        <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
          <Check size={16} style={{ color: '#4D7A50' }} />
        </div>
        <span className="flex-1 text-[13px] font-body font-bold" style={{ color: '#4D7A50' }}>
          Dans ta liste de courses
        </span>
        <span className="text-[12px] font-body" style={{ color: '#4D7A50' }}>Retirer</span>
      </button>
    );
  }

  return (
    <button
      onClick={add}
      className="w-full flex items-center gap-3 rounded-[14px] px-4 py-2.5 text-left active:scale-[0.99] transition-transform"
      style={{ backgroundColor: '#FDE8EB' }}
    >
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0">
        <ShoppingCart size={16} style={{ color: '#C4727F' }} />
      </div>
      <span className="flex-1 text-[13px] font-body font-bold" style={{ color: '#A85A66' }}>
        Ajouter aux courses
      </span>
      <Plus size={16} style={{ color: '#C4727F' }} className="flex-shrink-0" />
    </button>
  );
}
