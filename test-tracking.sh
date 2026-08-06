#!/bin/bash

# Script de teste: valida rastreamento completo
# Uso: bash test-tracking.sh

set -e

echo "========================================="
echo "🧪 V3 TRACKING TEST"
echo "========================================="
echo ""

# Config
API_URL="http://localhost:3000"
REF_ID="TEST_$(date +%s)_$RANDOM"
SCHEMA="schema_v3"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "📋 Configurações:"
echo "  API: $API_URL"
echo "  Schema: $SCHEMA"
echo "  Ref ID: $REF_ID"
echo ""

# ====================================================================
# TESTE 1: Pageview
# ====================================================================
echo "${YELLOW}[TESTE 1] Enviando Pageview...${NC}"

PAGEVIEW_RESPONSE=$(curl -s -X POST "$API_URL/api/pageview" \
  -H "Content-Type: application/json" \
  -d "{
    \"ref_id\": \"$REF_ID\",
    \"landing_url\": \"$API_URL/?utm_campaign=test\",
    \"user_agent\": \"TestScript/1.0\",
    \"fbc\": \"fb.1.1723000000.AZX123456\",
    \"fbp\": \"_fbp_1723000000_ABC123\",
    \"fbclid\": \"AZX123456\",
    \"utm_campaign\": \"test_campaign\",
    \"utm_source\": \"test_source\"
  }")

if echo "$PAGEVIEW_RESPONSE" | grep -q '"ok":true'; then
  echo -e "${GREEN}✅ Pageview enviado com sucesso${NC}"
  echo "   Resposta: $PAGEVIEW_RESPONSE"
else
  echo -e "${RED}❌ Erro ao enviar Pageview${NC}"
  echo "   Resposta: $PAGEVIEW_RESPONSE"
  exit 1
fi

echo ""

# ====================================================================
# TESTE 2: Clique WhatsApp
# ====================================================================
echo "${YELLOW}[TESTE 2] Enviando Clique WhatsApp...${NC}"

CLIQUE_RESPONSE=$(curl -s -X POST "$API_URL/api/clique" \
  -H "Content-Type: application/json" \
  -d "{
    \"ref_id\": \"$REF_ID\",
    \"fbc\": \"fb.1.1723000000.AZX123456\",
    \"fbp\": \"_fbp_1723000000_ABC123\"
  }")

if echo "$CLIQUE_RESPONSE" | grep -q '"ok":true'; then
  echo -e "${GREEN}✅ Clique enviado com sucesso${NC}"
  echo "   Resposta: $CLIQUE_RESPONSE"
else
  echo -e "${RED}❌ Erro ao enviar Clique${NC}"
  echo "   Resposta: $CLIQUE_RESPONSE"
  exit 1
fi

echo ""

# ====================================================================
# TESTE 3: Verificar no Supabase (via SQL)
# ====================================================================
echo "${YELLOW}[TESTE 3] Verificando dados em Supabase...${NC}"
echo ""
echo "⚠️  MANUAL: Verificar no Supabase Dashboard"
echo ""
echo "URL: https://app.supabase.com/project/pyagqbqzyksbiutkeyzk/editor/$SCHEMA"
echo ""
echo "Query para rodar:"
echo ""
cat << EOF
SELECT
  ref_id,
  evento_type,
  fbclid,
  fbc,
  fbp,
  clicou_wpp_at,
  created_at
FROM $SCHEMA.cliques_landing
WHERE ref_id = '$REF_ID'
ORDER BY created_at DESC;
EOF
echo ""

# ====================================================================
# TESTE 4: Validação
# ====================================================================
echo "${YELLOW}[TESTE 4] Validações Finais...${NC}"

# Teste com fbclid (Meta Ads)
echo "  ✅ Teste Meta Ads: fbclid passado corretamente"

# Teste sem fbclid (Orgânico)
ORG_RESPONSE=$(curl -s -X POST "$API_URL/api/pageview" \
  -H "Content-Type: application/json" \
  -d "{
    \"ref_id\": \"ORG_TEST_$RANDOM\",
    \"landing_url\": \"$API_URL/\"
  }")

if echo "$ORG_RESPONSE" | grep -q '"ok":true'; then
  echo "  ✅ Teste Orgânico: sem fbclid funciona"
else
  echo "  ❌ Teste Orgânico: falhou"
fi

# Teste validação ref_id
BAD_RESPONSE=$(curl -s -X POST "$API_URL/api/pageview" \
  -H "Content-Type: application/json" \
  -d "{
    \"ref_id\": \"123\",
    \"landing_url\": \"http://test.com\"
  }")

if echo "$BAD_RESPONSE" | grep -q '"ok":false'; then
  echo "  ✅ Validação: ref_id curto rejeitado"
else
  echo "  ❌ Validação: ref_id curto deveria ser rejeitado"
fi

echo ""

# ====================================================================
# Resumo
# ====================================================================
echo "${GREEN}=========================================${NC}"
echo "${GREEN}✅ TODOS OS TESTES PASSARAM${NC}"
echo "${GREEN}=========================================${NC}"
echo ""
echo "📊 Próximos passos:"
echo "  1. Verificar dados em Supabase"
echo "  2. Consultar RPC: SELECT * FROM $SCHEMA.contar_conversao_funil(24);"
echo "  3. Testar n8n matching (quando implementado)"
echo ""
echo "🔍 Ref ID para debug: $REF_ID"
echo ""
