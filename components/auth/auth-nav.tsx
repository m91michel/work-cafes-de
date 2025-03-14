'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/libs/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { isProd } from '@/libs/environment'

export default function AuthNav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setIsLoading(false)
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  if (isLoading) {
    return null
  }

  // Don't show auth nav on login page
  if (pathname === '/login' || isProd) {
    return null
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            Dashboard
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <Link href="/login">
      <Button variant="ghost" size="sm">
        Login
      </Button>
    </Link>
  )
} 