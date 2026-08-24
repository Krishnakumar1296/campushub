import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Event from "../models/Event.js";
import Registration from "../models/Registration.js";
import Notification from "../models/Notification.js";
import Counter from "../models/Counter.js";

const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (n) => new Date(Date.now() - n * DAY);

const DEMO_PASSWORD = "demo123";

const seedUsers = [
  {
    userId: "ORG-1001",
    name: "Dr. Meera Krishnan",
    email: "organizer@campushub.edu",
    role: "organizer",
    phone: "+91 98450 12345",
    department: "Student Affairs",
    year: "",
    bio: "Coordinates campus-wide events and workshops.",
  },
  {
    userId: "STU-1001",
    name: "Arjun Verma",
    email: "student@campushub.edu",
    role: "student",
    phone: "",
    department: "Computer Science",
    year: "3rd Year",
    bio: "",
  },
];

const seedEvents = [
  {
    eventId: 1,
    title: "AI Innovation Summit",
    description:
      "Explore the latest developments in artificial intelligence, machine learning and emerging technologies with industry pioneers.",
    longDescription:
      "The AI Innovation Summit brings together researchers, engineers and students for a full day of keynotes, live demos and panel discussions. Tracks cover generative AI, computer vision, robotics and AI ethics. Includes a hands-on demo zone and a networking lunch with hiring partners.",
    category: "Technical",
    date: "2026-08-28",
    time: "10:00 AM",
    endTime: "04:30 PM",
    venue: "Main Auditorium",
    department: "Computer Science Department",
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80",
    registered: 72,
    capacity: 150,
    attended: 0,
    registrationDeadline: "2026-08-26",
    status: "Upcoming",
    tags: ["AI", "ML", "Innovation"],
    createdAt: "2026-07-02",
    organizerId: "ORG-001",
  },
  {
    eventId: 2,
    title: "Cultural Fest 2026",
    description:
      "A grand celebration of music, dance, drama and art featuring performances from colleges across the state.",
    longDescription:
      "Three stages, forty performances and one unforgettable night. Cultural Fest 2026 features battle of bands, classical dance showdowns, a stand-up comedy hour, art installations and a headline concert under the open sky. Food stalls and creator zones open all day.",
    category: "Cultural",
    date: "2026-09-05",
    time: "09:00 AM",
    endTime: "10:00 PM",
    venue: "Open Air Theatre",
    department: "Student Cultural Club",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    registered: 210,
    capacity: 500,
    attended: 0,
    registrationDeadline: "2026-09-03",
    status: "Upcoming",
    tags: ["Music", "Dance", "Art"],
    createdAt: "2026-06-18",
    organizerId: "ORG-001",
  },
  {
    eventId: 3,
    title: "Inter College Cricket Championship",
    description:
      "Cheer your college team in the biggest cricket tournament of the season. Finals followed by prize night.",
    longDescription:
      "Sixteen teams, knockout format, floodlit evening matches. The championship culminates in a grand final followed by the awards ceremony. Student ID grants free entry to league matches; finals seating is ticketed through CampusHub.",
    category: "Sports",
    date: "2026-09-12",
    time: "08:30 AM",
    endTime: "07:00 PM",
    venue: "College Sports Ground",
    department: "Sports Committee",
    image:
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80",
    registered: 180,
    capacity: 300,
    attended: 0,
    registrationDeadline: "2026-09-10",
    status: "Upcoming",
    tags: ["Cricket", "Tournament"],
    createdAt: "2026-06-25",
    organizerId: "ORG-001",
  },
  {
    eventId: 4,
    title: "CodeSprint 2026",
    description:
      "A six-hour competitive programming battle. Solve real-world problem sets and climb the campus leaderboard.",
    longDescription:
      "CodeSprint is an on-site competitive programming contest with three difficulty divisions. Problems are set by alumni working at top product companies. Prizes worth Rs.75,000, fastest-solver swag and direct interview slots for top performers.",
    category: "Competition",
    date: "2026-09-18",
    time: "09:30 AM",
    endTime: "04:00 PM",
    venue: "Computer Lab Block C",
    department: "Coding Club",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    registered: 95,
    capacity: 120,
    attended: 0,
    registrationDeadline: "2026-09-15",
    status: "Upcoming",
    tags: ["Coding", "Contest"],
    createdAt: "2026-07-01",
    organizerId: "ORG-001",
  },
  {
    eventId: 5,
    title: "Full Stack Development Workshop",
    description:
      "Hands-on workshop covering React, Node.js and databases. Build and deploy a complete project in one day.",
    longDescription:
      "Bring your laptop — you will ship a deployed full-stack app before dinner. Sessions cover modern React patterns, REST API design with Express, MongoDB modelling, authentication and a CI deploy pipeline. Starter kits, mentors and certificates included.",
    category: "Workshop",
    date: "2026-09-22",
    time: "10:00 AM",
    endTime: "05:00 PM",
    venue: "Seminar Hall 2",
    department: "Developer Club",
    image:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    registered: 85,
    capacity: 100,
    attended: 0,
    registrationDeadline: "2026-09-20",
    status: "Upcoming",
    tags: ["React", "Node.js", "MERN"],
    createdAt: "2026-07-05",
    organizerId: "ORG-001",
  },
  {
    eventId: 6,
    title: "Future Tech Seminar",
    description:
      "Industry leaders discuss quantum computing, Web3 and the future of human-computer interaction.",
    longDescription:
      "A half-day seminar featuring talks from principal engineers and researchers. Topics include quantum computing practicalities, spatial computing, edge AI and responsible innovation. Audience Q&A and a curated reading list to take home.",
    category: "Seminar",
    date: "2026-09-25",
    time: "02:00 PM",
    endTime: "06:00 PM",
    venue: "Seminar Hall 1",
    department: "CSE Department",
    image:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    registered: 120,
    capacity: 200,
    attended: 0,
    registrationDeadline: "2026-09-23",
    status: "Upcoming",
    tags: ["Quantum", "Web3"],
    createdAt: "2026-07-08",
    organizerId: "ORG-001",
  },
  {
    eventId: 7,
    title: "Photography Club Meetup",
    description:
      "Monthly meetup with a golden-hour photowalk across campus. All cameras welcome — phones included.",
    longDescription:
      "This month's theme is Campus at Golden Hour. The session begins with a short editing masterclass followed by a guided photowalk. Best shots get featured on the official campus Instagram and printed for the club wall.",
    category: "Club",
    date: "2026-09-28",
    time: "03:00 PM",
    endTime: "06:30 PM",
    venue: "Activity Hall",
    department: "Photography Club",
    image:
      "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80",
    registered: 45,
    capacity: 80,
    attended: 0,
    registrationDeadline: "2026-09-27",
    status: "Upcoming",
    tags: ["Photography", "Creative"],
    createdAt: "2026-07-12",
    organizerId: "ORG-001",
  },
  {
    eventId: 8,
    title: "UI/UX Design Challenge",
    description:
      "Design a campus app screen live, pitch it to a jury of designers and win an internship interview.",
    longDescription:
      "Teams get three hours to redesign a real campus flow — onboarding, event discovery or ticketing. Jury includes senior product designers. Figma templates provided; bring creativity. Winning entries go into the design system used by the student portal.",
    category: "Technical",
    date: "2026-10-02",
    time: "10:00 AM",
    endTime: "03:00 PM",
    venue: "Innovation Lab",
    department: "Design Club",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
    registered: 60,
    capacity: 100,
    attended: 0,
    registrationDeadline: "2026-09-30",
    status: "Upcoming",
    tags: ["Design", "Figma"],
    createdAt: "2026-07-15",
    organizerId: "ORG-001",
  },
  {
    eventId: 9,
    title: "Robotics & Drone Expo",
    description:
      "Live robot battles, drone racing and an autonomous navigation showcase built by student teams.",
    longDescription:
      "Student-built robots face off in the arena while FPV pilots race through a custom obstacle course. Labs exhibit autonomous rovers, humanoid arms and swarm drones. Great exposure for first-years looking to join tech teams.",
    category: "Technical",
    date: "2026-10-05",
    time: "11:00 AM",
    endTime: "05:00 PM",
    venue: "Tech Pavilion",
    department: "Robotics Society",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    registered: 40,
    capacity: 90,
    attended: 0,
    registrationDeadline: "2026-10-03",
    status: "Draft",
    tags: ["Robotics", "Drones"],
    createdAt: "2026-07-20",
    organizerId: "ORG-001",
  },
  {
    eventId: 10,
    title: "Startup & Innovation Bootcamp",
    description:
      "Two-day bootcamp on idea validation, pitching and building an MVP with mentors from the startup ecosystem.",
    longDescription:
      "Day one covers customer discovery and rapid prototyping. Day two is pitch day in front of a founder panel with seed-grant prizes for the best validated ideas. Ideal for final-year projects that want to become real products.",
    category: "Other",
    date: "2026-10-10",
    time: "09:00 AM",
    endTime: "06:00 PM",
    venue: "Incubation Centre",
    department: "E-Cell",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80",
    registered: 55,
    capacity: 120,
    attended: 0,
    registrationDeadline: "2026-10-08",
    status: "Upcoming",
    tags: ["Startups", "Pitching"],
    createdAt: "2026-07-21",
    organizerId: "ORG-001",
  },
];

const seedRegistrations = [
  {
    regId: "REG-2026-1002",
    eventId: 1,
    studentId: "STU-INF-1104",
    studentName: "Ananya Sharma",
    email: "ananya.sharma@campushub.edu",
    department: "Information Technology",
    year: "2nd Year",
    status: "Checked-in",
    registeredAt: daysAgo(14),
    checkedInAt: new Date(),
  },
  {
    regId: "REG-2026-1004",
    eventId: 2,
    studentId: "STU-MEC-1106",
    studentName: "Rohan Patel",
    email: "rohan.patel@campushub.edu",
    department: "Mechanical Engineering",
    year: "3rd Year",
    status: "Registered",
    registeredAt: daysAgo(12),
    checkedInAt: null,
  },
  {
    regId: "REG-2026-1008",
    eventId: 4,
    studentId: "STU-CSE-1110",
    studentName: "Sneha Reddy",
    email: "sneha.reddy@campushub.edu",
    department: "Computer Science",
    year: "4th Year",
    status: "Registered",
    registeredAt: daysAgo(9),
    checkedInAt: null,
  },
  {
    regId: "REG-2026-1011",
    eventId: 3,
    studentId: "STU-ECE-1113",
    studentName: "Vikram Singh",
    email: "vikram.singh@campushub.edu",
    department: "Electronics & Comm.",
    year: "2nd Year",
    status: "Checked-in",
    registeredAt: daysAgo(8),
    checkedInAt: new Date(),
  },
  {
    regId: "REG-2026-1015",
    eventId: 5,
    studentId: "STU-CSE-1117",
    studentName: "Priya Nair",
    email: "priya.nair@campushub.edu",
    department: "Computer Science",
    year: "1st Year",
    status: "Registered",
    registeredAt: daysAgo(6),
    checkedInAt: null,
  },
  {
    regId: "REG-2026-1018",
    eventId: 6,
    studentId: "STU-EEE-1120",
    studentName: "Arjun Mehta",
    email: "arjun.mehta@campushub.edu",
    department: "Electrical Engineering",
    year: "3rd Year",
    status: "Checked-in",
    registeredAt: daysAgo(5),
    checkedInAt: new Date(),
  },
  {
    regId: "REG-2026-1021",
    eventId: 7,
    studentId: "STU-MAC-1123",
    studentName: "Ishita Bose",
    email: "ishita.bose@campushub.edu",
    department: "Mass Communication",
    year: "2nd Year",
    status: "Registered",
    registeredAt: daysAgo(3),
    checkedInAt: null,
  },
];

export async function runSeed() {
  await Promise.all([
    User.deleteMany({}),
    Event.deleteMany({}),
    Registration.deleteMany({}),
    Notification.deleteMany({}),
    Counter.deleteMany({}),
  ]);

  const hash = bcrypt.hashSync(DEMO_PASSWORD, 10);
  await User.insertMany(seedUsers.map((u) => ({ ...u, password: hash })));

  await Event.insertMany(seedEvents);
  await Registration.insertMany(seedRegistrations);

  await Notification.create({
    userEmail: null,
    type: "info",
    title: "Welcome to CampusHub",
    message:
      "Create your account to register for events, grab QR tickets and never miss a campus moment.",
    isRead: false,
    createdAt: new Date(),
  });

  await Counter.insertMany([
    { _id: "user_STU", seq: 1001 },
    { _id: "user_ORG", seq: 1001 },
    { _id: "event", seq: 10 },
    { _id: "registration", seq: 1026 },
  ]);

  console.log(
    "Seeded demo data: users=%d events=%d registrations=%d",
    seedUsers.length,
    seedEvents.length,
    seedRegistrations.length
  );
}

export async function seedIfEmpty() {
  const [users, events] = await Promise.all([
    User.countDocuments(),
    Event.countDocuments(),
  ]);
  if (users === 0 && events === 0) {
    console.log("Empty database detected - seeding demo data...");
    await runSeed();
  }
}
