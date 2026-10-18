import axios from 'axios'

export interface NFT {
  id: string
  name: string
  artist: string
  price: string
  currency: string
  image: string
  available: number
  category: string
}

export interface NFTFilters {
  search: string
  category: string
  artist: string
  sort: string
  page: number
  pageSize: number
}

interface NFTListResponse {
  items: NFT[]
  total: number
  page: number
  pageSize: number
}

export async function getNFTs(filters: NFTFilters): Promise<NFTListResponse> {
  const response = await axios.get<NFTListResponse>('/api/nfts', {
    params: filters,
  })

  return response.data
}