-- Durable one-time lock for the existing-owner authorization endpoint.
-- This file is prepared locally only; do not apply without owner approval.

begin;

create table public.sarraf_admin_authorization_lock (
  lock_name text primary key check (lock_name = 'owner-promotion'),
  claim_token uuid not null,
  state text not null check (state in ('pending', 'complete')),
  created_at timestamptz not null default pg_catalog.now(),
  updated_at timestamptz not null default pg_catalog.now()
);

alter table public.sarraf_admin_authorization_lock enable row level security;
revoke all on table public.sarraf_admin_authorization_lock from public, anon, authenticated, service_role;

create function public.sarraf_claim_admin_authorization_lock_20261112(p_claim_token uuid)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog
as $$
begin
  insert into public.sarraf_admin_authorization_lock (lock_name, claim_token, state)
  values ('owner-promotion', p_claim_token, 'pending')
  on conflict (lock_name) do nothing;
  return found;
end;
$$;

create function public.sarraf_complete_admin_authorization_lock_20261112(p_claim_token uuid)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog
as $$
begin
  update public.sarraf_admin_authorization_lock
  set state = 'complete', updated_at = pg_catalog.now()
  where lock_name = 'owner-promotion'
    and claim_token = p_claim_token
    and state = 'pending';
  return found;
end;
$$;

create function public.sarraf_release_admin_authorization_lock_20261112(p_claim_token uuid)
returns boolean
language plpgsql
security definer
set search_path = pg_catalog
as $$
begin
  delete from public.sarraf_admin_authorization_lock
  where lock_name = 'owner-promotion'
    and claim_token = p_claim_token
    and state = 'pending';
  return found;
end;
$$;

revoke all on function public.sarraf_claim_admin_authorization_lock_20261112(uuid) from public, anon, authenticated;
revoke all on function public.sarraf_complete_admin_authorization_lock_20261112(uuid) from public, anon, authenticated;
revoke all on function public.sarraf_release_admin_authorization_lock_20261112(uuid) from public, anon, authenticated;
grant execute on function public.sarraf_claim_admin_authorization_lock_20261112(uuid) to service_role;
grant execute on function public.sarraf_complete_admin_authorization_lock_20261112(uuid) to service_role;
grant execute on function public.sarraf_release_admin_authorization_lock_20261112(uuid) to service_role;

commit;
