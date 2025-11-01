import type { Recipe } from './types';

export const PREDEFINED_RECIPES: Recipe[] = [
  {
    id: 1,
    title: 'Classic Spaghetti Carbonara',
    description: 'A creamy and delicious Italian pasta dish made with eggs, cheese, pancetta, and pepper.',
    imageUrl: 'https://picsum.photos/seed/carbonara/600/400',
    ingredients: [
      '200g spaghetti',
      '100g pancetta or guanciale, diced',
      '2 large eggs',
      '50g Pecorino Romano cheese, grated',
      '50g Parmesan cheese, grated',
      '2 cloves garlic, minced',
      'Freshly ground black pepper',
      'Salt to taste',
    ],
    instructions: [
      'Cook spaghetti according to package directions. Reserve 1 cup of pasta water.',
      'While pasta cooks, sauté pancetta in a large skillet over medium heat until crisp. Add garlic and cook for 1 minute more.',
      'In a bowl, whisk together eggs and grated cheeses. Season generously with black pepper.',
      'Drain the pasta and add it to the skillet with the pancetta. Toss to combine. Remove from heat.',
      'Slowly pour the egg and cheese mixture into the pasta, stirring quickly to create a creamy sauce. Add a splash of pasta water if needed to reach desired consistency.',
      'Serve immediately with extra cheese and pepper.',
    ],
  },
  {
    id: 2,
    title: 'Avocado Toast with Egg',
    description: 'A simple, nutritious, and satisfying breakfast or snack that is ready in minutes.',
    imageUrl: 'https://picsum.photos/seed/avocado/600/400',
    ingredients: [
        '1 slice of whole-wheat bread',
        '1/2 ripe avocado',
        '1 large egg',
        '1 tsp lemon juice',
        'Red pepper flakes to taste',
        'Salt and pepper to taste',
    ],
    instructions: [
        'Toast the bread to your desired crispness.',
        'While the bread is toasting, mash the avocado with lemon juice, salt, and pepper in a small bowl.',
        'Cook the egg as you like (fried, poached, or scrambled).',
        'Spread the mashed avocado evenly on the toast.',
        'Top with the cooked egg and a sprinkle of red pepper flakes.',
        'Serve immediately and enjoy!'
    ]
  },
  {
    id: 3,
    title: 'Chicken Stir-Fry',
    description: 'A quick, healthy, and flavorful weeknight dinner packed with veggies and tender chicken.',
    imageUrl: 'https://picsum.photos/seed/stirfry/600/400',
    ingredients: [
        '1 lb boneless, skinless chicken breast, cut into bite-sized pieces',
        '1 tbsp soy sauce',
        '1 tbsp cornstarch',
        '2 tbsp vegetable oil',
        '1 head of broccoli, cut into florets',
        '1 red bell pepper, sliced',
        '1 carrot, julienned',
        '3 cloves garlic, minced',
        '1 tbsp ginger, grated',
        '1/4 cup soy sauce',
        '2 tbsp honey',
        '1 tsp sesame oil'
    ],
    instructions: [
        'In a bowl, toss chicken with 1 tbsp soy sauce and cornstarch.',
        'Heat 1 tbsp vegetable oil in a large skillet or wok over high heat. Add chicken and cook until browned and cooked through. Remove from skillet.',
        'Add remaining 1 tbsp oil to the skillet. Add broccoli, bell pepper, and carrot. Stir-fry for 3-5 minutes until crisp-tender.',
        'Add garlic and ginger, and cook for another minute until fragrant.',
        'In a small bowl, whisk together 1/4 cup soy sauce, honey, and sesame oil.',
        'Return chicken to the skillet. Pour the sauce over everything and toss to coat. Cook for 1-2 minutes until the sauce has thickened slightly.',
        'Serve hot with rice or noodles.'
    ]
  }
];
