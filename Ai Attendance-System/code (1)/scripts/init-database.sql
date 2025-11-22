-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'student')),
  face_encoding BYTEA,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id SERIAL PRIMARY KEY,
  admin_id INTEGER NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_time TIMESTAMP NOT NULL,
  duration_minutes INTEGER NOT NULL,
  location_lat FLOAT,
  location_lng FLOAT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'ongoing', 'completed')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create class enrollments table
CREATE TABLE IF NOT EXISTS class_enrollments (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL REFERENCES classes(id),
  student_id INTEGER NOT NULL REFERENCES users(id),
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, student_id)
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  class_id INTEGER NOT NULL REFERENCES classes(id),
  student_id INTEGER NOT NULL REFERENCES users(id),
  check_in_time TIMESTAMP NOT NULL,
  check_out_time TIMESTAMP,
  face_verified BOOLEAN DEFAULT FALSE,
  location_lat FLOAT,
  location_lng FLOAT,
  duration_minutes INTEGER,
  status VARCHAR(50) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(class_id, student_id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_classes_admin_id ON classes(admin_id);
CREATE INDEX idx_enrollments_student_id ON class_enrollments(student_id);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_class_id ON attendance(class_id);
