const bcrypt = require('bcryptjs');

let mockUsers = [];
let mockActivities = [];
let mockPosts = [];
let mockStories = [];

const initMockStorage = async () => {
  if (mockUsers.length > 0) return;

  const salt = await bcrypt.genSalt(10);
  const defaultPassword = await bcrypt.hash('Password123!', salt);

  // Users
  const maya = {
    _id: '660a1f01a1b2c3d4e5f60001',
    name: 'Maya Lin',
    email: 'maya@volunteer.org',
    password: defaultPassword,
    role: 'volunteer',
    location: 'San Francisco, CA',
    causes: ['Environment', 'Education', 'Disaster relief'],
    availability: 'Weekends',
    bio: 'Lifelong environmental advocate and weekend STEM tutor. Believer in grassroots community action and sustainable urban gardens.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    skills: ['Tree Planting', 'Youth Mentoring', 'First Aid Certified', 'Event Coordination'],
    totalHours: 76,
    createdAt: new Date()
  };

  const marcus = {
    _id: '660a1f01a1b2c3d4e5f60002',
    name: 'Marcus Vance',
    email: 'marcus@greenearth.org',
    password: defaultPassword,
    role: 'worker',
    location: 'Seattle, WA',
    causes: ['Environment', 'Disaster relief'],
    organization: 'Green Earth Alliance',
    designation: 'Director of Volunteer Operations',
    website: 'https://greenearthalliance.example.org',
    bio: 'Leading environmental regeneration projects and disaster relief response teams across the Pacific Northwest for 8+ years.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    banner: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    skills: ['Disaster Response', 'Volunteer Training', 'Project Management'],
    totalHours: 140,
    createdAt: new Date()
  };

  const priya = {
    _id: '660a1f01a1b2c3d4e5f60003',
    name: 'Priya Patel',
    email: 'priya@healthvolunteer.org',
    password: defaultPassword,
    role: 'volunteer',
    location: 'Austin, TX',
    causes: ['Health', 'Animals'],
    availability: 'Flexible',
    bio: 'Pre-med student volunteering with local community mobile health clinics and animal foster networks.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    banner: '',
    skills: ['Patient Intake', 'Animal Rehabilitation', 'CPR Certified'],
    totalHours: 52,
    createdAt: new Date()
  };

  const david = {
    _id: '660a1f01a1b2c3d4e5f60004',
    name: 'David Kim',
    email: 'david@hopefoundation.org',
    password: defaultPassword,
    role: 'worker',
    location: 'Chicago, IL',
    causes: ['Education', 'Poverty & Hunger'],
    organization: 'Urban Youth Horizon',
    designation: 'Community Programs Lead',
    website: 'https://urbanyouthhorizon.example.org',
    bio: 'Bridging the educational divide in underserved neighborhoods through after-school tech labs and nutrition programs.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    skills: ['Curriculum Design', 'Community Organizing'],
    totalHours: 110,
    createdAt: new Date()
  };

  mockUsers = [maya, marcus, priya, david];

  // Activities
  mockActivities = [
    {
      _id: 'act001',
      user: maya._id,
      title: 'Community Tree Planting & Urban Reforestation',
      organization: 'Green Earth Alliance',
      date: '2026-03-12',
      hours: 24,
      description: 'Planted over 180 native saplings in city parks, managed irrigation zones, and led an orientation for 15 first-time volunteers.',
      cause: 'Environment',
      createdAt: new Date()
    },
    {
      _id: 'act002',
      user: maya._id,
      title: 'Weekend STEM & Coding Workshop Mentor',
      organization: 'Bay Area Youth Tech',
      date: '2026-02-18',
      hours: 32,
      description: 'Taught foundational Python and robotics concepts to middle-school students from under-resourced public schools.',
      cause: 'Education',
      createdAt: new Date()
    },
    {
      _id: 'act003',
      user: maya._id,
      title: 'Emergency Flood Relief Food Packaging',
      organization: 'Red Cross Disaster Team',
      date: '2026-01-08',
      hours: 20,
      description: 'Sorted, packed, and loaded 1,400 emergency food and water kits for displaced families affected by coastal storms.',
      cause: 'Disaster relief',
      createdAt: new Date()
    },
    {
      _id: 'act004',
      user: priya._id,
      title: 'Mobile Vaccine Clinic Volunteer Assistant',
      organization: 'Austin Community Health',
      date: '2026-03-01',
      hours: 28,
      description: 'Assisted nursing staff with patient registration, multilingual translation, and post-observation wellness checks.',
      cause: 'Health',
      createdAt: new Date()
    },
    {
      _id: 'act005',
      user: priya._id,
      title: 'Weekend Animal Rescue & Foster Care Support',
      organization: 'Paws & Hearts Sanctuary',
      date: '2026-02-10',
      hours: 24,
      description: 'Administered medication, cleaned rehabilitation enclosures, and socialized 35 rescue dogs preparing for adoption.',
      cause: 'Animals',
      createdAt: new Date()
    }
  ];

  // Posts
  mockPosts = [
    {
      _id: 'post001',
      author: maya,
      content: 'Incredible morning at the Presidio park restoration! Over 45 volunteers joined us, and together we planted 200 native coastal shrubs to prevent soil erosion. Nothing beats the feeling of leaving the earth better than we found it. 🌱✨',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80',
      cause: 'Environment',
      likes: [marcus._id, priya._id, david._id],
      comments: [
        {
          user: marcus._id,
          userName: 'Marcus Vance',
          userAvatar: marcus.avatar,
          text: 'Huge gratitude to you and the team Maya! Your leadership in the field makes a massive difference.',
          createdAt: new Date(Date.now() - 3600000 * 4)
        },
        {
          user: priya._id,
          userName: 'Priya Patel',
          userAvatar: priya.avatar,
          text: 'So inspiring! Looking forward to joining the next session.',
          createdAt: new Date(Date.now() - 3600000 * 2)
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 5)
    },
    {
      _id: 'post002',
      author: marcus,
      content: '📢 Exciting announcement: Green Earth Alliance is expanding our disaster preparedness volunteer network across the West Coast! We will be hosting free certified training sessions every Saturday this month. Whether you are a student or a working professional, your hands and heart are needed.',
      image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=80',
      cause: 'Disaster relief',
      likes: [maya._id, priya._id],
      comments: [
        {
          user: david._id,
          userName: 'David Kim',
          userAvatar: david.avatar,
          text: 'Will share this with our youth graduates!',
          createdAt: new Date(Date.now() - 3600000 * 6)
        }
      ],
      createdAt: new Date(Date.now() - 3600000 * 12)
    },
    {
      _id: 'post003',
      author: priya,
      content: 'Today at the Mobile Wellness Clinic, we crossed the milestone of 500 free preventive health screenings completed this year! A gentle reminder that small, consistent volunteer hours accumulate into life-changing community impact. 🩺❤️',
      image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=900&q=80',
      cause: 'Health',
      likes: [maya._id, david._id],
      comments: [],
      createdAt: new Date(Date.now() - 3600000 * 24)
    }
  ];

  // Stories
  mockStories = [
    {
      _id: 'story001',
      author: maya._id,
      authorName: 'Maya Lin',
      authorRole: 'volunteer',
      authorAvatar: maya.avatar,
      organization: 'Green Earth Alliance',
      title: 'Reviving the Urban Canopy: From Barren Asphalt to Thriving Community Forest',
      story: 'Two years ago, our neighborhood park was an abandoned plot surrounded by concrete. With a group of 12 volunteers and local neighborhood leaders, we mapped soil conditions, gathered donations of native saplings, and established weekly watering schedules. Today, over 500 flourishing trees provide shade for thousands of residents and clean our urban air. Starting as a volunteer changed my life perspective forever.',
      keyImpact: '500+ Native Trees Planted & 12 Urban Acres Restored',
      hoursServed: 76,
      cause: 'Environment',
      coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=900&q=80',
      inspires: [marcus._id, priya._id, david._id],
      createdAt: new Date(Date.now() - 86400000 * 2)
    },
    {
      _id: 'story002',
      author: david._id,
      authorName: 'David Kim',
      authorRole: 'worker',
      authorAvatar: david.avatar,
      organization: 'Urban Youth Horizon',
      title: 'Opening Doors to the Future: The High School Coding & Mentorship Circle',
      story: 'Many high schoolers in our district had never written a single line of code or met a software engineer. Our volunteer mentors dedicated just 2 hours every Tuesday evening to mentor 40 students. In six months, these brilliant students built apps to address food waste and elderly loneliness in their community. Three students earned full university scholarships.',
      keyImpact: '40 Youth Mentored & 3 Full STEM University Scholarships Won',
      hoursServed: 110,
      cause: 'Education',
      coverImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
      inspires: [maya._id, priya._id],
      createdAt: new Date(Date.now() - 86400000 * 4)
    },
    {
      _id: 'story003',
      author: priya._id,
      authorName: 'Priya Patel',
      authorRole: 'volunteer',
      authorAvatar: priya.avatar,
      organization: 'Paws & Hearts Sanctuary',
      title: 'Giving Second Chances: Rehabilitating 80 At-Risk Animals',
      story: 'When cold snaps hit our county, shelter resources were stretched to the limit. Volunteers organized emergency foster networks, coordinated veterinary triage, and spent nights nursing vulnerable animals back to health. Seeing every single rescued animal find a warm, loving home is the greatest reward imaginable.',
      keyImpact: '80 Animals Rescued, Treated, and Placed into Loving Homes',
      hoursServed: 52,
      cause: 'Animals',
      coverImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=900&q=80',
      inspires: [maya._id, marcus._id],
      createdAt: new Date(Date.now() - 86400000 * 6)
    }
  ];
};

initMockStorage();

module.exports = {
  getMockUsers: () => mockUsers,
  getMockActivities: () => mockActivities,
  getMockPosts: () => mockPosts,
  getMockStories: () => mockStories,
  setMockUsers: (u) => { mockUsers = u; },
  setMockActivities: (a) => { mockActivities = a; },
  setMockPosts: (p) => { mockPosts = p; },
  setMockStories: (s) => { mockStories = s; }
};
