import { MenuSelectItemType } from "@/app/common/components/filters/types";
import { BreadcrumbType } from "@/app/common/types/breadcrumb.type";
import { FilterType } from "@/components/products/types";
import { TableHeaderType } from "@/app/common/types/table.types";
import { OptionType } from "@/app/common/types/option.type";
import {ref} from "vue";
import {getUnixTime} from "date-fns";

export const productBreadcrumb: BreadcrumbType[] = [
  {
    title: "home",
    disabled: false,
  },
  {
    title: "fb-page",
    disabled: true,
  },
];

export const filter: FilterType = {
  query: "",
  brands: [],
  category: "",
  discount: "",
};

export const brandOptions: MenuSelectItemType[] = [
  { value: "boat", label: "Boat" },
  { value: "puma", label: "Puma" },
  { value: "adidas", label: "Adidas" },
  { value: "realMe", label: "RealMe" },
];

export const categoryOptions: MenuSelectItemType[] = [
  { value: "Appliances", label: "Appliances" },
  { value: "Automotive Accessories", label: "Automotive Accessories" },
  { value: "Electronics", label: "Electronics" },
  { value: "Fashion", label: "Fashion" },
  { value: "Furniture", label: "Furniture" },
  { value: "Grocery", label: "Grocery" },
  { value: "Headphones", label: "Headphones" },
  { value: "Kids", label: "Kids" },
  { value: "Luggage", label: "Luggage" },
  { value: "Sports", label: "Sports" },
  { value: "Watches", label: "Watches" },
];

export const discountOptions: MenuSelectItemType[] = [
  { value: "50$", label: "50% or more" },
  { value: "40%", label: "40% or more" },
  { value: "30%", label: "30% or more" },
  { value: "20%", label: "20% or more" },
  { value: "10%", label: "10% or more" },
  { value: "0%", label: "Less than 10%" },
];

export const productsHeader: TableHeaderType[] = [
  { title: "all", isCheck: true },
  { title: "Products" },
  { title: "Category" },
  { title: "Stock" },
  { title: "Price" },
  { title: "Orders" },
  { title: "Rating" },
  { title: "Publish" },
  { title: "Action" },
];

export const pageHeaderSelect = [
  {
    title: '#',
    align: 'start',
    key: 'stt',
  },
  {
    title: 'Page name',
    align: 'start',
    key: 'page_name',
  },
  { title: 'Page id', key: 'page_id', align: 'start', },
] as any

export const pageHeaderSelected = [
  {
    title: '#',
    align: 'start',
    key: 'stt',
  },
  {
    title: 'Page name',
    align: 'start',
    key: 'page_name',
  },
  { title: 'Scheduled Time', key: 'scheduled_time', align: 'start', },
  { title: 'Action', key: 'action', align: 'start', },
] as any

export const pageAction: OptionType[] = [
  // {
  //   title: "View",
  //   icon: "ph-eye",
  //   value: "view",
  //   to: "/ecommerce/product-details",
  // },
  // {
  //   title: "Push data",
  //   icon: "ph-paper-plane-tilt",
  //   value: "push",
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

export const checkDateExpired = (value: number) => {
  const unixNow = getUnixTime(new Date())
  return unixNow > value
}
