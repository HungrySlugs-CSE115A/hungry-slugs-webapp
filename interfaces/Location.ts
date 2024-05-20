interface Food {
  name: string;
  restrictions: Array<string>;
}

interface subCategory {
  name: string;
  foods: Array<Food>;
}

interface Category {
  name: string;
  sub_categories: Array<subCategory>;
}

export interface Location {
  name: string;
  categories: Array<Category>;
}
