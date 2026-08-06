# ⚡ Quickstart v3 - 5 Minutos

## 🚀 1. Instalar & Rodar

```bash
cd /Users/madsonmagalhaes/Documents/agente-ia-modular/v3
npm install
npm run dev
```

→ Acesse: http://localhost:3000

---

## 🗄️ 2. Criar Schema no Supabase

1. Abra: https://app.supabase.com/project/pyagqbqzyksbiutkeyzk/sql/new
2. Cole conteúdo de `SETUP_SCHEMA_V3.sql`
3. Execute (Ctrl+Enter)
4. Aguarde ✅

---

## ✅ 3. Testar

### Opção A: Via Navegador (Manual)

1. Abra http://localhost:3000
2. F12 para abrir Console
3. Procure por `[pageview]` e `[clique]` nos logs
4. Clique botão "📱 Falar no WhatsApp"
5. Verifique Supabase: https://app.supabase.com/project/pyagqbqzyksbiutkeyzk/editor/schema_v3

### Opção B: Via Script (Automático)

```bash
# Assumindo dev server rodando em http://localhost:3000
bash /Users/madsonmagalhaes/Documents/agente-ia-modular/v3/test-tracking.sh
```

---

## 🔍 4. Verificar Dados

### Query Simples (No Supabase SQL Editor)

```sql
-- Ver último evento
SELECT * FROM schema_v3.cliques_landing
ORDER BY created_at DESC
LIMIT 1;
```

### Query Avançada

```sql
-- Ver taxa de conversão
SELECT 
  COUNT(CASE WHEN evento_type = 'pageview' THEN 1 END) as pageviews,
  COUNT(CASE WHEN evento_type = 'clique' THEN 1 END) as cliques,
  ROUND(100.0 * COUNT(CASE WHEN evento_type = 'clique' THEN 1 END) / COUNT(*), 2) as taxa_pct
FROM schema_v3.cliques_landing
WHERE created_at >= NOW() - INTERVAL '1 hour';
```

### Chamar RPC

```sql
-- Monitoramento automático
SELECT * FROM schema_v3.contar_conversao_funil(24);
```

---

## 📊 O Que Você Está Testando

| Funcionalidade | Esperado | Onde Ver |
|---|---|---|
| **Pageview** | status 200 | Console [pageview] |
| **Ref ID** | XXXX12CHARS | sessionStorage |
| **fbclid** | Capturado se Meta Ads | Supabase coluna fbclid |
| **fbc/fbp** | Cookies Meta Pixel | Supabase colunas fbc/fbp |
| **Clique** | status 200 | Console [clique] |
| **clicou_wpp_at** | Timestamp | Supabase coluna preenchida |
| **evento_type** | pageview + clique | Supabase diferencia eventos |
| **Orgânico** | Sem erros, fbclid=NULL | Tabela OK mesmo sem fbclid |

---

## 🐛 Se Algo Não Funcionar

### "POST /api/pageview 404"
- [ ] Dev server está rodando? (`npm run dev`)
- [ ] Porta 3000 está livre?

### "schema não configurado"
- [ ] `.env.local` existe? (copie de `.env.example`)
- [ ] `NEXT_PUBLIC_SCHEMA_ID=schema_v3`?

### "RPC não encontrada"
- [ ] Rodou `SETUP_SCHEMA_V3.sql`? Procure por ✅
- [ ] Schema está em **Exposed Schemas**?
  - Settings > API > Schema Expose > add schema_v3

### Dados não chegam em Supabase
- [ ] Abra DevTools → Network
- [ ] POST /api/pageview - qual status?
- [ ] Se 502, verificar console do dev server

---

## 🎯 Checklist Rápido

- [ ] npm install ✓
- [ ] npm run dev ✓
- [ ] .env.local existindo ✓
- [ ] SETUP_SCHEMA_V3.sql rodado ✓
- [ ] schema_v3 em Exposed Schemas ✓
- [ ] Landing acessível em http://localhost:3000 ✓
- [ ] Console mostra [pageview] quando entra ✓
- [ ] Clique no botão ✓
- [ ] Console mostra [clique] ✓
- [ ] Dados aparecem em schema_v3.cliques_landing ✓

**Se tudo verde acima → 🎉 Funcionando!**

---

## 📚 Documentação Completa

- `README_V3.md` — Setup detalhado + troubleshooting
- `FUNIL_END_TO_END.md` — Arquitetura (lp-test/)
- `N8N_EXEMPLO_MATCHING.md` — Próximos passos n8n (lp-test/)

---

## 🚀 Próximo Passo

Quando tudo estiver testado:

1. Deploy em Vercel: `git push`
2. Configurar n8n webhook
3. Implementar matching por telefone
4. Enviar eventos CAPI para Meta

Mas por enquanto: **aproveite o teste local!** 🎉
