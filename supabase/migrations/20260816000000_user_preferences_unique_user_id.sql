-- =============================================================================
-- user_preferences: enforce one row per user
-- =============================================================================
-- 20260812000000_initial_schema.sql creates user_preferences with a surrogate
-- `id` PRIMARY KEY and a bare `user_id UUID REFERENCES profiles(id)` — nothing
-- makes user_id unique. Two things already assume it is:
--
--   * handle_new_user() (the on_profile_created trigger) seeds exactly one
--     preferences row per profile.
--   * src/pages/Index.tsx reads preferences with .maybeSingle(), which errors
--     if more than one row matches.
--
-- Commit 8d91894 fixed the client side of the 42P10 (Onboarding.tsx now does a
-- read-then-update/insert instead of .upsert({ onConflict: 'user_id' })) but
-- the constraint it described was never written, so the 1:1 invariant stayed
-- unenforced. This adds it.
--
-- ADD CONSTRAINT fails if duplicates exist. To check before applying:
--
--   SELECT user_id, count(*)
--   FROM public.user_preferences
--   GROUP BY user_id
--   HAVING count(*) > 1;
--
-- Duplicates are not expected — every write path that could have created them
-- raised 42P10 and never inserted — but the query is cheap.
-- =============================================================================

ALTER TABLE public.user_preferences
  ADD CONSTRAINT user_preferences_user_id_key UNIQUE (user_id);
