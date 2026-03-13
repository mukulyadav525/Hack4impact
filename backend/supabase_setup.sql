-- =============================================================================
-- GovTrack AI — Supabase SQL Setup (Fixed)
-- Run this entire file in Supabase SQL Editor
-- Uses gen_random_uuid() — native to Supabase PostgreSQL 15, no extension needed
-- =============================================================================

-- PostGIS for geo-fencing (enable in Supabase Dashboard > Extensions first)
-- If PostGIS is not enabled, comment out the "boundary" column in zones table
CREATE EXTENSION IF NOT EXISTS postgis;

-- =============================================================================
-- 1. TABLE DEFINITIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS departments (
    id         SERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    ministry   TEXT,
    state      TEXT,
    dept_code  TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS zones (
    id         SERIAL PRIMARY KEY,
    dept_id    INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    city       TEXT,
    district   TEXT
    -- boundary GEOMETRY(POLYGON, 4326)  -- uncomment if PostGIS is enabled
);

CREATE TABLE IF NOT EXISTS employees (
    id                    UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    govt_id               TEXT UNIQUE NOT NULL,
    name                  TEXT NOT NULL,
    dept_id               INTEGER REFERENCES departments(id),
    zone_id               INTEGER REFERENCES zones(id),
    employee_type         TEXT,
    job_role              TEXT,
    category              TEXT,
    grade_band            TEXT,
    pin_hash              TEXT,
    streak_count          INTEGER DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    lockout_until         TIMESTAMPTZ,
    is_active             BOOLEAN DEFAULT TRUE,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS attendance (
    id            UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id   UUID REFERENCES employees(id) ON DELETE CASCADE,
    date          TIMESTAMPTZ DEFAULT NOW(),
    checkin_time  TIMESTAMPTZ,
    checkout_time TIMESTAMPTZ,
    checkin_lat   DECIMAL(9,6),
    checkin_lon   DECIMAL(9,6),
    status        TEXT,
    streak_count  INTEGER DEFAULT 0,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS work_submissions (
    id               UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id      UUID REFERENCES employees(id) ON DELETE CASCADE,
    task_type        TEXT NOT NULL,
    before_image_url TEXT,
    after_image_url  TEXT,
    latitude         DECIMAL(9,6),
    longitude        DECIMAL(9,6),
    submitted_at     TIMESTAMPTZ DEFAULT NOW(),
    ai_confidence    DECIMAL(4,3),
    ai_quality_score INTEGER,
    status           TEXT,
    fraud_risk_score DECIMAL(4,3),
    details          JSONB,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS daily_scores (
    id               UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id      UUID REFERENCES employees(id) ON DELETE CASCADE,
    date             TIMESTAMP NOT NULL,
    attendance_score FLOAT,
    work_score       FLOAT,
    quality_score    FLOAT,
    bonus_score      FLOAT DEFAULT 0,
    fraud_penalty    FLOAT DEFAULT 0,
    total_score      FLOAT,
    tier             TEXT,
    scoring_version  TEXT DEFAULT '1.0',
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS monthly_scores (
    id                UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id       UUID REFERENCES employees(id) ON DELETE CASCADE,
    month             INTEGER NOT NULL,
    year              INTEGER NOT NULL,
    total_score       FLOAT,
    avg_quality_score FLOAT,
    reward_eligible   BOOLEAN DEFAULT FALSE,
    fraud_flag_count  INTEGER DEFAULT 0,
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scoring_rules (
    id                    SERIAL PRIMARY KEY,
    dept_code             TEXT UNIQUE NOT NULL,
    attendance_weight     FLOAT DEFAULT 0.3,
    quality_weight        FLOAT DEFAULT 0.4,
    count_weight          FLOAT DEFAULT 0.3,
    context_bonus_formula JSONB,
    created_at            TIMESTAMPTZ DEFAULT NOW(),
    updated_at            TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS rewards (
    id               UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id      UUID REFERENCES employees(id) ON DELETE CASCADE,
    type             TEXT,
    amount           DECIMAL(12,2),
    trigger          TEXT,
    ai_justification TEXT,
    status           TEXT DEFAULT 'pending',
    payment_ref      TEXT,
    created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fraud_flags (
    id            UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    submission_id UUID REFERENCES work_submissions(id) ON DELETE CASCADE,
    flag_type     TEXT,
    risk_score    DECIMAL(4,3),
    evidence      JSONB,
    status        TEXT DEFAULT 'open',
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS grievances (
    id                UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id       UUID REFERENCES employees(id) ON DELETE CASCADE,
    disputed_score_id UUID REFERENCES daily_scores(id),
    category          TEXT,
    description       TEXT,
    status            TEXT DEFAULT 'open',
    reviewer_id       UUID REFERENCES employees(id),
    resolution        TEXT,
    created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_log (
    id          SERIAL PRIMARY KEY,
    entity_type TEXT,
    entity_id   TEXT,
    action      TEXT,
    actor_id    TEXT,
    prev_state  JSONB,
    new_state   JSONB,
    checksum    TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS climate_adjustments (
    id                         SERIAL PRIMARY KEY,
    alert_type                 TEXT,
    region_id                  INTEGER REFERENCES zones(id),
    start_date                 TIMESTAMPTZ,
    end_date                   TIMESTAMPTZ,
    weight_multiplier          FLOAT DEFAULT 1.0,
    allow_threshold_relaxation BOOLEAN DEFAULT TRUE,
    created_at                 TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lesson_plans (
    id                  UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id         UUID REFERENCES employees(id) ON DELETE CASCADE,
    date                TIMESTAMP,
    subject             TEXT,
    content_url         TEXT,
    is_early_submission BOOLEAN DEFAULT FALSE,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS class_proofs (
    id                     UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id            UUID REFERENCES employees(id) ON DELETE CASCADE,
    video_url              TEXT,
    student_count_detected INTEGER,
    session_type           TEXT,
    created_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS opd_logs (
    id            UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id   UUID REFERENCES employees(id) ON DELETE CASCADE,
    patient_count INTEGER,
    start_time    TIMESTAMPTZ,
    end_time      TIMESTAMPTZ,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patrol_logs (
    id                  UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id         UUID REFERENCES employees(id) ON DELETE CASCADE,
    route_points        JSONB,
    coverage_percentage FLOAT,
    incident_count      INTEGER DEFAULT 0,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS incident_reports (
    id                    UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id           UUID REFERENCES employees(id) ON DELETE CASCADE,
    type                  TEXT,
    description           TEXT,
    response_time_minutes INTEGER,
    status                TEXT,
    created_at            TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback (
    id            UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id   UUID REFERENCES employees(id) ON DELETE CASCADE,
    source        TEXT,
    rating        INTEGER CHECK (rating BETWEEN 1 AND 5),
    comment       TEXT,
    submission_id UUID REFERENCES work_submissions(id),
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id          UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    type        TEXT,
    message     TEXT,
    read        BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 2. INDEXES
-- =============================================================================
CREATE INDEX IF NOT EXISTS idx_daily_scores_emp_date ON daily_scores(employee_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_work_submissions_emp  ON work_submissions(employee_id);
CREATE INDEX IF NOT EXISTS idx_grievances_emp        ON grievances(employee_id);
CREATE INDEX IF NOT EXISTS idx_fraud_flags_sub       ON fraud_flags(submission_id);
CREATE INDEX IF NOT EXISTS idx_attendance_emp        ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_govt_id     ON employees(govt_id);

-- =============================================================================
-- 3. SEED DATA
-- =============================================================================

-- 3.1 Departments
INSERT INTO departments (name, ministry, state, dept_code) VALUES
  ('Education Department',    'Ministry of Education',    'Haryana', 'EDU'),
  ('Health & Family Welfare', 'Ministry of Health',       'Haryana', 'HFW'),
  ('Haryana Police',          'Ministry of Home Affairs', 'Haryana', 'POL'),
  ('District Administration', 'Ministry of Home Affairs', 'Haryana', 'ADMIN'),
  ('Public Services',         'Ministry of Urban Affairs','Haryana', 'PUBLIC')
ON CONFLICT (dept_code) DO NOTHING;

-- 3.2 Zones
INSERT INTO zones (dept_id, name, city, district)
SELECT id, 'EDU — North Zone',   'Ambala',    'Ambala'    FROM departments WHERE dept_code='EDU';
INSERT INTO zones (dept_id, name, city, district)
SELECT id, 'EDU — South Zone',   'Gurugram',  'Gurugram'  FROM departments WHERE dept_code='EDU';
INSERT INTO zones (dept_id, name, city, district)
SELECT id, 'EDU — Central Zone', 'Hisar',     'Hisar'     FROM departments WHERE dept_code='EDU';

INSERT INTO zones (dept_id, name, city, district)
SELECT id, 'HFW — North Zone',   'Ambala',    'Ambala'    FROM departments WHERE dept_code='HFW';
INSERT INTO zones (dept_id, name, city, district)
SELECT id, 'HFW — South Zone',   'Faridabad', 'Faridabad' FROM departments WHERE dept_code='HFW';
INSERT INTO zones (dept_id, name, city, district)
SELECT id, 'HFW — Central Zone', 'Rohtak',    'Rohtak'    FROM departments WHERE dept_code='HFW';

INSERT INTO zones (dept_id, name, city, district)
SELECT id, 'POL — North Zone',   'Panchkula', 'Panchkula' FROM departments WHERE dept_code='POL';
INSERT INTO zones (dept_id, name, city, district)
SELECT id, 'POL — South Zone',   'Gurugram',  'Gurugram'  FROM departments WHERE dept_code='POL';
INSERT INTO zones (dept_id, name, city, district)
SELECT id, 'POL — Central Zone', 'Karnal',    'Karnal'    FROM departments WHERE dept_code='POL';

INSERT INTO zones (dept_id, name, city, district)
SELECT id, 'ADMIN — North Zone',   'Ambala',   'Ambala'   FROM departments WHERE dept_code='ADMIN';
INSERT INTO zones (dept_id, name, city, district)
SELECT id, 'ADMIN — South Zone',   'Gurugram', 'Gurugram' FROM departments WHERE dept_code='ADMIN';
INSERT INTO zones (dept_id, name, city, district)
SELECT id, 'ADMIN — Central Zone', 'Hisar',    'Hisar'    FROM departments WHERE dept_code='ADMIN';

INSERT INTO zones (dept_id, name, city, district)
SELECT id, 'PUBLIC — North Zone',   'Chandigarh','Chandigarh' FROM departments WHERE dept_code='PUBLIC';
INSERT INTO zones (dept_id, name, city, district)
SELECT id, 'PUBLIC — South Zone',   'Gurugram',  'Gurugram'  FROM departments WHERE dept_code='PUBLIC';
INSERT INTO zones (dept_id, name, city, district)
SELECT id, 'PUBLIC — Central Zone', 'Rohtak',    'Rohtak'    FROM departments WHERE dept_code='PUBLIC';

-- 3.3 Scoring Rules
INSERT INTO scoring_rules (dept_code, attendance_weight, quality_weight, count_weight, context_bonus_formula) VALUES
  ('EDU',    0.3, 0.4, 0.3, '[{"task_type":"Lesson Plan","points":5,"max":20},{"task_type":"Class Proof","points":8,"max":25}]'),
  ('HFW',    0.3, 0.4, 0.3, '[{"task_type":"OPD Log","points":4,"max":20},{"task_type":"Emergency Response","points":15,"max":30}]'),
  ('POL',    0.3, 0.4, 0.3, '[{"task_type":"Beat Patrol","points":6,"max":20},{"task_type":"FIR Filed","points":5,"max":20}]'),
  ('ADMIN',  0.3, 0.4, 0.3, '[{"task_type":"Application Processed","points":3,"max":15}]'),
  ('PUBLIC', 0.1, 0.4, 0.5, '[{"task_type":"Citizen Report","points":5,"max":15}]')
ON CONFLICT (dept_code) DO NOTHING;

-- 3.4 Employees
-- PIN hash below = bcrypt of "1234" compatible with FastAPI passlib
INSERT INTO employees (id, name, govt_id, pin_hash, employee_type, job_role, dept_id, zone_id, grade_band, streak_count, category, is_active)
SELECT
  gen_random_uuid(),
  name, govt_id,
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3jp4x4ZgDK',
  employee_type, job_role,
  (SELECT id FROM departments WHERE dept_code = dept_code_ref),
  (SELECT id FROM zones WHERE dept_id = (SELECT id FROM departments WHERE dept_code = dept_code_ref) LIMIT 1),
  grade_band, streak_count, category, TRUE
FROM (VALUES
  ('Priya Sharma',        'EDU-2024-0001',  'education',  'Primary Teacher',   'EDU',    'Grade-B', 12, 'General'),
  ('Ramesh Gupta',        'EDU-2024-0002',  'education',  'Senior Teacher',    'EDU',    'Grade-B',  8, 'OBC'),
  ('Anita Devi',          'EDU-2024-0003',  'education',  'Principal',         'EDU',    'Grade-A', 22, 'SC'),
  ('Suresh Kumar',        'EDU-2024-0004',  'supervisor', 'School Inspector',  'EDU',    'Grade-A',  5, 'General'),
  ('Dr. Sunita Rao',      'HFW-2024-0001',  'healthcare', 'PHC Doctor',        'HFW',    'Grade-B', 15, 'General'),
  ('Dr. Rajiv Nair',      'HFW-2024-0002',  'healthcare', 'Specialist',        'HFW',    'Grade-A',  9, 'General'),
  ('Dr. Meena Joshi',     'HFW-2024-0003',  'healthcare', 'Emergency Doctor',  'HFW',    'Grade-A',  3, 'ST'),
  ('Nurse Kavita',        'HFW-2024-0004',  'supervisor', 'Head Nurse',        'HFW',    'Grade-B',  7, 'OBC'),
  ('Const. Vikram Singh', 'POL-2024-0001',  'police',     'Constable',         'POL',    'Grade-C', 18, 'SC'),
  ('SI Deepak Yadav',     'POL-2024-0002',  'police',     'Sub-Inspector',     'POL',    'Grade-B', 11, 'General'),
  ('Insp. Amar Thakur',   'POL-2024-0003',  'police',     'Inspector',         'POL',    'Grade-A', 25, 'General'),
  ('DSP Rajendra',        'POL-2024-0004',  'supervisor', 'DSP',               'POL',    'Grade-A',  4, 'General'),
  ('Mohan Lal',           'ADMIN-2024-0001','admin',      'Clerk',             'ADMIN',  'Grade-C',  6, 'SC'),
  ('Seema Agarwal',       'ADMIN-2024-0002','admin',      'Section Officer',   'ADMIN',  'Grade-B', 14, 'General'),
  ('Rajesh Mehta',        'ADMIN-2024-0003','admin',      'District Officer',  'ADMIN',  'Grade-A', 10, 'OBC'),
  ('Pradeep Singh',       'ADMIN-2024-0004','admin',      'Admin',             'ADMIN',  'Grade-A',  2, 'General'),
  ('Citizen Rajani',      'PUBLIC-2024-0001','citizen',   'Resident',          'PUBLIC', 'N/A',      3, NULL),
  ('Citizen Arun',        'PUBLIC-2024-0002','citizen',   'Resident',          'PUBLIC', 'N/A',      1, NULL),
  ('Citizen Priti',       'PUBLIC-2024-0003','citizen',   'Resident',          'PUBLIC', 'N/A',      0, NULL),
  ('Citizen Mohan',       'PUBLIC-2024-0004','citizen',   'Resident',          'PUBLIC', 'N/A',      2, NULL)
) AS t(name, govt_id, employee_type, job_role, dept_code_ref, grade_band, streak_count, category)
ON CONFLICT (govt_id) DO NOTHING;

-- 3.5 Daily Scores (30 days per employee)
INSERT INTO daily_scores (id, employee_id, date, attendance_score, work_score, quality_score, fraud_penalty, total_score, tier, scoring_version)
SELECT
  gen_random_uuid(),
  e.id,
  NOW() - (s.day || ' days')::INTERVAL,
  CASE WHEN random() > 0.12 THEN 100.0 ELSE 0.0 END,
  CASE WHEN random() > 0.12 THEN 100.0 ELSE 0.0 END,
  ROUND((60.0 + random() * 38.0)::NUMERIC, 1),
  CASE WHEN random() < 0.04 THEN 50.0 ELSE 0.0 END,
  0, -- placeholder, updated below
  'Bronze',  -- placeholder, updated below
  '1.0'
FROM employees e
CROSS JOIN generate_series(1, 30) AS s(day);

-- Update total_score and tier
UPDATE daily_scores
SET
  total_score = GREATEST(0, LEAST(100, ROUND(((attendance_score * 0.3) + (quality_score * 0.4) + (work_score * 0.3) - fraud_penalty)::NUMERIC, 1))),
  tier = CASE
    WHEN GREATEST(0, LEAST(100, (attendance_score * 0.3) + (quality_score * 0.4) + (work_score * 0.3) - fraud_penalty)) >= 90 THEN 'Platinum'
    WHEN GREATEST(0, LEAST(100, (attendance_score * 0.3) + (quality_score * 0.4) + (work_score * 0.3) - fraud_penalty)) >= 80 THEN 'Gold'
    WHEN GREATEST(0, LEAST(100, (attendance_score * 0.3) + (quality_score * 0.4) + (work_score * 0.3) - fraud_penalty)) >= 60 THEN 'Silver'
    ELSE 'Bronze'
  END
WHERE scoring_version = '1.0';

-- 3.6 Monthly Scores
INSERT INTO monthly_scores (id, employee_id, month, year, total_score, avg_quality_score, reward_eligible, fraud_flag_count)
SELECT
  gen_random_uuid(),
  employee_id,
  EXTRACT(MONTH FROM NOW())::INTEGER,
  EXTRACT(YEAR  FROM NOW())::INTEGER,
  ROUND(AVG(total_score)::NUMERIC, 1),
  ROUND(AVG(quality_score)::NUMERIC, 1),
  (AVG(total_score) >= 80),
  COUNT(*) FILTER (WHERE fraud_penalty > 0)
FROM daily_scores
GROUP BY employee_id;

-- 3.7 Work Submissions (1 per employee, approved)
INSERT INTO work_submissions (id, employee_id, task_type, status, ai_confidence, ai_quality_score, fraud_risk_score, latitude, longitude, details)
SELECT
  gen_random_uuid(),
  e.id,
  CASE e.employee_type
    WHEN 'education'  THEN 'Lesson Plan Upload'
    WHEN 'healthcare' THEN 'OPD Log'
    WHEN 'police'     THEN 'Beat Patrol'
    WHEN 'admin'      THEN 'File Processed'
    WHEN 'citizen'    THEN 'Garbage Dump Report'
    ELSE 'General Submission'
  END,
  'approved',
  ROUND((0.7 + random() * 0.29)::NUMERIC, 3),
  (6 + FLOOR(random() * 4))::INTEGER,
  0.000,
  ROUND((28.5 + random() * 0.5)::NUMERIC, 6),
  ROUND((77.0 + random() * 0.5)::NUMERIC, 6),
  '{"note": "Submitted via GovTrack AI app"}'::JSONB
FROM employees e;

-- 3.8 One fraud-flagged submission
WITH new_sub AS (
  INSERT INTO work_submissions (id, employee_id, task_type, status, ai_confidence, ai_quality_score, fraud_risk_score, latitude, longitude)
  SELECT
    gen_random_uuid(),
    id, 'Suspicious Attendance Photo', 'review', 0.18, 2, 0.91, 28.612893, 77.229534
  FROM employees WHERE employee_type = 'education' LIMIT 1
  RETURNING id
)
INSERT INTO fraud_flags (id, submission_id, flag_type, risk_score, evidence, status)
SELECT
  gen_random_uuid(),
  new_sub.id,
  'low_confidence_spoof',
  0.910,
  '{"confidence": 0.18, "note": "AI detected possible image manipulation or recycled photo"}'::JSONB,
  'open'
FROM new_sub;

-- 3.9 Grievances (explicitly pass gen_random_uuid() to avoid null id)
INSERT INTO grievances (id, employee_id, category, description, status, resolution)
VALUES
  (
    gen_random_uuid(),
    (SELECT id FROM employees WHERE govt_id = 'EDU-2024-0001'),
    'scoring',
    'My attendance was marked absent on 5th March even though I checked in via the app. GPS was logged correctly. Requesting review of the daily score for that date.',
    'under_review',
    NULL
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM employees WHERE govt_id = 'HFW-2024-0001'),
    'rejection',
    'My OPD log for 12th March was rejected by the AI system as low quality. It was a valid digitally prepared record meeting all criteria. Requesting manual review.',
    'open',
    NULL
  ),
  (
    gen_random_uuid(),
    (SELECT id FROM employees WHERE govt_id = 'POL-2024-0001'),
    'other',
    'My beat patrol on 8th March was flagged for GPS anomaly. The discrepancy was due to poor GPS signal in the older part of the city, not fraudulent activity.',
    'resolved',
    'GPS anomaly confirmed as network interference in a low-connectivity area. The fraud flag has been dismissed and the original score has been restored.'
  );

-- 3.10 Feedback
INSERT INTO feedback (id, employee_id, source, rating, comment)
VALUES
  (gen_random_uuid(), (SELECT id FROM employees WHERE govt_id='EDU-2024-0001'), 'parent',  5, 'Excellent teacher, always prepared and engaged!'),
  (gen_random_uuid(), (SELECT id FROM employees WHERE govt_id='HFW-2024-0001'), 'patient', 4, 'Doctor was very professional and attended to us promptly.'),
  (gen_random_uuid(), (SELECT id FROM employees WHERE govt_id='POL-2024-0001'), 'citizen', 4, 'Police responded quickly and handled the situation well.'),
  (gen_random_uuid(), (SELECT id FROM employees WHERE govt_id='EDU-2024-0002'), 'parent',  3, 'Good teacher but could improve communication with parents.'),
  (gen_random_uuid(), (SELECT id FROM employees WHERE govt_id='HFW-2024-0002'), 'patient', 5, 'Specialist explained everything clearly. Very satisfied with the care.');

-- 3.11 Climate Adjustment (active heatwave)
INSERT INTO climate_adjustments (alert_type, region_id, start_date, end_date, weight_multiplier, allow_threshold_relaxation)
VALUES (
  'Heatwave',
  (SELECT id FROM zones WHERE name LIKE '%North%' LIMIT 1),
  NOW() - INTERVAL '2 days',
  NOW() + INTERVAL '5 days',
  0.85,
  TRUE
);

-- 3.12 Sample notifications
INSERT INTO notifications (id, employee_id, type, message, read)
SELECT
  gen_random_uuid(),
  id,
  'score_computed',
  'Your performance score for ' || TO_CHAR(NOW() - INTERVAL '1 day', 'DD Mon YYYY') || ' has been published.',
  FALSE
FROM employees WHERE employee_type NOT IN ('citizen');

-- =============================================================================
-- DONE
-- =============================================================================
-- Demo credentials (PIN "1234" for all):
-- Teacher    → EDU-2024-0001
-- Doctor     → HFW-2024-0001
-- Police     → POL-2024-0001
-- Supervisor → EDU-2024-0004
-- Admin      → ADMIN-2024-0004
-- Citizen    → PUBLIC-2024-0001
-- =============================================================================
