
CREATE TABLE users (
    id VARCHAR(40) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role ENUM('student','organizer') NOT NULL,
    phone VARCHAR(30) DEFAULT NULL,
    department VARCHAR(120) DEFAULT NULL,
    year VARCHAR(20) DEFAULT NULL,
    bio TEXT
);

CREATE TABLE events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    long_description TEXT,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(20),
    end_time VARCHAR(20),
    venue VARCHAR(150),
    department VARCHAR(150),
    image VARCHAR(500),
    registered INT DEFAULT 0,
    capacity INT NOT NULL DEFAULT 0,
    attended INT DEFAULT 0,
    registration_deadline DATE,
    status ENUM('Upcoming','Draft','Completed','Cancelled') DEFAULT 'Upcoming',
    tags VARCHAR(300),
    created_at DATE,
    organizer_id VARCHAR(40)
);

CREATE TABLE registrations (
    reg_id VARCHAR(30) PRIMARY KEY,
    event_id INT NOT NULL,
    student_id VARCHAR(40) NOT NULL,
    student_name VARCHAR(120) NOT NULL,
    email VARCHAR(150),
    department VARCHAR(120),
    year VARCHAR(20),
    status ENUM('Registered','Checked-in') DEFAULT 'Registered',
    registered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    checked_in_at DATETIME DEFAULT NULL,
    CONSTRAINT fk_reg_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE KEY uniq_student_event (event_id, student_id)
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(150) DEFAULT NULL,
    type VARCHAR(20) DEFAULT 'info',
    title VARCHAR(200) NOT NULL,
    message TEXT,
    is_read TINYINT(1) DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO events (title, description, long_description, category, date, time, end_time, venue, department, image, registered, capacity, attended, registration_deadline, status, tags, created_at, organizer_id) VALUES
('AI Innovation Summit', 'Explore the latest developments in artificial intelligence, machine learning and emerging technologies with industry pioneers.', 'The AI Innovation Summit brings together researchers, engineers and students for a full day of keynotes, live demos and panel discussions. Tracks cover generative AI, computer vision, robotics and AI ethics. Includes a hands-on demo zone and a networking lunch with hiring partners.', 'Technical', '2026-08-28', '10:00 AM', '04:30 PM', 'Main Auditorium', 'Computer Science Department', 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80', 72, 150, 0, '2026-08-26', 'Upcoming', 'AI,ML,Innovation', '2026-07-02', 'ORG-001'),
('Cultural Fest 2026', 'A grand celebration of music, dance, drama and art featuring performances from colleges across the state.', 'Three stages, forty performances and one unforgettable night. Cultural Fest 2026 features battle of bands, classical dance showdowns, a stand-up comedy hour, art installations and a headline concert under the open sky. Food stalls and creator zones open all day.', 'Cultural', '2026-09-05', '09:00 AM', '10:00 PM', 'Open Air Theatre', 'Student Cultural Club', 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80', 210, 500, 0, '2026-09-03', 'Upcoming', 'Music,Dance,Art', '2026-06-18', 'ORG-001'),
('Inter College Cricket Championship', 'Cheer your college team in the biggest cricket tournament of the season. Finals followed by prize night.', 'Sixteen teams, knockout format, floodlit evening matches. The championship culminates in a grand final followed by the awards ceremony. Student ID grants free entry to league matches; finals seating is ticketed through CampusHub.', 'Sports', '2026-09-12', '08:30 AM', '07:00 PM', 'College Sports Ground', 'Sports Committee', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=80', 180, 300, 0, '2026-09-10', 'Upcoming', 'Cricket,Tournament', '2026-06-25', 'ORG-001'),
('CodeSprint 2026', 'A six-hour competitive programming battle. Solve real-world problem sets and climb the campus leaderboard.', 'CodeSprint is an on-site competitive programming contest with three difficulty divisions. Problems are set by alumni working at top product companies. Prizes worth Rs.75,000, fastest-solver swag and direct interview slots for top performers.', 'Competition', '2026-09-18', '09:30 AM', '04:00 PM', 'Computer Lab Block C', 'Coding Club', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80', 95, 120, 0, '2026-09-15', 'Upcoming', 'Coding,Contest', '2026-07-01', 'ORG-001'),
('Full Stack Development Workshop', 'Hands-on workshop covering React, Node.js and databases. Build and deploy a complete project in one day.', 'Bring your laptop â€” you will ship a deployed full-stack app before dinner. Sessions cover modern React patterns, REST API design with Express, MongoDB modelling, authentication and a CI deploy pipeline. Starter kits, mentors and certificates included.', 'Workshop', '2026-09-22', '10:00 AM', '05:00 PM', 'Seminar Hall 2', 'Developer Club', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80', 85, 100, 0, '2026-09-20', 'Upcoming', 'React,Node.js,MERN', '2026-07-05', 'ORG-001'),
('Future Tech Seminar', 'Industry leaders discuss quantum computing, Web3 and the future of human-computer interaction.', 'A half-day seminar featuring talks from principal engineers and researchers. Topics include quantum computing practicalities, spatial computing, edge AI and responsible innovation. Audience Q&A and a curated reading list to take home.', 'Seminar', '2026-09-25', '02:00 PM', '06:00 PM', 'Seminar Hall 1', 'CSE Department', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80', 120, 200, 0, '2026-09-23', 'Upcoming', 'Quantum,Web3', '2026-07-08', 'ORG-001'),
('Photography Club Meetup', 'Monthly meetup with a golden-hour photowalk across campus. All cameras welcome â€” phones included.', 'This month''s theme is Campus at Golden Hour. The session begins with a short editing masterclass followed by a guided photowalk. Best shots get featured on the official campus Instagram and printed for the club wall.', 'Club', '2026-09-28', '03:00 PM', '06:30 PM', 'Activity Hall', 'Photography Club', 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80', 45, 80, 0, '2026-09-27', 'Upcoming', 'Photography,Creative', '2026-07-12', 'ORG-001'),
('UI/UX Design Challenge', 'Design a campus app screen live, pitch it to a jury of designers and win an internship interview.', 'Teams get three hours to redesign a real campus flow â€” onboarding, event discovery or ticketing. Jury includes senior product designers. Figma templates provided; bring creativity. Winning entries go into the design system used by the student portal.', 'Technical', '2026-10-02', '10:00 AM', '03:00 PM', 'Innovation Lab', 'Design Club', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80', 60, 100, 0, '2026-09-30', 'Upcoming', 'Design,Figma', '2026-07-15', 'ORG-001'),
('Robotics & Drone Expo', 'Live robot battles, drone racing and an autonomous navigation showcase built by student teams.', 'Student-built robots face off in the arena while FPV pilots race through a custom obstacle course. Labs exhibit autonomous rovers, humanoid arms and swarm drones. Great exposure for first-years looking to join tech teams.', 'Technical', '2026-10-05', '11:00 AM', '05:00 PM', 'Tech Pavilion', 'Robotics Society', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80', 40, 90, 0, '2026-10-03', 'Draft', 'Robotics,Drones', '2026-07-20', 'ORG-001'),
('Startup & Innovation Bootcamp', 'Two-day bootcamp on idea validation, pitching and building an MVP with mentors from the startup ecosystem.', 'Day one covers customer discovery and rapid prototyping. Day two is pitch day in front of a founder panel with seed-grant prizes for the best validated ideas. Ideal for final-year projects that want to become real products.', 'Other', '2026-10-10', '09:00 AM', '06:00 PM', 'Incubation Centre', 'E-Cell', 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80', 55, 120, 0, '2026-10-08', 'Upcoming', 'Startups,Pitching', '2026-07-21', 'ORG-001');

INSERT INTO registrations (reg_id, event_id, student_id, student_name, email, department, year, status, registered_at, checked_in_at) VALUES
('REG-2026-1002', 1, 'STU-INF-1104', 'Ananya Sharma', 'ananya.sharma@campushub.edu', 'Information Technology', '2nd Year', 'Checked-in', DATE_SUB(NOW(), INTERVAL 14 DAY), NOW()),
('REG-2026-1004', 2, 'STU-MEC-1106', 'Rohan Patel', 'rohan.patel@campushub.edu', 'Mechanical Engineering', '3rd Year', 'Registered', DATE_SUB(NOW(), INTERVAL 12 DAY), NULL),
('REG-2026-1008', 4, 'STU-CSE-1110', 'Sneha Reddy', 'sneha.reddy@campushub.edu', 'Computer Science', '4th Year', 'Registered', DATE_SUB(NOW(), INTERVAL 9 DAY), NULL),
('REG-2026-1011', 3, 'STU-ECE-1113', 'Vikram Singh', 'vikram.singh@campushub.edu', 'Electronics & Comm.', '2nd Year', 'Checked-in', DATE_SUB(NOW(), INTERVAL 8 DAY), NOW()),
('REG-2026-1015', 5, 'STU-CSE-1117', 'Priya Nair', 'priya.nair@campushub.edu', 'Computer Science', '1st Year', 'Registered', DATE_SUB(NOW(), INTERVAL 6 DAY), NULL),
('REG-2026-1018', 6, 'STU-EEE-1120', 'Arjun Mehta', 'arjun.mehta@campushub.edu', 'Electrical Engineering', '3rd Year', 'Checked-in', DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
('REG-2026-1021', 7, 'STU-MAC-1123', 'Ishita Bose', 'ishita.bose@campushub.edu', 'Mass Communication', '2nd Year', 'Registered', DATE_SUB(NOW(), INTERVAL 3 DAY), NULL);

INSERT INTO notifications (user_email, type, title, message, is_read, created_at) VALUES
(NULL, 'info', 'Welcome to CampusHub', 'Create your account to register for events, grab QR tickets and never miss a campus moment.', 0, NOW());
