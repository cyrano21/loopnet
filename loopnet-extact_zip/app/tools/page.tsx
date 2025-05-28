import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import Link from 'next/link';

const tools = [
  {
    title: 'Calculateur de Taux de Capitalisation',
    description: 'Calculez le taux de capitalisation de vos investissements immobiliers',
    href: '/tools/cap-rate-calculator',
    icon: Calculator,
  },
  // Ajoutez plus d'outils ici au fur et à mesure
];

export default function OutilsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Outils</h1>
        <p className="text-muted-foreground">
          Des outils pratiques pour vous aider dans vos investissements immobiliers
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href}>
              <Card className="h-full transition-colors hover:bg-accent/50">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{tool.title}</CardTitle>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
