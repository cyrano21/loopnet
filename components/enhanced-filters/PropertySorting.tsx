'use client'

import React from "react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { ArrowDownWideNarrow, ArrowUpWideNarrow, Check, ChevronsUpDown } from "lucide-react"

interface SortingComponentProps {
  currentSortingOption: string;
  onSortChange: (option: string) => void;
  sortOptions: {
    value: string;
    label: string;
    icon?: React.ElementType;
  }[];
}

const PropertySorting: React.FC<SortingComponentProps> = ({
  currentSortingOption,
  onSortChange,
  sortOptions
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="property-sorting relative">
      <Button
        variant="outline"
        className="w-full flex items-center justify-between border-slate-200 dark:border-slate-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center gap-2">
          <ChevronsUpDown className="h-4 w-4 text-slate-500" />
          <span>Trier par: {sortOptions.find(opt => opt.value === currentSortingOption)?.label}</span>
        </span>
      </Button>

      {isOpen && (
        <Card className="absolute z-10 mt-1 w-full shadow-lg border-slate-200 dark:border-slate-700">
          <CardContent className="p-0">
            <div className="py-1">
              {sortOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <div
                    key={option.value}
                    className={`px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 ${
                      currentSortingOption === option.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''
                    }`}
                    onClick={() => {
                      onSortChange(option.value);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      {IconComponent && <IconComponent className="h-4 w-4 text-slate-500" />}
                      <span>{option.label}</span>
                    </div>
                    {currentSortingOption === option.value && (
                      <Check className="h-4 w-4" />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PropertySorting
