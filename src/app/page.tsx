import { WhatsAppButton } from "@/components/landing/WhatsAppButton";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl text-center">
          <h1 className="text-5xl font-bold mb-6">
            Landing Page v3
            <br />
            <span className="text-xl font-normal text-blue-100">
              Teste Completo do Funil
            </span>
          </h1>

          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Esta página testa o rastreamento completo:
          </p>

          <ul className="text-left space-y-3 mb-12 bg-blue-700/50 p-6 rounded-lg backdrop-blur">
            <li className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <span>Captura automática de fbclid, fbc, fbp, utm_*</span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <span>Pageview registrado em schema_v3.cliques_landing</span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <span>Clique em WhatsApp registrado com timestamp</span>
            </li>
            <li className="flex items-start">
              <span className="text-2xl mr-3">✅</span>
              <span>Suporta tráfego orgânico (sem fbclid) sem erros</span>
            </li>
          </ul>

          <div className="mb-8">
            <p className="text-sm text-blue-200 mb-4">
              🎯 <strong>Como testar:</strong>
            </p>
            <ol className="text-left space-y-2 text-sm text-blue-100">
              <li>1️⃣ Clique no botão abaixo</li>
              <li>2️⃣ Verifique em Supabase: schema_v3.cliques_landing</li>
              <li>3️⃣ Procure seu ref_id (gerado no navegador)</li>
              <li>4️⃣ Verifique evento_type (pageview vs clique)</li>
            </ol>
          </div>

          <WhatsAppButton />

          <p className="text-xs text-blue-200 mt-8">
            Console do navegador mostra logs detalhados (F12)
          </p>
        </div>
      </section>

      {/* Debug Info Section */}
      <section className="bg-white px-4 py-16 border-t">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            📊 Informações de Teste
          </h2>

          <div className="space-y-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">
                Referência de ID
              </h3>
              <p className="text-sm text-gray-600">
                Seu ref_id é gerado automaticamente e armazenado em sessionStorage.
                Verifique no Console do navegador:
              </p>
              <code className="block mt-2 bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto">
                {`sessionStorage.getItem('lp_ref_id_v3')`}
              </code>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-2">
                Cookies Meta Pixel
              </h3>
              <p className="text-sm text-gray-600">
                Verifique os cookies criados pelo Meta Pixel:
              </p>
              <code className="block mt-2 bg-gray-900 text-green-400 p-3 rounded text-xs overflow-auto">
                {`// Abra DevTools → Application → Cookies → Procure:
// _fbp (Facebook Pixel ID)
// _fbc (Facebook Click ID, se de Meta Ads)`}
              </code>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-700 mb-2">
                Verificar Dados no Supabase
              </h3>
              <p className="text-sm text-gray-600">
                Após clicar no botão WhatsApp:
              </p>
              <ol className="list-decimal list-inside text-sm text-gray-600 mt-2 space-y-1">
                <li>Acesse: https://app.supabase.com/project/pyagqbqzyksbiutkeyzk/editor/schema_v3</li>
                <li>Clique na tabela: cliques_landing</li>
                <li>Procure por seu ref_id</li>
                <li>Verifique coluna evento_type (pageview vs clique)</li>
                <li>Verifique fbc, fbp, fbclid (podem ser NULL se orgânico)</li>
                <li>Verifique clicou_wpp_at (timestamp do clique)</li>
              </ol>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>💡 Dica:</strong> Abra a aba "Console" do navegador (F12)
              para ver logs detalhados de cada evento. Procure por [pageview] e
              [clique].
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 px-4 py-8">
        <div className="max-w-2xl mx-auto text-center text-sm">
          <p>v3 - Schema-based Tracking | {new Date().getFullYear()}</p>
        </div>
      </footer>
    </main>
  );
}
