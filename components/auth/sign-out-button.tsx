'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/libs/supabase/client'
import { Button } from '@/components/ui/button'
import { cn } from '@/libs/utils'

interface SignOutButtonProps {
  className?: string;
}

export default function SignOutButton({ className }: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    setIsLoading(true)
    
    try {
      await supabase.auth.signOut()
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleSignOut} 
      disabled={isLoading}
      className={className}
    >
      {isLoading ? 'Signing out...' : 'Sign out'}
    </Button>
  )
} 