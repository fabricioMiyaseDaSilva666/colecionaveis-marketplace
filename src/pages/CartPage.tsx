import { Link } from '@tanstack/react-router'
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react'
import { useCart } from '../context/useCart'
import { useState } from 'react'

export default function CartPage() {
  const {
  items,
  updateQuantity,
  removeFromCart,
  clearCart,
  totalItems,
  discount,
  setDiscount,
} = useCart()
  const [coupon, setCoupon] = useState('')
  const [couponMessage, setCouponMessage] = useState('')

  function applyCoupon() {
    const normalizedCoupon = coupon.trim().toUpperCase()

    if (normalizedCoupon === 'KURIO10') {
        setDiscount(10)
        setCouponMessage('Cupom aplicado! Você ganhou 10% de desconto.')
    } else {
        setDiscount(0)
        setCouponMessage('Cupom inválido. Verifique o código e tente novamente.')
    }
  }


  const total = items.reduce(
    (sum, item) => sum + Number(item.nft.price) * item.quantity,
    0,
  )

  const discountAmount = total * (discount / 100)
  const serviceFee = total * 0.02
  const finalTotal = total - discountAmount + serviceFee

  return (
    <main className="min-h-screen bg-[#160e0a] px-6 py-8 text-white sm:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/"
          search={{
            search: '',
            category: '',
            artist: '',
            sort: 'newest',
            page: 1,
          }}
          className="inline-flex items-center gap-2 text-sm text-[#c9a98c] hover:text-orange-400"
        >
          <ArrowLeft size={16} />
          Voltar à coleção
        </Link>

        <header className="mb-8 mt-8">
          <div className="flex items-center gap-3">
            <ShoppingCart size={28} className="text-[#e69a50]" />
            <h1 className="font-mono text-3xl font-bold">Meu carrinho</h1>
          </div>
          <p className="mt-2 text-sm text-[#bca797]">
            {totalItems} {totalItems === 1 ? 'item' : 'itens'} no carrinho
          </p>
        </header>

        {items.length === 0 ? (
          <section className="rounded-xl border border-[#3b3029] bg-[#241711] p-8 text-center">
            <p className="text-lg">Seu carrinho está vazio.</p>
            <p className="mt-2 text-sm text-[#bca797]">
              Explore a coleção e adicione seus NFTs favoritos.
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
              className="mt-6 inline-block rounded-lg bg-[#e69a50] px-5 py-3 font-mono font-bold text-[#160e0a] hover:bg-orange-400"
            >
              Explorar coleção
            </Link>
          </section>
        ) : (
          <div className="grid gap-8 md:grid-cols-[1fr_320px]">
            <section className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.nft.id}
                  className="flex gap-4 rounded-xl border border-[#3b3029] bg-[#241711] p-4"
                >
                  <img
                    src={item.nft.image}
                    alt={item.nft.name}
                    className="h-24 w-24 rounded-lg object-cover sm:h-32 sm:w-32"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#c9a98c]">
                      {item.nft.artist}
                    </p>
                    <h2 className="mt-1 font-mono text-lg font-semibold">
                      {item.nft.name}
                    </h2>
                    <div className="mt-3 flex items-center gap-3">
                    <span className="text-sm text-[#bca797]">Quantidade:</span>

                    <button
                        type="button"
                        onClick={() =>
                        updateQuantity(item.nft.id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        aria-label={`Diminuir quantidade de ${item.nft.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded border border-[#594438] text-lg hover:bg-[#3b3029] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        −
                    </button>

                    <span className="min-w-5 text-center">{item.quantity}</span>

                    <button
                        type="button"
                        onClick={() =>
                        updateQuantity(item.nft.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.nft.available}
                        aria-label={`Aumentar quantidade de ${item.nft.name}`}
                        className="flex h-8 w-8 items-center justify-center rounded border border-[#594438] text-lg hover:bg-[#3b3029] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        +
                    </button>
                    </div>
                    <p className="mt-2 font-bold text-[#e69a50]">
                      {(Number(item.nft.price) * item.quantity).toFixed(2)}{' '}
                      {item.nft.currency}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.nft.id)}
                    aria-label={`Remover ${item.nft.name} do carrinho`}
                    className="self-start rounded-lg p-2 text-[#c9a98c] hover:bg-[#3b3029] hover:text-red-400"
                  >
                    <Trash2 size={20} />
                  </button>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-xl border border-[#3b3029] bg-[#241711] p-6">
              <h2 className="font-mono text-xl font-bold">Resumo do pedido</h2>

              
<div className="mt-6">
  <label
    htmlFor="coupon"
    className="mb-2 block text-sm text-[#bca797]"
  >
    Cupom de desconto
  </label>

  <div className="flex gap-2">
    <input
      id="coupon"
      type="text"
      value={coupon}
      onChange={(event) => setCoupon(event.target.value)}
      placeholder="Digite seu cupom"
      className="min-w-0 flex-1 rounded-lg border border-[#594438] bg-[#160e0a] px-3 py-2 text-sm text-white outline-none focus:border-[#e69a50]"
    />

    <button
        type="button"
        onClick={applyCoupon}
        className="rounded-lg bg-[#e69a50] px-3 py-2 text-sm font-bold text-[#160e0a] hover:bg-orange-400"
        >
        Aplicar
        </button>
    </div>

    {couponMessage && (
        <p
        role="status"
        className={`mt-2 text-sm ${
            discount > 0 ? 'text-green-400' : 'text-red-400'
        }`}
        >
        {couponMessage}
        </p>
    )}
    </div>

              <button
                type="button"
                onClick={clearCart}
                className="mt-3 text-sm text-[#c9a98c] underline hover:text-red-400"
              >
                Limpar carrinho
              </button>

              <div className="mt-6 flex justify-between gap-4 text-sm text-[#bca797]">
                <span>Quantidade de itens</span>
                <span>{totalItems}</span>
              </div>

              
            {discount > 0 && (
            <div className="mt-4 flex justify-between gap-4 text-sm text-green-400">
                <span>Desconto ({discount}%)</span>
                <span>-{discountAmount.toFixed(2)} ETH</span>
            </div>
            )}

            
            <div className="mt-4 flex justify-between gap-4 text-sm text-[#bca797]">
                <span>Taxa de serviço (2%)</span>
                <span>+{serviceFee.toFixed(2)} ETH</span>
            </div>

            <div className="mt-4 flex justify-between gap-4 border-t border-[#3b3029] pt-4">
            <span className="font-semibold">Total</span>
            <span className="font-mono text-lg font-bold text-[#e69a50]">
                {finalTotal.toFixed(2)} ETH
            </span>
            </div>

              
            <Link
                to="/checkout"
                className="mt-6 block w-full rounded-lg bg-[#e69a50] px-4 py-3 text-center font-mono font-bold text-[#160e0a] transition-colors hover:bg-[#f0ad69]"
            >
                Finalizar compra
            </Link>

              <p className="mt-3 text-xs leading-5 text-[#bca797]">
                A compra será simulada. Nenhuma transação real será realizada.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  )
}