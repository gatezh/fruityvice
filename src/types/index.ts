
export interface Nutrition {
  calories: number;
  fat: number;
  protein: number;
  carbohydrates: number;
}

export interface Fruit {
  name: string;
  family: string;
  order: string;
  genus: string;
  nutritions: Nutrition;
}

export interface GroupedFruits {
  [key: string]: Fruit[];
}
