create table if not exists waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  problem text,
  created_at timestamptz not null default now()
);

alter table waitlist add column if not exists problem text;

alter table waitlist enable row level security;

create policy "anyone can join the waitlist"
  on waitlist for insert
  to anon
  with check (true);
