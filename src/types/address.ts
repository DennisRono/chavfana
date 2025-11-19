export interface AddressData {}

export interface AddressResponse {
  id: string
  country: string
  city: string
  street_address: string
  apartment_address: string
  postal_code: string
  address_type: 'P' | 'S'
  created_at: string
  updated_at: string
}
