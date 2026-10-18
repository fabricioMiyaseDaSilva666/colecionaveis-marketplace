import { Link } from '@tanstack/react-router'
import { CheckCircle2, ShoppingBag } from 'lucide-react'

export default function OrderConfirmationPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#160e0a] px-6 py-12 text-white">
      <section className="w-full max-w-lg rounded-xl border border-[#3b3029] bg-[#241711] p-8 text-center">
        <CheckCircle2
          size={56}
          className="mx-auto text-green-400"
        />

        <h1 className="mt-6 font-mono text-3xl font-bold">
          Pedido confirmado!
        </h1>

        <p className="mt-4 leading-7 text-[#bca797]">
          Seu pagamento foi aprovado na simulação. Obrigado por
          colecionar com a KURIO!
        </p>

        <Link
          to="/"
          search={{
            search: '',
            category: '',
            artist: '',
            sort: 'newest',
            page: 1,
          }}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[#e69a50] px-5 py-3 font-mono font-bold text-[#160e0a] transition hover:bg-orange-400"
        >
          <ShoppingBag size={18} />
          Voltar à coleção
        </Link>
      </section>
    </main>
  )
}