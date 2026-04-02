import type { CourseCardProps } from "../components/CourseCard";

export interface CourseListItem extends CourseCardProps {
  id: string;
}

export interface FilterOption {
  label: string;
  count: number;
  checked?: boolean;
}

export const suggestionTags = [
  "user interface",
  "user experience",
  "web design",
  "interface",
  "app",
];

export const courses: CourseListItem[] = [
  {
    id: "1",
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    title: "Complete Blender Creator: Learn 3D Modelling for Beginners",
    category: "Design",
    categoryTone: "warning",
    price: 49,
    rating: 4.9,
    students: 197637,
    author: "Kevin Gilbert",
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=1200&auto=format&fit=crop",
    title: "Learn Ethical Hacking From Scratch",
    category: "IT & Software",
    categoryTone: "danger",
    price: 35,
    rating: 4.8,
    students: 451444,
    author: "Dianne Russell",
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=1200&auto=format&fit=crop",
    title: "SQL for NEWBS: Weekender Crash Course",
    category: "IT & Software",
    categoryTone: "danger",
    price: 32,
    rating: 5,
    students: 451444,
    author: "Robert Fox",
  },
  {
    id: "4",
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    title: "Automate the Boring Stuff with Python Programming",
    category: "IT & Software",
    categoryTone: "danger",
    price: 9,
    rating: 4.5,
    students: 982941,
    author: "Guy Hawkins",
  },
  {
    id: "5",
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    title: "Machine Learning A-Z: Hands-On Python & R in Data Science",
    category: "IT & Software",
    categoryTone: "danger",
    price: 24,
    rating: 4.7,
    students: 451444,
    author: "Jane Cooper",
  },
  {
    id: "6",
    imageUrl:
      "https://images.unsplash.com/photo-1492724441997-5dc865305da7?q=80&w=1200&auto=format&fit=crop",
    title: "Learn Python Programming Masterclass",
    category: "IT & Software",
    categoryTone: "danger",
    price: 35,
    rating: 4,
    students: 211434,
    author: "Cameron Williamson",
  },
  {
    id: "7",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1200&auto=format&fit=crop",
    title: "Ultimate AWS Certified Cloud Practitioner",
    category: "Marketing",
    categoryTone: "primary",
    price: 13,
    rating: 4.1,
    students: 511123,
    author: "Jacob Jones",
  },
  {
    id: "8",
    imageUrl:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1200&auto=format&fit=crop",
    title: "Digital Marketing Masterclass - 23 Courses in 1",
    category: "Development",
    categoryTone: "secondary",
    price: 32,
    rating: 5,
    students: 211434,
    author: "Savannah Nguyen",
  },
  {
    id: "9",
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
    title: "SEO Complete Training for WordPress Websites",
    category: "Development",
    categoryTone: "secondary",
    price: 24,
    rating: 4.6,
    students: 181811,
    author: "Jerome Bell",
  },
];

export const categoryOptions: FilterOption[] = [
  { label: "Web Development", count: 574 },
  { label: "Data Science", count: 568 },
  { label: "Mobile Development", count: 1345, checked: true },
  { label: "Software Testing", count: 317 },
  { label: "Software Engineering", count: 31 },
];

export const toolOptions: FilterOption[] = [
  { label: "HTML 5", count: 1345 },
  { label: "CSS 3", count: 2736 },
  { label: "React", count: 1345 },
  { label: "Webflow", count: 1345, checked: true },
  { label: "Node.js", count: 1345 },
];

export const ratingOptions: FilterOption[] = [
  { label: "5 Star", count: 1345 },
  { label: "4 Star & up", count: 1345 },
  { label: "3 Star & up", count: 1345, checked: true },
  { label: "2 Star & up", count: 1345 },
  { label: "1 Star & up", count: 1345 },
];

export const levelOptions: FilterOption[] = [
  { label: "All Level", count: 1345 },
  { label: "Beginner", count: 1345 },
  { label: "Intermediate", count: 1345 },
  { label: "Expert", count: 1345 },
];

export const durationOptions: FilterOption[] = [
  { label: "6-12 Months", count: 1345 },
  { label: "3-6 Months", count: 1345 },
  { label: "1-3 Months", count: 1345, checked: true },
  { label: "1-4 Weeks", count: 1345 },
  { label: "1-7 Days", count: 1345 },
];
