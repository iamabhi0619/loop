-- ============================================================================
-- Milaap - full schema for Supabase (fresh create)
--
-- Same 8 tables and columns as your current database, with the identity
-- columns corrected from varchar(24) to uuid so Supabase Auth user ids fit.
-- Adds RLS policies and the storage buckets the app expects.
--
-- Run in Supabase Dashboard -> SQL Editor.
--
-- If the existing tables already contain data you want to keep, use
-- supabase-auth-migration.sql instead. This file is for creating the
-- tables cleanly.
-- ============================================================================


-- ============================================================================
-- SECTION 0. Optional teardown
--
-- Uncomment ONLY if you are rebuilding from scratch. This destroys all
-- messages, chats, attachments and reactions.
-- ============================================================================
-- drop table if exists public.message_status cascade;
-- drop table if exists public.reactions       cascade;
-- drop table if exists public.attachments      cascade;
-- drop table if exists public.messages         cascade;
-- drop table if exists public.user_blocks      cascade;
-- drop table if exists public.chat_participants cascade;
-- drop table if exists public.chats            cascade;
-- drop table if exists public.users            cascade;


-- ============================================================================
-- SECTION 1. Tables
--
-- Ordering follows your dependency chain. Identity columns are uuid and
-- reference public.users(id), which in turn references auth.users(id).
-- ============================================================================

-- --------------------------------------------------------------------- users
-- One row per auth account. id is the Supabase Auth uuid.
create table public.users (
  id          uuid        not null,
  username    text        not null,
  avatar      text        null,
  status      text        null default 'offline'::text,
  last_seen   timestamp without time zone null default now(),
  updated_at  timestamp without time zone null default now(),
  name        text        null,
  constraint users_pkey primary key (id),
  constraint users_username_key unique (username),
  -- guarantees a public profile cannot exist without (or outlive) its
  -- auth account, and keeps id in sync with auth.uid()
  constraint users_id_fkey foreign key (id)
    references auth.users(id) on delete cascade
);

-- --------------------------------------------------------------------- chats
create table public.chats (
  id          uuid        not null default gen_random_uuid(),
  is_group    boolean     null default false,
  chat_name   text        null,
  chat_icon   text        null,
  created_by  uuid        null,
  pinned      boolean     null default false,
  created_at  timestamp without time zone null default now(),
  updated_at  timestamp without time zone null default now(),
  constraint chats_pkey primary key (id),
  constraint chats_created_by_fkey foreign key (created_by)
    references public.users(id) on delete cascade
);

create index if not exists idx_chat_updated_at
  on public.chats using btree (updated_at);
create index if not exists idx_chats_created_by
  on public.chats using btree (created_by);

-- -------------------------------------------------------- chat_participants
create table public.chat_participants (
  id            uuid        not null default gen_random_uuid(),
  chat_id       uuid        null,
  user_id       uuid        null,
  role          text        null default 'member'::text,
  joined_at     timestamp without time zone null default now(),
  muted         boolean     null default false,
  typing        boolean     null default false,
  unread_count  integer     null default 0,
  constraint chat_participants_pkey primary key (id),
  constraint chat_participants_chat_id_user_id_key unique (chat_id, user_id),
  constraint chat_participants_chat_id_fkey foreign key (chat_id)
    references public.chats(id) on delete cascade,
  constraint chat_participants_user_id_fkey foreign key (user_id)
    references public.users(id) on delete cascade
);

create index if not exists idx_chat_participants_chat_id
  on public.chat_participants using btree (chat_id);
create index if not exists idx_chat_participants_user_id
  on public.chat_participants using btree (user_id);

-- ----------------------------------------------------------------- messages
create table public.messages (
  id          uuid        not null default gen_random_uuid(),
  chat_id     uuid        null,
  sender_id   uuid        null,
  text        text        null,
  image_url   text        null,
  voice_url   text        null,
  reply_to    uuid        null,
  seen_by     uuid[]      null,
  edited      boolean     null default false,
  deleted     boolean     null default false,
  created_at  timestamp without time zone null default now(),
  constraint messages_pkey primary key (id),
  constraint messages_chat_id_fkey foreign key (chat_id)
    references public.chats(id) on delete cascade,
  constraint messages_reply_to_fkey foreign key (reply_to)
    references public.messages(id) on delete set null,
  constraint messages_sender_id_fkey foreign key (sender_id)
    references public.users(id) on delete cascade
);

create index if not exists idx_messages_chat_id
  on public.messages using btree (chat_id);
create index if not exists idx_messages_sender_id
  on public.messages using btree (sender_id);
-- supports the paginated history query: .eq(chat_id).order(created_at desc)
create index if not exists idx_messages_chat_id_created_at
  on public.messages using btree (chat_id, created_at desc);

-- -------------------------------------------------------------- attachments
-- Note: the old messages.attachments text column is intentionally omitted.
-- It duplicated this table and was never read by the app.
create table public.attachments (
  id          uuid        not null default gen_random_uuid(),
  message_id  uuid        null,
  file_url    text        not null,
  file_type   text        null,
  created_at  timestamp without time zone null default now(),
  file_name   text        null,
  constraint attachments_pkey primary key (id),
  constraint attachments_message_id_fkey foreign key (message_id)
    references public.messages(id) on delete cascade
);

create index if not exists idx_attachments_message_id
  on public.attachments using btree (message_id);

-- --------------------------------------------------------------- reactions
create table public.reactions (
  id          uuid        not null default gen_random_uuid(),
  message_id  uuid        null,
  user_id     uuid        null,
  emoji       text        not null,
  created_at  timestamp without time zone null default now(),
  constraint reactions_pkey primary key (id),
  constraint reactions_message_id_user_id_emoji_key
    unique (message_id, user_id, emoji),
  constraint reactions_message_id_fkey foreign key (message_id)
    references public.messages(id) on delete cascade,
  constraint reactions_user_id_fkey foreign key (user_id)
    references public.users(id) on delete cascade
);

create index if not exists idx_reactions_message_id
  on public.reactions using btree (message_id);

-- ---------------------------------------------------------- message_status
create table public.message_status (
  message_id  uuid        not null,
  user_id     uuid        not null,
  status      text        null default 'sent'::text,
  updated_at  timestamp without time zone null default now(),
  constraint message_status_pkey primary key (message_id, user_id),
  constraint message_status_message_id_fkey foreign key (message_id)
    references public.messages(id) on delete cascade,
  constraint message_status_user_id_fkey foreign key (user_id)
    references public.users(id) on delete cascade
);

-- ------------------------------------------------------------- user_blocks
create table public.user_blocks (
  id          uuid        not null default gen_random_uuid(),
  blocker_id  uuid        null,
  blocked_id  uuid        null,
  created_at  timestamp without time zone null default now(),
  constraint user_blocks_pkey primary key (id),
  constraint user_blocks_blocker_id_blocked_id_key
    unique (blocker_id, blocked_id),
  constraint user_blocks_blocker_id_fkey foreign key (blocker_id)
    references public.users(id) on delete cascade,
  constraint user_blocks_blocked_id_fkey foreign key (blocked_id)
    references public.users(id) on delete cascade
);

create index if not exists idx_user_blocks_blocker_id
  on public.user_blocks using btree (blocker_id);
create index if not exists idx_user_blocks_blocked_id
  on public.user_blocks using btree (blocked_id);


-- ============================================================================
-- SECTION 2. RLS helper functions
--
-- These are SECURITY DEFINER so they can read chat_participants without
-- recursing infinitely through that table's own RLS policy. search_path is
-- pinned to '' so the function body cannot be hijacked via search_path.
-- ============================================================================

-- is the given user a participant in the given chat?
create or replace function public.is_chat_participant(
  _chat_id uuid,
  _user_id uuid
)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.chat_participants cp
    where cp.chat_id = _chat_id
      and cp.user_id = _user_id
  );
$$;

-- convenience wrapper that defaults to the caller
create or replace function public.am_chat_participant(_chat_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_chat_participant(_chat_id, auth.uid());
$$;

-- can the caller see the chat that owns this message?
create or replace function public.can_read_message(_message_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.messages m
    where m.id = _message_id
      and public.is_chat_participant(m.chat_id, auth.uid())
  );
$$;


-- ============================================================================
-- SECTION 3. Row Level Security
--
-- Without this, anyone holding the anon key can read every message in the
-- database. Every table has RLS on and a default-deny posture.
-- ============================================================================

alter table public.users             enable row level security;
alter table public.chats             enable row level security;
alter table public.chat_participants enable row level security;
alter table public.messages          enable row level security;
alter table public.attachments       enable row level security;
alter table public.reactions         enable row level security;
alter table public.message_status    enable row level security;
alter table public.user_blocks       enable row level security;

-- --------------------------------------------------------------------- users
-- Authenticated users can read profiles: required for user search and for
-- rendering the other participant's name/avatar in the chat list.
-- Writes are restricted to your own row.
drop policy if exists "read profiles" on public.users;
create policy "read profiles" on public.users
  for select to authenticated
  using (true);

drop policy if exists "insert own profile" on public.users;
create policy "insert own profile" on public.users
  for insert to authenticated
  with check (id = auth.uid());

drop policy if exists "update own profile" on public.users;
create policy "update own profile" on public.users
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- --------------------------------------------------------------------- chats
drop policy if exists "read own chats" on public.chats;
create policy "read own chats" on public.chats
  for select to authenticated
  using (public.is_chat_participant(id, auth.uid()));

drop policy if exists "create chat" on public.chats;
create policy "create chat" on public.chats
  for insert to authenticated
  with check (created_by = auth.uid());

drop policy if exists "update own chats" on public.chats;
create policy "update own chats" on public.chats
  for update to authenticated
  using (public.is_chat_participant(id, auth.uid()));

drop policy if exists "delete own chats" on public.chats;
create policy "delete own chats" on public.chats
  for delete to authenticated
  using (created_by = auth.uid());

-- -------------------------------------------------------- chat_participants
drop policy if exists "read participants of own chats" on public.chat_participants;
create policy "read participants of own chats" on public.chat_participants
  for select to authenticated
  using (public.is_chat_participant(chat_id, auth.uid()));

-- the creator seeds the chat, then adds others; a user may add themselves
drop policy if exists "join chats" on public.chat_participants;
create policy "join chats" on public.chat_participants
  for insert to authenticated
  with check (
    user_id = auth.uid()
    or exists (
      select 1 from public.chats c
      where c.id = chat_id
        and c.created_by = auth.uid()
    )
  );

drop policy if exists "update own membership" on public.chat_participants;
create policy "update own membership" on public.chat_participants
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "leave chats" on public.chat_participants;
create policy "leave chats" on public.chat_participants
  for delete to authenticated
  using (user_id = auth.uid());

-- ----------------------------------------------------------------- messages
drop policy if exists "read messages in own chats" on public.messages;
create policy "read messages in own chats" on public.messages
  for select to authenticated
  using (public.is_chat_participant(chat_id, auth.uid()));

drop policy if exists "send messages" on public.messages;
create policy "send messages" on public.messages
  for insert to authenticated
  with check (
    sender_id = auth.uid()
    and public.is_chat_participant(chat_id, auth.uid())
  );

drop policy if exists "delete own messages" on public.messages;
create policy "delete own messages" on public.messages
  for delete to authenticated
  using (sender_id = auth.uid());

-- -------------------------------------------------------------- attachments
drop policy if exists "read attachments in own chats" on public.attachments;
create policy "read attachments in own chats" on public.attachments
  for select to authenticated
  using (public.can_read_message(message_id));

drop policy if exists "attach to own messages" on public.attachments;
create policy "attach to own messages" on public.attachments
  for insert to authenticated
  with check (
    exists (
      select 1 from public.messages m
      where m.id = message_id
        and m.sender_id = auth.uid()
    )
  );

-- --------------------------------------------------------------- reactions
drop policy if exists "read reactions in own chats" on public.reactions;
create policy "read reactions in own chats" on public.reactions
  for select to authenticated
  using (public.can_read_message(message_id));

drop policy if exists "react in own chats" on public.reactions;
create policy "react in own chats" on public.reactions
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and public.can_read_message(message_id)
  );

drop policy if exists "remove own reactions" on public.reactions;
create policy "remove own reactions" on public.reactions
  for delete to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------- message_status
drop policy if exists "read status in own chats" on public.message_status;
create policy "read status in own chats" on public.message_status
  for select to authenticated
  using (public.can_read_message(message_id));

drop policy if exists "update own status" on public.message_status;
create policy "update own status" on public.message_status
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and public.can_read_message(message_id)
  );

-- ------------------------------------------------------------- user_blocks
drop policy if exists "read own blocks" on public.user_blocks;
create policy "read own blocks" on public.user_blocks
  for select to authenticated
  using (blocker_id = auth.uid() or blocked_id = auth.uid());

drop policy if exists "manage own blocks" on public.user_blocks;
create policy "manage own blocks" on public.user_blocks
  for all to authenticated
  using (blocker_id = auth.uid())
  with check (blocker_id = auth.uid());


-- ============================================================================
-- SECTION 4. Grants
--
-- Default privileges cover tables created through the dashboard, but being
-- explicit keeps this script self-contained.
-- ============================================================================
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public
  to authenticated;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to authenticated, service_role;
grant execute on all functions in schema public to authenticated, service_role;


-- ============================================================================
-- SECTION 5. Storage buckets
--
-- The app uploads with the anon key while signed in and resolves files with
-- getPublicUrl, so these buckets must be public. Two buckets are referenced
-- in code: 'attachment' for message media, 'avatars' for profile pictures.
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('attachment', 'attachment', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "read attachment files" on storage.objects;
create policy "read attachment files" on storage.objects
  for select to public
  using (bucket_id = 'attachment');

drop policy if exists "read avatar files" on storage.objects;
create policy "read avatar files" on storage.objects
  for select to public
  using (bucket_id = 'avatars');

drop policy if exists "upload own attachment files" on storage.objects;
create policy "upload own attachment files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'attachment');

drop policy if exists "upload own avatar files" on storage.objects;
create policy "upload own avatar files" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars');

-- Uploads are keyed by a random filename (src/lib/cloudinary.ts builds
-- `${Date.now()}-${random}.${ext}`) with no owner tracking, so replace and
-- remove are intentionally not restricted per user. Tighten this if you
-- start storing an owner column.
drop policy if exists "modify avatar files" on storage.objects;
create policy "modify avatar files" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars');

drop policy if exists "delete avatar files" on storage.objects;
create policy "delete avatar files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars');

drop policy if exists "delete attachment files" on storage.objects;
create policy "delete attachment files" on storage.objects
  for delete to authenticated
  using (bucket_id = 'attachment');


-- ============================================================================
-- SECTION 6. Realtime
--
-- The app subscribes to INSERT on messages filtered by chat_id
-- (src/stores/message.ts, listenForNewMessages). The table must be in the
-- supabase_realtime publication for postgres_changes to deliver.
--
-- Note: RLS applies to realtime, and postgres_changes also needs
-- SELECT permission on the table. The Section 3 policies cover this.
-- ============================================================================
-- guard against re-running: adding an existing table raises a duplicate
-- object error, so add membership only when missing.
do $$
declare t text;
begin
  foreach t in array array['messages', 'chats'] loop
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = t
    ) then
      execute format(
        'alter publication supabase_realtime add table public.%I', t
      );
    end if;
  end loop;
end $$;


-- ============================================================================
-- SECTION 7. Optional: auto-create the profile row on signup
--
-- The app already upserts its own row from the client on login
-- (src/stores/userStore.ts). Enabling this trigger makes the row exist
-- immediately at signup, which removes the ordering problem of adding
-- yourself to a chat before your first sync. Uncomment to enable.
--
-- Note: username here must stay in sync with deriveUsername() in the app
-- (email local part + first 6 chars of the user id) to satisfy the unique
-- constraint on users.username.
-- ============================================================================
-- create or replace function public.handle_new_user()
-- returns trigger
-- language plpgsql
-- security definer
-- set search_path = ''
-- as $$
-- begin
--   insert into public.users (id, username, name, avatar, status, last_seen, updated_at)
--   values (
--     new.id,
--     coalesce(
--       nullif(new.raw_user_meta_data->>'username', ''),
--       regexp_replace(
--         split_part(coalesce(new.email, 'user'), '@', 1),
--         '[^a-z0-9._-]', '', 'g'
--       )
--     ) || '-' || left(new.id::text, 6),
--     coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email, ''), '@', 1)),
--     new.raw_user_meta_data->>'avatar_url',
--     'online',
--     now(),
--     now()
--   )
--   on conflict (id) do nothing;
--   return new;
-- end;
-- $$;
--
-- create trigger on_auth_user_created
--   after insert on auth.users
--   for each row execute function public.handle_new_user();


-- ============================================================================
-- After running this, set in Supabase -> Authentication -> URL Configuration:
--   Site URL:  http://localhost:3000
--   Redirect URLs: http://localhost:3000/**
-- ============================================================================
