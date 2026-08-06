# 🚀 Landing Page v3 - Setup Completo

## 📋 Status
**✅ 100% Pronto para Testar do Zero**

- ✅ Next.js 15 configurado
- ✅ Rastreamento Meta Pixel
- ✅ API pageview + clique
- ✅ Supabase schema criado
- ✅ 6 RPCs prontas
- ✅ Documentação completa

---

## 🎯 Como Começar (5 Minutos)

### 1️⃣ Setup Local

```bash
cd /Users/madsonmagalhaes/Documents/agente-ia-modular/v3

# Instalar dependências
npm install

# Rodar dev server
npm run dev
```

Acesse: http://localhost:3000

### 2️⃣ Configurar Supabase

1. Abra: https://app.supabase.com/project/pyagqbqzyksbiutkeyzk/sql/new
2. Cole o arquivo: `SETUP_SCHEMA_V3.sql`
3. Execute (Ctrl+Enter)
4. Aguarde mensagem: "Schema schema_v3 setup completo! ✅"

### 3️⃣ Testar Rastreamento

1. Abra http://localhost:3000 no navegador
2. Abra **Console** (F12)
3. Procure por logs `[pageview]` e `[clique]`
4. Clique no botão **"📱 Falar no WhatsApp"**
5. Verifique em Supabase (tabela cliques_landing)

---

## 🔍 Verificar Dados

### No Supabase

```sql
-- Ver todos os eventos da última hora
SELECT 
  ref_id,
  evento_type,
  fbclid,
  fbc,
  fbp,
  clicou_wpp_at,
  created_at
FROM schema_v3.cliques_landing
WHERE created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

### No Navegador (Console)

```javascript
// Ver seu ref_id
sessionStorage.getItem('lp_ref_id_v3')

// Ver cookies Meta Pixel
document.cookie
```

---

## 📊 Estrutura do Projeto

```
v3/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── pageview/route.ts      ← POST /api/pageview
│   │   │   └── clique/route.ts        ← POST /api/clique
│   │   ├── layout.tsx                 ← Layout + MetaPixel
│   │   └── page.tsx                   ← Landing page
│   ├── components/
│   │   ├── analytics/MetaPixel.tsx    ← Pixel tracking
│   │   └── landing/WhatsAppButton.tsx ← Botão clique
│   ├── lib/
│   │   ├── config.ts                  ← Env vars
│   │   ├── supabase/server.ts         ← Clientes Supabase
│   │   ├── tracking/                  ← ref_id, eventId, pixel
│   │   └── security/validation.ts     ← Validações
│   └── types/tracking.ts              ← TypeScript types
├── .env.example                       ← Template (vazio)
├── .env.local                         ← Valores reais (não commitar)
├── SETUP_SCHEMA_V3.sql                ← Schema + RPCs
├── README_V3.md                       ← Este arquivo
└── package.json
```

---

## ✅ Checklist de Teste

### Teste 1: Pageview (Sem Clique)

- [ ] Acesse http://localhost:3000
- [ ] Console mostra: `[pageview] status 200`
- [ ] Supabase tem linha com evento_type='pageview'
- [ ] Coluna ref_id preenchida
- [ ] Coluna fbclid = NULL (se acesso direto)
- [ ] Coluna fbc/fbp = NULL (se acesso direto)

### Teste 2: Clique WhatsApp

- [ ] Clique no botão "📱 Falar no WhatsApp"
- [ ] Console mostra: `[clique] botão WhatsApp clicado`
- [ ] Console mostra: `[clique] status 200`
- [ ] Redireciona para wa.me (se WhatsApp configurado)
- [ ] Supabase: mesma linha agora com evento_type='clique'
- [ ] Coluna clicou_wpp_at tem timestamp (não NULL)

### Teste 3: Com Meta Ads (fbclid)

- [ ] Acesse: http://localhost:3000?fbclid=AZX1234567
- [ ] Console mostra fbclid sendo capturado
- [ ] Supabase: fbclid = 'AZX1234567'
- [ ] fbc = 'fb.1.XXXXX.AZX1234567' (construído automaticamente)
- [ ] Clique e verifique que fbc/fbp se mantêm

### Teste 4: Com UTM Params

- [ ] Acesse: http://localhost:3000?utm_campaign=test&utm_source=google
- [ ] Supabase: utm_campaign = 'test'
- [ ] Supabase: utm_source = 'google'
- [ ] Outros utm_* podem ser NULL

### Teste 5: Queries SQL

```sql
-- 1. Contar eventos
SELECT evento_type, COUNT(*) as total
FROM schema_v3.cliques_landing
GROUP BY evento_type;

-- 2. Ver taxa de clique
SELECT 
  COUNT(CASE WHEN evento_type = 'pageview' THEN 1 END) as pageviews,
  COUNT(CASE WHEN evento_type = 'clique' THEN 1 END) as cliques,
  ROUND(100.0 * COUNT(CASE WHEN evento_type = 'clique' THEN 1 END) / COUNT(CASE WHEN evento_type = 'pageview' THEN 1 END), 2) as taxa_pct
FROM schema_v3.cliques_landing;

-- 3. Chamar RPC de monitoramento
SELECT * FROM schema_v3.contar_conversao_funil(24);
```

---

## 🐛 Troubleshooting

### Erro: "schema não configurado"
- [ ] Verificar `.env.local` tem `NEXT_PUBLIC_SCHEMA_ID=schema_v3`
- [ ] Reiniciar dev server

### Erro: "RPC não encontrada"
- [ ] Verificar se rodou `SETUP_SCHEMA_V3.sql` em Supabase
- [ ] Verificar se schema_v3 está em Exposed Schemas (Settings > API)

### Dados não chegam em Supabase
- [ ] Abrir Console do navegador (F12)
- [ ] Procurar por erros (vermelho)
- [ ] Verificar Status da API (Network tab)
- [ ] Verificar logs do dev server (terminal)

### "ref_id não encontrado" (RPC)
- [ ] Verificar se pageview foi registrado primeiro
- [ ] Aguardar 1-2 segundos antes de clicar

---

## 📚 Documentos Relacionados

| Documento | Propósito |
|-----------|-----------|
| `FUNIL_END_TO_END.md` (lp-test/) | Arquitetura completa |
| `IMPLEMENTACAO_CHECKLIST.md` (lp-test/) | Checklist de implementação |
| `N8N_EXEMPLO_MATCHING.md` (lp-test/) | Como integrar com n8n |
| `SEGURANCA_CREDENCIAIS.md` (lp-test/) | Segurança de credenciais |

---

## 🚀 Próximos Passos (Após Testar)

1. **Deploy em Vercel:**
   ```bash
   git add .
   git commit -m "init: v3 landing page with tracking"
   git push origin main
   ```

2. **Implementar n8n:**
   - Webhook Z-API
   - Matching de cliques por telefone
   - Envio de CAPI

3. **Configurar em Produção:**
   - Vercel Environment Variables
   - SUPABASE_SERVICE_ROLE_KEY
   - n8n Variables (CAPI_ACCESS_TOKEN)

---

## 🔐 Segurança

- ✅ Pixel ID = NEXT_PUBLIC (é público)
- ✅ WhatsApp # = NEXT_PUBLIC (é público)
- ✅ Service Role = .env.local (nunca commitar)
- ✅ Validação de entrada em todas rotas
- ✅ RLS + Schema isolation no Supabase

---

## 📞 Suporte

Se algo não funcionar:

1. Verificar logs do navegador (F12 Console)
2. Verificar logs do dev server (terminal)
3. Verificar se schema_v3 existe em Supabase
4. Verificar se .env.local tem valores corretos
5. Reiniciar dev server: `npm run dev`

---

**Criado:** 2026-08-06  
**Status:** ✅ Pronto para Testar  
**Próximo:** Deploy Vercel
