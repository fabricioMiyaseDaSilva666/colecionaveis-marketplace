import { Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, CreditCard } from 'lucide-react'
import { useCart } from '../context/useCart'
import { useState } from 'react'
import { createOrder } from '../services/orderService'
import type { PaymentScenario } from '../services/orderService'


export default function CheckoutPage() {
  const paymentScenario: PaymentScenario | undefined = 'confirmed'
  const { items, discount, clearCart } = useCart()

  const [paymentStatus, setPaymentStatus] = useState< 'idle' | 'approved' | 'refused' | 'pending' >('idle')

  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  
  async function handlePayment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    const form = event.currentTarget
    if (!form.reportValidity()) return

    const formData = new FormData(form)
    const paymentMethod = String(formData.get('paymentMethod') ?? 'card')

    setPaymentStatus('pending')

    try {
        const order = await createOrder({
        items: items.map((item) => ({
            nftId: item.nft.id,
            name: item.nft.name,
            quantity: item.quantity,
            price: Number(item.nft.price),
        })),
        subtotal,
        discount: discountAmount,
        serviceFee,
        total,
        paymentMethod,
        },
        paymentScenario,
    )

        if (order.status === 'confirmed') {
        setPaymentStatus('approved')
        clearCart()
        navigate({ to: '/pedido-confirmado' })
        } else if (order.status === 'pending') {
        setPaymentStatus('pending')
        } else {
        setPaymentStatus('refused')
        }
    } catch (error) {
        console.error('Erro ao registrar o pedido:', error)
        setPaymentStatus('refused')
    } finally {
        setIsSubmitting(false)
    }
  }

  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.nft.price) * item.quantity,
    0,
  )

  const serviceFee = subtotal * 0.02
  const discountAmount = subtotal * (discount / 100)
  const total = subtotal - discountAmount + serviceFee

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#160e0a] px-6 py-12 text-white">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="font-mono text-2xl font-bold">
            Seu carrinho está vazio
          </h1>
          <p className="mt-3 text-[#bca797]">
            Adicione um NFT antes de iniciar o pagamento.
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
            className="mt-6 inline-block rounded-lg bg-[#e69a50] px-5 py-3 font-bold text-[#160e0a]"
          >
            Explorar coleção
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#160e0a] px-6 py-8 text-white sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/carrinho"
          className="inline-flex items-center gap-2 text-sm text-[#c9a98c] hover:text-orange-400"
        >
          <ArrowLeft size={16} />
          Voltar ao carrinho
        </Link>

        <header className="mb-8 mt-8">
          <h1 className="font-mono text-3xl font-bold">
            Finalizar compra
          </h1>
          <p className="mt-2 text-sm text-[#bca797]">
            Revise seu pedido e prepare o pagamento simulado.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-[1fr_320px]">
          <section className="rounded-xl border border-[#3b3029] bg-[#241711] p-6">
            <div className="flex items-center gap-3">
              <CreditCard className="text-[#e69a50]" size={24} />
              <h2 className="font-mono text-xl font-bold">
                Dados de pagamento
              </h2>
            </div>

            
        <form
            className="mt-6 space-y-5"
            onSubmit={handlePayment}
        >
        <div>
            <label
            htmlFor="fullName"
            className="mb-2 block text-sm text-[#c9a98c]"
            >
            Nome completo
            </label>
            <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            minLength={3}
            placeholder="Seu nome completo"
            className="w-full rounded-lg border border-[#594438] bg-[#160e0a] px-4 py-3 text-white outline-none focus:border-[#e69a50]"
            />
        </div>

        <div>
            <label
            htmlFor="email"
            className="mb-2 block text-sm text-[#c9a98c]"
            >
            E-mail
            </label>
            <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="voce@exemplo.com"
            className="w-full rounded-lg border border-[#594438] bg-[#160e0a] px-4 py-3 text-white outline-none focus:border-[#e69a50]"
            />
        </div>

        <div>
            <label
            htmlFor="paymentMethod"
            className="mb-2 block text-sm text-[#c9a98c]"
            >
            Método de pagamento
            </label>
            <select
            id="paymentMethod"
            name="paymentMethod"
            required
            defaultValue="card"
            className="w-full rounded-lg border border-[#594438] bg-[#160e0a] px-4 py-3 text-white outline-none focus:border-[#e69a50]"
            >
            <option value="card">Cartão de crédito (simulação)</option>
            <option value="pix">PIX (simulação)</option>
            <option value="crypto">Carteira cripto (simulação)</option>
            </select>
        </div>

        <p className="text-xs leading-5 text-[#bca797]">
            Este é um ambiente de demonstração. Não informe dados reais de
            cartão, senhas ou chaves de carteira.
        </p>

        
        <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-[#e69a50] px-5 py-3 font-mono font-bold text-[#160e0a] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
        {isSubmitting ? 'Processando pedido...' : 'Continuar para pagamento'}
        </button>

        {paymentStatus !== 'idle' && (
        <div
            role="status"
            aria-live="polite"
            className={`mt-4 rounded-lg border p-4 text-sm ${
            paymentStatus === 'approved'
                ? 'border-green-700 bg-green-950 text-green-300'
                : paymentStatus === 'pending'
                ? 'border-yellow-700 bg-yellow-950 text-yellow-300'
                : 'border-red-700 bg-red-950 text-red-300'
            }`}
        >
            {paymentStatus === 'approved' &&
            'Pagamento aprovado! Seu pedido foi confirmado.'}

            {paymentStatus === 'pending' &&
            'Pagamento pendente. Estamos aguardando a confirmação.'}

            {paymentStatus === 'refused' &&
            'Pagamento recusado. Você pode tentar novamente.'}
        </div>
        )}
        </form>

          </section>

          <aside className="h-fit rounded-xl border border-[#3b3029] bg-[#241711] p-6">
            <h2 className="font-mono text-xl font-bold">
              Resumo do pedido
            </h2>

            <div className="mt-5 space-y-3">
              {items.map((item) => (
                <div
                  key={item.nft.id}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="text-[#c9a98c]">
                    {item.nft.name} × {item.quantity}
                  </span>
                  <span>
                    {(Number(item.nft.price) * item.quantity).toFixed(2)} ETH
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-between border-t border-[#3b3029] pt-4 text-sm text-[#bca797]">
              <span>Subtotal</span>
              <span>{subtotal.toFixed(2)} ETH</span>
            </div>

            <div className="mt-3 flex justify-between text-sm text-[#bca797]">
              <span>Desconto</span>
              <span>-{discountAmount.toFixed(2)} ETH</span>
            </div>

            <div className="mt-3 flex justify-between text-sm text-[#bca797]">
              <span>Taxa de serviço (2%)</span>
              <span>{serviceFee.toFixed(2)} ETH</span>
            </div>

            <div className="mt-4 flex justify-between border-t border-[#3b3029] pt-4 font-bold">
              <span>Total</span>
              <span className="text-[#e69a50]">
                {total.toFixed(2)} ETH
              </span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}