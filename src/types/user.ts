import { AddressResponse } from '@/types/address'

export interface PhoneNumber {
  phone_number: string
}

export interface UserResponse {
  id: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  phone_number: PhoneNumber
  addresses: AddressResponse[]
}

export interface UserState {
  userDetails: UserResponse | null
  addresses: AddressResponse[]
  currentAddress: AddressResponse | null
  isLoading: boolean
  error: string | null
}
