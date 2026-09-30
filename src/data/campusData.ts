import { Building, MapNode, CampusPreset, CampusEvent, StudentScheduleItem } from '../types';

export const DEFAULT_CAMPUS_PRESET: CampusPreset = {
  id: 'apex_tech_univ',
  name: 'Apex Institute of Technology & Sciences',
  shortName: 'Apex Tech',
  motto: 'Innovating for Humanity & Future Realms',
  location: 'Tech Valley Campus, Bay District',
  buildings: [
    {
      id: 'bldg_admin',
      name: 'Central Administration & Chancellor Tower',
      shortName: 'Admin Tower',
      code: 'ADM',
      category: 'admin',
      x: 180,
      y: 160,
      width: 140,
      height: 110,
      color: '#3B82F6', // Blue
      accentColor: '#1D4ED8',
      floors: [0, 1, 2, 3],
      entranceNodeId: 'node_admin_entrance',
      description: 'Main administrative hub housing Admissions, Registrar, Student Financial Services, and Chancellor offices.',
      fullOverview: 'The Central Administration Tower is the formal headquarters of Apex Tech. It handles enrollment, student ID cards, official transcripts, bursar payments, career services, and university leadership.',
      departments: ['Office of Admissions', 'Office of Registrar', 'Financial Aid & Scholarships', 'Student Affairs', 'Career Development Center'],
      openingHours: 'Mon-Fri: 8:00 AM - 5:00 PM',
      accessibilityFeatures: ['Dual ADA Automatic Glass Doors', 'Braille Signage on all elevators', 'Wheelchair Access Ramps', 'Hearing Loop System in Boardroom'],
      emergencyContact: '+1 (555) 019-2001',
      historicalFact: 'Constructed in 1968, renovated in 2021 with rooftop solar glass & LEED Platinum certification.',
      amenities: [
        { id: 'am_adm_1', name: 'Student Records Kiosk', type: 'printer', floor: 0, description: 'Self-serve official transcript printer' },
        { id: 'am_adm_2', name: 'Campus Security & Lost & Found', type: 'emergency_call', floor: 0 },
        { id: 'am_adm_3', name: 'Accessible Restrooms', type: 'restroom', floor: 1 },
        { id: 'am_adm_4', name: 'High-speed Guest WiFi', type: 'wifi', floor: 0 }
      ],
      rooms: [
        { id: 'r_adm_01', roomNumber: 'G-10', name: 'One-Stop Student Services Hub', type: 'admin', floor: 0, hours: '8:30 AM - 4:30 PM', headOrProfessor: 'Director Sarah Lin' },
        { id: 'r_adm_02', roomNumber: '101', name: 'Admissions & Campus Tour Departure', type: 'admin', floor: 1, headOrProfessor: 'Dean of Enrollment Mark Reyes' },
        { id: 'r_adm_03', roomNumber: '105', name: 'Registrar & Academic Records', type: 'admin', floor: 1, headOrProfessor: 'Dr. Elena Vance' },
        { id: 'r_adm_04', roomNumber: '202', name: 'Financial Aid & Scholarship Counseling', type: 'admin', floor: 2, headOrProfessor: 'Mrs. Cynthia Wu' },
        { id: 'r_adm_05', roomNumber: '301', name: 'University Chancellor & Board Room', type: 'admin', floor: 3, headOrProfessor: 'President Julian Hayes' }
      ]
    },
    {
      id: 'bldg_cs_ai',
      name: 'Alan Turing Computer Science & AI Complex',
      shortName: 'Turing CS Complex',
      code: 'CS',
      category: 'academic',
      x: 480,
      y: 140,
      width: 170,
      height: 125,
      color: '#10B981', // Emerald
      accentColor: '#047857',
      floors: [0, 1, 2, 3],
      entranceNodeId: 'node_cs_entrance',
      description: 'Cutting-edge engineering center with AI research labs, robotics arenas, cybersecurity centers, and lecture halls.',
      fullOverview: 'The Alan Turing Complex is the beating heart of computing at Apex. Features high-performance computing clusters, 24/7 student makerspace, VR game dev labs, robotics testing pens, and tech startup incubator.',
      departments: ['Computer Science & Software Eng.', 'Artificial Intelligence & Data Science', 'Cybersecurity & Cryptography', 'Robotics & Mechatronics'],
      openingHours: '24/7 for CS Students & Faculty (General: 7:00 AM - 11:00 PM)',
      accessibilityFeatures: ['Elevator with Voice Announcements', 'Low-height lab workstations', 'Wide automatic lab doors', 'Step-free level entrances'],
      emergencyContact: '+1 (555) 019-2042',
      historicalFact: 'Houses the university’s DeepMatrix supercomputing cluster in the basement with liquid nitrogen cooling.',
      amenities: [
        { id: 'am_cs_1', name: '3D Printer & Circuit Maker Hub', type: 'printer', floor: 0 },
        { id: 'am_cs_2', name: 'Coffee & Energy Snack Bot', type: 'cafe', floor: 1 },
        { id: 'am_cs_3', name: 'Ultra Gigabit Wi-Fi 7 Hub', type: 'wifi', floor: 2 },
        { id: 'am_cs_4', name: 'Microwave & Kitchenette', type: 'microwaves', floor: 2 }
      ],
      rooms: [
        { id: 'r_cs_01', roomNumber: '101-A', name: 'Ada Lovelace Auditorium (Main CS 101)', type: 'lecture_hall', floor: 1, capacity: 250, occupancyStatus: 'In Class', headOrProfessor: 'Prof. Donald Knuth' },
        { id: 'r_cs_02', roomNumber: '108', name: 'AI & Machine Learning Lab', type: 'lab', floor: 1, capacity: 45, occupancyStatus: 'Available', headOrProfessor: 'Dr. Aisha Patel' },
        { id: 'r_cs_03', roomNumber: '204', name: 'Robotics & Autonomous Drones Studio', type: 'lab', floor: 2, capacity: 30, occupancyStatus: 'Available', headOrProfessor: 'Prof. Marcus Vance' },
        { id: 'r_cs_04', roomNumber: '215', name: 'Cybersecurity & Ethical Hacking Arena', type: 'lab', floor: 2, capacity: 40, occupancyStatus: 'Reserved', headOrProfessor: 'Dr. Leo Sterling' },
        { id: 'r_cs_05', roomNumber: '302', name: 'Quantum Software Research Group', type: 'faculty_office', floor: 3, capacity: 15, occupancyStatus: 'Quiet Study', headOrProfessor: 'Prof. Robert Chang' },
        { id: 'r_cs_06', roomNumber: 'G-05', name: 'Hardware Prototyping & Hackerspace', type: 'lab', floor: 0, capacity: 50, occupancyStatus: 'Available', headOrProfessor: 'Tech Lead Jordan Scott' }
      ]
    },
    {
      id: 'bldg_library',
      name: 'Alexandria Learning Commons & Central Library',
      shortName: 'Central Library',
      code: 'LIB',
      category: 'library',
      x: 190,
      y: 350,
      width: 160,
      height: 130,
      color: '#8B5CF6', // Purple
      accentColor: '#6D28D9',
      floors: [0, 1, 2, 3],
      entranceNodeId: 'node_lib_entrance',
      description: 'Multilevel research library with 24/7 silent study zones, book checkout, digital media labs, and group pods.',
      fullOverview: 'Spanning four luminous glass floors with panoramic views of the campus quad. Floor 1 is collaborative with cafe; Floor 2 is silent study; Floor 3 holds rare manuscript archives and digital media suites.',
      departments: ['University Library Services', 'Research & Academic Writing Center', 'Digital Media Commons', 'Interlibrary Loans'],
      openingHours: '24 Hours / 7 Days a week (Student ID required after 10 PM)',
      accessibilityFeatures: ['Wheelchair accessible study carrels', 'Screen reader computers', 'Braille navigation maps', 'Elevator to all study floors'],
      emergencyContact: '+1 (555) 019-3300',
      historicalFact: 'Holds over 450,000 physical volumes and access to over 12 million scientific digital journals.',
      amenities: [
        { id: 'am_lib_1', name: 'High-volume Color Laser Printers', type: 'printer', floor: 1 },
        { id: 'am_lib_2', name: 'Silent Study Soundproof Pods', type: 'quiet_zone', floor: 2 },
        { id: 'am_lib_3', name: 'Recharge Cafe & Espresso Bar', type: 'cafe', floor: 1 },
        { id: 'am_lib_4', name: 'Fast Phone & Laptop Charging Bank', type: 'power_outlet', floor: 0 }
      ],
      rooms: [
        { id: 'r_lib_01', roomNumber: '101', name: 'Information & Reference Desk', type: 'admin', floor: 1, headOrProfessor: 'Head Librarian Karen Ross' },
        { id: 'r_lib_02', roomNumber: '112', name: 'Writing Center & Peer Tutoring Hub', type: 'study_room', floor: 1, capacity: 40, occupancyStatus: 'Available' },
        { id: 'r_lib_03', roomNumber: '201', name: 'Deep Focus Silent Reading Hall', type: 'study_room', floor: 2, capacity: 180, occupancyStatus: 'Quiet Study' },
        { id: 'r_lib_04', roomNumber: '210-218', name: 'Group Study Collaboration Rooms', type: 'study_room', floor: 2, capacity: 8, occupancyStatus: 'In Class' },
        { id: 'r_lib_05', roomNumber: '305', name: 'Digital Media & VR Production Studio', type: 'lab', floor: 3, capacity: 25, occupancyStatus: 'Available', headOrProfessor: 'Media Specialist Tom Cole' }
      ]
    },
    {
      id: 'bldg_union_dining',
      name: 'Grand Student Union & Global Dining Plaza',
      shortName: 'Student Union & Dining',
      code: 'STU',
      category: 'dining',
      x: 470,
      y: 350,
      width: 170,
      height: 130,
      color: '#F59E0B', // Amber
      accentColor: '#D97706',
      floors: [0, 1, 2],
      entranceNodeId: 'node_stu_entrance',
      description: 'Campus social nucleus featuring 8 diverse food stations, student council chambers, campus bookstore, and bank ATMs.',
      fullOverview: 'The Student Union is the primary gathering space for all campus life. Features a food court serving Halal, Vegan, Asian, Mediterranean, and American Grill fare, student lounge with ping pong, and the official Apex Bookstore.',
      departments: ['Student Government Association (SGA)', 'Clubs & Organizations Hub', 'Dining Services & Meal Plans', 'Campus Bookstore & Apparel'],
      openingHours: 'Food Court: 7:00 AM - 10:00 PM | Building: 6:30 AM - Midnight',
      accessibilityFeatures: ['Step-free dining access', 'Lowered service counters', 'Braille food station menus', 'Elevator with braille & voice'],
      emergencyContact: '+1 (555) 019-4400',
      historicalFact: 'Voted #1 university dining hall in the state for culinary variety and sustainable zero-waste composting.',
      amenities: [
        { id: 'am_stu_1', name: 'Multi-Bank ATMs (Chase, BofA, Wells)', type: 'atm', floor: 1 },
        { id: 'am_stu_2', name: 'Filtered Hydro Stations', type: 'water_station', floor: 1 },
        { id: 'am_stu_3', name: 'Microwaves & Dining Seating', type: 'microwaves', floor: 1 },
        { id: 'am_stu_4', name: 'Apex Tech Merchandise Bookstore', type: 'cafe', floor: 0 }
      ],
      rooms: [
        { id: 'r_stu_01', roomNumber: '100', name: 'Global Kitchens Food Court', type: 'cafe', floor: 1, capacity: 400, occupancyStatus: 'Available' },
        { id: 'r_stu_02', roomNumber: '120', name: 'Campus Spirit Bookstore & Supplies', type: 'admin', floor: 1, headOrProfessor: 'Manager Dave Miller' },
        { id: 'r_stu_03', roomNumber: '201', name: 'Student Government Chamber', type: 'admin', floor: 2, headOrProfessor: 'SGA President Maya Gomez' },
        { id: 'r_stu_04', roomNumber: '215', name: 'Esports Arena & Gaming Lounge', type: 'study_room', floor: 2, capacity: 50, occupancyStatus: 'Available' },
        { id: 'r_stu_05', roomNumber: 'G-10', name: 'Commuter Lockers & Transit Lounge', type: 'study_room', floor: 0, capacity: 60, occupancyStatus: 'Available' }
      ]
    },
    {
      id: 'bldg_science_bio',
      name: 'Curie Natural Sciences & Bioengineering Deck',
      shortName: 'Curie Science Complex',
      code: 'SCI',
      category: 'academic',
      x: 720,
      y: 150,
      width: 150,
      height: 120,
      color: '#06B6D4', // Cyan
      accentColor: '#0891B2',
      floors: [0, 1, 2, 3],
      entranceNodeId: 'node_sci_entrance',
      description: 'Advanced biotechnology, chemistry wet labs, genetics center, physics telescopes, and environmental research.',
      fullOverview: 'State-of-the-art laboratory complex with fume hoods, sterile cleanrooms, genetic sequencing machinery, and a rooftop meteorological observatory.',
      departments: ['Department of Biology & Genetics', 'Department of Chemistry & Materials', 'Department of Applied Physics', 'Environmental Sciences'],
      openingHours: 'Mon-Sat: 7:30 AM - 9:30 PM (Lab badge access after hours)',
      accessibilityFeatures: ['ADA compliant eye-wash & shower stations', 'Adjustable height lab benches', 'Wide corridors with auto-openers'],
      emergencyContact: '+1 (555) 019-5500',
      historicalFact: 'Home to 3 Nobel Prize laureates in Molecular Chemistry and Biophysics.',
      amenities: [
        { id: 'am_sci_1', name: 'BioSafety Level 2 Cleanrooms', type: 'quiet_zone', floor: 2 },
        { id: 'am_sci_2', name: 'Chemical Waste Disposal & Safety Station', type: 'emergency_call', floor: 0 },
        { id: 'am_sci_3', name: 'Hydration Station with Pure RO Water', type: 'water_station', floor: 1 }
      ],
      rooms: [
        { id: 'r_sci_01', roomNumber: '101', name: 'Newton Physics Auditorium', type: 'lecture_hall', floor: 1, capacity: 200, occupancyStatus: 'Available', headOrProfessor: 'Dr. Arthur Pendelton' },
        { id: 'r_sci_02', roomNumber: '115', name: 'Organic Chemistry Wet Lab', type: 'lab', floor: 1, capacity: 35, occupancyStatus: 'In Class', headOrProfessor: 'Prof. Helen Cho' },
        { id: 'r_sci_03', roomNumber: '204', name: 'Genetics & CRISPR Editing Suite', type: 'lab', floor: 2, capacity: 25, occupancyStatus: 'Reserved', headOrProfessor: 'Dr. Samuel Green' },
        { id: 'r_sci_04', roomNumber: '310', name: 'Rooftop Astronomical Observatory', type: 'lab', floor: 3, capacity: 20, occupancyStatus: 'Available', headOrProfessor: 'Dr. Nova Vance' }
      ]
    },
    {
      id: 'bldg_health_wellness',
      name: 'Apex Health & Wellness Medical Center',
      shortName: 'Health & Wellness Center',
      code: 'HLT',
      category: 'health',
      x: 730,
      y: 350,
      width: 140,
      height: 110,
      color: '#EF4444', // Red
      accentColor: '#B91C1C',
      floors: [0, 1, 2],
      entranceNodeId: 'node_health_entrance',
      description: 'Campus urgent care, primary clinical care, pharmacy, mental health counseling, and student immunization clinic.',
      fullOverview: 'Comprehensive student medical clinic providing walk-in urgent care, sports injury physiotherapy, low-cost prescription pharmacy, and confidential mental wellness counseling.',
      departments: ['Urgent & Primary Care Clinic', 'Campus Pharmacy', 'Counseling & Psychological Services (CAPS)', 'Health Promotion & Wellness'],
      openingHours: 'Mon-Fri: 8:00 AM - 7:00 PM | Urgent Care Nurse Line: 24/7',
      accessibilityFeatures: ['Full ADA stretcher elevator', 'Zero-threshold doors', 'Specialized exam tables for mobility impairments'],
      emergencyContact: '+1 (555) 019-9111 (Campus Urgent Line)',
      historicalFact: 'Equipped with direct ambulance triage bay linked to Metro General Hospital.',
      amenities: [
        { id: 'am_hlt_1', name: 'Express Prescription Pharmacy', type: 'cafe', floor: 0, description: 'Affordable medicines & over-the-counter essentials' },
        { id: 'am_hlt_2', name: 'Emergency Defibrillator (AED) & First Aid Station', type: 'emergency_call', floor: 0 },
        { id: 'am_hlt_3', name: 'Mindfulness & De-Stress Meditation Room', type: 'quiet_zone', floor: 1 }
      ],
      rooms: [
        { id: 'r_hlt_01', roomNumber: 'G-01', name: 'Urgent Care Triage & Reception', type: 'admin', floor: 0, headOrProfessor: 'Nurse Supervisor Claire Bennett' },
        { id: 'r_hlt_02', roomNumber: '104', name: 'Primary Physician Exam Rooms 1-6', type: 'faculty_office', floor: 1, headOrProfessor: 'Chief Medical Officer Dr. Ethan Ross' },
        { id: 'r_hlt_03', roomNumber: '201', name: 'CAPS Mental Health & Counseling Suites', type: 'study_room', floor: 2, headOrProfessor: 'Dr. Maya Patel, Psy.D' }
      ]
    },
    {
      id: 'bldg_sports_arena',
      name: 'Olympic Sports Pavilion & Recreation Arena',
      shortName: 'Sports Arena & Rec',
      code: 'REC',
      category: 'sports',
      x: 720,
      y: 520,
      width: 170,
      height: 130,
      color: '#F97316', // Orange
      accentColor: '#C2410C',
      floors: [0, 1, 2],
      entranceNodeId: 'node_rec_entrance',
      description: 'Fitness center, Olympic swimming pool, indoor basketball courts, climbing wall, and athletic training tracks.',
      fullOverview: 'World-class athletic facility with 3-tier weight training cardio decks, indoor rock-climbing tower, Olympic 50m lap pool, multi-court arena for basketball/badminton/volleyball, and smoothie bar.',
      departments: ['Department of Athletics & Recreation', 'Club & Intramural Sports', 'Kinesiology & Physical Therapy'],
      openingHours: 'Mon-Fri: 6:00 AM - 11:00 PM | Sat-Sun: 8:00 AM - 9:00 PM',
      accessibilityFeatures: ['Pool ADA chair lift', 'Accessible locker rooms & roll-in showers', 'Adaptive fitness equipment'],
      emergencyContact: '+1 (555) 019-7700',
      historicalFact: 'Hosted the Regional Intercollegiate Games in 2024.',
      amenities: [
        { id: 'am_rec_1', name: 'NutriBoost Protein & Smoothie Bar', type: 'cafe', floor: 1 },
        { id: 'am_rec_2', name: 'Locker Rooms & Saunas', type: 'restroom', floor: 0 },
        { id: 'am_rec_3', name: 'High Output Water Bottle Refillers', type: 'water_station', floor: 1 }
      ],
      rooms: [
        { id: 'r_rec_01', roomNumber: '100', name: 'Main Championship Basketball Arena', type: 'auditorium', floor: 1, capacity: 2500, occupancyStatus: 'Available' },
        { id: 'r_rec_02', roomNumber: 'G-15', name: 'Olympic 50m Aquatics Complex', type: 'lab', floor: 0, capacity: 150, occupancyStatus: 'Available' },
        { id: 'r_rec_03', roomNumber: '201', name: 'Cardio, Free Weights & CrossFit Deck', type: 'study_room', floor: 2, capacity: 120, occupancyStatus: 'Available' }
      ]
    },
    {
      id: 'bldg_residence_dorm',
      name: 'Evergreen Student Residences & Living Learning Halls',
      shortName: 'Evergreen Dorms',
      code: 'DOR',
      category: 'residential',
      x: 180,
      y: 530,
      width: 160,
      height: 120,
      color: '#14B8A6', // Teal
      accentColor: '#0F766E',
      floors: [0, 1, 2, 3],
      entranceNodeId: 'node_dorm_entrance',
      description: 'Modern student residential housing with study lounges, communal kitchens, laundry facilities, and resident advisors.',
      fullOverview: 'Home to 1,200 undergraduate and graduate students across North and South Towers. Equipped with high-speed fiber internet, private study alcoves, bike storage rooms, and community games room.',
      departments: ['Housing & Residential Life', 'Resident Advisors Desk', 'Maintenance & Facilities Operations'],
      openingHours: '24/7 Keycard access for dorm residents',
      accessibilityFeatures: ['Fully compliant ADA dorm suites with roll-in showers', 'Elevator with emergency voice phone', 'Automatic entry doors'],
      emergencyContact: '+1 (555) 019-8800 (RA on-call)',
      historicalFact: 'Built with geothermal heating and smart energy-saving climate sensors in every room.',
      amenities: [
        { id: 'am_dor_1', name: 'Smart Laundry Facility (App-notified)', type: 'power_outlet', floor: 0 },
        { id: 'am_dor_2', name: 'Common Kitchen with Induction Ranges', type: 'microwaves', floor: 1 },
        { id: 'am_dor_3', name: 'Resident Quiet Study Lounge', type: 'quiet_zone', floor: 2 }
      ],
      rooms: [
        { id: 'r_dor_01', roomNumber: 'G-02', name: 'Housing Reception & Package Lockers', type: 'admin', floor: 0, headOrProfessor: 'Housing Director James O’Connor' },
        { id: 'r_dor_02', roomNumber: '110', name: 'Community Lounge & Media Center', type: 'study_room', floor: 1, capacity: 45, occupancyStatus: 'Available' },
        { id: 'r_dor_03', roomNumber: '201-240', name: 'North Residence Suites (Rooms 201-240)', type: 'study_room', floor: 2 }
      ]
    },
    {
      id: 'bldg_arts_design',
      name: 'Da Vinci Media, Fine Arts & Performance Center',
      shortName: 'Arts & Media Center',
      code: 'ART',
      category: 'arts',
      x: 470,
      y: 530,
      width: 160,
      height: 120,
      color: '#EC4899', // Pink
      accentColor: '#BE185D',
      floors: [0, 1, 2],
      entranceNodeId: 'node_art_entrance',
      description: 'Creative design studios, digital cinematography suites, blackbox theatre, orchestra hall, and art galleries.',
      fullOverview: 'The vibrant artistic center of campus. Features an acoustics-tuned 600-seat proscenium concert hall, film recording stages, ceramic & printmaking studios, and rotating student art exhibitions.',
      departments: ['School of Visual & Digital Arts', 'Department of Music & Sonic Arts', 'Theatre & Performing Arts', 'Animation & Game Art'],
      openingHours: 'Mon-Sun: 7:00 AM - 10:00 PM (Studio access 24/7 for art majors)',
      accessibilityFeatures: ['Wheelchair seating in main theatre', 'Assisted listening infrared devices', 'Level ramp to backstage and gallery'],
      emergencyContact: '+1 (555) 019-6600',
      historicalFact: 'Features an outdoor amphitheater used for commencement ceremonies and Shakespeare festivals.',
      amenities: [
        { id: 'am_art_1', name: 'The Gallery Cafe & Patio', type: 'cafe', floor: 0 },
        { id: 'am_art_2', name: 'Dolby Atmos Sound Mixing Room', type: 'quiet_zone', floor: 1 },
        { id: 'am_art_3', name: 'Exhibition Hallway & Display Gallery', type: 'wifi', floor: 0 }
      ],
      rooms: [
        { id: 'r_art_01', roomNumber: '100', name: 'Proscenium Concert & Theatre Hall', type: 'auditorium', floor: 1, capacity: 600, occupancyStatus: 'Available', headOrProfessor: 'Prof. Vivian Chen' },
        { id: 'r_art_02', roomNumber: '115', name: 'Digital Animation & 3D Modeling Lab', type: 'lab', floor: 1, capacity: 30, occupancyStatus: 'Available', headOrProfessor: 'Prof. Alex Mercer' },
        { id: 'r_art_03', roomNumber: '205', name: 'Acoustic Soundstage & Recording Booths', type: 'lab', floor: 2, capacity: 15, occupancyStatus: 'In Class', headOrProfessor: 'Sound Engineer David Kim' }
      ]
    },
    {
      id: 'bldg_transit_parking',
      name: 'Central Transit Hub & West Multi-Story Structure',
      shortName: 'Transit & Parking Hub',
      code: 'TRN',
      category: 'transit',
      x: 40,
      y: 350,
      width: 100,
      height: 130,
      color: '#64748B', // Slate
      accentColor: '#334155',
      floors: [0, 1, 2, 3],
      entranceNodeId: 'node_transit_entrance',
      description: 'Campus bus terminal, EV fast chargers, covered parking, bicycle maintenance station, and night safe-walk hub.',
      fullOverview: 'The primary transportation gateway connecting the university to city metro lines and intercampus shuttles. Offers 800 covered parking spots, 24 Level-3 DC fast chargers for EVs, and campus bike rentals.',
      departments: ['Transportation & Parking Services', 'Campus Night Safety Escort', 'Sustainable Transit Initiative'],
      openingHours: '24 Hours / 7 Days a week',
      accessibilityFeatures: ['Designated ADA van accessible parking spots right by elevator', 'Push-button crosswalk signals to central campus'],
      emergencyContact: '+1 (555) 019-1111 (Night Safety Escort)',
      historicalFact: 'Equipped with automated smart occupancy sensors showing available spots in real-time.',
      amenities: [
        { id: 'am_trn_1', name: 'Tesla & CCS EV Fast Chargers', type: 'power_outlet', floor: 0 },
        { id: 'am_trn_2', name: 'Bike Repair Tools & Air Pump', type: 'wifi', floor: 0 },
        { id: 'am_trn_3', name: 'Campus Safety Blue Light Station', type: 'emergency_call', floor: 0 }
      ],
      rooms: [
        { id: 'r_trn_01', roomNumber: 'G-01', name: 'Transit Office & Parking Permit Sales', type: 'admin', floor: 0, headOrProfessor: 'Supervisor Dan Walsh' },
        { id: 'r_trn_02', roomNumber: 'G-02', name: 'Night Escort Dispatch & Student Patrol', type: 'admin', floor: 0, headOrProfessor: 'Officer Robert Vance' }
      ]
    }
  ],
  nodes: [
    // Gates & External Junctions
    {
      id: 'node_north_gate',
      name: 'North University Main Gate',
      x: 500,
      y: 30,
      type: 'gate',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_north_plaza', distanceMeters: 60, accessible: true, indoor: false, pathType: 'walkway' }
      ]
    },
    {
      id: 'node_west_gate',
      name: 'West Transit Gate',
      x: 30,
      y: 200,
      type: 'gate',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_transit_entrance', distanceMeters: 120, accessible: true, indoor: false, pathType: 'road' },
        { targetNodeId: 'node_admin_entrance', distanceMeters: 160, accessible: true, indoor: false, pathType: 'walkway' }
      ]
    },
    {
      id: 'node_south_gate',
      name: 'South Residential Gate',
      x: 500,
      y: 670,
      type: 'gate',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_south_plaza', distanceMeters: 50, accessible: true, indoor: false, pathType: 'walkway' }
      ]
    },
    {
      id: 'node_east_gate',
      name: 'East Sports & Medical Gate',
      x: 950,
      y: 350,
      type: 'gate',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_east_plaza', distanceMeters: 80, accessible: true, indoor: false, pathType: 'road' }
      ]
    },

    // Central Plazas & Major Intersections
    {
      id: 'node_north_plaza',
      name: 'North Academic Concourse',
      x: 500,
      y: 90,
      type: 'plaza',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_north_gate', distanceMeters: 60, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_admin_entrance', distanceMeters: 190, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_cs_entrance', distanceMeters: 80, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_sci_entrance', distanceMeters: 200, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_central_quad', distanceMeters: 210, accessible: true, indoor: false, pathType: 'walkway' }
      ]
    },
    {
      id: 'node_central_quad',
      name: 'Grand Central Memorial Quadrangle (Clock Tower)',
      x: 400,
      y: 300,
      type: 'plaza',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_north_plaza', distanceMeters: 210, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_admin_entrance', distanceMeters: 170, accessible: true, indoor: false, pathType: 'garden_path' },
        { targetNodeId: 'node_cs_entrance', distanceMeters: 160, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_lib_entrance', distanceMeters: 120, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_stu_entrance', distanceMeters: 110, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_skybridge_cs_stu', distanceMeters: 130, accessible: true, indoor: true, pathType: 'skybridge' }
      ]
    },
    {
      id: 'node_south_plaza',
      name: 'South Arts & Living Commons Plaza',
      x: 400,
      y: 500,
      type: 'plaza',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_central_quad', distanceMeters: 190, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_lib_entrance', distanceMeters: 140, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_stu_entrance', distanceMeters: 130, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_dorm_entrance', distanceMeters: 150, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_art_entrance', distanceMeters: 120, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_south_gate', distanceMeters: 160, accessible: true, indoor: false, pathType: 'walkway' }
      ]
    },
    {
      id: 'node_east_plaza',
      name: 'East Science & Health Concourse',
      x: 700,
      y: 350,
      type: 'plaza',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_sci_entrance', distanceMeters: 170, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_health_entrance', distanceMeters: 40, accessible: true, indoor: false, pathType: 'ramp' },
        { targetNodeId: 'node_rec_entrance', distanceMeters: 160, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_stu_entrance', distanceMeters: 150, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_east_gate', distanceMeters: 220, accessible: true, indoor: false, pathType: 'road' }
      ]
    },

    // Building Entrance Nodes
    {
      id: 'node_admin_entrance',
      name: 'Administration Building Main Portico',
      x: 250,
      y: 275,
      buildingId: 'bldg_admin',
      type: 'building_entrance',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_admin_f1', distanceMeters: 10, accessible: true, indoor: true, pathType: 'corridor' },
        { targetNodeId: 'node_north_plaza', distanceMeters: 190, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_central_quad', distanceMeters: 170, accessible: true, indoor: false, pathType: 'garden_path' },
        { targetNodeId: 'node_transit_entrance', distanceMeters: 150, accessible: true, indoor: false, pathType: 'walkway' }
      ]
    },
    {
      id: 'node_admin_f1',
      name: 'Admin Building Floor 1 Main Lobby',
      x: 250,
      y: 215,
      floor: 1,
      buildingId: 'bldg_admin',
      type: 'junction',
      accessible: true,
      indoor: true,
      connections: [
        { targetNodeId: 'node_admin_entrance', distanceMeters: 10, accessible: true, indoor: true, pathType: 'corridor' },
        { targetNodeId: 'node_admin_elevator', distanceMeters: 15, accessible: true, indoor: true, pathType: 'elevator' },
        { targetNodeId: 'node_admin_stairs', distanceMeters: 15, accessible: false, indoor: true, pathType: 'stairs' }
      ]
    },
    {
      id: 'node_admin_elevator',
      name: 'Admin Tower Central Elevator',
      x: 255,
      y: 200,
      floor: 1,
      buildingId: 'bldg_admin',
      type: 'elevator',
      accessible: true,
      indoor: true,
      connections: [
        { targetNodeId: 'node_admin_f1', distanceMeters: 15, accessible: true, indoor: true, pathType: 'elevator' }
      ]
    },
    {
      id: 'node_admin_stairs',
      name: 'Admin Tower Grand Stairwell',
      x: 245,
      y: 200,
      floor: 1,
      buildingId: 'bldg_admin',
      type: 'stairs',
      accessible: false,
      indoor: true,
      connections: [
        { targetNodeId: 'node_admin_f1', distanceMeters: 15, accessible: false, indoor: true, pathType: 'stairs' }
      ]
    },

    // CS Building Nodes
    {
      id: 'node_cs_entrance',
      name: 'Turing CS Complex Glass Atrium Entrance',
      x: 565,
      y: 270,
      buildingId: 'bldg_cs_ai',
      type: 'building_entrance',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_cs_f1', distanceMeters: 12, accessible: true, indoor: true, pathType: 'corridor' },
        { targetNodeId: 'node_north_plaza', distanceMeters: 80, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_central_quad', distanceMeters: 160, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_sci_entrance', distanceMeters: 180, accessible: true, indoor: false, pathType: 'walkway' }
      ]
    },
    {
      id: 'node_cs_f1',
      name: 'Turing CS Complex Floor 1 Atrium',
      x: 565,
      y: 200,
      floor: 1,
      buildingId: 'bldg_cs_ai',
      type: 'junction',
      accessible: true,
      indoor: true,
      connections: [
        { targetNodeId: 'node_cs_entrance', distanceMeters: 12, accessible: true, indoor: true, pathType: 'corridor' },
        { targetNodeId: 'node_cs_elevator', distanceMeters: 10, accessible: true, indoor: true, pathType: 'elevator' },
        { targetNodeId: 'node_skybridge_cs_stu', distanceMeters: 60, accessible: true, indoor: true, pathType: 'skybridge' }
      ]
    },
    {
      id: 'node_cs_elevator',
      name: 'Turing Complex High-Speed Elevator',
      x: 575,
      y: 180,
      floor: 1,
      buildingId: 'bldg_cs_ai',
      type: 'elevator',
      accessible: true,
      indoor: true,
      connections: [
        { targetNodeId: 'node_cs_f1', distanceMeters: 10, accessible: true, indoor: true, pathType: 'elevator' }
      ]
    },
    {
      id: 'node_skybridge_cs_stu',
      name: 'Covered Skybridge (CS Complex <-> Student Union)',
      x: 550,
      y: 310,
      type: 'junction',
      accessible: true,
      indoor: true,
      connections: [
        { targetNodeId: 'node_cs_f1', distanceMeters: 60, accessible: true, indoor: true, pathType: 'skybridge' },
        { targetNodeId: 'node_stu_f2', distanceMeters: 60, accessible: true, indoor: true, pathType: 'skybridge' },
        { targetNodeId: 'node_central_quad', distanceMeters: 130, accessible: true, indoor: true, pathType: 'skybridge' }
      ]
    },

    // Library Nodes
    {
      id: 'node_lib_entrance',
      name: 'Alexandria Library Main Turnstiles',
      x: 270,
      y: 345,
      buildingId: 'bldg_library',
      type: 'building_entrance',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_lib_f1', distanceMeters: 10, accessible: true, indoor: true, pathType: 'corridor' },
        { targetNodeId: 'node_central_quad', distanceMeters: 120, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_south_plaza', distanceMeters: 140, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_transit_entrance', distanceMeters: 130, accessible: true, indoor: false, pathType: 'walkway' }
      ]
    },
    {
      id: 'node_lib_f1',
      name: 'Library 1st Floor Info Atrium',
      x: 270,
      y: 410,
      floor: 1,
      buildingId: 'bldg_library',
      type: 'junction',
      accessible: true,
      indoor: true,
      connections: [
        { targetNodeId: 'node_lib_entrance', distanceMeters: 10, accessible: true, indoor: true, pathType: 'corridor' },
        { targetNodeId: 'node_lib_elevator', distanceMeters: 12, accessible: true, indoor: true, pathType: 'elevator' }
      ]
    },
    {
      id: 'node_lib_elevator',
      name: 'Library Glass Elevator',
      x: 280,
      y: 420,
      floor: 1,
      buildingId: 'bldg_library',
      type: 'elevator',
      accessible: true,
      indoor: true,
      connections: [
        { targetNodeId: 'node_lib_f1', distanceMeters: 12, accessible: true, indoor: true, pathType: 'elevator' }
      ]
    },

    // Student Union Nodes
    {
      id: 'node_stu_entrance',
      name: 'Student Union North Plaza Entrance',
      x: 550,
      y: 345,
      buildingId: 'bldg_union_dining',
      type: 'building_entrance',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_stu_f1', distanceMeters: 10, accessible: true, indoor: true, pathType: 'corridor' },
        { targetNodeId: 'node_central_quad', distanceMeters: 110, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_south_plaza', distanceMeters: 130, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_east_plaza', distanceMeters: 150, accessible: true, indoor: false, pathType: 'walkway' }
      ]
    },
    {
      id: 'node_stu_f1',
      name: 'Student Union Food Court Floor 1',
      x: 550,
      y: 410,
      floor: 1,
      buildingId: 'bldg_union_dining',
      type: 'junction',
      accessible: true,
      indoor: true,
      connections: [
        { targetNodeId: 'node_stu_entrance', distanceMeters: 10, accessible: true, indoor: true, pathType: 'corridor' },
        { targetNodeId: 'node_stu_f2', distanceMeters: 25, accessible: true, indoor: true, pathType: 'ramp' }
      ]
    },
    {
      id: 'node_stu_f2',
      name: 'Student Union Floor 2 SGA Hall',
      x: 550,
      y: 390,
      floor: 2,
      buildingId: 'bldg_union_dining',
      type: 'junction',
      accessible: true,
      indoor: true,
      connections: [
        { targetNodeId: 'node_stu_f1', distanceMeters: 25, accessible: true, indoor: true, pathType: 'ramp' },
        { targetNodeId: 'node_skybridge_cs_stu', distanceMeters: 60, accessible: true, indoor: true, pathType: 'skybridge' }
      ]
    },

    // Science Deck Entrance
    {
      id: 'node_sci_entrance',
      name: 'Curie Science Complex Entrance Ramp',
      x: 790,
      y: 275,
      buildingId: 'bldg_science_bio',
      type: 'building_entrance',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_north_plaza', distanceMeters: 200, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_cs_entrance', distanceMeters: 180, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_east_plaza', distanceMeters: 170, accessible: true, indoor: false, pathType: 'walkway' }
      ]
    },

    // Health Center
    {
      id: 'node_health_entrance',
      name: 'Health & Wellness Urgent Care Entry',
      x: 730,
      y: 400,
      buildingId: 'bldg_health_wellness',
      type: 'building_entrance',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_east_plaza', distanceMeters: 40, accessible: true, indoor: false, pathType: 'ramp' }
      ]
    },

    // Sports Arena
    {
      id: 'node_rec_entrance',
      name: 'Olympic Sports Arena Grand Entrance',
      x: 720,
      y: 580,
      buildingId: 'bldg_sports_arena',
      type: 'building_entrance',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_east_plaza', distanceMeters: 160, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_south_plaza', distanceMeters: 240, accessible: true, indoor: false, pathType: 'walkway' }
      ]
    },

    // Dormitory
    {
      id: 'node_dorm_entrance',
      name: 'Evergreen Residence Quad Entrance',
      x: 260,
      y: 530,
      buildingId: 'bldg_residence_dorm',
      type: 'building_entrance',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_south_plaza', distanceMeters: 150, accessible: true, indoor: false, pathType: 'walkway' }
      ]
    },

    // Arts Center
    {
      id: 'node_art_entrance',
      name: 'Da Vinci Arts Blackbox Theatre Entrance',
      x: 550,
      y: 530,
      buildingId: 'bldg_arts_design',
      type: 'building_entrance',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_south_plaza', distanceMeters: 120, accessible: true, indoor: false, pathType: 'walkway' }
      ]
    },

    // Transit Center
    {
      id: 'node_transit_entrance',
      name: 'Transit Terminal & Shuttle Bay A',
      x: 90,
      y: 410,
      buildingId: 'bldg_transit_parking',
      type: 'bus_stop',
      accessible: true,
      indoor: false,
      connections: [
        { targetNodeId: 'node_west_gate', distanceMeters: 120, accessible: true, indoor: false, pathType: 'road' },
        { targetNodeId: 'node_admin_entrance', distanceMeters: 150, accessible: true, indoor: false, pathType: 'walkway' },
        { targetNodeId: 'node_lib_entrance', distanceMeters: 130, accessible: true, indoor: false, pathType: 'walkway' }
      ]
    }
  ],
  events: [
    {
      id: 'evt_1',
      title: 'AI & Quantum Computing Hackathon 2026',
      buildingId: 'bldg_cs_ai',
      roomName: 'Hackerspace & Room 101',
      time: 'Today • 10:00 AM - 6:00 PM',
      category: 'workshop',
      description: 'Annual flagship collegiate hackathon with industry mentors from Google, DeepMind, and NVIDIA.'
    },
    {
      id: 'evt_2',
      title: 'Career & Internship Expo: Tech & Health',
      buildingId: 'bldg_union_dining',
      roomName: 'Main Concourse & SGA Hall',
      time: 'Today • 1:00 PM - 5:00 PM',
      category: 'career',
      description: 'Meet over 80 hiring recruiters for summer 2026 internships. Professional attire recommended.'
    },
    {
      id: 'evt_3',
      title: 'Intercollegiate Basketball: Apex Tigers vs. Metro State',
      buildingId: 'bldg_sports_arena',
      roomName: 'Main Championship Arena',
      time: 'Tonight • 7:30 PM',
      category: 'sports',
      description: 'Cheer for the Tigers in the championship quarterfinals! Free student admission with ID.'
    },
    {
      id: 'evt_4',
      title: 'Late Night Acoustic Coffeehouse & Poetry Slam',
      buildingId: 'bldg_arts_design',
      roomName: 'Gallery Cafe Patio',
      time: 'Tonight • 8:00 PM',
      category: 'cultural',
      description: 'Live acoustic music, free espresso drinks, open mic performances by student artists.'
    }
  ],
  shuttleSchedule: [
    {
      routeName: 'Blue Line (North Campus Express)',
      nextArrivalMins: 3,
      stops: ['Transit Hub (Bay A)', 'North Gate', 'CS Complex', 'Curie Science', 'Sports Arena']
    },
    {
      routeName: 'Gold Line (Residential & Library Loop)',
      nextArrivalMins: 7,
      stops: ['Transit Hub (Bay B)', 'Evergreen Dorms', 'Student Union', 'Library Quad', 'Admin Tower']
    },
    {
      routeName: 'Night Owl Safe Escort Shuttle',
      nextArrivalMins: 5,
      stops: ['On-demand doorstep dropoff anywhere on campus (Call x1111)']
    }
  ]
};

export const SAMPLE_STUDENT_SCHEDULE: StudentScheduleItem[] = [
  {
    id: 'sch_1',
    courseCode: 'CS 301',
    courseName: 'Artificial Intelligence & Neural Architectures',
    buildingId: 'bldg_cs_ai',
    roomNumber: '101-A (Ada Lovelace Auditorium)',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
    dayOfWeek: 'Monday, Wednesday'
  },
  {
    id: 'sch_2',
    courseCode: 'PHYS 220',
    courseName: 'Quantum Mechanics & Modern Physics',
    buildingId: 'bldg_science_bio',
    roomNumber: '101 (Newton Auditorium)',
    startTime: '10:45 AM',
    endTime: '12:00 PM',
    dayOfWeek: 'Monday, Wednesday'
  },
  {
    id: 'sch_3',
    courseCode: 'LUNCH',
    courseName: 'Lunch & Student Union Study Session',
    buildingId: 'bldg_union_dining',
    roomNumber: 'Food Court & Floor 2 Study Pod',
    startTime: '12:15 PM',
    endTime: '01:30 PM',
    dayOfWeek: 'Monday, Wednesday'
  },
  {
    id: 'sch_4',
    courseCode: 'CS 380L',
    courseName: 'Autonomous Robotics Lab Practicum',
    buildingId: 'bldg_cs_ai',
    roomNumber: '204 (Robotics Studio)',
    startTime: '02:00 PM',
    endTime: '03:45 PM',
    dayOfWeek: 'Monday, Wednesday'
  }
];

export const ALTERNATIVE_CAMPUS_PRESETS: CampusPreset[] = [
  DEFAULT_CAMPUS_PRESET,
  {
    id: 'metropolitan_arts_col',
    name: 'Metropolitan College of Arts & Humanities',
    shortName: 'Metro Arts College',
    motto: 'Creativity, Culture & Global Expression',
    location: 'Downtown Cultural District',
    buildings: [
      {
        ...DEFAULT_CAMPUS_PRESET.buildings[0],
        name: 'Historic Founder Hall & Registrar',
        shortName: 'Founder Hall'
      },
      {
        ...DEFAULT_CAMPUS_PRESET.buildings[2],
        name: 'The Great Athenaeum Library',
        shortName: 'Athenaeum Library'
      },
      {
        ...DEFAULT_CAMPUS_PRESET.buildings[7],
        name: 'Conservatory of Music & Cinema Studio',
        shortName: 'Conservatory Hall'
      },
      {
        ...DEFAULT_CAMPUS_PRESET.buildings[3],
        name: 'Artisan Cafe & Student Commons',
        shortName: 'Student Commons'
      }
    ],
    nodes: DEFAULT_CAMPUS_PRESET.nodes,
    events: DEFAULT_CAMPUS_PRESET.events,
    shuttleSchedule: DEFAULT_CAMPUS_PRESET.shuttleSchedule
  }
];
