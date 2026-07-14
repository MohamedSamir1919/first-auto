import React, { useState, useEffect, useMemo } from 'react'
import axios, { AxiosError } from 'axios'
import Skeleton from './Skeleton'

interface Banner {
  id: string
  name: string
  title: string
  img: string
}

interface BannerResponse extends Array<Banner> { }

const SaleBanner: React.FC = () => {
  const [banners, setBanners] = useState<BannerResponse | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const shopBanner = useMemo(() => {
    if (!banners || banners.length === 0) return null
    const filteredBanners = banners?.filter((banner) => banner.name === 'shop banner')
    return filteredBanners.length > 0 ? filteredBanners[filteredBanners.length - 1] : null
  }, [banners])

  const fetchBanners = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)
      const serverUrl = import.meta.env.VITE_SERVER
      const response = await axios.get<BannerResponse>(`${serverUrl}/setting/get-banner`)

      if (response.status === 200) {
        setBanners(response.data)
      }
    } catch (err) {
      const errorMessage = err instanceof AxiosError
        ? err.message
        : 'Failed to load banner'
      setError(errorMessage)
      console.error('Error fetching banners:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])

  if (isLoading) {
    return (
      <div className='w-full flex justify-center p-4'>
        <div className='flex relative items-center mt-12 justify-center w-full'>
          <Skeleton className='h-80 w-full rounded-lg' />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='w-full flex justify-center p-4'>
        <div className='flex relative items-center mt-12 justify-center w-full'>
          <div className='h-80 w-full bg-gray-200 rounded-lg flex items-center justify-center'>
            <p className='text-gray-600 font-medium'>Unable to load banner</p>
          </div>
        </div>
      </div>
    )
  }

  if (!shopBanner) {
    return null
  }

  return (
    <div className='w-full'>
      <div className='w-full flex justify-center p-4'>
        <div className='relative w-full flex items-center justify-center mt-12 overflow-hidden rounded-lg'>
          {/* Overlay */}
          <div className='absolute inset-0 bg-gradient-to-r from-black/50 to-black/30 flex flex-col items-center justify-center z-10'>
            <h1 className='font-bold text-2xl md:text-4xl px-4 py-2 text-white text-center drop-shadow-lg'>
              {shopBanner.title}
            </h1>
          </div>

          {/* Banner Image */}
          <img
            src={shopBanner.img}
            alt={shopBanner.title}
            className='h-80 w-full object-cover'
            loading='lazy'
          />
        </div>
      </div>
    </div>
  )
}

export default SaleBanner