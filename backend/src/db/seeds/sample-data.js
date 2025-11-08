const { pool } = require('../../config/database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // 1. Insert Universities
    const universities = await pool.query(`
      INSERT INTO universities (name, domain, verified) VALUES
      ('IIT Bangalore', 'iitb.ac.in', true),
      ('IIT Delhi', 'iitd.ac.in', true),
      ('BITS Pilani', 'bits-pilani.ac.in', true),
      ('VIT Vellore', 'vit.ac.in', true),
      ('NIT Trichy', 'nitt.edu', true)
      RETURNING id, name
    `);
    console.log('✅ Universities seeded');

    // 2. Insert Skills
    const skills = await pool.query(`
      INSERT INTO skills (name) VALUES
      ('JavaScript'), ('Python'), ('React'), ('Node.js'), ('PostgreSQL'),
      ('Machine Learning'), ('UI/UX Design'), ('Docker'), ('AWS'), ('Blockchain')
      RETURNING id, name
    `);
    console.log('✅ Skills seeded');

    // 3. Insert Users with different locations
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = await pool.query(`
      INSERT INTO users (email, password_hash, full_name, username, university_id, city, latitude, longitude) VALUES
      ('ravi@iitb.ac.in', $1, 'Ravi Kumar', 'ravi_dev', $2, 'Bangalore', 12.9716, 77.5946),
      ('priya@iitd.ac.in', $1, 'Priya Sharma', 'priya_ml', $3, 'Delhi', 28.6139, 77.2090),
      ('arjun@vit.ac.in', $1, 'Arjun Patel', 'arjun_web', $4, 'Vellore', 12.9699, 79.1559),
      ('sneha@bits.ac.in', $1, 'Sneha Reddy', 'sneha_ui', $5, 'Hyderabad', 17.3850, 78.4867),
      ('karthik@nitt.edu', $1, 'Karthik Iyer', 'karthik_cloud', $6, 'Trichy', 10.7905, 78.7047),
      ('meera@iitb.ac.in', $1, 'Meera Singh', 'meera_ai', $2, 'Mumbai', 19.0760, 72.8777)
      RETURNING id, full_name, city
    `, [hashedPassword, universities.rows[0].id, universities.rows[1].id, universities.rows[3].id, universities.rows[2].id, universities.rows[4].id]);
    console.log('✅ Users seeded');

    // 4. Insert Events
    await pool.query(`
      INSERT INTO events (title, description, type, start_at, end_at, latitude, longitude, city, organizer_id, max_participants) VALUES
      ('AI Hackathon Bangalore', 'Build innovative AI solutions', 'Hackathon', '2025-11-15 09:00:00', '2025-11-17 18:00:00', 12.9716, 77.5946, 'Bangalore', $1, 100),
      ('Web3 Workshop Delhi', 'Learn blockchain development', 'Workshop', '2025-11-20 10:00:00', '2025-11-20 16:00:00', 28.6139, 77.2090, 'Delhi', $2, 50),
      ('React Meetup Mumbai', 'Community meetup for React developers', 'Meetup', '2025-11-18 17:00:00', '2025-11-18 20:00:00', 19.0760, 72.8777, 'Mumbai', $1, 30),
      ('ML Workshop Hyderabad', 'Machine Learning fundamentals', 'AI Workshop', '2025-11-25 09:00:00', '2025-11-25 17:00:00', 17.3850, 78.4867, 'Hyderabad', $2, 40)
    `, [users.rows[0].id, users.rows[1].id]);
    console.log('✅ Events seeded');

    console.log('✅ Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
