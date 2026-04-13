import { useSelector } from '../services/store';

export const useIngredientCount = (ingredientId: string) => {
  const constructorItems = useSelector((state) => state.burgerConstructor);

  if (!constructorItems.bun && !constructorItems.ingredients.length) {
    return 0;
  }

  let count = 0;

  // Считаем булки
  if (constructorItems.bun && constructorItems.bun._id === ingredientId) {
    count += 2; // Булка всегда в двух экземплярах (верх и низ)
  }

  // Считаем начинки
  const ingredientsCount = constructorItems.ingredients.filter(
    (item) => item._id === ingredientId
  ).length;
  count += ingredientsCount;

  return count;
};
