import {
  HomeIcon,
  type LucideIcon,
  TicketIcon,
  UserCircle2Icon,
  UsersIcon,
} from "lucide-react";

export const DEGREES = [
  "B.Tech",
  "B.E",
  "B.Sc",
  "M.Tech",
  "M.E",
  "M.Sc",
  "Ph.D",
  "Other",
] as const;

export const DEPARTMENTS = [
  "Computer Science and Engineering",
  "Electronics and Communication Engineering",
  "Electrical and Electronics Engineering",
  "Civil Engineering",
  "Mechanical Engineering",
  "Chemical Engineering",
  "Information Technology",
  "Textile and Apparel Engineering",
  "Food Processing and Technology",
  "Environmental Engineering",
  "Architecture",
  "Business Administration",
  "Commerce",
  "Computer Science",
  "Economics",
  "Education",
  "Engineering",
  "Law",
  "Mathematics",
  "Medicine",
  "Physics",
  "Social Sciences",
] as const;

export const YEAR_OF_STUDY = [
  {
    label: "1st",
    value: "1",
  },
  {
    label: "2nd",
    value: "2",
  },
  {
    label: "3rd",
    value: "3",
  },
  {
    label: "4th",
    value: "4",
  },
  {
    label: "5th",
    value: "5",
  },
] as const;

export const NAV_ITEMS: Array<{
  label: string;
  href: string;
  icon: LucideIcon;
}> = [
  {
    label: "Home",
    href: "/home",
    icon: HomeIcon,
  },
  {
    label: "Tickets",
    href: "/tickets",
    icon: TicketIcon,
  },
  {
    label: "Clubs",
    href: "/clubs",
    icon: UsersIcon,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserCircle2Icon,
  },
];

export enum ClubPosition {
  MEMBER = "Member",
  CREATOR = "Creator",
  HEAD = "Head",
}
