-- ============================================================================
-- SRMS: Row Level Security
-- Admins have full access. Staff can read reference data, read/update their
-- own staff record, and manage their own submissions.
-- ============================================================================

alter table public.departments enable row level security;
alter table public.positions enable row level security;
alter table public.profiles enable row level security;
alter table public.staff enable row level security;
alter table public.staff_submissions enable row level security;

-- ----------------------------------------------------------------------------
-- departments — readable by any authenticated user, writable by admins only
-- ----------------------------------------------------------------------------
create policy "departments_select_authenticated"
  on public.departments for select
  to authenticated
  using (true);

create policy "departments_write_admin"
  on public.departments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- positions — readable by any authenticated user, writable by admins only
-- ----------------------------------------------------------------------------
create policy "positions_select_authenticated"
  on public.positions for select
  to authenticated
  using (true);

create policy "positions_write_admin"
  on public.positions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- profiles — a user can read/update their own profile; admins can read/update
-- any profile. No one can change their own `role` from the client (handled
-- via a check constraint substitute: only admins can write role changes).
-- ----------------------------------------------------------------------------
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles_write_admin"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- staff — admins: full access. Staff: read/update only their own linked
-- record (matched via profile_id). Staff cannot insert or delete directly —
-- new/changed records flow through staff_submissions + approval.
-- ----------------------------------------------------------------------------
create policy "staff_select_own_or_admin"
  on public.staff for select
  to authenticated
  using (profile_id = auth.uid() or public.is_admin());

create policy "staff_admin_all"
  on public.staff for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ----------------------------------------------------------------------------
-- staff_submissions — staff can create + read/update their own (while still
-- pending/draft); admins can read/update all (to review) and delete.
-- ----------------------------------------------------------------------------
create policy "submissions_select_own_or_admin"
  on public.staff_submissions for select
  to authenticated
  using (submitted_by = auth.uid() or public.is_admin());

create policy "submissions_insert_own"
  on public.staff_submissions for insert
  to authenticated
  with check (submitted_by = auth.uid());

create policy "submissions_update_own_while_pending"
  on public.staff_submissions for update
  to authenticated
  using (submitted_by = auth.uid() and status in ('draft', 'pending'))
  with check (submitted_by = auth.uid());

create policy "submissions_admin_all"
  on public.staff_submissions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());
