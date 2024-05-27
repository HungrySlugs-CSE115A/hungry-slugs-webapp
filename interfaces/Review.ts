export interface FrontEndReview {
  average: number | null;
  user_rating: number | null;
}

export interface FrontEndReviews {
  [food_name: string]: FrontEndReview;
}

export interface UserReviews {
  [food_name: string]: number;
}
