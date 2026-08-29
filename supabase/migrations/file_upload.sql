alter table public.staff_documents
  add column submission_id uuid references public.staff_submissions (id) on delete cascade;

alter table public.staff_documents
  alter column staff_id drop not null;

create policy "staff_documents_select_own_submission"
  on public.staff_documents for select
  to authenticated
  using (
    submission_id in (select id from public.staff_submissions where submitted_by = auth.uid())
  );

create policy "staff_documents_insert_own_submission"
  on public.staff_documents for insert
  to authenticated
  with check (
    submission_id in (select id from public.staff_submissions where submitted_by = auth.uid())
  );

create policy "staff_documents_delete_own_submission"
  on public.staff_documents for delete
  to authenticated
  using (
    submission_id in (select id from public.staff_submissions where submitted_by = auth.uid())
  );