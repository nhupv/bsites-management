export type FilterType = {
  query: string;
  brands: string[];
  category: string;
  discount: string;
};

export type UserType = {
  id?: string;
  _id?: string;
  username: string;
  email: string;
  roles: string;
  password?: string;
};
