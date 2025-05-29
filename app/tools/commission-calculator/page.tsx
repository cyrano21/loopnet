"use client";

import React from "react";
import Link from "next/link";

// Composants temporaires pour remplacer les composants UI
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`bg-white rounded-lg shadow-sm border ${className}`}>
    {children}
  </div>
);

const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-6 border-b ${className}`}>{children}</div>;

const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;

const CardDescription = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <p className={`text-sm text-gray-500 mt-1 ${className}`}>{children}</p>;

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-6 ${className}`}>{children}</div>;

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
));
Input.displayName = "Input";

const Label = ({
  htmlFor,
  children,
  className = "",
}: {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
  >
    {children}
  </label>
);

const Button = ({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Icônes de remplacement
const Calculator = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="16" height="20" x="4" y="2" rx="2" />
    <line x1="8" x2="16" y1="6" y2="6" />
    <line x1="16" x2="16" y1="14" y2="18" />
    <path d="M16 10h.01" />
    <path d="M12 10h.01" />
    <path d="M8 10h.01" />
    <path d="M12 14h.01" />
    <path d="M8 14h.01" />
    <path d="M12 18h.01" />
    <path d="M8 18h.01" />
  </svg>
);

const DollarSign = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" x2="12" y1="2" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const Percent = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="19" x2="5" y1="5" y2="19" />
    <circle cx="6.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);

const TrendingUp = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const Users = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ArrowLeft = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const createBadge = (text: string) => (
  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
    {text}
  </span>
);

interface CommissionResults {
  propertyPrice: number;
  totalCommission: number;
  agentCommission: number;
  expenses: number;
  netCommission: number;
  commissionRate: number;
  splitRate: number;
}

export default function CommissionCalculatorPage() {
  const [propertyPrice, setPropertyPrice] = React.useState("");
  const [commissionRate, setCommissionRate] = React.useState("5");
  const [splitRate, setSplitRate] = React.useState("50");
  const [expenses, setExpenses] = React.useState("");
  const [results, setResults] = React.useState<CommissionResults | null>(null);

  const calculateCommission = () => {
    const price = parseFloat(propertyPrice) || 0;
    const commission = parseFloat(commissionRate) || 0;
    const split = parseFloat(splitRate) || 0;
    const exp = parseFloat(expenses) || 0;

    const totalCommission = (price * commission) / 100;
    const agentCommission = (totalCommission * split) / 100;
    const netCommission = agentCommission - exp;

    setResults({
      propertyPrice: price,
      totalCommission,
      agentCommission,
      expenses: exp,
      netCommission,
      commissionRate: commission,
      splitRate: split,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Rendre directement le contenu pour l'instant pour éviter les erreurs de compilation
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <Link
          href="/tools"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux outils
        </Link>{" "}
        <div className="flex items-center space-x-3 mb-2">
          <Calculator className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Calculateur de Commission</h1>{" "}
          {createBadge("Agent")}
        </div>
        <p className="text-muted-foreground">
          Calculez vos commissions et revenus nets pour vos transactions
          immobilières
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Formulaire de calcul */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Paramètres de la transaction</span>
            </CardTitle>
            <CardDescription>
              Saisissez les détails de votre transaction pour calculer votre
              commission
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="price">Prix de vente de la propriété (€)</Label>{" "}
              <Input
                id="price"
                type="number"
                placeholder="500000"
                value={propertyPrice}
                onChange={(e: any) => setPropertyPrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="commission">Taux de commission total (%)</Label>{" "}
              <Input
                id="commission"
                type="number"
                step="0.1"
                placeholder="5.0"
                value={commissionRate}
                onChange={(e: any) => setCommissionRate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="split">Votre part de la commission (%)</Label>{" "}
              <Input
                id="split"
                type="number"
                step="1"
                placeholder="50"
                value={splitRate}
                onChange={(e: any) => setSplitRate(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Pourcentage que vous gardez après partage avec votre agence
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenses">Frais et dépenses (€)</Label>{" "}
              <Input
                id="expenses"
                type="number"
                placeholder="2000"
                value={expenses}
                onChange={(e: any) => setExpenses(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Marketing, déplacements, documentation, etc.
              </p>
            </div>

            <Button onClick={calculateCommission} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Calculer la commission
            </Button>
          </CardContent>
        </Card>

        {/* Résultats */}
        <div className="space-y-6">
          {results && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Résultats du calcul</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Prix de vente
                      </p>
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(results.propertyPrice)}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Commission totale
                      </p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(results.totalCommission)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Votre part ({results.splitRate}%)
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(results.agentCommission)}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Frais et dépenses
                        </span>
                        <span className="font-semibold text-red-600">
                          -{formatCurrency(results.expenses)}
                        </span>
                      </div>

                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">
                            Commission nette
                          </span>
                          <span className="text-2xl font-bold text-green-600">
                            {formatCurrency(results.netCommission)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Statistiques additionnelles */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Percent className="h-5 w-5" />
                    <span>Analyses</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Taux de commission effectif
                      </p>
                      <p className="text-lg font-semibold">
                        {(
                          (results.netCommission / results.propertyPrice) *
                          100
                        ).toFixed(2)}
                        %
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        ROI sur les frais
                      </p>
                      <p className="text-lg font-semibold">
                        {results.expenses > 0
                          ? (
                              (results.netCommission / results.expenses) *
                              100
                            ).toFixed(0)
                          : "∞"}
                        %
                      </p>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      💡 Conseil
                    </p>
                    <p className="text-sm">
                      {results.netCommission > results.agentCommission * 0.8
                        ? "Excellente rentabilité ! Vos frais sont bien maîtrisés."
                        : "Analysez vos dépenses pour optimiser votre marge nette."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!results && (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  <Calculator className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>
                    Saisissez les informations de votre transaction pour voir
                    les résultats du calcul
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Aide et exemples */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Exemples de calculs</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Transaction Standard</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Prix : 400 000€</li>
                <li>Commission : 5%</li>
                <li>Part agent : 50%</li>
                <li>Frais : 1 500€</li>
                <li className="font-semibold text-foreground pt-1">
                  Net : 8 500€
                </li>
              </ul>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Transaction Premium</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Prix : 800 000€</li>
                <li>Commission : 4%</li>
                <li>Part agent : 60%</li>
                <li>Frais : 2 500€</li>
                <li className="font-semibold text-foreground pt-1">
                  Net : 16 700€
                </li>
              </ul>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Transaction Haut de Gamme</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>Prix : 1 500 000€</li>
                <li>Commission : 3%</li>
                <li>Part agent : 70%</li>
                <li>Frais : 5 000€</li>
                <li className="font-semibold text-foreground pt-1">
                  Net : 26 500€
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
