export type FilterType = {
  query: string;
  brands: string[];
  category: string;
  discount: string;
};

export type SiteType = {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  ip: string;
  siteUrl: string;

};
