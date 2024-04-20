export type FilterType = {
  query: string;
  brands: string[];
  category: string;
  discount: string;
};

export type ProxyType = {
  _id?: string;
  status?: string;
  ip_changed_time?: string;
  proxy?: string;
  used_at?: string;
  updated_time?: string;

};
