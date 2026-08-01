-- ============================================================================
-- SRMS: Functions & triggers
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Generic updated_at trigger
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.departments
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.positions
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.staff
  for each row execute function public.set_updated_at();

create trigger set_updated_at before update on public.staff_submissions
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Auto-create a profile row whenever a new auth.users row is inserted.
-- Role defaults to 'staff'; promote to 'admin' manually via SQL or an
-- admin-only route once the first administrator account exists.
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::public.app_role, 'staff')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- Helper: is the current user an admin? Used throughout RLS policies.
-- SECURITY DEFINER + fixed search_path avoids recursive RLS checks on
-- public.profiles when this function is called from a profiles policy.
-- ----------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ----------------------------------------------------------------------------
-- On submission approval, upsert the payload into the staff table and stamp
-- reviewed_at. Called from application code (service role) after an admin
-- approves — kept here as a reusable RPC so it can also be called directly.
-- ----------------------------------------------------------------------------
create or replace function public.approve_staff_submission(
  submission_id uuid,
  reviewer_id uuid,
  notes text default null
)
returns public.staff
language plpgsql
security definer set search_path = public
as $$
declare
  sub public.staff_submissions;
  result public.staff;
begin
  select * into sub from public.staff_submissions where id = submission_id;

  if sub is null then
    raise exception 'Submission % not found', submission_id;
  end if;

  if sub.staff_id is null then
    -- New staff record
    insert into public.staff (
      staff_id, first_name, last_name, other_names, email, phone,
      date_of_birth, gender, address, department_id, position_id,
      employment_status, date_employed, photo_url, profile_id, created_by
    )
    select
      (sub.payload ->> 'staff_id'),
      (sub.payload ->> 'first_name'),
      (sub.payload ->> 'last_name'),
      (sub.payload ->> 'other_names'),
      (sub.payload ->> 'email'),
      (sub.payload ->> 'phone'),
      nullif(sub.payload ->> 'date_of_birth', '')::date,
      (sub.payload ->> 'gender'),
      (sub.payload ->> 'address'),
      nullif(sub.payload ->> 'department_id', '')::uuid,
      nullif(sub.payload ->> 'position_id', '')::uuid,
      coalesce((sub.payload ->> 'employment_status')::public.employment_status, 'active'),
      nullif(sub.payload ->> 'date_employed', '')::date,
      (sub.payload ->> 'photo_url'),
      sub.submitted_by,
      sub.submitted_by
    returning * into result;

    update public.staff_submissions
      set staff_id = result.id
      where id = submission_id;
  else
    -- Edit to an existing staff record: merge payload keys that are present
    update public.staff s
      set
        first_name = coalesce(sub.payload ->> 'first_name', s.first_name),
        last_name = coalesce(sub.payload ->> 'last_name', s.last_name),
        other_names = coalesce(sub.payload ->> 'other_names', s.other_names),
        phone = coalesce(sub.payload ->> 'phone', s.phone),
        address = coalesce(sub.payload ->> 'address', s.address),
        department_id = coalesce(nullif(sub.payload ->> 'department_id', '')::uuid, s.department_id),
        position_id = coalesce(nullif(sub.payload ->> 'position_id', '')::uuid, s.position_id),
        photo_url = coalesce(sub.payload ->> 'photo_url', s.photo_url)
      where s.id = sub.staff_id
      returning * into result;
  end if;

  update public.staff_submissions
    set status = 'approved',
        reviewed_by = reviewer_id,
        reviewed_at = now(),
        review_notes = notes
    where id = submission_id;

  return result;
end;
$$;
