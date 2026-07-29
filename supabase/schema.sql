-- Education Institute Management System
-- Safe to run in the Supabase SQL Editor against the supplied tables.
-- It creates missing objects and replaces the relevant functions and policies.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text check (role in ('admin', 'teacher', 'student')) not null default 'student',
  created_at timestamp with time zone default now()
);

alter table public.profiles
  add column if not exists is_approved boolean not null default true;

create table if not exists public.modules (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  credits int not null default 3,
  teacher_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists modules_teacher_id_idx on public.modules(teacher_id);
create index if not exists profiles_role_idx on public.profiles(role);

-- Public signup may create students or pending teachers, never administrators.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data ->> 'role', 'student');
begin
  if requested_role not in ('student', 'teacher') then
    requested_role := 'student';
  end if;

  insert into public.profiles (id, email, full_name, role, is_approved)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    requested_role,
    requested_role <> 'teacher'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- SECURITY DEFINER helpers avoid recursive RLS checks inside profile policies.
create or replace function public.current_user_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_user_is_approved()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(is_approved, false) from public.profiles where id = auth.uid();
$$;

alter table public.profiles enable row level security;
alter table public.modules enable row level security;

-- Remove policies from the original pasted query and earlier project revisions.
drop policy if exists "Profiles are viewable by authenticated users" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Admins can insert profiles" on public.profiles;
drop policy if exists "Admins can delete profiles" on public.profiles;
drop policy if exists "Users see self, teachers, and admins see all profiles" on public.profiles;
drop policy if exists "Admins update profiles" on public.profiles;

create policy "Profiles are viewable by authenticated users"
on public.profiles for select to authenticated
using (true);

-- A user may edit their own ordinary fields, but cannot change role/approval.
create policy "Users can safely update their own profile"
on public.profiles for update to authenticated
using (id = auth.uid())
with check (
  id = auth.uid()
  and role = public.current_user_role()
  and is_approved = public.current_user_is_approved()
);

create policy "Admins can update profiles"
on public.profiles for update to authenticated
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "Admins can insert profiles"
on public.profiles for insert to authenticated
with check (public.current_user_role() = 'admin');

create policy "Admins can delete profiles"
on public.profiles for delete to authenticated
using (public.current_user_role() = 'admin');

drop policy if exists "Modules are viewable by authenticated users" on public.modules;
drop policy if exists "Admins and teachers can insert modules" on public.modules;
drop policy if exists "Admins can update any module, teachers their own" on public.modules;
drop policy if exists "Admins can delete any module, teachers their own" on public.modules;
drop policy if exists "Authenticated users read modules" on public.modules;
drop policy if exists "Admins and approved teachers create modules" on public.modules;
drop policy if exists "Admins and assigned teachers update modules" on public.modules;
drop policy if exists "Admins and assigned teachers delete modules" on public.modules;

create policy "Modules are viewable by authenticated users"
on public.modules for select to authenticated
using (true);

create policy "Admins and approved teachers can insert modules"
on public.modules for insert to authenticated
with check (
  public.current_user_role() = 'admin'
  or (
    public.current_user_role() = 'teacher'
    and public.current_user_is_approved()
    and teacher_id = auth.uid()
  )
);

create policy "Admins update any module, teachers their own"
on public.modules for update to authenticated
using (
  public.current_user_role() = 'admin'
  or (
    public.current_user_role() = 'teacher'
    and public.current_user_is_approved()
    and teacher_id = auth.uid()
  )
)
with check (
  public.current_user_role() = 'admin'
  or (
    public.current_user_role() = 'teacher'
    and public.current_user_is_approved()
    and teacher_id = auth.uid()
  )
);

create policy "Admins delete any module, teachers their own"
on public.modules for delete to authenticated
using (
  public.current_user_role() = 'admin'
  or (
    public.current_user_role() = 'teacher'
    and public.current_user_is_approved()
    and teacher_id = auth.uid()
  )
);

-- Run once after public signup to bootstrap the first administrator:
-- update public.profiles set role = 'admin', is_approved = true
-- where email = 'your-admin@example.com';
