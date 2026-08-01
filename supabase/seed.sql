-- ============================================================================
-- SRMS: Seed data (local development only)
-- Run automatically by `supabase db reset`. Safe to re-run (idempotent).
-- ============================================================================

insert into public.departments (name, code, description) values
  ('Computer Science', 'CSC', 'Department of Computer Science'),
  ('Electrical Engineering', 'EEE', 'Department of Electrical & Electronic Engineering'),
  ('Business Administration', 'BAM', 'Department of Business Administration & Management'),
  ('Mass Communication', 'MCM', 'Department of Mass Communication'),
  ('Bursary', 'BUR', 'Finance & accounts department'),
  ('Registry', 'REG', 'Academic registry & records')
on conflict (name) do nothing;

insert into public.positions (title, description) values
  ('Lecturer I', 'Academic staff — Lecturer I'),
  ('Lecturer II', 'Academic staff — Lecturer II'),
  ('Chief Lecturer', 'Academic staff — Chief Lecturer'),
  ('Senior Lecturer', 'Academic staff — Senior Lecturer'),
  ('Technologist', 'Laboratory / workshop technologist'),
  ('Admin Officer', 'Administrative / non-academic officer'),
  ('Registrar', 'Head of registry'),
  ('Bursar', 'Head of bursary')
on conflict (title) do nothing;

-- Note: to create your first administrator, sign up normally through the
-- app (creates an auth.users + public.profiles row with role='staff'), then
-- promote the account by running:
--
--   update public.profiles set role = 'admin' where email = 'you@example.com';
