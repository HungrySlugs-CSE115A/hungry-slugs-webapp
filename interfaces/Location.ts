export interface Food {
  name: string;
  restrictions: Array<string>;
}

export interface subCategory {
  name: string;
  foods: Array<Food>;
}

export interface Category {
  name: string;
  sub_categories: Array<subCategory>;
}

export interface Location {
  name: string;
  categories: Array<Category>;
}
