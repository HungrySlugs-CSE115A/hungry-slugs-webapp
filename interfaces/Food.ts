export interface Comment {
  user_id: string;
  comment: string;
  date: string;
}

export interface Rating {
  user_id: string;
  rating: number;
  date: string;
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
  ratings: Array<Rating> | never[];
  images: Array<Image> | never[];
}
