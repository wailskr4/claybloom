
import { tutorials as allTutorials } from './tutorials';

// Catégories ClayBloom
const baseCategories = [
  {
    title: 'Fleurs & bouquets',
    image:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80',
    color: 'bg-pink-50',
  },
  {
    title: 'Figurines kawaii',
    image:
      'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
    color: 'bg-purple-50',
  },
  {
    title: 'Fleurs souriantes',
    image:
      'https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=600&q=80',
    color: 'bg-amber-50',
  },
  {
    title: 'Gourmandises kawaii',
    image:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=600&q=80',
    color: 'bg-orange-50',
  },
  {
    title: 'Bijoux & Accessoires',
    image:
      'https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=600&q=80',
    color: 'bg-green-50',
  },
  {
    title: 'Déco & Maison',
    image:
      'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=600&q=80',
    color: 'bg-rose-50',
  },
];

// Calcul automatique du nombre de tutoriels par catégorie
export const categories = baseCategories.map((category) => {
  const count = allTutorials.filter(
    (tutorial) => tutorial.category === category.title
  ).length;

  return {
    ...category,
    count: `${count} tutoriel${count > 1 ? 's' : ''}`,
  };
});
