import { SearchBar } from "@/components/ui/SearchBar"
import { Pagination } from "@/components/ui/Pagination"

const ProfessionalsPage = () => {
  return (
    <div>
      <h1>Professionals</h1>
      <SearchBar />
      {/* Professionals list will go here */}
      <Pagination />
    </div>
  )
}

export default ProfessionalsPage
