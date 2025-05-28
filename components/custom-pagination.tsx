"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CustomPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function CustomPagination({ currentPage, totalPages, onPageChange }: CustomPaginationProps) {
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex flex-row items-center gap-2 p-1 rounded-lg bg-background/80 backdrop-blur-sm shadow-sm border border-border/30 transition-all duration-300 hover:shadow-md">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="border border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30 transition-all duration-300 hover:scale-105 hover:shadow-sm disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          <ChevronLeft className="h-4 w-4" />
          Précédent
        </Button>

        {getPageNumbers().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <span className="flex h-9 w-9 items-center justify-center text-blue-500 transition-all duration-300">
                <span className="h-4 w-4 animate-pulse">...</span>
              </span>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page as number)}
                className={currentPage === page ? 
                  "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105" : 
                  "hover:text-blue-600 transition-all duration-300 hover:scale-105"
                }
              >
                {page}
              </Button>
            )}
          </div>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30 transition-all duration-300 hover:scale-105 hover:shadow-sm disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          Suivant
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
