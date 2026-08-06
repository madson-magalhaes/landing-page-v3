# 🔧 N8N - Variáveis de Teste (Set Edit)

## 📋 Configurar Antes de Testar

No N8N, acesse **Settings > Variables** e adicione as seguintes variáveis:

### Meta CAPI (System User)
```
META_CAPI_TOKEN = EAAM5Dvcg1IYBSLf6ZC8e2tJszZAcT9bUrj8kt1DMqVBdYk7y1SEhpytwcadjj14Qru9jOedTeGS6mvxpSnWeOHmh2nt0ynwzz4fsYAT0cBLUTEA5uP44kOY4KtGCo29WrKrCkAZBykeUereKDqIZBL7lI1UG34y6h3hGLYtEwEsr29JZCHWOZAQmzZCgE9wASQvzAZDZD

META_PIXEL_ID = 28026272890397173

AD_ACCOUNT_ID = 1059089405536091

ACCESS_TOKEN_PIXEL = EAAHyru1tK7ABSN2Ol6xHcnQUqoNTwAGRreIx0ATa2XM5oj9yQDj6aGWCDcYzaDtVrqBCqq83eQ1VdtYd7UZAgbi3huABdUHQGGeUZBtepQZBv6fTI1AiJXGsnuLpLgFBiaBWfRKlsFZARbj634WakF0umLCrTZB4Cv2U2pUsM2DdAZCV8Bhtuse3eJeAlnXrRx6gZDZD
```

### Supabase
```
SUPABASE_URL = https://pyagqbqzyksbiutkeyzk.supabase.co

SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5YWdxYnF6eWtzYml1dGtleXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMjgyODUsImV4cCI6MjA2MDkwNDI4NX0.M43o9ovhkRWAiDuM6R_b04S9P6sCyfZxra1s22htvzY
```

---

## 🧪 Teste 1: Tráfego Orgânico (Sem Clique)

**Objetivo**: Validar que N8N retorna erro quando não encontra clique

### Payload para Z-API (Copiar e colar no Test Edit)

```json
{
  "body": {
    "isStatusReply": false,
    "chatLid": "999999999999999@lid",
    "connectedPhone": "5588996758647",
    "phone": "5588996758647",
    "senderName": "Lead Orgânico Teste",
    "text": {
      "message": "Oi, achei seu número em um grupo"
    },
    "momment": 1786044676000,
    "status": "RECEIVED",
    "type": "ReceivedCallback"
  }
}
```

### Resultado Esperado
```json
{
  "ok": false,
  "motivo": "clique_nao_encontrado"
}
```

✅ **Se receber isso = NÃO tentou enviar para Meta** (correto!)

---

## 🧪 Teste 2: Tráfego Pago (Com Clique Recente)

**Objetivo**: Validar que N8N encontra clique e envia para Meta

### Procedimento
1. **Clique na landing page** (https://landing-page-v3-beige.vercel.app)
2. **Copie o último registro de `cliques_landing`** em Supabase
3. **Coloque aqui** (exemplo com dados reais do clique):

```json
{
  "body": {
    "isStatusReply": false,
    "chatLid": "245612016627760@lid",
    "connectedPhone": "5588996758647",
    "phone": "5588996758647",
    "senderName": "Teste Tráfego Pago",
    "text": {
      "message": "vim do anuncio"
    },
    "momment": 1786044700000,
    "status": "RECEIVED",
    "type": "ReceivedCallback",
    "adContext": {
      "entryPointConversionSource": "click_to_chat_link"
    }
  }
}
```

### Resultado Esperado
```json
{
  "ok": true,
  "ref_id": "LPMSHW6C5AC39",
  "fbclid_existe": true,
  "match_qual": "novo_2min"
}
```

✅ **Se receber isso = ENVIOU para Meta InitiateCheckout + Purchase** (correto!)

---

## 📊 No N8N: Como Verificar

### 1. Workflow Execution
- Clicar em **"Test"** dentro do workflow
- Preencher com payload acima
- Clicar **"Execute"**
- Ver resultado na aba **Outputs**

### 2. Logs de Envio para Meta
- Node: **"Enviar CAPI InitiateCheckout"**
- Node: **"Enviar CAPI Purchase"**
- Se status = 200 = enviou com sucesso ✅
- Se status = 4xx/5xx = erro na validação ❌

### 3. Verificar em Supabase
```sql
-- Ver se match foi registrado
SELECT * FROM schema_v3.cliques_landing 
WHERE matched_at IS NOT NULL 
ORDER BY created_at DESC LIMIT 5;

-- Ver se foi registrado em conversas_leads
SELECT * FROM schema_v3.conversas_leads 
ORDER BY created_at DESC LIMIT 5;
```

### 4. Verificar em Meta Ads Manager
- Ir em **Eventos** do Pixel
- Procurar por **InitiateCheckout** e **Purchase**
- Se aparecer = CAPI funcionando ✅

---

## 🚨 Troubleshooting

### "clique_nao_encontrado" mas deveria ter encontrado
- ❌ Clique antigo demais (passou de 5min)
- ❌ Chatlid não bate
- ✅ Criar novo clique na landing page

### Erro 400/401 no envio para Meta
- ❌ Token expirado
- ❌ Pixel ID incorreto
- ✅ Verificar variáveis em Settings > Variables

### "fbclid_existe": false
- ✅ Correto para tráfego orgânico
- ✅ Não enviará para Meta

---

## ✅ Checklist Completo

- [ ] Variáveis adicionadas no N8N (Settings > Variables)
- [ ] Teste 1 rodado: Tráfego orgânico = erro esperado
- [ ] Teste 2 rodado: Clique encontrado = enviou para Meta
- [ ] Meta Ads Manager mostra InitiateCheckout + Purchase
- [ ] Supabase mostra matched_at preenchido
- [ ] Conversas_leads tem entrada com origem_lead correta

**Quando tudo passar = Sistema V3 está 100% operacional!** 🚀
