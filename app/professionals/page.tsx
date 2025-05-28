import { SearchBar } from '@/components/ui/SearchBar'
import { Pagination } from '@/components/ui/pagination'

const ProfessionalsPage = () => {
  const handleSearch = (filters: any) => {
    console.log('Search filters:', filters)
    // Implement search logic here
  }

  return (
    <div>
      <h1>Professionals</h1>
      <SearchBar onSearch={handleSearch} />
      {/* Professionals list will go here */}
      <Pagination />
    </div>
  )
}

export default ProfessionalsPage
