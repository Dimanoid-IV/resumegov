BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '30s';
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint c JOIN pg_attribute a
      ON a.attrelid=c.conrelid AND a.attname='analysis_id'
    WHERE c.conrelid='public.optimizations'::regclass AND c.contype='u'
      AND c.conkey=ARRAY[a.attnum]::smallint[]
  ) THEN
    ALTER TABLE public.optimizations ADD CONSTRAINT optimizations_analysis_id_key UNIQUE (analysis_id);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.save_optimization_and_charge(
  p_user_id uuid, p_analysis_id uuid, p_text text,
  p_word_count integer, p_coverage integer, p_details text
)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path=''
AS $$
DECLARE
  profile public.users%ROWTYPE;
  saved public.optimizations%ROWTYPE;
BEGIN
  -- Serialize all credit spending for this user, including concurrent analyses.
  SELECT * INTO profile FROM public.users WHERE id=p_user_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'User not found' USING ERRCODE='P0002'; END IF;

  PERFORM 1 FROM public.analyses WHERE id=p_analysis_id AND user_id=p_user_id FOR SHARE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Analysis not found' USING ERRCODE='P0002'; END IF;

  SELECT * INTO saved FROM public.optimizations WHERE analysis_id=p_analysis_id;
  IF FOUND THEN RETURN to_jsonb(saved) || jsonb_build_object('reused',true); END IF;

  IF profile.plan_type NOT IN ('basic','pro','enterprise')
    OR profile.plan_type IS NULL
    OR profile.credits_remaining IS NULL
    OR (profile.credits_remaining <> -1 AND profile.credits_remaining <= 0) THEN
    RAISE EXCEPTION 'No optimization credits available' USING ERRCODE='P0001';
  END IF;
  IF p_text IS NULL OR length(trim(p_text)) < 200
    OR p_word_count IS NULL OR p_word_count <= 0
    OR p_coverage IS NULL OR p_coverage < 0 OR p_coverage > 100 THEN
    RAISE EXCEPTION 'Invalid optimization result' USING ERRCODE='22023';
  END IF;

  INSERT INTO public.optimizations (
    analysis_id,compressed_resume_text,final_word_count,qualification_coverage_percent,ksa_text
  ) VALUES (p_analysis_id,p_text,p_word_count,p_coverage,p_details)
  RETURNING * INTO saved;

  IF profile.credits_remaining > 0 THEN
    UPDATE public.users SET credits_remaining=credits_remaining-1 WHERE id=p_user_id;
  END IF;
  RETURN to_jsonb(saved) || jsonb_build_object('reused',false);
END $$;
REVOKE ALL ON FUNCTION public.save_optimization_and_charge(uuid,uuid,text,integer,integer,text) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.save_optimization_and_charge(uuid,uuid,text,integer,integer,text) TO service_role;
COMMIT;
