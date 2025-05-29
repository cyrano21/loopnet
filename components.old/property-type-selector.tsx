"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PROPERTY_TYPES, TRANSACTION_TYPES } from "@/lib/property-types"

interface PropertyTypeSelectorProps {
  selectedType?: string
  selectedTransaction?: string
  onTypeChange: (type: string) => void
  onTransactionChange: (transaction: string) => void
}

export function PropertyTypeSelector({
  selectedType,
  selectedTransaction,
  onTypeChange,
  onTransactionChange,
}: PropertyTypeSelectorProps) {
  return (
    <div className="space-y-6">
      {/* Sélection du type de transaction */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Type de transaction</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {TRANSACTION_TYPES.map((transaction) => (
            <Card
              key={transaction.value}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTransaction === transaction.value ? "ring-2 ring-blue-600 bg-blue-50" : ""
              }`}
              onClick={() => onTransactionChange(transaction.value)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-2">{transaction.icon}</div>
                <div className="font-medium text-sm">{transaction.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Sélection du type de propriété */}
      {selectedTransaction && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Type de propriété</h3>
          <Tabs defaultValue="commercial" className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
              {Object.entries(PROPERTY_TYPES).map(([key, category]) => (
                <TabsTrigger key={key} value={key} className="text-xs">
                  <span className="mr-1">{category.icon}</span>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(PROPERTY_TYPES).map(([categoryKey, category]) => (
              <TabsContent key={categoryKey} value={categoryKey}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {category.types.map((type) => (
                    <Card
                      key={type.value}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedType === type.value ? "ring-2 ring-blue-600 bg-blue-50" : ""
                      }`}
                      onClick={() => onTypeChange(type.value)}
                    >
                      <CardContent className="p-3 text-center">
                        <div className="text-xl mb-1">{type.icon}</div>
                        <div className="font-medium text-xs">{type.label}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      {/* Résumé de la sélection */}
      {selectedType && selectedTransaction && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2">Sélection actuelle :</h4>
          <div className="flex gap-2">
            <Badge className="bg-green-600">
              {TRANSACTION_TYPES.find((t) => t.value === selectedTransaction)?.label}
            </Badge>
            <Badge variant="outline">
              {
                Object.values(PROPERTY_TYPES)
                  .flatMap((cat) => cat.types)
                  .find((t) => t.value === selectedType)?.label
              }
            </Badge>
          </div>
        </div>
      )}
    </div>
  )
}
