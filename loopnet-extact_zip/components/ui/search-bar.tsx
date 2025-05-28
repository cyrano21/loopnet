'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  defaultValue?: string
}

export function SearchBar ({
  onSearch,
  placeholder = 'Search properties...',
  defaultValue = ''
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  return (
    <form onSubmit={handleSubmit} className='flex gap-2'>
      <div className='flex-1'>
        <Input
          type='text'
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className='w-full'
        />
      </div>
      <Button type='submit' className='px-6'>
        <Search className='w-4 h-4 mr-2' />
        Search
      </Button>
    </form>
  )
}
