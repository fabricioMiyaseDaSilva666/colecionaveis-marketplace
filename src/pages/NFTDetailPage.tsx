import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import axios from 'axios'
import type { NFT } from '../services/nftService'
import { useCart } from '../context/useCart'

async function getNFT(id: string): Promise<NFT> {
  const response = await axios.get<NFT>(`/api/nfts/${id}`)
  return response.data
}

export default function NFTDetailPage() {
  const { nftId } = useParams({ from: '/nft/$nftId' })

  const { addToCart } = useCart()

  const { data: nft, isPending, isError } = useQuery({
    queryKey: ['nft', nftId],
    queryFn: () => getNFT(nftId),
  })

  if (isPending) {
    return (
      <main className="min-h-screen bg-[#160e0a] p-8 text-white">
        Carregando detalhes do NFT...
      </main>
    )
  }

  if (isError || !nft) {
    return (
      <main className="min-h-screen bg-[#160e0a] p-8 text-white">
        <p>Não foi possível encontrar esse NFT.</p>
        <Link
            to="/"
            search={{
                search: '',
                category: '',
                artist: '',
                sort: 'newest',
                page: 1,
            }}
            className="mt-4 inline-block text-[#e69a50]"
        >
            Voltar para a página inicial
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#160e0a] px-6 py-8 text-white sm:px-10">
      <header className="mx-auto max-w-6xl">
        <Link
          to="/"
          search={{
            search: '',
            category: '',
            artist: '',
            sort: 'newest',
            page: 1,
          }}
          className="inline-flex items-center gap-2 text-sm text-[#c9a98c] transition hover:text-orange-400"
        >
          <ArrowLeft size={16} />
          Voltar à coleção
        </Link>

        <p className="mt-8 font-mono text-sm uppercase tracking-[0.3em] text-[#e69a50]">
          {nft.category}
        </p>

        <div className="mt-4 grid gap-10 md:grid-cols-2 md:items-start">
          <img
            src={nft.image}
            alt={nft.name}
            className="w-full rounded-2xl object-cover"
          />

          <section className="space-y-6">
            <div>
              <p className="text-sm text-[#c9a98c]">
                Criado por {nft.artist}
              </p>
              <h1 className="mt-3 font-mono text-3xl font-bold sm:text-5xl">
                {nft.name}
              </h1>
            </div>

            <div className="rounded-xl border border-[#3b3029] bg-[#241711] p-6">
              <p className="text-sm text-[#bca797]">Preço atual</p>
              <p className="mt-2 font-mono text-3xl font-bold text-[#e69a50]">
                {nft.price} {nft.currency}
              </p>
              <p className="mt-3 text-sm text-[#bca797]">
                {nft.available} unidades disponíveis
              </p>
            </div>

            <button
                type="button"
                onClick={() => addToCart(nft)}
                disabled={nft.available <= 0}
                className="w-full rounded-lg bg-[#e69a50] px-6 py-4 font-mono font-bold text-[#160e0a] transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {nft.available > 0 ? 'Adicionar ao carrinho' : 'Esgotado'}
            </button>

            <p className="text-sm leading-6 text-[#bca797]">
              Explore os detalhes deste colecionável digital. A compra será
              simulada no próprio marketplace, sem transações reais.
            </p>
          </section>
        </div>
      </header>
    </main>
  )
}