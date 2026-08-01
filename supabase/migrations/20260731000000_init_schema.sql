-- ============================================================================
-- SRMS: Initial schema
-- Enums, core tables (departments, positions, profiles, staff, submissions)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type public.app_role as enum ('admin', 'staff');

create type public.employment_status as enum (
  'active',
  'on_leave',
  'suspended',
  'retired',
  'terminated'
);

create type public.submission_status as enum (
  'draft',
  'pending',
  'approved',
  'rejected'
);

-- ----------------------------------------------------------------------------
-- departments
-- ----------------------------------------------------------------------------
create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  code text unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.departments is 'Academic / administrative departments within the polytechnic.';

-- ----------------------------------------------------------------------------
-- positions (job titles / ranks)
-- ----------------------------------------------------------------------------
create table public.positions (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.positions is 'Job titles / ranks that can be assigned to staff.';

-- ----------------------------------------------------------------------------
-- profiles (1:1 with auth.users) — holds role + basic identity
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  role public.app_role not null default 'staff',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Extends auth.users with app-specific profile data and role.';

-- ----------------------------------------------------------------------------
-- staff (the record being managed)
-- ----------------------------------------------------------------------------
create table public.staff (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete set null,
  staff_id text not null unique, -- human-readable staff/employee number
  first_name text not null,
  last_name text not null,
  other_names text,
  email text not null unique,
  phone text,
  date_of_birth date,
  gender text,
  address text,
  department_id uuid references public.departments (id) on delete set null,
  position_id uuid references public.positions (id) on delete set null,
  employment_status public.employment_status not null default 'active',
  date_employed date,
  photo_url text,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.staff is 'Core staff record. One row per staff member.';

create index staff_department_id_idx on public.staff (department_id);
create index staff_position_id_idx on public.staff (position_id);
create index staff_profile_id_idx on public.staff (profile_id);
create index staff_full_text_idx on public.staff
  using gin (
    to_tsvector(
      'english',
      coalesce(first_name, '') || ' ' || coalesce(last_name, '') || ' ' ||
      coalesce(staff_id, '') || ' ' || coalesce(email, '')
    )
  );

-- ----------------------------------------------------------------------------
-- staff_submissions — an approval-workflow envelope around proposed changes
-- to a staff record (either a new record or an edit to an existing one).
-- ----------------------------------------------------------------------------
create table public.staff_submissions (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references public.staff (id) on delete cascade,
  submitted_by uuid not null references public.profiles (id) on delete cascade,
  reviewed_by uuid references public.profiles (id) on delete set null,
  status public.submission_status not null default 'pending',
  payload jsonb not null, -- proposed staff fields (new or changed)
  review_notes text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.staff_submissions is 'Tracks staff-submitted records/changes awaiting admin approval.';

create index staff_submissions_status_idx on public.staff_submissions (status);
create index staff_submissions_submitted_by_idx on public.staff_submissions (submitted_by);
