export interface Comment {
  // id: number;
  user_id: string;
  comment: string;
  date: string;
}

export interface Rating {
  rating: number;
}

export interface Ratings {
  [user_id: string]: Rating;
}

export interface Image {
  user_id: string;
  url: string;
  date: string;
}

export interface Food {
  name: string;
  restrictions: Array<string> | never[];
  comments: Array<Comment> | never[];
  ratings: Ratings | never[];
  images: Array<Image> | never[];
}
