import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Heart, Search, ShoppingCart } from 'lucide-react'
import { getNFTs } from '../services/nftService'
import { useCart } from '../context/useCart'
import { useAuth } from '../context/useAuth'
import { useFavorites } from '../context/useFavorites'
import { socket } from '../services/socket'

export default function HomePage() {
  const { totalItems } = useCart()
  const navigate = useNavigate({ from: '/' })
  const searchParams = useSearch({ from: '/' })
  const { user, logout } = useAuth()
  const { toggleFavorite, isFavorite } = useFavorites()
  const [availabilityUpdates, setAvailabilityUpdates] = useState<
  Record<string, number>
>({})

useEffect(() => {
  function handleAvailabilityUpdate(update: {
    nftId: string
    available: number
  }) {
    setAvailabilityUpdates((current) => ({
      ...current,
      [update.nftId]: update.available,
    }))
  }

  socket.on('nft:availability', handleAvailabilityUpdate)

  return () => {
    socket.off('nft:availability', handleAvailabilityUpdate)
  }
}, [])


  const search = typeof searchParams.search === 'string' ? searchParams.search : ''
  const category = typeof searchParams.category === 'string' ? searchParams.category : ''
  const artist = typeof searchParams.artist === 'string' ? searchParams.artist : ''
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest'
  const page = typeof searchParams.page === 'number' ? searchParams.page : 1
  const pageSize = 6

  const [searchInput, setSearchInput] = useState(search)

  const { data, isPending, isError } = useQuery({
    queryKey: ['nfts', search, category, artist, sort, page, pageSize],
    queryFn: () =>
      getNFTs({ search, category, artist, sort, page, pageSize }),
  })

  function updateFilters(
    updates: Partial<{
      search: string
      category: string
      artist: string
      sort: string
      page: number
    }>,
  ) {
    navigate({
      search: (previous) => ({
        ...previous,
        ...updates,
        page: updates.page ?? 1,
      }),
    })
  }

  const categories = ['Arte', 'Colecionáveis', 'Música']
  const artists = ['Nova Studio', 'Pixel Ghost', 'Kira Labs', 'Studio North']

  return (
    <div className="min-h-screen bg-[#120b08] text-[#f5e9dc]">
      <header className="border-b border-[#39241a]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4">
          <Link
            to="/" search={{
                     search: '',
                     category: '',
                     artist: '',
                     sort: 'newest',
                     page: 1,
                   }}
                   className="font-mono text-lg font-bold tracking-[0.2em] text-[#e69a50]"
          >
            KURIO
          </Link>

          <div className="hidden items-center gap-8 text-sm md:flex">
            <Link to="/" search={{
                           search: '',
                           category: '',
                           artist: '',
                           sort: 'newest',
                           page: 1,
                         }}
                         className="border-b-2 border-[#e69a50] pb-2 text-[#e69a50]">
              Início
            </Link>
            <a href="#catalogo" className="text-[#c9b5a4] hover:text-white">
              Mercado
            </a>
            <a href="#diario" className="text-[#c9b5a4] hover:text-white">
              Aprenda
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Pesquisar"
              onClick={() => document.getElementById('catalog-search')?.focus()}
              className="text-[#e7d6c8] hover:text-[#e69a50]"
            >
              <Search size={20} />
            </button>

            <Link
              to="/favoritos"
              aria-label="Meus favoritos"
              className="text-[#e7d6c8] hover:text-[#e69a50]"
            >
              <Heart size={20} />
            </Link>
            
            <Link
              to="/carrinho"
              aria-label={`Carrinho, ${totalItems} itens`}
              className="relative text-[#e7d6c8] hover:text-[#e69a50]"
            >
              <ShoppingCart size={20} />

              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e69a50] px-1 text-xs font-bold text-[#160e0a]">
                  {totalItems}
                </span>
              )}
            </Link>
            
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#e7d6c8]">
                  Olá, {user.name}
                </span>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-md border border-[#e69a50] px-4 py-2 text-sm font-semibold text-[#e69a50] hover:bg-[#39241a]"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="rounded-md bg-[#e69a50] px-4 py-2 text-sm font-semibold text-[#201109] hover:bg-[#f2b16f]"
              >
                Entrar
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5">
        <section className="grid items-center gap-10 py-12 md:grid-cols-2 md:py-16">
          <div>
            <p className="mb-4 font-mono text-sm text-[#c9a98c]">
              Bem-vindo à Kurio
            </p>
            <h1 className="max-w-xl font-mono text-3xl font-bold leading-tight sm:text-4xl">
              SEJA DONO DO FUTURO DA ARTE DIGITAL
            </h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-[#bca797]">
              Descubra NFTs selecionados de criadores emergentes e consagrados.
              Colecione arte digital rara, apoie artistas e tenha uma parte da
              cultura da internet.
            </p>
            <a
              href="#catalogo"
              className="mt-6 inline-block rounded-md bg-[#e69a50] px-6 py-3 text-sm font-bold text-[#201109] transition hover:bg-[#f2b16f]"
            >
              EXPLORAR
            </a>
          </div>

          {data?.items[0] && (
            <div className="overflow-hidden rounded-2xl">
              <img
                src={data.items[0].image}
                alt={data.items[0].name}
                className="aspect-square w-full object-cover"
              />  
            </div>
          )}
        </section>

        <section id="catalogo" className="py-10">
          <div className="mb-6">
            <p className="font-mono text-sm text-[#e69a50]">COLEÇÃO</p>
            <h2 className="mt-2 text-2xl font-bold">Todos os NFTs</h2>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
            <aside className="space-y-5 rounded-lg border border-[#39241a] bg-[#1a100c] p-4">
              <h3 className="font-mono font-bold">FILTROS</h3>

              <div>
                <label htmlFor="category-filter" className="mb-2 block text-sm text-[#c9b5a4]">
                  Categoria
                </label>
                <select
                  id="category-filter"
                  value={category}
                  onChange={(event) => updateFilters({ category: event.target.value })}
                  className="w-full rounded-md border border-[#503525] bg-[#241711] p-2 text-sm"
                >
                  <option value="">Todas</option>
                  {categories.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="artist-filter" className="mb-2 block text-sm text-[#c9b5a4]">
                  Artista
                </label>
                <select
                  id="artist-filter"
                  value={artist}
                  onChange={(event) => updateFilters({ artist: event.target.value })}
                  className="w-full rounded-md border border-[#503525] bg-[#241711] p-2 text-sm"
                >
                  <option value="">Todos</option>
                  {artists.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSearchInput('')
                  updateFilters({ search: '', category: '', artist: '', sort: 'newest' })
                }}
                className="text-sm text-[#e69a50] underline"
              >
                Limpar filtros
              </button>
            </aside>

            <div className="min-w-0">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                <div className="flex flex-1 items-center gap-2 rounded-md border border-[#503525] bg-[#1a100c] px-3">
                  <Search size={18} className="text-[#bca797]" />
                  <input
                    id="catalog-search"
                    type="search"
                    value={searchInput}
                    onChange={(event) => {
                      setSearchInput(event.target.value)
                      updateFilters({ search: event.target.value })
                    }}
                    placeholder="Buscar NFT ou artista..."
                    className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#8d7869]"
                    aria-label="Buscar NFTs por nome ou artista"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm text-[#c9b5a4]">
                  Ordenar:
                  <select
                    value={sort}
                    onChange={(event) => updateFilters({ sort: event.target.value })}
                    className="rounded-md border border-[#503525] bg-[#241711] p-3 text-[#f5e9dc]"
                  >
                    <option value="newest">Mais recentes</option>
                    <option value="price-asc">Menor preço</option>
                    <option value="price-desc">Maior preço</option>
                  </select>
                </label>
              </div>

              {isPending ? (
                <p className="p-8 text-[#bca797]">Carregando colecionáveis...</p>
              ) : isError ? (
                <div className="rounded-lg border border-[#75412e] p-6">
                  <p>Não foi possível carregar os colecionáveis.</p>
                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-3 text-[#e69a50] underline"
                  >
                    Tentar novamente
                  </button>
                </div>
              ) : data.items.length === 0 ? (
                <div className="rounded-lg border border-[#39241a] p-8 text-center">
                  <p>Nenhum NFT encontrado com esses filtros.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput('')
                      updateFilters({ search: '', category: '', artist: '', sort: 'newest' })
                    }}
                    className="mt-3 text-[#e69a50] underline"
                  >
                    Limpar filtros
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4 text-sm text-[#bca797]">
                    {data.total} resultado(s)
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"> 
                    {data.items.map((nft) => (
                      <Link
                        key={nft.id}
                        to="/nft/$nftId"
                        params={{ nftId: nft.id }}
                        className="block overflow-hidden rounded-lg bg-[#241711] transition hover:-translate-y-1 hover:ring-1 hover:ring-orange-500"
                      >
                        <img
                          src={nft.image}
                          alt={nft.name}
                          className="aspect-square w-full object-cover"
                        />
                        
                        <button
                          type="button"
                          aria-label={
                            isFavorite(nft.id)
                              ? `Remover ${nft.name} dos favoritos`
                              : `Adicionar ${nft.name} aos favoritos`
                          }
                          aria-pressed={isFavorite(nft.id)}
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            toggleFavorite(nft.id)
                          }}
                          className="m-3 rounded-full bg-[#120b08] p-2 text-[#e69a50] hover:bg-[#39241a]"
                        >
                          <Heart
                            size={20}
                            fill={isFavorite(nft.id) ? 'currentColor' : 'none'}
                          />
                        </button>

                        <div className="space-y-2 p-4">
                          <p className="text-xs text-[#c9a98c]">{nft.artist}</p>

                          <h3 className="font-mono text-lg font-semibold">
                            {nft.name}
                          </h3>

                          <p className="text-xs text-[#bca797]">{nft.category}</p>

                          <div className="flex items-center justify-between gap-3">
                            <p className="font-bold text-[#e69a50]">
                              {nft.price} {nft.currency}
                            </p>

                            <p className="text-xs text-[#bca797]">
                              {availabilityUpdates[nft.id] ?? nft.available} disponíveis
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {data && data.total > pageSize && (
                    <div className="mt-10 flex items-center justify-center gap-6">
                      <button
                        onClick={() => updateFilters({ page: page - 1 })}
                        disabled={page <= 1}
                        className="rounded border border-[#3b3029] px-5 py-3 font-mono text-sm text-white transition hover:border-orange-500 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        ← Anterior
                      </button>

                      <span className="font-mono text-sm text-[#a69a90]">
                        Página {page} de {Math.ceil(data.total / pageSize)}
                      </span>

                      <button
                        onClick={() => updateFilters({ page: page + 1 })}
                        disabled={page >= Math.ceil(data.total / pageSize)}
                        className="rounded border border-[#3b3029] px-5 py-3 font-mono text-sm text-white transition hover:border-orange-500 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        Próxima →
                      </button>
                    </div>
                  )}

                  <div className="mt-8 flex items-center justify-between gap-4">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => updateFilters({ page: page - 1 })}
                      className="rounded-md border border-[#503525] px-4 py-2 text-sm disabled:opacity-40"
                    >
                      Anterior
                    </button>
                    <span className="text-sm text-[#bca797]">
                      Página {page} de {Math.max(1, Math.ceil(data.total / data.pageSize))}
                    </span>
                    <button
                      type="button"
                      disabled={page >= Math.ceil(data.total / data.pageSize)}
                      onClick={() => updateFilters({ page: page + 1 })}
                      className="rounded-md border border-[#503525] px-4 py-2 text-sm disabled:opacity-40"
                    >
                      Próxima
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        <section id="diario" className="py-12 text-center">
          <h2 className="font-mono text-2xl font-bold">Diário da Cunhagem</h2>
          <p className="mt-3 text-sm text-[#bca797]">
            Histórias e novidades do universo da arte digital.
          </p>
        </section>
      </main>

      <footer className="border-t border-[#39241a] px-5 py-8 text-center text-sm text-[#bca797]">
        KURIO · Propriedade digital para todos.
      </footer>
    </div>
  )
}