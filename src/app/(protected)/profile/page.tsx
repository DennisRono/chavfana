'use client'

import { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { getUserDetails } from '@/store/actions/user'
import { getAllAddresses } from '@/store/actions/address'
import {
  selectUserDetails,
  selectUserAddresses,
  selectUserLoading,
  selectPrimaryAddress,
  selectSecondaryAddresses,
} from '@/store/selectors/user'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { User, MapPin, Phone, Mail } from 'lucide-react'

const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const userDetails = useAppSelector(selectUserDetails)
  const addresses = useAppSelector(selectUserAddresses)
  const isLoading = useAppSelector(selectUserLoading)
  const primaryAddress = useAppSelector(selectPrimaryAddress)
  const secondaryAddresses = useAppSelector(selectSecondaryAddresses)

  useEffect(() => {
    dispatch(getUserDetails())
    dispatch(getAllAddresses())
  }, [dispatch])

  const addressCards = useMemo(() => {
    return addresses.map((address) => (
      <Card key={address.id}>
        <CardHeader>
          <CardTitle className="text-sm">
            {address.address_type === 'P'
              ? 'Primary Address'
              : 'Secondary Address'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <p>{address.street_address}</p>
          <p>{address.apartment_address}</p>
          <p>
            {address.city}, {address.postal_code}
          </p>
          <p>{address.country}</p>
        </CardContent>
      </Card>
    ))
  }, [addresses])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    )
  }

  if (!userDetails) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-muted-foreground">
          No user data available
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">First Name</p>
              <p className="font-medium">{userDetails.first_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Name</p>
              <p className="font-medium">{userDetails.last_name}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{userDetails.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">
                {userDetails.phone_number.phone_number}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Addresses
            </CardTitle>
            <Button variant="outline" size="sm">
              Add Address
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {addresses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No addresses added yet
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addressCards}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage
