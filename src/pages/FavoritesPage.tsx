import { Link } from '@tanstack/react-router'
import { Heart } from 'lucide-react'
import { useFavorites } from '../context/useFavorites'
import { useQuery } from '@tanstack/react-query'
import { getNFTs } from '../services/nftService'

export default function FavoritesPage() {
  const { favorites, toggleFavorite } = useFavorites()

  
    const { data, isPending, isError } = useQuery({
    queryKey: ['nfts', 'favorites'],
    queryFn: () =>
        getNFTs({
        search: '',
        category: '',
        artist: '',
        sort: 'newest',
        page: 1,
        pageSize: 100,
        }),
    })


  const favoriteNFTs =
    data?.items.filter((nft) => favorites.includes(nft.id)) ?? []

  return (
    <div className="min-h-screen bg-[#120b08] px-5 py-8 text-[#f5e9dc]">
      <div className="mx-auto max-w-7xl">
        <Link
          to="/"
          search={{
            search: '',
            category: '',
            artist: '',
            sort: 'newest',
            page: 1,
          }}
          className="text-sm text-[#e69a50] hover:underline"
        >
          ← Voltar ao mercado
        </Link>

        <div className="mb-8 mt-6 flex items-center gap-3">
          <Heart size={28} className="text-[#e69a50]" />
          <h1 className="font-mono text-3xl font-bold">Meus favoritos</h1>
        </div>

        {isPending ? (
          <p className="text-[#bca797]">Carregando favoritos...</p>
        ) : isError ? (
          <p>Não foi possível carregar os NFTs favoritos.</p>
        ) : favoriteNFTs.length === 0 ? (
          <div className="rounded-lg border border-[#39241a] p-8 text-center">
            <p>Você ainda não tem NFTs favoritos.</p>
            <Link
              to="/"
              search={{
                search: '',
                category: '',
                artist: '',
                sort: 'newest',
                page: 1,
              }}
              className="mt-4 inline-block text-[#e69a50] underline"
            >
              Explorar NFTs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {favoriteNFTs.map((nft) => (
              <div
                key={nft.id}
                className="overflow-hidden rounded-lg bg-[#241711]"
              >
                <Link
                  to="/nft/$nftId"
                  params={{ nftId: nft.id }}
                  className="block"
                >
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="space-y-2 p-4">
                    <p className="text-xs text-[#c9a98c]">{nft.artist}</p>
                    <h2 className="font-mono text-lg font-semibold">
                      {nft.name}
                    </h2>
                    <p className="text-xs text-[#bca797]">{nft.category}</p>
                    <p className="font-bold text-[#e69a50]">
                      {nft.price} {nft.currency}
                    </p>
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => toggleFavorite(nft.id)}
                  className="m-4 rounded-md border border-[#e69a50] px-4 py-2 text-sm text-[#e69a50] hover:bg-[#39241a]"
                >
                  Remover dos favoritos
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}