export type FilterType = {
  query: string;
  brands: string[];
  category: string;
  discount: string;
};

export type FBPageType = {
  id?: string;
  _id?: string;
  via_name: string;
  page_name: string;
  page_id: string;
  url?: string;
  expired_date?: number | string;
  access_token: string;
};
