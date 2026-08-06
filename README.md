# 🌍 Landing Page V3

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E)](https://supabase.com)

Repositório independente da landing page com rastreamento completo de Meta Pixel e Supabase.

## ✨ Features

- ✅ Meta Pixel tracking automático (fbclid, fbc, fbp, utm_*)
- ✅ Pageview capturado ao carregar a página
- ✅ Clique em WhatsApp rastreado com timestamp
- ✅ Suporte a tráfego pago e orgânico (sem fbclid, sem erro)
- ✅ Validação de entrada em todas APIs
- ✅ TypeScript + Tailwind CSS
- ✅ Deploy pronto para Vercel

## 🚀 Quick Start

### Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com seus valores

# Rodar dev server
npm run dev
```

Acesse: http://localhost:3000

### Deploy no Vercel

1. Push para GitHub
2. Conectar repositório no Vercel
3. Adicionar variáveis de ambiente
4. Deploy automático

Detalhes: ver `DEPLOYMENT.md`

## 🔧 Configuração

### .env.local (Development)

```env
# Meta Pixel (obrigatório)
NEXT_PUBLIC_META_PIXEL_ID=seu_pixel_id

# Supabase (obrigatório)
NEXT_PUBLIC_SUPABASE_URL=sua_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key

# App Config
NEXT_PUBLIC_SCHEMA_ID=schema_v3
NEXT_PUBLIC_WHATSAPP_NUMBER=5588996758647
NEXT_PUBLIC_WHATSAPP_MESSAGE=Quero saber mais

# Backend (privado)
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
```

## 📦 Estrutura

```
landing-page-v3/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── pageview/route.ts    # Registra pageview
│   │   │   └── clique/route.ts      # Registra clique
│   │   ├── layout.tsx               # Layout + MetaPixel
│   │   ├── page.tsx                 # Hero + CTA
│   │   └── globals.css
│   ├── components/
│   │   ├── analytics/MetaPixel.tsx  # Pixel tracking
│   │   └── landing/WhatsAppButton.tsx # Botão + clique
│   ├── lib/
│   │   ├── config.ts                # Env vars
│   │   ├── supabase/server.ts       # Clientes Supabase
│   │   ├── tracking/                # ref_id, eventId, pixel
│   │   └── security/validation.ts   # Validações
│   └── types/tracking.ts            # TypeScript interfaces
├── SETUP_SCHEMA_V3.sql              # Schema + RPCs
├── DEPLOYMENT.md                    # Deploy guide
└── package.json
```

## 🧪 Testes

### Testar Rastreamento Localmente

```bash
bash test-tracking.sh
```

Valida:
- ✅ Pageview enviado
- ✅ Clique enviado
- ✅ Dados em Supabase

### Verificar em Supabase

```sql
SELECT * FROM schema_v3.cliques_landing
WHERE created_at >= NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC
LIMIT 10;
```

### Testar Pixel no Meta

1. Ads Manager > Ferramentas > Gerenciador de Pixels
2. Clique seu pixel
3. Aba "Testar eventos"
4. Procure "PageView" e "Lead"

## 📊 Dados Capturados

### Pageview
- `ref_id` — ID único da sessão
- `fbclid` — ID de clique de anúncio (se Meta Ads)
- `fbc` — Facebook Click ID do cookie
- `fbp` — Facebook Pixel ID do cookie
- `utm_*` — Parâmetros UTM
- Timestamp e User Agent

### Clique
- `ref_id` — Mesmo da sessão
- `fbc`/`fbp` — Repassado
- `clicou_wpp_at` — Timestamp do clique

## 🔐 Segurança

- ✅ Validação em todas rotas
- ✅ Sanitização de entrada
- ✅ Chaves privadas em variáveis de ambiente
- ✅ Suporte a RLS (Row Level Security) do Supabase

## 📈 Próximas Etapas

1. **Setup Supabase**
   ```bash
   # Rodar no SQL Editor do Supabase
   # Conteúdo: SETUP_SCHEMA_V3.sql
   ```

2. **Testar Localmente**
   ```bash
   npm run dev
   # Verificar console e Supabase
   ```

3. **Deploy**
   ```bash
   # Ver DEPLOYMENT.md
   git push origin main
   ```

4. **Integrar com n8n**
   - Webhook do Z-API
   - Buscar cliques do Supabase
   - Enviar para Meta CAPI

5. **Monitorar**
   - BI Dashboard (`python BI.py`)
   - Meta Pixel events
   - Supabase metrics

## 📝 Documentação Relacionada

- `QUICKSTART.md` — Setup em 5 minutos
- `README_V3.md` — Documentação completa
- `DEPLOYMENT.md` — Deploy em Vercel
- `SETUP_SCHEMA_V3.sql` — Schema do banco

## 🆘 Troubleshooting

### "Pageview não chega"
- Verificar console (F12) para erros
- Validar `NEXT_PUBLIC_SCHEMA_ID`
- Verificar permissões Supabase

### "Clique não aparece"
- Verificar se botão está clicável
- Verificar logs da API (`/api/clique`)
- Validar credenciais Supabase

### "Pixel não rastreia"
- Verificar `NEXT_PUBLIC_META_PIXEL_ID`
- Verificar se fbq está carregando
- Testar em ambiente diferente

## 📞 Suporte

- Issues: GitHub issues
- Docs: Ver `DEPLOYMENT.md` e `SETUP_SCHEMA_V3.sql`
- Logs: Vercel Function Logs ou console local

---

**Pronto para produção!** 🚀
