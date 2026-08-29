-- New table: one row per uploaded document
create table public.staff_documents (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff (id) on delete cascade,
  uploaded_by uuid references public.profiles (id) on delete set null,
  document_type text not null default 'Other',
  file_name text not null,
  file_path text not null,
  file_size bigint,
  created_at timestamptz not null default now()
);

create index staff_documents_staff_id_idx on public.staff_documents (staff_id);

alter table public.staff_documents enable row level security;

-- Admins see/manage everything; staff see/manage only documents on their own linked staff record
create policy "staff_documents_select_own_or_admin"
  on public.staff_documents for select
  to authenticated
  using (
    public.is_admin()
    or staff_id in (select id from public.staff where profile_id = auth.uid())
  );

create policy "staff_documents_insert_own_or_admin"
  on public.staff_documents for insert
  to authenticated
  with check (
    public.is_admin()
    or staff_id in (select id from public.staff where profile_id = auth.uid())
  );

create policy "staff_documents_delete_own_or_admin"
  on public.staff_documents for delete
  to authenticated
  using (
    public.is_admin()
    or staff_id in (select id from public.staff where profile_id = auth.uid())
  );

-- Private storage bucket (unlike the public photos bucket — documents are sensitive)
insert into storage.buckets (id, name, public)
values ('staff-documents', 'staff-documents', false)
on conflict (id) do nothing;

create policy "staff_documents_storage_select"
on storage.objects for select
to authenticated
using (bucket_id = 'staff-documents');

create policy "staff_documents_storage_insert"
on storage.objects for insert
to authenticated
with check (bucket_id = 'staff-documents');

create policy "staff_documents_storage_delete"
on storage.objects for delete
to authenticated
using (bucket_id = 'staff-documents');