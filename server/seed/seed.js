import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);  // Use Google DNS — fixes ISP SRV block

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Gig from "../models/gig.model.js";
import Review from "../models/review.model.js";

dotenv.config();

const CATEGORIES = [
  { value: "design", label: "Graphics & Design" },
  { value: "marketing", label: "Digital Marketing" },
  { value: "writing", label: "Writing & Translation" },
  { value: "video", label: "Video & Animation" },
  { value: "programming", label: "Programming & Tech" },
  { value: "business", label: "Business" },
  { value: "music", label: "Music & Audio" },
  { value: "ai", label: "AI Services" },
];

// 5 employees per category (40 total) - each gets a different face
const EMPLOYEES_PER_CATEGORY = 5;
const EMPLOYEES_BY_CATEGORY = {
  design: [
    { name: "Priya Sharma", city: "Mumbai", email: "priya.design1@example.com", hourlyRate: 850 },
    { name: "Rahul Verma", city: "Delhi", email: "rahul.design2@example.com", hourlyRate: 1200 },
    { name: "Anita Desai", city: "Bangalore", email: "anita.design3@example.com", hourlyRate: 950 },
    { name: "Vikram Singh", city: "Chennai", email: "vikram.design4@example.com", hourlyRate: 1100 },
    { name: "Kavita Reddy", city: "Hyderabad", email: "kavita.design5@example.com", hourlyRate: 780 },
    { name: "Arjun Nair", city: "Pune", email: "arjun.design6@example.com", hourlyRate: 1350 },
    { name: "Meera Iyer", city: "Kolkata", email: "meera.design7@example.com", hourlyRate: 900 },
    { name: "Suresh Patel", city: "Ahmedabad", email: "suresh.design8@example.com", hourlyRate: 820 },
    { name: "Lakshmi Krishnan", city: "Kochi", email: "lakshmi.design9@example.com", hourlyRate: 1050 },
    { name: "Rohan Gupta", city: "Jaipur", email: "rohan.design10@example.com", hourlyRate: 1150 },
    { name: "Divya Menon", city: "Trivandrum", email: "divya.design11@example.com", hourlyRate: 880 },
    { name: "Karthik Rao", city: "Mysore", email: "karthik.design12@example.com", hourlyRate: 990 },
    { name: "Pooja Joshi", city: "Nagpur", email: "pooja.design13@example.com", hourlyRate: 750 },
  ],
  marketing: [
    { name: "Amit Kumar", city: "Mumbai", email: "amit.marketing1@example.com", hourlyRate: 950 },
    { name: "Neha Agarwal", city: "Delhi", email: "neha.marketing2@example.com", hourlyRate: 1100 },
    { name: "Rajesh Pillai", city: "Bangalore", email: "rajesh.marketing3@example.com", hourlyRate: 1300 },
    { name: "Swati Menon", city: "Chennai", email: "swati.marketing4@example.com", hourlyRate: 1000 },
    { name: "Deepak Malhotra", city: "Hyderabad", email: "deepak.marketing5@example.com", hourlyRate: 900 },
    { name: "Shreya Bhatt", city: "Pune", email: "shreya.marketing6@example.com", hourlyRate: 1250 },
    { name: "Manoj Tiwari", city: "Kolkata", email: "manoj.marketing7@example.com", hourlyRate: 850 },
    { name: "Anjali Saxena", city: "Lucknow", email: "anjali.marketing8@example.com", hourlyRate: 980 },
    { name: "Sanjay Mehta", city: "Surat", email: "sanjay.marketing9@example.com", hourlyRate: 920 },
    { name: "Ritu Chopra", city: "Chandigarh", email: "ritu.marketing10@example.com", hourlyRate: 1080 },
    { name: "Vivek Nambiar", city: "Coimbatore", email: "vivek.marketing11@example.com", hourlyRate: 1020 },
    { name: "Preeti Shah", city: "Indore", email: "preeti.marketing12@example.com", hourlyRate: 870 },
    { name: "Gaurav Bhatia", city: "Bhopal", email: "gaurav.marketing13@example.com", hourlyRate: 940 },
  ],
  writing: [
    { name: "Sneha Kapoor", city: "Mumbai", email: "sneha.writing1@example.com", hourlyRate: 650 },
    { name: "Aditya Joshi", city: "Delhi", email: "aditya.writing2@example.com", hourlyRate: 800 },
    { name: "Rekha Subramanian", city: "Bangalore", email: "rekha.writing3@example.com", hourlyRate: 720 },
    { name: "Nitin Srinivasan", city: "Chennai", email: "nitin.writing4@example.com", hourlyRate: 780 },
    { name: "Isha Venkatesh", city: "Hyderabad", email: "isha.writing5@example.com", hourlyRate: 690 },
    { name: "Varun Menon", city: "Kochi", email: "varun.writing6@example.com", hourlyRate: 850 },
    { name: "Tanvi Deshmukh", city: "Pune", email: "tanvi.writing7@example.com", hourlyRate: 740 },
    { name: "Kiran Reddy", city: "Vizag", email: "kiran.writing8@example.com", hourlyRate: 670 },
    { name: "Rhea Nair", city: "Thrissur", email: "rhea.writing9@example.com", hourlyRate: 760 },
    { name: "Abhishek Iyer", city: "Madurai", email: "abhishek.writing10@example.com", hourlyRate: 710 },
    { name: "Maya Krishnan", city: "Mysore", email: "maya.writing11@example.com", hourlyRate: 830 },
    { name: "Siddharth Rao", city: "Mangalore", email: "siddharth.writing12@example.com", hourlyRate: 700 },
    { name: "Ananya Gupta", city: "Dehradun", email: "ananya.writing13@example.com", hourlyRate: 750 },
  ],
  video: [
    { name: "Ravi Shankar", city: "Mumbai", email: "ravi.video1@example.com", hourlyRate: 1500 },
    { name: "Kriti Bansal", city: "Delhi", email: "kriti.video2@example.com", hourlyRate: 1800 },
    { name: "Sandeep Nambiar", city: "Bangalore", email: "sandeep.video3@example.com", hourlyRate: 1650 },
    { name: "Pallavi Iyer", city: "Chennai", email: "pallavi.video4@example.com", hourlyRate: 1400 },
    { name: "Harsh Varma", city: "Hyderabad", email: "harsh.video5@example.com", hourlyRate: 1550 },
    { name: "Nidhi Kapoor", city: "Pune", email: "nidhi.video6@example.com", hourlyRate: 1900 },
    { name: "Yash Patel", city: "Ahmedabad", email: "yash.video7@example.com", hourlyRate: 1350 },
    { name: "Aarti Singh", city: "Lucknow", email: "aarti.video8@example.com", hourlyRate: 1600 },
    { name: "Rahul Menon", city: "Kochi", email: "rahul.video9@example.com", hourlyRate: 1450 },
    { name: "Simran Kaur", city: "Chandigarh", email: "simran.video10@example.com", hourlyRate: 1700 },
    { name: "Vikram Reddy", city: "Vizag", email: "vikram.video11@example.com", hourlyRate: 1520 },
    { name: "Disha Sharma", city: "Jaipur", email: "disha.video12@example.com", hourlyRate: 1580 },
    { name: "Akash Gupta", city: "Nagpur", email: "akash.video13@example.com", hourlyRate: 1420 },
  ],
  programming: [
    { name: "Arun Kumar", city: "Bangalore", email: "arun.prog1@example.com", hourlyRate: 2200 },
    { name: "Shalini Nair", city: "Hyderabad", email: "shalini.prog2@example.com", hourlyRate: 2500 },
    { name: "Rahul Desai", city: "Pune", email: "rahul.prog3@example.com", hourlyRate: 2400 },
    { name: "Kavya Iyer", city: "Chennai", email: "kavya.prog4@example.com", hourlyRate: 2100 },
    { name: "Vishal Singh", city: "Mumbai", email: "vishal.prog5@example.com", hourlyRate: 2600 },
    { name: "Anjali Rao", city: "Delhi", email: "anjali.prog6@example.com", hourlyRate: 2300 },
    { name: "Siddharth Menon", city: "Kochi", email: "siddharth.prog7@example.com", hourlyRate: 2000 },
    { name: "Pooja Verma", city: "Gurgaon", email: "pooja.prog8@example.com", hourlyRate: 2550 },
    { name: "Rohit Krishnan", city: "Noida", email: "rohit.prog9@example.com", hourlyRate: 2350 },
    { name: "Divya Pillai", city: "Trivandrum", email: "divya.prog10@example.com", hourlyRate: 2150 },
    { name: "Karan Malhotra", city: "Jaipur", email: "karan.prog11@example.com", hourlyRate: 2250 },
    { name: "Neha Subramanian", city: "Coimbatore", email: "neha.prog12@example.com", hourlyRate: 2450 },
    { name: "Aditya Bhat", city: "Mysore", email: "aditya.prog13@example.com", hourlyRate: 2050 },
  ],
  business: [
    { name: "Rajiv Mehta", city: "Mumbai", email: "rajiv.business1@example.com", hourlyRate: 1600 },
    { name: "Sunita Agarwal", city: "Delhi", email: "sunita.business2@example.com", hourlyRate: 1850 },
    { name: "Mohan Krishnan", city: "Bangalore", email: "mohan.business3@example.com", hourlyRate: 1950 },
    { name: "Lakshmi Venkatesh", city: "Chennai", email: "lakshmi.business4@example.com", hourlyRate: 1700 },
    { name: "Suresh Reddy", city: "Hyderabad", email: "suresh.business5@example.com", hourlyRate: 1750 },
    { name: "Geeta Nambiar", city: "Pune", email: "geeta.business6@example.com", hourlyRate: 1900 },
    { name: "Prakash Iyer", city: "Kolkata", email: "prakash.business7@example.com", hourlyRate: 1650 },
    { name: "Usha Patel", city: "Ahmedabad", email: "usha.business8@example.com", hourlyRate: 1800 },
    { name: "Venkat Rao", city: "Vizag", email: "venkat.business9@example.com", hourlyRate: 1720 },
    { name: "Shobha Gupta", city: "Indore", email: "shobha.business10@example.com", hourlyRate: 1680 },
    { name: "Ramesh Joshi", city: "Bhopal", email: "ramesh.business11@example.com", hourlyRate: 1780 },
    { name: "Vandana Saxena", city: "Lucknow", email: "vandana.business12@example.com", hourlyRate: 1820 },
    { name: "Gopal Sharma", city: "Kanpur", email: "gopal.business13@example.com", hourlyRate: 1550 },
  ],
  music: [
    { name: "Anil Menon", city: "Mumbai", email: "anil.music1@example.com", hourlyRate: 1200 },
    { name: "Reshma Pillai", city: "Chennai", email: "reshma.music2@example.com", hourlyRate: 1400 },
    { name: "Karthik Subramanian", city: "Bangalore", email: "karthik.music3@example.com", hourlyRate: 1350 },
    { name: "Priya Iyer", city: "Kochi", email: "priya.music4@example.com", hourlyRate: 1250 },
    { name: "Suresh Nair", city: "Trivandrum", email: "suresh.music5@example.com", hourlyRate: 1150 },
    { name: "Meera Krishnan", city: "Hyderabad", email: "meera.music6@example.com", hourlyRate: 1300 },
    { name: "Vijay Rao", city: "Pune", email: "vijay.music7@example.com", hourlyRate: 1450 },
    { name: "Lakshmi Reddy", city: "Vizag", email: "lakshmi.music8@example.com", hourlyRate: 1180 },
    { name: "Ravi Venkatesh", city: "Madurai", email: "ravi.music9@example.com", hourlyRate: 1280 },
    { name: "Kavita Desai", city: "Delhi", email: "kavita.music10@example.com", hourlyRate: 1380 },
    { name: "Arjun Malhotra", city: "Jaipur", email: "arjun.music11@example.com", hourlyRate: 1220 },
    { name: "Divya Joshi", city: "Mysore", email: "divya.music12@example.com", hourlyRate: 1320 },
    { name: "Rohan Bhat", city: "Mangalore", email: "rohan.music13@example.com", hourlyRate: 1270 },
  ],
  ai: [
    { name: "Amitabh Singh", city: "Bangalore", email: "amitabh.ai1@example.com", hourlyRate: 2800 },
    { name: "Ishita Nair", city: "Hyderabad", email: "ishita.ai2@example.com", hourlyRate: 2600 },
    { name: "Varun Krishnan", city: "Pune", email: "varun.ai3@example.com", hourlyRate: 3000 },
    { name: "Ananya Iyer", city: "Mumbai", email: "ananya.ai4@example.com", hourlyRate: 2700 },
    { name: "Rishabh Rao", city: "Chennai", email: "rishabh.ai5@example.com", hourlyRate: 2750 },
    { name: "Sneha Menon", city: "Delhi", email: "sneha.ai6@example.com", hourlyRate: 2900 },
    { name: "Kunal Patel", city: "Gurgaon", email: "kunal.ai7@example.com", hourlyRate: 2650 },
    { name: "Tanya Verma", city: "Noida", email: "tanya.ai8@example.com", hourlyRate: 2850 },
    { name: "Rajat Gupta", city: "Kochi", email: "rajat.ai9@example.com", hourlyRate: 2550 },
    { name: "Pooja Reddy", city: "Trivandrum", email: "pooja.ai10@example.com", hourlyRate: 2720 },
    { name: "Nikhil Joshi", city: "Coimbatore", email: "nikhil.ai11@example.com", hourlyRate: 2680 },
    { name: "Shruti Malhotra", city: "Jaipur", email: "shruti.ai12@example.com", hourlyRate: 2780 },
    { name: "Akash Nambiar", city: "Mysore", email: "akash.ai13@example.com", hourlyRate: 2620 },
  ],
};

// Gig titles and descriptions per category (used for each employee's gig)
const GIG_TEMPLATES = {
  design: [
    { title: "Logo Design", shortTitle: "Logo", shortDesc: "Professional logo in 5 days", price: 2500, delivery: 5 },
    { title: "Social Media Graphics", shortTitle: "SM Graphics", shortDesc: "10 posts per week", price: 4500, delivery: 3 },
    { title: "Brand Identity Kit", shortTitle: "Brand Kit", shortDesc: "Logo + guidelines", price: 8500, delivery: 7 },
    { title: "UI/UX Design", shortTitle: "UI Design", shortDesc: "Mobile app screens", price: 12000, delivery: 10 },
    { title: "Illustration Pack", shortTitle: "Illustrations", shortDesc: "Custom illustrations", price: 5500, delivery: 5 },
    { title: "Brochure Design", shortTitle: "Brochure", shortDesc: "Tri-fold brochure", price: 3500, delivery: 4 },
    { title: "Business Card Design", shortTitle: "Cards", shortDesc: "Print-ready cards", price: 1500, delivery: 2 },
    { title: "Instagram Templates", shortTitle: "IG Templates", shortDesc: "20 templates", price: 3200, delivery: 4 },
    { title: "Banner Design", shortTitle: "Banners", shortDesc: "Web & social banners", price: 2800, delivery: 3 },
    { title: "Infographic Design", shortTitle: "Infographic", shortDesc: "Data visualization", price: 4000, delivery: 5 },
    { title: "Packaging Design", shortTitle: "Packaging", shortDesc: "Product packaging", price: 9500, delivery: 8 },
    { title: "Poster Design", shortTitle: "Poster", shortDesc: "Event or promo poster", price: 2200, delivery: 3 },
    { title: "Icon Set Design", shortTitle: "Icons", shortDesc: "50 custom icons", price: 6000, delivery: 6 },
  ],
  marketing: [
    { title: "SEO Audit", shortTitle: "SEO Audit", shortDesc: "Full site audit report", price: 3500, delivery: 3 },
    { title: "Facebook Ads Campaign", shortTitle: "FB Ads", shortDesc: "Setup & manage", price: 6000, delivery: 5 },
    { title: "Google Ads Management", shortTitle: "Google Ads", shortDesc: "Monthly management", price: 8000, delivery: 7 },
    { title: "Content Strategy", shortTitle: "Strategy", shortDesc: "30-day plan", price: 5500, delivery: 5 },
    { title: "Email Marketing", shortTitle: "Email", shortDesc: "Sequence + templates", price: 4500, delivery: 4 },
    { title: "LinkedIn Growth", shortTitle: "LinkedIn", shortDesc: "Profile + content", price: 5000, delivery: 5 },
    { title: "Instagram Growth", shortTitle: "IG Growth", shortDesc: "Strategy & content", price: 4200, delivery: 4 },
    { title: "PPC Campaign Setup", shortTitle: "PPC", shortDesc: "Campaign setup", price: 7000, delivery: 6 },
    { title: "Analytics Report", shortTitle: "Analytics", shortDesc: "Monthly report", price: 3000, delivery: 3 },
    { title: "Landing Page Copy", shortTitle: "Landing", shortDesc: "High-converting copy", price: 3800, delivery: 4 },
    { title: "Influencer Outreach", shortTitle: "Influencer", shortDesc: "Outreach list", price: 4000, delivery: 5 },
    { title: "Brand Voice Guide", shortTitle: "Brand Voice", shortDesc: "Tone & style", price: 4800, delivery: 5 },
    { title: "Competitor Analysis", shortTitle: "Competitor", shortDesc: "Detailed report", price: 5500, delivery: 6 },
  ],
  writing: [
    { title: "Blog Posts", shortTitle: "Blog", shortDesc: "1000 words SEO", price: 1200, delivery: 3 },
    { title: "Product Descriptions", shortTitle: "Descriptions", shortDesc: "50 products", price: 2500, delivery: 4 },
    { title: "Website Copy", shortTitle: "Web Copy", shortDesc: "5 pages", price: 5500, delivery: 5 },
    { title: "Social Media Content", shortTitle: "SM Content", shortDesc: "30 posts", price: 3500, delivery: 7 },
    { title: "White Paper", shortTitle: "White Paper", shortDesc: "3000 words", price: 8000, delivery: 10 },
    { title: "Translation Hindi to English", shortTitle: "Translation", shortDesc: "1000 words", price: 1500, delivery: 2 },
    { title: "Proofreading", shortTitle: "Proofread", shortDesc: "5000 words", price: 1800, delivery: 2 },
    { title: "Resume Writing", shortTitle: "Resume", shortDesc: "ATS-friendly", price: 2200, delivery: 3 },
    { title: "Script Writing", shortTitle: "Script", shortDesc: "Video script", price: 2800, delivery: 4 },
    { title: "Newsletter Copy", shortTitle: "Newsletter", shortDesc: "4 editions", price: 4000, delivery: 7 },
    { title: "E-book Writing", shortTitle: "E-book", shortDesc: "10000 words", price: 15000, delivery: 14 },
    { title: "Press Release", shortTitle: "Press", shortDesc: "Professional PR", price: 2000, delivery: 2 },
    { title: "Case Study", shortTitle: "Case Study", shortDesc: "1500 words", price: 3500, delivery: 5 },
  ],
  video: [
    { title: "YouTube Intro", shortTitle: "Intro", shortDesc: "15 sec animated", price: 3500, delivery: 5 },
    { title: "Product Video", shortTitle: "Product", shortDesc: "60 sec explainer", price: 8000, delivery: 7 },
    { title: "Social Video Ads", shortTitle: "Video Ads", shortDesc: "3 versions", price: 12000, delivery: 10 },
    { title: "Animation Explainer", shortTitle: "Explainer", shortDesc: "2 min 2D", price: 25000, delivery: 14 },
    { title: "Video Editing", shortTitle: "Edit", shortDesc: "10 min raw to final", price: 4500, delivery: 4 },
    { title: "Subtitles & Captions", shortTitle: "Subtitles", shortDesc: "Per minute", price: 150, delivery: 2 },
    { title: "Logo Animation", shortTitle: "Logo Anim", shortDesc: "10 sec", price: 5000, delivery: 5 },
    { title: "Whiteboard Video", shortTitle: "Whiteboard", shortDesc: "2 min", price: 15000, delivery: 10 },
    { title: "Testimonial Edit", shortTitle: "Testimonial", shortDesc: "Multi-cam edit", price: 6000, delivery: 5 },
    { title: "YouTube Thumbnail", shortTitle: "Thumbnail", shortDesc: "Custom thumbnail", price: 800, delivery: 1 },
    { title: "Short Form Reels", shortTitle: "Reels", shortDesc: "5 reels", price: 5500, delivery: 5 },
    { title: "Corporate Video", shortTitle: "Corporate", shortDesc: "5 min", price: 35000, delivery: 21 },
    { title: "Music Video", shortTitle: "Music Video", shortDesc: "Full production", price: 50000, delivery: 30 },
  ],
  programming: [
    { title: "Website in React", shortTitle: "React Site", shortDesc: "5 pages responsive", price: 15000, delivery: 7 },
    { title: "REST API Development", shortTitle: "API", shortDesc: "Node.js API", price: 12000, delivery: 5 },
    { title: "WordPress Site", shortTitle: "WordPress", shortDesc: "Theme + plugins", price: 8000, delivery: 5 },
    { title: "Mobile App (React Native)", shortTitle: "App", shortDesc: "iOS & Android", price: 45000, delivery: 21 },
    { title: "Bug Fixing", shortTitle: "Bug Fix", shortDesc: "Per hour support", price: 800, delivery: 1 },
    { title: "Database Design", shortTitle: "DB Design", shortDesc: "Schema + queries", price: 6500, delivery: 4 },
    { title: "Chrome Extension", shortTitle: "Extension", shortDesc: "Custom extension", price: 10000, delivery: 7 },
    { title: "Python Script", shortTitle: "Script", shortDesc: "Automation", price: 5000, delivery: 3 },
    { title: "E-commerce Store", shortTitle: "E-commerce", shortDesc: "Full store", price: 35000, delivery: 14 },
    { title: "Landing Page", shortTitle: "Landing", shortDesc: "Single page", price: 5500, delivery: 3 },
    { title: "API Integration", shortTitle: "Integration", shortDesc: "Third-party APIs", price: 9000, delivery: 5 },
    { title: "Code Review", shortTitle: "Review", shortDesc: "Full review", price: 3500, delivery: 2 },
    { title: "DevOps Setup", shortTitle: "DevOps", shortDesc: "CI/CD pipeline", price: 18000, delivery: 7 },
  ],
  business: [
    { title: "Business Plan", shortTitle: "Plan", shortDesc: "Investor-ready", price: 12000, delivery: 7 },
    { title: "Financial Model", shortTitle: "Model", shortDesc: "Excel model", price: 8500, delivery: 5 },
    { title: "Market Research", shortTitle: "Research", shortDesc: "Industry report", price: 15000, delivery: 10 },
    { title: "Virtual Assistant", shortTitle: "VA", shortDesc: "20 hrs/month", price: 8000, delivery: 30 },
    { title: "Data Entry", shortTitle: "Data Entry", shortDesc: "500 entries", price: 2500, delivery: 3 },
    { title: "Excel Automation", shortTitle: "Excel", shortDesc: "Macros & formulas", price: 4500, delivery: 4 },
    { title: "Presentation Design", shortTitle: "PPT", shortDesc: "10 slides", price: 3500, delivery: 3 },
    { title: "Legal Document Review", shortTitle: "Legal", shortDesc: "Contract review", price: 6000, delivery: 4 },
    { title: "HR Policy Draft", shortTitle: "HR Policy", shortDesc: "Company policies", price: 9000, delivery: 7 },
    { title: "Process Documentation", shortTitle: "Process", shortDesc: "SOPs", price: 5500, delivery: 5 },
    { title: "Lead Generation", shortTitle: "Leads", shortDesc: "100 leads", price: 7000, delivery: 5 },
    { title: "Customer Support", shortTitle: "Support", shortDesc: "Chat/email", price: 10000, delivery: 30 },
    { title: "Project Management", shortTitle: "PM", shortDesc: "Setup & tracking", price: 11000, delivery: 7 },
  ],
  music: [
    { title: "Jingle Creation", shortTitle: "Jingle", shortDesc: "30 sec original", price: 8000, delivery: 7 },
    { title: "Voice Over", shortTitle: "VO", shortDesc: "Per 100 words", price: 500, delivery: 2 },
    { title: "Podcast Editing", shortTitle: "Podcast", shortDesc: "Per episode", price: 2500, delivery: 3 },
    { title: "Background Music", shortTitle: "BGM", shortDesc: "2 min track", price: 6000, delivery: 5 },
    { title: "Audio Mixing", shortTitle: "Mixing", shortDesc: "Multi-track", price: 4500, delivery: 4 },
    { title: "Sound Design", shortTitle: "Sound", shortDesc: "SFX pack", price: 5500, delivery: 5 },
    { title: "Song Production", shortTitle: "Production", shortDesc: "Full song", price: 20000, delivery: 14 },
    { title: "Audiobook Narration", shortTitle: "Audiobook", shortDesc: "Per hour", price: 3000, delivery: 5 },
    { title: "Radio Ad", shortTitle: "Radio", shortDesc: "30 sec ad", price: 4000, delivery: 4 },
    { title: "Music Transcription", shortTitle: "Transcription", shortDesc: "Sheet music", price: 2000, delivery: 3 },
    { title: "Audio Restoration", shortTitle: "Restore", shortDesc: "Clean audio", price: 3500, delivery: 3 },
    { title: "YouTube Intro Music", shortTitle: "Intro Music", shortDesc: "15 sec", price: 2500, delivery: 3 },
    { title: "Voice Acting", shortTitle: "Voice", shortDesc: "Character voices", price: 1500, delivery: 2 },
  ],
  ai: [
    { title: "Chatbot Development", shortTitle: "Chatbot", shortDesc: "Custom AI chatbot", price: 25000, delivery: 10 },
    { title: "LLM Integration", shortTitle: "LLM", shortDesc: "OpenAI/Claude API", price: 18000, delivery: 7 },
    { title: "Image Generation API", shortTitle: "Image AI", shortDesc: "Stable Diffusion", price: 15000, delivery: 7 },
    { title: "Document AI", shortTitle: "Doc AI", shortDesc: "Extract & classify", price: 22000, delivery: 14 },
    { title: "Custom GPT", shortTitle: "Custom GPT", shortDesc: "Trained assistant", price: 20000, delivery: 10 },
    { title: "Sentiment Analysis", shortTitle: "Sentiment", shortDesc: "Text/feedback", price: 12000, delivery: 5 },
    { title: "Recommendation Engine", shortTitle: "Recommend", shortDesc: "ML model", price: 35000, delivery: 21 },
    { title: "Automation with AI", shortTitle: "Automation", shortDesc: "Workflow AI", price: 28000, delivery: 14 },
    { title: "Data Labeling", shortTitle: "Labeling", shortDesc: "1000 samples", price: 8000, delivery: 5 },
    { title: "AI Content Moderation", shortTitle: "Moderation", shortDesc: "Image/text", price: 16000, delivery: 7 },
    { title: "Voice AI", shortTitle: "Voice AI", shortDesc: "Speech to text", price: 19000, delivery: 10 },
    { title: "Predictive Model", shortTitle: "Predict", shortDesc: "Forecasting", price: 30000, delivery: 14 },
    { title: "RAG System", shortTitle: "RAG", shortDesc: "Retrieval augmented", price: 32000, delivery: 14 },
  ],
};

// 104+ unique faces (different people) - RandomUser.me portraits
const UNIQUE_FACE_URLS = (() => {
  const urls = [];
  for (let i = 1; i <= 52; i++) {
    urls.push(`https://randomuser.me/api/portraits/men/${i}.jpg`);
    urls.push(`https://randomuser.me/api/portraits/women/${i}.jpg`);
  }
  return urls;
})();
const getGigCover = (category, index, title) =>
  `https://picsum.photos/seed/${encodeURIComponent(category + index + title)}/400/300`;

// Review templates for realistic feedback
const REVIEW_TEMPLATES = [
  {
    star: 5,
    desc: "Excellent work! Delivered on time and exceeded expectations. Highly recommend!",
    communication: 5,
    serviceQuality: 5,
    deliveryTime: 5,
    valueForMoney: 5,
    wouldRecommend: true,
    projectType: "Fixed Price Project"
  },
  {
    star: 5,
    desc: "Very professional and skilled. Great communication throughout the project.",
    communication: 5,
    serviceQuality: 5,
    deliveryTime: 4,
    valueForMoney: 5,
    wouldRecommend: true,
    projectType: "Hourly Project"
  },
  {
    star: 4,
    desc: "Good quality work. Minor revisions needed but overall satisfied.",
    communication: 4,
    serviceQuality: 4,
    deliveryTime: 4,
    valueForMoney: 4,
    wouldRecommend: true,
    projectType: "Fixed Price Project"
  },
  {
    star: 5,
    desc: "Outstanding service! Will definitely work with them again.",
    communication: 5,
    serviceQuality: 5,
    deliveryTime: 5,
    valueForMoney: 5,
    wouldRecommend: true,
    projectType: "Custom Quote"
  },
  {
    star: 4,
    desc: "Professional work with attention to detail. Met all requirements.",
    communication: 4,
    serviceQuality: 4,
    deliveryTime: 5,
    valueForMoney: 4,
    wouldRecommend: true,
    projectType: "Hourly Project"
  },
  {
    star: 5,
    desc: "Amazing quality and fast delivery. Perfect for my project needs.",
    communication: 5,
    serviceQuality: 5,
    deliveryTime: 5,
    valueForMoney: 5,
    wouldRecommend: true,
    projectType: "Fixed Price Project"
  },
  {
    star: 3,
    desc: "Decent work but communication could be improved. Delivered as expected.",
    communication: 3,
    serviceQuality: 3,
    deliveryTime: 4,
    valueForMoney: 3,
    wouldRecommend: true,
    projectType: "Hourly Project"
  },
  {
    star: 4,
    desc: "Good value for money. Quality work with reasonable pricing.",
    communication: 4,
    serviceQuality: 4,
    deliveryTime: 4,
    valueForMoney: 5,
    wouldRecommend: true,
    projectType: "Fixed Price Project"
  }
];

// Sample buyer users for reviews
const BUYER_USERS = [
  { username: "rahul_client", email: "rahul.client@example.com", name: "Rahul Sharma" },
  { username: "priya_client", email: "priya.client@example.com", name: "Priya Patel" },
  { username: "amit_client", email: "amit.client@example.com", name: "Amit Kumar" },
  { username: "neha_client", email: "neha.client@example.com", name: "Neha Singh" },
  { username: "vijay_client", email: "vijay.client@example.com", name: "Vijay Reddy" }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { family: 4 });
    console.log("✅ Connected to MongoDB");

    // Clear previous seed data (example.com users and their gigs only)
    const seedUsers = await User.find({ email: /@example\.com$/ }).select("_id");
    const seedUserIds = seedUsers.map((u) => u._id);
    if (seedUserIds.length > 0) {
      const deletedGigs = await Gig.deleteMany({ userId: { $in: seedUserIds } });
      const deletedReviews = await Review.deleteMany({ userId: { $in: seedUserIds } });
      await User.deleteMany({ _id: { $in: seedUserIds } });
      console.log(`   Cleared previous seed: ${seedUserIds.length} users, ${deletedGigs.deletedCount} gigs, ${deletedReviews.deletedCount} reviews`);
    }

    // Ensure admin user exists (login: admin / Admin@123)
    const adminPassword = await bcrypt.hash("Admin@123", 10);
    const adminUser = await User.findOne({ email: "admin@talktrade.com" });
    if (!adminUser) {
      await User.create({
        username: "admin",
        email: "admin@talktrade.com",
        password: adminPassword,
        country: "India",
        isSeller: false,
        isAdmin: true,
        desc: "Platform administrator",
      });
      console.log("   Created admin user: admin@talktrade.com (password: Admin@123)");
    } else if (!adminUser.isAdmin) {
      adminUser.isAdmin = true;
      await adminUser.save();
      console.log("   Updated existing user to admin: admin@talktrade.com");
    }

    const hashedPassword = await bcrypt.hash("Seller@123", 10);
    const buyerPassword = await bcrypt.hash("Buyer@123", 10);
    let totalUsers = 0;
    let totalGigs = 0;
    let totalReviews = 0;
    let faceIndex = 0;

    // Create buyer users for reviews
    const buyerUsers = [];
    for (const buyer of BUYER_USERS) {
      const existingBuyer = await User.findOne({ email: buyer.email });
      let buyerUser;
      if (!existingBuyer) {
        buyerUser = await User.create({
          username: buyer.username,
          email: buyer.email,
          password: buyerPassword,
          country: "India",
          isSeller: false,
          desc: `Client looking for quality services. ${buyer.name}`,
        });
        totalUsers++;
      } else {
        buyerUser = existingBuyer;
      }
      buyerUsers.push(buyerUser);
    }

    for (const cat of CATEGORIES) {
      const employees = EMPLOYEES_BY_CATEGORY[cat.value] || [];
      const templates = GIG_TEMPLATES[cat.value] || [];
      const count = Math.min(EMPLOYEES_PER_CATEGORY, employees.length, templates.length);

      for (let i = 0; i < count; i++) {
        const emp = employees[i];
        const gigTemplate = templates[i];
        const username = emp.email.split("@")[0] + "_" + cat.value;
        const avatarUrl = UNIQUE_FACE_URLS[faceIndex % UNIQUE_FACE_URLS.length];
        faceIndex += 1;
        const gigCoverUrl = getGigCover(cat.value, i, gigTemplate.title);

        const existingUser = await User.findOne({ email: emp.email });
        let user;
        if (existingUser) {
          user = existingUser;
          if (!user.img) {
            user.img = avatarUrl;
            await user.save();
          }
        } else {
          user = await User.create({
            username,
            email: emp.email,
            password: hashedPassword,
            country: "India",
            isSeller: true,
            img: avatarUrl,
            desc: `Freelancer from ${emp.city}, India. Offering ${cat.label} services.`,
            skills: [cat.label],
            experience: "2+ years",
            languages: ["Hindi", "English"],
            hourlyRate: emp.hourlyRate,
            availability: "Freelance",
            totalEarnings: Math.floor(emp.hourlyRate * 100),
            completedJobs: 5,
            responseTime: "Within 24 hours",
          });
          totalUsers++;
        }

        const gigExists = await Gig.findOne({
          userId: user._id,
          category: cat.value,
          title: gigTemplate.title,
        });
        if (gigExists) continue;

        const priceInr = gigTemplate.price;
        const newGig = await Gig.create({
          userId: user._id,
          title: gigTemplate.title,
          shortTitle: gigTemplate.shortTitle,
          shortDesc: gigTemplate.shortDesc,
          desc: `Professional ${gigTemplate.title.toLowerCase()} service. Delivery in ${gigTemplate.delivery} days. Price in Indian Rupees (₹${priceInr.toLocaleString("en-IN")}). Contact for custom requirements.`,
          category: cat.value,
          price: priceInr,
          priceInr,
          cover: gigCoverUrl,
          images: [],
          deliveryTime: gigTemplate.delivery,
          revisionNumber: 2,
          features: ["Quality work", "On-time delivery", "Revisions included"],
          serviceType: "Fixed Price",
          tags: [cat.label, "India", "INR"],
        });
        totalGigs++;

        // Generate 2-4 reviews for each gig
        const numReviews = Math.floor(Math.random() * 3) + 2; // 2-4 reviews
        for (let r = 0; r < numReviews; r++) {
          const buyerUser = buyerUsers[Math.floor(Math.random() * buyerUsers.length)];
          const reviewTemplate = REVIEW_TEMPLATES[Math.floor(Math.random() * REVIEW_TEMPLATES.length)];
          
          await Review.create({
            gigId: newGig._id,
            userId: buyerUser._id,
            star: reviewTemplate.star,
            desc: reviewTemplate.desc,
            communication: reviewTemplate.communication,
            serviceQuality: reviewTemplate.serviceQuality,
            deliveryTime: reviewTemplate.deliveryTime,
            valueForMoney: reviewTemplate.valueForMoney,
            wouldRecommend: reviewTemplate.wouldRecommend,
            projectType: reviewTemplate.projectType,
          });
          totalReviews++;
        }
      }
      console.log(`  ${cat.label}: ${count} employees/gigs (INR)`);
    }

    console.log("\n✅ Seed complete.");
    console.log(`   New users (sellers + buyers): ${totalUsers}`);
    console.log(`   New gigs: ${totalGigs}`);
    console.log(`   New reviews: ${totalReviews}`);
    console.log("   All prices in Indian Rupees (₹). Default passwords: Seller@123, Buyer@123");
  } catch (err) {
    console.error("❌ Seed error:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();
