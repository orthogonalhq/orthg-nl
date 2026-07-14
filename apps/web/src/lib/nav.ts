export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  description?: string;
  icon?: string;
};

export type MegaMenu = {
  label: string;
  items: NavLink[];
};

export type NavItem =
  | ({ type: "link" } & NavLink)
  | ({ type: "mega" } & MegaMenu);

export const NAV_ITEMS: NavItem[] = [
  {
    type: "mega",
    label: "Products",
    items: [
      {
        label: "Nue",
        href: "https://nue.orthg.nl",
        external: true,
        description: "The personal agent operating system",
        icon: "terminal",
      },
      {
        label: "Worktree",
        href: "https://worktree.orthg.nl/",
        external: true,
        description: "Managed business agents",
        icon: "worktree",
      },
      {
        label: "APM",
        href: "https://apm.orthg.nl",
        external: true,
        description: "Agent Package Manager",
        icon: "package",
      },
    ],
  },
  {
    type: "mega",
    label: "Research",
    items: [
      {
        label: "Research",
        href: "/research",
        description: "Technical & philosophical research",
        icon: "file-text",
      },
      {
        label: "News",
        href: "/blog",
        description: "Perspectives, announcements & updates",
        icon: "radio",
      },
    ],
  },
  {
    type: "mega",
    label: "Company",
    items: [
      {
        label: "Alignment",
        href: "/manifesto",
        description: "The immutable mandates of life",
        icon: "scroll-text",
      },
      {
        label: "Investors",
        href: "/investors",
        description: "Investor relations & deck",
        icon: "trending-up",
      },
    ],
  },
];

/** Flat list of all links for mobile menu and footer */
export const NAV_LINKS_FLAT: NavLink[] = NAV_ITEMS.flatMap((item) =>
  item.type === "mega" ? item.items : [item]
);
