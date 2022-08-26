export interface Post {
  id: string;
  title: string;
  content?: string;
  published: boolean;
  authorId?: string;
  author?: User;
  price: number;
  location: string;
  images?: Image[];
  comments?: Comment[];
  categories?: Category[];
}

export interface Image {
  id: string;
  secureUrl: string;
  publicId: string;
  format: string;
  version: string;
  postId?: string;
  post?: Post;
}

export interface Comment {
  id: string;
  content: string;
  authorId?: string;
  author?: User;
  replies?: Reply[];
  post?: Post;
  postId: string;
}

export interface Reply {
  id: string;
  content: string;
  author?: User;
  authorId?: string;
  commentId?: string;
  comment: Comment[];
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  posts?: Post[];
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}
