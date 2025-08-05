import { routes } from "../routes";

export const teams = [
  {
    id: 1,
    name: "name ...",
    description: "desc ...",
    code: "code ...",
    isActive: true,
  },
];

export const posts = [
  { id: 1, title: "First Post", author: "John Doe", date: "2024-01-01" },
  { id: 2, title: "Second Post", author: "Jane Smith", date: "2024-01-02" },
  { id: 3, title: "Third Post", author: "Bob Johnson", date: "2024-01-03" },
];

export const lineChartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      label: "User Growth",
      data: [65, 59, 80, 81, 56, 55],
      borderColor: "rgb(255, 107, 0)",
      backgroundColor: "rgba(255, 107, 0, 0.5)",
      tension: 0.4,
    },
    {
      label: "Active Teams",
      data: [28, 48, 40, 19, 86, 27],
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
      tension: 0.4,
    },
  ],
};

export const barChartData = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Posts",
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: "rgba(255, 107, 0, 0.5)",
      borderColor: "rgb(255, 107, 0)",
      borderWidth: 1,
    },
  ],
};

export const stats = [
  {
    label: "Total Teams",
    value: "12,345",
    icon: "fas fa-users",
    color: "bg-blue-500",
  },
  {
    label: "Active Posts",
    value: "5,678",
    icon: "fas fa-file-alt",
    color: "bg-green-500",
  },
  {
    label: "Revenue",
    value: "$45,678",
    icon: "fas fa-dollar-sign",
    color: "bg-orange-500",
  },
  {
    label: "Engagement",
    value: "87%",
    icon: "fas fa-chart-line",
    color: "bg-purple-500",
  },
];

export const profileData = {
  personal: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "+1 (555) 123-4567",
    bio: "Experienced professional with a passion for technology and innovation.",
    location: "San Francisco, CA",
    website: "https://emilyjohnson.dev",
    birthDate: "1990-05-15",
  },
  professional: {
    jobTitle: "Senior Product Manager",
    company: "Tech Innovations Inc.",
    department: "Product Development",
    employeeId: "EMP-2024-001",
    startDate: "2022-01-15",
    manager: "John Smith",
    skills: [
      "Product Management",
      "UX Design",
      "Data Analysis",
      "Team Leadership",
    ],
  },
  preferences: {
    language: "English",
    timezone: "Pacific Time (PT)",
    dateFormat: "MM/DD/YYYY",
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
  },
};

export const settingsData = {
  general: {
    siteName: "YourBrand",
    siteDescription: "Modern admin dashboard with authentication",
    timezone: "UTC",
    language: "en",
    dateFormat: "MM/DD/YYYY",
  },
  notifications: {
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    weeklyReports: true,
    monthlyReports: true,
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",
    loginAttempts: "5",
  },
  appearance: {
    theme: "light",
    sidebarCollapsed: false,
    compactMode: false,
    showAnimations: true,
  },
};

export const sidebarItems = [
  { icon: "fas fa-home", label: "Dashboard", href: routes.ui.dashboard.index },
  { icon: "fas fa-users", label: "Teams", href: routes.ui.dashboard.teams },
  { icon: "fas fa-user", label: "Users", href: routes.ui.dashboard.users },
  {
    icon: "fas fa-clock",
    label: "Meetings",
    href: routes.ui.dashboard.meetings,
  },
  {
    icon: "fas fa-comments",
    label: "Chat Bot",
    href: routes.ui.dashboard.chatbot,
  },
  { icon: "fas fa-cog", label: "Settings", href: routes.ui.dashboard.settings },
];

export const landingcarouselImages = [
  "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  "https://images.pexels.com/photos/3184293/pexels-photo-3184293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
];
