import {
  MenuItemType,
  BrandsListType,
  CartItemType,
  NotificationType
} from "@/components/layouts/types";
import {
  gitHub,
  bitBucket,
  dribbble,
  dropbox,
  mail_chimp,
  slack
} from "@/assets/images/brands/utils";
import { Img1, Img5, Img10 } from "@/assets/images/products/utils";
import { Avatar2, Avatar8 } from "@/assets/images/users/utils";
import {LS_KEY_SITE} from "@/app/const";

export const menuItems: MenuItemType[] = [
  {
    label: "home",
    isHeader: true,
    id: "HeaderMenu",
    show: true,
  },
  {
    label: "site",
    icon: "ph-browser",
    id: "sidebarSites",
    link: "/sites",
    show: true
  },
  {
    label: "proxy",
    icon: "ph-line-segments",
    id: "sidebarProxy",
    link: "/proxy",
    show: true
  },
  {
    label: "user",
    icon: "ph-users",
    id: "UserSidebar",
    link: "/users",
    show: true
  },
  // {
  //   label: "dashboards",
  //   icon: "ph-gauge",
  //   id: "sidebarDashboards",
  //   prefix: "/dashboard",
  //   subMenu: [{ label: "ecommerce", link: "/" }]
  // },
  {
    label: "manager",
    isHeader: true,
    id: "sidebarPages",
    show: !!localStorage.getItem(LS_KEY_SITE)
  },
  // {
  //   label: "bot",
  //   icon: "ph-robot",
  //   id: "sidebarBot",
  //   link: "/bots",
  //   show: !!localStorage.getItem(LS_KEY_SITE)
  // },
  {
    label: "url",
    icon: "ph-link",
    id: "sidebarUrl",
    link: "/urls",
    show: !!localStorage.getItem(LS_KEY_SITE)
  },

  // {
  //   label: "proxy",
  //   icon: "ph-line-segments",
  //   id: "sidebarProxy",
  //   link: "/proxies",
  //   show: !!localStorage.getItem(LS_KEY_SITE)
  // },
  // {
  //   label: "keyword",
  //   icon: "ph-key",
  //   id: "sidebarKeyword",
  //   link: "/keywords",
  //   show: !!localStorage.getItem(LS_KEY_SITE)
  // },
  // {
  //   label: "authentication",
  //   icon: "ph-user-circle",
  //   id: "sidebarAuth",
  //   subMenu: [
  //     { label: "signin", link: "/auth/signin" },
  //     { label: "signup", link: "/auth/signup" },
  //     { label: "password-reset", link: "/auth/pass-reset" },
  //     { label: "password-create", link: "/auth/pass-change" },
  //     { label: "lock-screen", link: "/auth/lockscreen" },
  //     { label: "logout", link: "/auth/logout" },
  //     { label: "success-message", link: "/auth/success-msg" },
  //     { label: "two-step-verification", link: "/auth/twostep" },
  //     {
  //       label: "errors",
  //       id: "sidebarErrors",
  //       subMenu: [
  //         { label: "404-error", link: "/auth/404" },
  //         { label: "500", link: "/auth/500" },
  //         { label: "503", link: "/auth/503" },
  //         { label: "offline-page", link: "/auth/offline" }
  //       ]
  //     }
  //   ]
  // },
  // {
  //   label: "pages",
  //   icon: "ph-address-book",
  //   id: "sidebarPages",
  //   prefix: "/pages",
  //   subMenu: [
  //     { label: "starter", link: "/pages/starter" },
  //     { label: "maintenance", link: "/pages/maintenance" },
  //     { label: "coming-soon", link: "/pages/coming-soon" }
  //   ]
  // },
  // {
  //   label: "multi-level",
  //   icon: "ph-share-network",
  //   id: "sidebarMultiLevel",
  //   subMenu: [
  //     { label: "level-1.1" },
  //     {
  //       label: "level-1.2",
  //       subMenu: [
  //         { label: "level-2.1", link: "" },
  //         { label: "level-2.2", link: "" }
  //       ]
  //     }
  //   ]
  // }
];

export const brandsList: BrandsListType[] = [
  { src: gitHub, title: "GitHub" },
  { src: bitBucket, title: "Bitbucket" },
  { src: dribbble, title: "Dribbble" },
  { src: dropbox, title: "Dropbox" },
  { src: mail_chimp, title: "Mail Chimp" },
  { src: slack, title: "Slack" }
];

export const cartItems: CartItemType[] = [
  {
    id: 1,
    src: Img1,
    subTitle: "Fashion",
    title: "Blive Printed Men Round Neck",
    price: 327.49,
    items: 2
  },
  {
    id: 2,
    src: Img5,
    subTitle: "Sportwear",
    title: "Willage Volleyball Ball",
    price: 49.06,
    items: 3
  },
  {
    id: 3,
    src: Img10,
    subTitle: "Fashion",
    title: "Cotton collar t-shirts for men",
    price: 53.33,
    items: 3
  }
];

export const notifications: NotificationType[] = [
  {
    isSelected: false,
    id: "unread-1",
    src: Avatar2,
    title: "Angela Bernier",
    message: "Answered to your comment on the cash flow forecast's graph 🔔.",
    time: "48 min ago",
    isRead: false
  },
  {
    isSelected: false,
    id: "unread-2",
    icon: "bx bx-badge-check bx-xs",
    message: `<h4>Your <b>Elite</b> author Graphic
    Optimization <span class="text-secondary">reward</span> is ready!</h4>`,
    time: "Just 30 sec ago",
    isRead: false
  },
  {
    isSelected: false,
    id: "unread-3",
    icon: "bx bx-message-square-dots",
    message: `<h4>You have received <b class="text-success">20</b> new messages in the conversation</h4>`,
    time: "2 hrs ago",
    isRead: false
  },

  {
    isSelected: false,
    id: "read-1",
    src: Avatar8,
    title: "Maureen Gibson",
    message: "We talked about a project on linkedin.",
    time: "4 hrs ago",
    isRead: true
  }
];
