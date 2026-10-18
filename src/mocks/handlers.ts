import { http, HttpResponse } from 'msw'

const nfts = [
  {
    id: 'nft-001',
    name: 'Cosmic Bloom',
    artist: 'Nova Studio',
    price: '0.25',
    currency: 'ETH',
    image: '/images/cosmic-bloom.png',
    available: 8,
    category: 'Arte',
  },
  {
    id: 'nft-002',
    name: 'Emerald Ape',
    artist: 'Pixel Ghost',
    price: '0.18',
    currency: 'ETH',
    image: '/images/emerald-ape.png',
    available: 5,
    category: 'Colecionáveis',
  },
  {
    id: 'nft-003',
    name: 'Golden Beat',
    artist: 'Kira Labs',
    price: '0.32',
    currency: 'ETH',
    image: '/images/golden-beat.png',
    available: 3,
    category: 'Música',
  },
  {
    id: 'nft-004',
    name: 'Neon Vessel',
    artist: 'Nova Studio',
    price: '0.42',
    currency: 'ETH',
    image: '/images/neon-vessel.png',
    available: 6,
    category: 'Arte',
  },
  {
    id: 'nft-005',
    name: 'Digital Horizon',
    artist: 'Studio North',
    price: '0.12',
    currency: 'ETH',
    image: '/images/cosmic-bloom.png',
    available: 12,
    category: 'Arte',
  },
  {
    id: 'nft-006',
    name: 'Ape Society',
    artist: 'Pixel Ghost',
    price: '0.55',
    currency: 'ETH',
    image: '/images/emerald-ape.png',
    available: 2,
    category: 'Colecionáveis',
  },
  {
    id: 'nft-007',
    name: 'Golden Rhythm',
    artist: 'Kira Labs',
    price: '0.21',
    currency: 'ETH',
    image: '/images/golden-beat.png',
    available: 9,
    category: 'Música',
  },
  {
    id: 'nft-008',
    name: 'Vessel of Light',
    artist: 'Studio North',
    price: '0.38',
    currency: 'ETH',
    image: '/images/neon-vessel.png',
    available: 4,
    category: 'Arte',
  },
  {
    id: 'nft-009',
    name: 'Cosmic Echo',
    artist: 'Nova Studio',
    price: '0.15',
    currency: 'ETH',
    image: '/images/cosmic-bloom.png',
    available: 7,
    category: 'Música',
  },
  {
    id: 'nft-010',
    name: 'Emerald Legacy',
    artist: 'Pixel Ghost',
    price: '0.47',
    currency: 'ETH',
    image: '/images/emerald-ape.png',
    available: 1,
    category: 'Colecionáveis',
  },
  {
    id: 'nft-011',
    name: 'Golden Era',
    artist: 'Kira Labs',
    price: '0.29',
    currency: 'ETH',
    image: '/images/golden-beat.png',
    available: 10,
    category: 'Música',
  },
  {
    id: 'nft-012',
    name: 'Neon Dreams',
    artist: 'Studio North',
    price: '0.33',
    currency: 'ETH',
    image: '/images/neon-vessel.png',
    available: 5,
    category: 'Arte',
  },
]


type MockOrder = {
  id: string
  items: {
    nftId: string
    name: string
    quantity: number
    price: number
  }[]
  subtotal: number
  discount: number
  serviceFee: number
  total: number
  paymentMethod: string
  status: 'confirmed' | 'pending' | 'refused'
  createdAt: string
}

const mockOrders: MockOrder[] = []
type MockUser = {
  id: string
  name: string
  email: string
  password: string
}

const mockUsers: MockUser[] = []


export const handlers = [
  http.get('/api/nfts', ({ request }) => {
    const url = new URL(request.url)

    const search = url.searchParams.get('search')?.toLowerCase() ?? ''
    const category = url.searchParams.get('category') ?? ''
    const artist = url.searchParams.get('artist') ?? ''
    const sort = url.searchParams.get('sort') ?? 'newest'
    const page = Math.max(1, Number(url.searchParams.get('page') ?? 1))
    const pageSize = Math.min(
      12,
      Math.max(1, Number(url.searchParams.get('pageSize') ?? 6)),
    )

    let filtered = nfts.filter((nft) => {
      const matchesSearch =
        nft.name.toLowerCase().includes(search) ||
        nft.artist.toLowerCase().includes(search)

      const matchesCategory = !category || nft.category === category
      const matchesArtist = !artist || nft.artist === artist

      return matchesSearch && matchesCategory && matchesArtist
    })

    if (sort === 'price-asc') {
      filtered = [...filtered].sort(
        (a, b) => Number(a.price) - Number(b.price),
      )
    } else if (sort === 'price-desc') {
      filtered = [...filtered].sort(
        (a, b) => Number(b.price) - Number(a.price),
      )
    }

    const total = filtered.length
    const start = (page - 1) * pageSize
    const items = filtered.slice(start, start + pageSize)

    return HttpResponse.json({
      items,
      total,
      page,
      pageSize,
    })
  }),

  
  http.get('/api/nfts/:id', ({ params }) => {
    const nft = nfts.find((item) => item.id === params.id)

    if (!nft) {
      return HttpResponse.json(
        { message: 'NFT não encontrado' },
        { status: 404 },
      )
    }

    return HttpResponse.json(nft)
  }),
  
http.post('/api/orders', async ({ request }) => {
    const body = (await request.json()) as Omit<
      MockOrder,
      'id' | 'status' | 'createdAt'
    >

    const url = new URL(request.url)
    const scenario = url.searchParams.get('scenario')

const status: MockOrder['status'] =
  scenario === 'confirmed'
    ? 'confirmed'
    : scenario === 'pending'
      ? 'pending'
      : scenario === 'refused'
        ? 'refused'
        : Math.random() < 0.6
          ? 'confirmed'
          : Math.random() < 0.5
            ? 'pending'
            : 'refused'

    const order: MockOrder = {
      ...body,
      id: `order-${Date.now()}`,
      status,
      createdAt: new Date().toISOString(),
    }

    mockOrders.push(order)

    return HttpResponse.json(order, { status: 201 })
  }),
  
  http.post('/api/auth/register', async ({ request }) => {
    const body = (await request.json()) as {
      name: string
      email: string
      password: string
    }

    const email = body.email.trim().toLowerCase()

    const existingUser = mockUsers.find(
      (user) => user.email === email,
    )

    if (existingUser) {
      return HttpResponse.json(
        { message: 'Este e-mail já está cadastrado.' },
        { status: 409 },
      )
    }

    const user: MockUser = {
      id: `user-${Date.now()}`,
      name: body.name.trim(),
      email,
      password: body.password,
    }

    mockUsers.push(user)

    return HttpResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    )
  }),
  
http.post('/api/auth/login', async ({ request }) => {
    const body = (await request.json()) as {
      email: string
      password: string
    }

    const email = body.email.trim().toLowerCase()

    const user = mockUsers.find(
      (item) =>
        item.email === email && item.password === body.password,
    )

    if (!user) {
      return HttpResponse.json(
        { message: 'E-mail ou senha incorretos.' },
        { status: 401 },
      )
    }

    return HttpResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  }),
]