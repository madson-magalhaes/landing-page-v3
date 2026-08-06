# 🚀 Deployment - GitHub + Vercel

## 📋 Checklist de Deploy

### 1️⃣ Preparar GitHub

```bash
# Clonar este repositório ou criar novo
cd landing-page-v3
git init
git add .
git commit -m "init: landing page v3 with pixel tracking"
git branch -M main
git remote add origin https://github.com/seu-usuario/lp-v3.git
git push -u origin main
```

### 2️⃣ Conectar no Vercel

1. Acesse: https://vercel.com
2. Clique: "New Project"
3. Selecione: Repositório `lp-v3`
4. Configure: Conforme abaixo

### 3️⃣ Variáveis de Ambiente (Vercel)

Em **Settings > Environment Variables**, adicione:

```
# PUBLIC (visível no código)
NEXT_PUBLIC_META_PIXEL_ID=1034449309557577
NEXT_PUBLIC_SUPABASE_URL=https://pyagqbqzyksbiutkeyzk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
NEXT_PUBLIC_SCHEMA_ID=schema_v3
NEXT_PUBLIC_WHATSAPP_NUMBER=5588996758647
NEXT_PUBLIC_WHATSAPP_MESSAGE=Quero saber mais

# PRIVATE (apenas servidor)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### 4️⃣ Deploy

```bash
# Vercel auto-deploy ao fazer push para main
git push origin main

# Ou deploy manual via CLI:
npm install -g vercel
vercel
```

## 🔍 Verificar Deployment

1. Acesse URL do Vercel (ex: `lp-v3.vercel.app`)
2. Abra DevTools → Console
3. Procure por `[pageview]` e `[clique]` nos logs
4. Verifique se dados chegam no Supabase

## 🛠️ Troubleshooting

### "Variáveis não carregam"
- Verificar se NEXT_PUBLIC_ está correto
- Rebuild após adicionar variáveis
- Limpar cache do navegador

### "Pixel não carrega"
- Verificar NEXT_PUBLIC_META_PIXEL_ID
- Abrir Console (F12) para erros
- Testar com fbclid real de Meta

### "Erro ao enviar para Supabase"
- Verificar credenciais
- Verificar se schema_v3 existe
- Verificar RLS (Row Level Security)

## 📝 Monitoramento Pós-Deploy

### Logs em Vercel
- Settings > Function Logs
- Ver erros de API em tempo real

### Verificar em Supabase
```sql
SELECT * FROM schema_v3.cliques_landing
ORDER BY created_at DESC
LIMIT 10
```

### Monitorar Pixel
- Meta Ads Manager > Pixels
- Aba "Testar eventos"
- Procurar por "PageView" e "Lead"

## 🔐 Segurança

- ✅ .env.local nunca é commitado (.gitignore)
- ✅ Variáveis sensíveis em Vercel (não em repo)
- ✅ SUPABASE_SERVICE_ROLE_KEY é privado
- ✅ Código aberto é seguro (sem hardcoded secrets)

## 📚 Próximas Etapas

1. Setup Supabase schema (ver SETUP_SCHEMA_V3.sql)
2. Testar com dados reais
3. Conectar n8n webhook
4. Monitorar métricas em BI.py

---

**Pronto para produção!** 🎉
