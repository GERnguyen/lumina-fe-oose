import type { CourseCardProps } from "../components/CourseCard";

export interface LectureItem {
  title: string;
  duration: string;
  isFile?: boolean;
  active?: boolean;
}

export interface CurriculumSection {
  title: string;
  lectures: number;
  duration: string;
  items: LectureItem[];
}

export interface ReviewItem {
  name: string;
  time: string;
  rating: number;
  comment: string;
  avatarUrl: string;
}

export interface InstructorItem {
  name: string;
  title: string;
  avatarUrl: string;
  rating: number;
  students: number;
  courses: number;
  bio: string;
}

export interface BenefitItem {
  text: string;
}

export const relatedCourses: CourseCardProps[] = [
  {
    imageUrl:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    title: "Machine Learning A-Z: Hands-On Python & R in Data Science",
    category: "Design",
    categoryTone: "warning",
    price: 57,
    rating: 5,
    students: 265700,
    author: "Kevin Gilbert",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
    title: "The Complete 2021 Web Development Bootcamp",
    category: "Development",
    categoryTone: "secondary",
    price: 57,
    rating: 5,
    students: 265700,
    author: "Dianne Russell",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    title: "Learn Python Programming Masterclass",
    category: "Business",
    categoryTone: "success",
    price: 57,
    rating: 5,
    students: 265700,
    author: "Robert Fox",
  },
  {
    imageUrl:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    title: "The Complete Digital Marketing Course - 12 Courses in 1",
    category: "Marketing",
    categoryTone: "primary",
    price: 57,
    rating: 5,
    students: 265700,
    author: "Savannah Nguyen",
  },
];

export const curriculumSections: CurriculumSection[] = [
  {
    title: "Getting Started",
    lectures: 4,
    duration: "51m",
    items: [
      { title: "What’s is Webflow?", duration: "07:31" },
      { title: "Sign up in Webflow", duration: "07:31" },
      { title: "Webflow Terms & Conditions", duration: "5.3 MB", isFile: true },
      { title: "Teaser of Webflow", duration: "07:31" },
      {
        title: "Practice Project",
        duration: "5.3 MB",
        isFile: true,
        active: true,
      },
    ],
  },
  {
    title: "Secret of Good Design",
    lectures: 52,
    duration: "5h 49m",
    items: [
      { title: "Design principles for beginners", duration: "11:20" },
      { title: "Working with grids and spacing", duration: "09:41" },
      { title: "Typography fundamentals", duration: "08:53" },
    ],
  },
  {
    title: "Practice Design Like an Artist",
    lectures: 43,
    duration: "53m",
    items: [
      { title: "Moodboards and visual references", duration: "14:03" },
      { title: "Design critique workflow", duration: "16:22" },
      { title: "Hand-off checklist", duration: "22:31" },
    ],
  },
  {
    title: "Web Development (webflow)",
    lectures: 137,
    duration: "10h 6m",
    items: [
      { title: "Build responsive hero sections", duration: "12:45" },
      { title: "Create reusable components", duration: "18:02" },
      { title: "Publish and iterate", duration: "09:12" },
    ],
  },
  {
    title: "Secrets of Making Money Freelancing",
    lectures: 21,
    duration: "38m",
    items: [
      { title: "Find your first client", duration: "12:12" },
      { title: "Write proposals that convert", duration: "10:44" },
      { title: "Scope and pricing basics", duration: "14:21" },
    ],
  },
  {
    title: "Advanced",
    lectures: 39,
    duration: "91m",
    items: [
      { title: "Advanced layout patterns", duration: "28:15" },
      { title: "Animation and micro-interactions", duration: "31:03" },
      { title: "Optimization and QA", duration: "31:42" },
    ],
  },
];

export const reviews: ReviewItem[] = [
  {
    name: "Guy Hawkins",
    time: "1 week ago",
    rating: 5,
    comment:
      "I appreciate the precise short videos because overly long lessons tend to make me lose focus. The instructor is very knowledgeable and it shows.",
    avatarUrl: "https://placehold.co/40x40",
  },
  {
    name: "Dianne Russell",
    time: "51 mins ago",
    rating: 5,
    comment:
      "This course is just amazing. It has great content, practical examples, and a lot of real-world knowledge.",
    avatarUrl: "https://placehold.co/40x40",
  },
  {
    name: "Bessie Cooper",
    time: "6 hours ago",
    rating: 5,
    comment:
      "The course helped me build real skills I could apply immediately. Highly recommended for newcomers.",
    avatarUrl: "https://placehold.co/40x40",
  },
  {
    name: "Eleanor Pena",
    time: "1 day ago",
    rating: 5,
    comment:
      "Great pacing, clear explanations, and the hands-on exercises made the whole experience practical.",
    avatarUrl: "https://placehold.co/40x40",
  },
  {
    name: "Ralph Edwards",
    time: "2 days ago",
    rating: 5,
    comment:
      "Very descriptive and professional instruction. I learned a ton that applies directly to client work.",
    avatarUrl: "https://placehold.co/40x40",
  },
  {
    name: "Arlene McCoy",
    time: "1 week ago",
    rating: 5,
    comment:
      "One of the best courses I have taken for UX/UI. Highly recommend for anyone starting out.",
    avatarUrl: "https://placehold.co/40x40",
  },
];

export const benefitItems: BenefitItem[] = [
  {
    text: "You will learn how to design beautiful websites using Figma, an interface design tool used by designers at Uber, Airbnb and Microsoft.",
  },
  {
    text: "You will learn how to take your designs and build them into powerful websites using Webflow, a site builder used by teams at Dell, NASA and more.",
  },
  {
    text: "You will learn secret tips of Freelance Web Designers and how they make great money freelancing online.",
  },
  {
    text: "Learn to use Python professionally, learning both Python 2 and Python 3.",
  },
  {
    text: "Understand how to use both the Jupyter Notebook and create .py files.",
  },
  {
    text: "Get an understanding of how to create GUIs in the Jupyter Notebook system.",
  },
];

export const whoThisCourseIsFor = [
  "This course is for those who want to launch a Freelance Web Design career.",
  "Praesent eget consequat elit. Duis a pretium purus.",
  "Sed sagittis suscipit condimentum pellentesque vulputate feugiat libero nec accumsan.",
  "Sed nec dapibus orci integer nisl turpis, eleifend sit amet aliquam vel, lacinia quis ex.",
  "Those who are looking to reboot their work life and try a new profession that is fun, rewarding and highly in-demand.",
  "Nunc auctor consequat lorem, in posuere enim hendrerit sed.",
  "Duis ornare enim ullamcorper congue consectetur suspendisse interdum tristique est sed molestie.",
];

export const courseRequirements = [
  "Nunc auctor consequat lorem, in posuere enim hendrerit sed.",
  "Sed sagittis suscipit condimentum pellentesque vulputate feugiat libero nec accumsan.",
  "Duis ornare enim ullamcorper congue consectetur suspendisse interdum tristique est sed molestie.",
  "Those who are looking to reboot their work life and try a new profession that is fun, rewarding and highly in-demand.",
  "Praesent eget consequat elit. Duis a pretium purus.",
  "Sed nec dapibus orci integer nisl turpis, eleifend sit amet aliquam vel, lacinia quis ex.",
  "This course is for those who want to launch a Freelance Web Design career.",
];

export const courseIncludes = [
  "Lifetime access",
  "30-days money-back guarantee",
  "Free exercises file & downloadable resources",
  "Shareable certificate of completion",
  "Access on mobile, tablet and TV",
  "English subtitles",
  "100% online course",
];

export const courseStats = [
  { label: "Course Duration", value: "6 Month" },
  { label: "Course Level", value: "Beginner and Intermediate" },
  { label: "Students Enrolled", value: "69,419,618" },
  { label: "Language", value: "Mandarin" },
  { label: "Subtittle Language", value: "English" },
];

export const instructor = {
  name: "Vako Shvili",
  title: "Web Designer & Best-Selling Instructor",
  avatarUrl: "https://placehold.co/136x136",
  rating: 4.9,
  students: 236568,
  courses: 9,
  bio: "One day Vako had enough with the 9-to-5 grind and decided to work on his dream: be his own boss, travel the world, only do work he enjoyed, and teach others the same path. He has over 10 years of experience in design and product creation.",
};

export const instructorSecond = {
  name: "Nima Tahami",
  title: "Entrepreneur & Designer • Founder of ShiftRide",
  avatarUrl: "https://placehold.co/136x136",
  rating: 4.6,
  students: 5342,
  courses: 1,
  bio: "I’m an entrepreneur & designer with a passion for building products and seeing ideas come to life. Over the years I have designed and built projects in fashion and technology, combining strategy with execution.",
};
