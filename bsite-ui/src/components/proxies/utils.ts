import { MenuSelectItemType } from "@/app/common/components/filters/types";
import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import { FilterType } from "@/components/products/types";
import { TableHeaderType } from "@/app/common/types/table.types";
import { OptionType } from "@/app/common/types/option.type";

export const productBreadcrumb: BreadcrumbType[] = [
  {
    title: "home",
    disabled: false,
  },
  {
    title: "proxy",
    disabled: true,
  },
];

export const filter: FilterType = {
  query: "",
  brands: [],
  category: "",
  discount: "",
};

export const proxyAction: OptionType[] = [
  // {
  //   title: "View",
  //   icon: "ph-eye",
  //   value: "view",
  //   to: "/ecommerce/product-details",
  // },
  {
    title: "Edit",
    icon: "ph-pencil",
    value: "edit",
  },
  {
    title: "Remove",
    icon: "ph-trash",
    value: "remove",
  },
];
