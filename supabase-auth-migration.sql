-- ============================================================================
-- Milaap: widen identity columns from varchar(24) (Mongo ObjectId) -> uuid
--          so Supabase Auth UUIDs fit.
--
-- This does NOT recreate any table. All 8 tables, all columns, all indexes
-- and all constraints are preserved in place. Only the TYPE of 9 identity
-- columns changes, plus the FKs that span them are dropped and restored.
--
-- Run in Supabase Dashboard -> SQL Editor.
-- Review STEP 2 (destructive) before executing.
-- ============================================================================

begin;

-- ----------------------------------------------------------------------------
-- STEP 1. Drop the 8 foreign keys that connect child tables to users(id).
--
--         These must go before the retype: Postgres will not change the type
--         of a column that participates in a foreign key, and every one of
--         these FKs spans two columns we are changing (both sides).
--
--         Only FKs are dropped here. The btree indexes on these columns
--         (idx_messages_sender_id, idx_chat_participants_user_id,
--         idx_user_blocks_blocker_id, idx_user_blocks_blocked_id) and the
--         unique constraints (chat_participants_chat_id_user_id_key,
--         reactions_message_id_user_id_emoji_key,
--         user_blocks_blocker_id_blocked_id_key,
--         message_status_pkey) are rebuilt automatically by STEP 3.
-- ----------------------------------------------------------------------------
alter table public.chat_participants drop constraint if exists chat_participants_user_id_fkey;
alter table public.messages           drop constraint if exists messages_sender_id_fkey;
alter table public.chats               drop constraint if exists chats_created_by_fkey;
alter table public.reactions           drop constraint if exists reactions_user_id_fkey;
alter table public.message_status      drop constraint if exists message_status_user_id_fkey;
alter table public.user_blocks         drop constraint if exists user_blocks_blocker_id_fkey;
alter table public.user_blocks         drop constraint if exists user_blocks_blocked_id_fkey;

-- ----------------------------------------------------------------------------
-- STEP 2. DATA GATE  *** DESTRUCTIVE - REVIEW FIRST ***
--
--   Your database still holds legacy MongoDB data:
--     messages             88 rows
--     chat_participants     6 rows
--     attachments          13 rows
--   referencing three 24-char ObjectIds:
--     68285f1e7906952f5ceb0645
--     686cd4d35c767bdc2753d959
--     6918ca457eec8e2a9c5ba49d
--
--   Those cannot cast to uuid ('68285f1e...'::uuid is invalid), so STEP 3
--   aborts while they exist. Supabase Auth can never mint these values, so
--   the app cannot reach this data after the migration regardless.
--
--   >>> To KEEP this history instead: each person must first create a Supabase
--   >>> auth account, then retarget their rows (see footer) and skip the
--   >>> deletes for those users. Do that BEFORE running this script.
-- ----------------------------------------------------------------------------
delete from public.attachments
  where message_id in (select id from public.messages);
delete from public.message_status
  where message_id in (select id from public.messages)
     or user_id is not null;
delete from public.reactions
  where message_id in (select id from public.messages);
delete from public.messages;
delete from public.chat_participants;
delete from public.chats;
delete from public.user_blocks;
delete from public.users;

-- ----------------------------------------------------------------------------
-- STEP 3. Widen the 9 identity columns to uuid.
--
--   Scalar (8):  users.id, chat_participants.user_id, messages.sender_id,
--                chats.created_by, reactions.user_id, message_status.user_id,
--                user_blocks.blocker_id, user_blocks.blocked_id
--   Array  (1):  messages.seen_by  -> uuid[]
--
--   seen_by is cleared rather than cast: it is varchar(24)[] and the app
--   never writes it, so there is nothing to preserve.
-- ----------------------------------------------------------------------------
alter table public.users
  alter column id type uuid using id::uuid;

alter table public.chat_participants
  alter column user_id type uuid using user_id::uuid;

alter table public.messages
  alter column sender_id type uuid using sender_id::uuid;

alter table public.chats
  alter column created_by type uuid using created_by::uuid;

alter table public.reactions
  alter column user_id type uuid using user_id::uuid;

alter table public.message_status
  alter column user_id type uuid using user_id::uuid;

alter table public.user_blocks
  alter column blocker_id type uuid using blocker_id::uuid,
  alter column blocked_id  type uuid using blocked_id::uuid;

alter table public.messages
  alter column seen_by type uuid[] using null::uuid[];

-- ----------------------------------------------------------------------------
-- STEP 4. Restore the foreign keys, with your original constraint names and
--         your original ON DELETE behaviour.
--
--   Added: users.id -> auth.users(id) on delete cascade, so a public.users
--   row can never outlive its auth account. This is what guarantees
--   public.users.id always equals auth.uid().
-- ----------------------------------------------------------------------------
alter table public.users
  add constraint users_id_fkey
  foreign key (id) references auth.users(id) on delete cascade;

alter table public.chat_participants
  add constraint chat_participants_user_id_fkey
  foreign key (user_id) references public.users(id) on delete cascade;

alter table public.messages
  add constraint messages_sender_id_fkey
  foreign key (sender_id) references public.users(id) on delete cascade;

alter table public.chats
  add constraint chats_created_by_fkey
  foreign key (created_by) references public.users(id) on delete cascade;

alter table public.reactions
  add constraint reactions_user_id_fkey
  foreign key (user_id) references public.users(id) on delete cascade;

alter table public.message_status
  add constraint message_status_user_id_fkey
  foreign key (user_id) references public.users(id) on delete cascade;

alter table public.user_blocks
  add constraint user_blocks_blocker_id_fkey
  foreign key (blocker_id) references public.users(id) on delete cascade,
  add constraint user_blocks_blocked_id_fkey
  foreign key (blocked_id) references public.users(id) on delete cascade;

commit;

-- ============================================================================
-- STEP 5. RLS POLICY REWRITES  (run after the above succeeds)
--
-- Postgres will NOT auto-convert policies, and this fails SILENTLY rather
-- than loudly: `auth.uid()::text = user_id` resolves fine against varchar,
-- but against a uuid column `text = uuid` has no operator, so the policy
-- starts matching zero rows. Symptom is "logged in but empty chat list".
--
-- Dump what you currently have:
--
--   select tablename, policyname, cmd, qual, with_check
--   from pg_policies
--   where schemaname = 'public'
--   order by tablename, policyname;
--
-- Then in every policy that touches id / user_id / sender_id / created_by /
-- blocker_id / blocked_id, drop the ::text cast:
--
--   auth.uid()::text = user_id     ->     auth.uid() = user_id
--
-- Policies that compare text-to-text (e.g. username) are unaffected.
-- ============================================================================
--
-- Preserving history instead of deleting (STEP 2)
--   The three ObjectIds are listed above. If those people should keep their
--   messages, have each create a Supabase auth account, then point their rows
--   at the new ids before running this script:
--
--     update public.users set id = :new_uuid where id = '68285f1e7906952f5ceb0645';
--
--   The FKs added in STEP 4 then cascade to chat_participants.user_id,
--   messages.sender_id, user_blocks, reactions and message_status.
-- ============================================================================