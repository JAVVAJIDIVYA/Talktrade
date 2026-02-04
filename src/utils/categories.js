export const categories = [
  {
    name: "Graphics & Design",
    value: "design",
    icon: "🎨",
    path: "/gigs?category=design",
    color: "from-blue-400 to-blue-600",
  },
  {
    name: "Digital Marketing",
    value: "marketing",
    icon: "📈",
    path: "/gigs?category=marketing",
    color: "from-blue-500 to-indigo-500",
  },
  {
    name: "Writing & Translation",
    value: "writing",
    icon: "✍️",
    path: "/gigs?category=writing",
    color: "from-indigo-400 to-blue-500",
  },
  {
    name: "Video & Animation",
    value: "video",
    icon: "🎬",
    path: "/gigs?category=video",
    color: "from-blue-600 to-blue-400",
  },
  {
    name: "Programming & Tech",
    value: "programming",
    icon: "💻",
    path: "/gigs?category=programming",
    color: "from-blue-400 to-indigo-500",
  },
  {
    name: "Business",
    value: "business",
    icon: "💼",
    path: "/gigs?category=business",
    color: "from-indigo-500 to-blue-600",
  },
  {
    name: "Music & Audio",
    value: "music",
    icon: "🎵",
    path: "/gigs?category=music",
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "AI Services",
    value: "ai",
    icon: "🤖",
    path: "/gigs?category=ai",
    color: "from-blue-400 to-indigo-400",
  },
];

export const categoriesForFilter = [
  { value: "", label: "All Categories" },
  ...categories.map(c => ({ value: c.value, label: c.name }))
];
