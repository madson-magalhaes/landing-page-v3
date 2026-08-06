-- ============================================================================
-- SCHEMA V3: Setup Completo (Zero-Based)
-- ============================================================================
-- Rode isto em: https://app.supabase.com/project/pyagqbqzyksbiutkeyzk/sql/new
-- Tudo do zero: tabela + RPCs + índices

DO $MAIN$
DECLARE
  v_schema TEXT := 'schema_v3';
BEGIN
  -- ====================================================================
  -- 1. Criar schema
  -- ====================================================================
  EXECUTE format('CREATE SCHEMA IF NOT EXISTS %I', v_schema);
  RAISE NOTICE 'Schema %I criado/já existe', v_schema;

  -- ====================================================================
  -- 2. Criar tabela cliques_landing (rastreamento bruto)
  -- ====================================================================
  EXECUTE format($f$
    CREATE TABLE IF NOT EXISTS %I.cliques_landing (
      id                 BIGSERIAL PRIMARY KEY,
      created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
      ref_id             VARCHAR(100) UNIQUE NOT NULL,
      evento_type        VARCHAR(20) NOT NULL DEFAULT 'pageview',
      fbc                TEXT,
      fbp                TEXT,
      fbclid             TEXT,
      utm_source         TEXT,
      utm_medium         TEXT,
      utm_campaign       TEXT,
      utm_content        TEXT,
      utm_term           TEXT,
      utm_id             TEXT,
      user_agent         TEXT,
      client_ip          TEXT,
      landing_url        TEXT,
      clicou_wpp_at      TIMESTAMPTZ,
      session_id         VARCHAR(255),
      telefone           VARCHAR(50),
      matched_at         TIMESTAMPTZ,
      match_metodo       VARCHAR(20)
    )
  $f$, v_schema);
  RAISE NOTICE 'Tabela cliques_landing criada/já existe';

  -- ====================================================================
  -- 3. Criar índices para performance
  -- ====================================================================
  EXECUTE format(
    'CREATE INDEX IF NOT EXISTS idx_cliques_landing_ref ON %I.cliques_landing (ref_id)',
    v_schema);
  RAISE NOTICE 'Índice ref_id criado';

  EXECUTE format(
    'CREATE INDEX IF NOT EXISTS idx_cliques_landing_evento ON %I.cliques_landing (evento_type, created_at DESC)',
    v_schema);
  RAISE NOTICE 'Índice evento_type criado';

  EXECUTE format(
    'CREATE INDEX IF NOT EXISTS idx_cliques_landing_clique ON %I.cliques_landing (created_at DESC) WHERE clicou_wpp_at IS NOT NULL',
    v_schema);
  RAISE NOTICE 'Índice cliques criado';

  -- ====================================================================
  -- 4. RPC: registrar_pageview_landing
  -- ====================================================================
  EXECUTE format($f$
    CREATE OR REPLACE FUNCTION %I.registrar_pageview_landing(
      p_ref_id TEXT,
      p_fbc TEXT DEFAULT NULL,
      p_fbp TEXT DEFAULT NULL,
      p_fbclid TEXT DEFAULT NULL,
      p_utm_source TEXT DEFAULT NULL,
      p_utm_medium TEXT DEFAULT NULL,
      p_utm_campaign TEXT DEFAULT NULL,
      p_utm_content TEXT DEFAULT NULL,
      p_utm_term TEXT DEFAULT NULL,
      p_utm_id TEXT DEFAULT NULL,
      p_landing_url TEXT DEFAULT NULL,
      p_user_agent TEXT DEFAULT NULL,
      p_client_ip TEXT DEFAULT NULL
    )
    RETURNS VOID AS $FUNC$
    BEGIN
      INSERT INTO %I.cliques_landing
        (ref_id, evento_type, fbc, fbp, fbclid, utm_source, utm_medium, utm_campaign, utm_content, utm_term, utm_id, landing_url, user_agent, client_ip)
      VALUES
        (p_ref_id, 'pageview', p_fbc, p_fbp, p_fbclid, p_utm_source, p_utm_medium, p_utm_campaign, p_utm_content, p_utm_term, p_utm_id, p_landing_url, p_user_agent, p_client_ip)
      ON CONFLICT (ref_id) DO UPDATE SET
        fbc = COALESCE(EXCLUDED.fbc, cliques_landing.fbc),
        fbp = COALESCE(EXCLUDED.fbp, cliques_landing.fbp),
        fbclid = COALESCE(EXCLUDED.fbclid, cliques_landing.fbclid),
        utm_source = COALESCE(EXCLUDED.utm_source, cliques_landing.utm_source),
        utm_campaign = COALESCE(EXCLUDED.utm_campaign, cliques_landing.utm_campaign),
        landing_url = COALESCE(EXCLUDED.landing_url, cliques_landing.landing_url);
    END;
    $FUNC$ LANGUAGE plpgsql;
  $f$, v_schema, v_schema);
  RAISE NOTICE 'RPC registrar_pageview_landing criada';

  -- ====================================================================
  -- 5. RPC: registrar_clique_wpp_landing
  -- ====================================================================
  EXECUTE format($f$
    CREATE OR REPLACE FUNCTION %I.registrar_clique_wpp_landing(
      p_ref_id TEXT,
      p_fbc TEXT DEFAULT NULL,
      p_fbp TEXT DEFAULT NULL
    )
    RETURNS VOID AS $FUNC$
    BEGIN
      UPDATE %I.cliques_landing
      SET
        clicou_wpp_at = now(),
        fbc = COALESCE(p_fbc, fbc),
        fbp = COALESCE(p_fbp, fbp),
        evento_type = 'clique'
      WHERE ref_id = p_ref_id;
    END;
    $FUNC$ LANGUAGE plpgsql;
  $f$, v_schema, v_schema);
  RAISE NOTICE 'RPC registrar_clique_wpp_landing criada';

  -- ====================================================================
  -- 6. RPC: buscar_clique_orfao (para n8n matching)
  -- ====================================================================
  EXECUTE format($f$
    CREATE OR REPLACE FUNCTION %I.buscar_clique_orfao(
      p_telefone TEXT,
      p_minutos_atras INT DEFAULT 15
    )
    RETURNS TABLE (
      ref_id TEXT,
      fbclid TEXT,
      fbc TEXT,
      fbp TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_content TEXT,
      utm_term TEXT,
      utm_id TEXT,
      fbclid_existe BOOLEAN,
      created_at TIMESTAMPTZ
    ) AS $FUNC$
    BEGIN
      RETURN QUERY
      SELECT
        cl.ref_id,
        cl.fbclid,
        cl.fbc,
        cl.fbp,
        cl.utm_source,
        cl.utm_medium,
        cl.utm_campaign,
        cl.utm_content,
        cl.utm_term,
        cl.utm_id,
        (cl.fbclid IS NOT NULL) as fbclid_existe,
        cl.created_at
      FROM %I.cliques_landing cl
      WHERE
        cl.clicou_wpp_at IS NOT NULL
        AND cl.session_id IS NULL
        AND cl.telefone IS NULL
        AND cl.created_at >= NOW() - (p_minutos_atras || ' minutes')::INTERVAL
      ORDER BY cl.created_at DESC
      LIMIT 1;
    END;
    $FUNC$ LANGUAGE plpgsql;
  $f$, v_schema, v_schema);
  RAISE NOTICE 'RPC buscar_clique_orfao criada';

  -- ====================================================================
  -- 7. RPC: registrar_match_clique (para n8n)
  -- ====================================================================
  EXECUTE format($f$
    CREATE OR REPLACE FUNCTION %I.registrar_match_clique(
      p_ref_id TEXT,
      p_telefone TEXT,
      p_session_id TEXT
    )
    RETURNS TABLE (
      ok BOOLEAN,
      mensagem TEXT,
      ref_id_retorno TEXT
    ) AS $FUNC$
    DECLARE
      v_encontrado BOOLEAN;
    BEGIN
      SELECT EXISTS(
        SELECT 1 FROM %I.cliques_landing
        WHERE ref_id = p_ref_id
      ) INTO v_encontrado;

      IF NOT v_encontrado THEN
        RETURN QUERY SELECT false, 'ref_id não encontrado', NULL::TEXT;
        RETURN;
      END IF;

      UPDATE %I.cliques_landing
      SET
        telefone = p_telefone,
        session_id = p_session_id,
        matched_at = NOW(),
        match_metodo = 'telefone_timing_manual'
      WHERE ref_id = p_ref_id;

      RETURN QUERY SELECT true, 'Match registrado com sucesso', p_ref_id;
    END;
    $FUNC$ LANGUAGE plpgsql;
  $f$, v_schema, v_schema, v_schema);
  RAISE NOTICE 'RPC registrar_match_clique criada';

  -- ====================================================================
  -- 8. RPC: buscar_dados_capi (para CAPI)
  -- ====================================================================
  EXECUTE format($f$
    CREATE OR REPLACE FUNCTION %I.buscar_dados_capi(
      p_ref_id TEXT
    )
    RETURNS TABLE (
      fbclid TEXT,
      fbc TEXT,
      fbp TEXT,
      client_ip TEXT,
      user_agent TEXT,
      evento_type VARCHAR,
      criado_at TIMESTAMPTZ,
      clicou_at TIMESTAMPTZ
    ) AS $FUNC$
    BEGIN
      RETURN QUERY
      SELECT
        cl.fbclid,
        cl.fbc,
        cl.fbp,
        cl.client_ip,
        cl.user_agent,
        cl.evento_type,
        cl.created_at,
        cl.clicou_wpp_at
      FROM %I.cliques_landing cl
      WHERE cl.ref_id = p_ref_id;
    END;
    $FUNC$ LANGUAGE plpgsql;
  $f$, v_schema, v_schema);
  RAISE NOTICE 'RPC buscar_dados_capi criada';

  -- ====================================================================
  -- 9. RPC: contar_conversao_funil (monitoring)
  -- ====================================================================
  EXECUTE format($f$
    CREATE OR REPLACE FUNCTION %I.contar_conversao_funil(
      p_horas INT DEFAULT 24
    )
    RETURNS TABLE (
      pageviews BIGINT,
      cliques BIGINT,
      taxa_conversao NUMERIC,
      organicos BIGINT,
      com_meta_ads BIGINT,
      matches_realizados BIGINT
    ) AS $FUNC$
    BEGIN
      RETURN QUERY
      SELECT
        COUNT(CASE WHEN cl.evento_type = 'pageview' THEN 1 END),
        COUNT(CASE WHEN cl.evento_type = 'clique' THEN 1 END),
        ROUND(
          100.0 * COUNT(CASE WHEN cl.evento_type = 'clique' THEN 1 END)
          / NULLIF(COUNT(CASE WHEN cl.evento_type = 'pageview' THEN 1 END), 0),
          2
        ),
        COUNT(CASE WHEN cl.fbclid IS NULL THEN 1 END),
        COUNT(CASE WHEN cl.fbclid IS NOT NULL THEN 1 END),
        COUNT(CASE WHEN cl.session_id IS NOT NULL THEN 1 END)
      FROM %I.cliques_landing cl
      WHERE cl.created_at >= NOW() - (p_horas || ' hours')::INTERVAL;
    END;
    $FUNC$ LANGUAGE plpgsql;
  $f$, v_schema, v_schema);
  RAISE NOTICE 'RPC contar_conversao_funil criada';

  -- ====================================================================
  -- 10. Grant permissions
  -- ====================================================================
  EXECUTE format('GRANT USAGE ON SCHEMA %I TO anon, authenticated, service_role', v_schema);
  EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA %I TO anon, authenticated, service_role', v_schema);
  EXECUTE format('GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA %I TO anon, authenticated, service_role', v_schema);
  EXECUTE format('GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA %I TO anon, authenticated, service_role', v_schema);
  RAISE NOTICE 'Permissões concedidas';

  -- ====================================================================
  -- Done!
  -- ====================================================================
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Schema % setup completo! ✅', v_schema;
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Tabela: cliques_landing';
  RAISE NOTICE 'RPCs: 6 funções criadas';
  RAISE NOTICE 'Índices: 3 índices criados';
  RAISE NOTICE '';
  RAISE NOTICE 'Próximo passo: Agora teste a landing page!';
  RAISE NOTICE 'URL: http://localhost:3000 (desenvolvimento)';
  RAISE NOTICE '========================================';

END;
$MAIN$;
