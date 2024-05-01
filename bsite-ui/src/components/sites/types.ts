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
  description?: string;
  ctr?: number;
  status?: boolean;
  ip: string;
  siteUrl: string;

};
