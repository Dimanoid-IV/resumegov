\set ON_ERROR_STOP on
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='service_role') THEN CREATE ROLE service_role; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='anon') THEN CREATE ROLE anon; END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname='authenticated') THEN CREATE ROLE authenticated; END IF;
END $$;
CREATE TABLE public.users (id uuid PRIMARY KEY, plan_type text, credits_remaining integer);
CREATE TABLE public.analyses (id uuid PRIMARY KEY, user_id uuid REFERENCES public.users(id));
CREATE TABLE public.optimizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(), analysis_id uuid REFERENCES public.analyses(id),
  compressed_resume_text text, final_word_count integer, qualification_coverage_percent numeric,
  ksa_text text, created_at timestamptz DEFAULT now()
);
\ir ../supabase/migrations/013_atomic_optimization_credits.sql
\ir ../supabase/migrations/013_atomic_optimization_credits.sql
INSERT INTO public.users VALUES
('03fc12f7-f4b1-4d4f-98aa-59d502870db5','basic',1),
('60b8e85b-8b3a-466d-a46c-c437ac346c41','free',3),
('bf0089a9-c018-4e10-b6c0-4c0bc0096ebc','pro',-1);
INSERT INTO public.analyses VALUES
('611a5715-38b7-49b5-a66c-38641c86e8c5','03fc12f7-f4b1-4d4f-98aa-59d502870db5'),
('633a5715-38b7-49b5-a66c-38641c86e8c5','03fc12f7-f4b1-4d4f-98aa-59d502870db5'),
('622a5715-38b7-49b5-a66c-38641c86e8c5','60b8e85b-8b3a-466d-a46c-c437ac346c41'),
('644a5715-38b7-49b5-a66c-38641c86e8c5','bf0089a9-c018-4e10-b6c0-4c0bc0096ebc');
DO $$
DECLARE
  buyer uuid := '03fc12f7-f4b1-4d4f-98aa-59d502870db5';
  other_user uuid := '60b8e85b-8b3a-466d-a46c-c437ac346c41';
  a uuid := '611a5715-38b7-49b5-a66c-38641c86e8c5';
  draft text := repeat('Preserved source evidence. ',20);
  result jsonb;
BEGIN
  result := public.save_optimization_and_charge(buyer,a,draft,60,75,'{}');
  IF result->>'reused' <> 'false' OR (SELECT credits_remaining FROM public.users WHERE id=buyer) <> 0 THEN
    RAISE EXCEPTION 'first draft must save and consume the last credit';
  END IF;
  result := public.save_optimization_and_charge(buyer,a,'Different concurrent draft. ' || draft,65,80,'{}');
  IF result->>'reused' <> 'true' OR result->>'compressed_resume_text' <> draft THEN
    RAISE EXCEPTION 'replay must return the saved draft and use no additional credit';
  END IF;
  BEGIN
    PERFORM public.save_optimization_and_charge(other_user,a,draft,60,75,'{}');
    RAISE EXCEPTION 'other user must not read or overwrite a cached optimization';
  EXCEPTION WHEN no_data_found THEN NULL;
  END;
  BEGIN
    PERFORM public.save_optimization_and_charge(buyer,'633a5715-38b7-49b5-a66c-38641c86e8c5',draft,60,75,'{}');
    RAISE EXCEPTION 'a second analysis must not spend an exhausted credit';
  EXCEPTION WHEN SQLSTATE 'P0001' THEN
    IF SQLERRM <> 'No optimization credits available' THEN RAISE; END IF;
  END;
  BEGIN
    PERFORM public.save_optimization_and_charge(other_user,'622a5715-38b7-49b5-a66c-38641c86e8c5',draft,60,75,'{}');
    RAISE EXCEPTION 'free analysis credits must not grant a paid optimization';
  EXCEPTION WHEN SQLSTATE 'P0001' THEN
    IF SQLERRM <> 'No optimization credits available' THEN RAISE; END IF;
  END;
  PERFORM public.save_optimization_and_charge('bf0089a9-c018-4e10-b6c0-4c0bc0096ebc','644a5715-38b7-49b5-a66c-38641c86e8c5',draft,60,75,'{}');
  IF (SELECT credits_remaining FROM public.users WHERE id='bf0089a9-c018-4e10-b6c0-4c0bc0096ebc') <> -1 THEN
    RAISE EXCEPTION 'unlimited balance must remain unlimited';
  END IF;
  IF (SELECT count(*) FROM public.optimizations) <> 2 THEN
    RAISE EXCEPTION 'only successful owned drafts may be persisted';
  END IF;
  IF has_function_privilege('authenticated','public.save_optimization_and_charge(uuid,uuid,text,integer,integer,text)','EXECUTE') THEN
    RAISE EXCEPTION 'clients must not be allowed to call paid fulfillment directly';
  END IF;
END $$;
