import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";
import { PropertySeedData } from "@/lib/seed-data";

interface PropertyReviewsProps {
  property: PropertySeedData;
}

interface Review {
  id: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
  verified: boolean;
}

export function PropertyReviews({ property }: PropertyReviewsProps) {
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  // Données d'exemple pour les avis
  const reviews: Review[] = [
    {
      id: "1",
      author: "Marie Dubois",
      rating: 5,
      date: "2024-01-15",
      comment: "Excellente propriété, très bien située et en parfait état. Le propriétaire est très réactif et professionnel. Je recommande vivement !",
      helpful: 12,
      verified: true
    },
    {
      id: "2",
      author: "Jean Martin",
      rating: 4,
      date: "2024-01-10",
      comment: "Bon rapport qualité-prix. L'emplacement est idéal, proche de tous les commerces. Quelques petits travaux à prévoir mais rien de majeur.",
      helpful: 8,
      verified: true
    },
    {
      id: "3",
      author: "Sophie Laurent",
      rating: 5,
      date: "2024-01-05",
      comment: "Propriété magnifique ! Les photos ne rendent pas justice à la réalité. Très lumineux et spacieux. Parfait pour une famille.",
      helpful: 15,
      verified: false
    }
  ];

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= (interactive ? hoveredRating || newRating : rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${interactive ? "cursor-pointer" : ""}`}
            onClick={() => interactive && onRate && onRate(star)}
            onMouseEnter={() => interactive && setHoveredRating(star)}
            onMouseLeave={() => interactive && setHoveredRating(0)}
          />
        ))}
      </div>
    );
  };

  const handleSubmitReview = () => {
    if (newReview.trim() && newRating > 0) {
      // Ici, vous ajouteriez la logique pour soumettre l'avis
      console.log("Nouvel avis:", { rating: newRating, comment: newReview });
      setNewReview("");
      setNewRating(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Résumé des avis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Avis et évaluations</span>
            <Badge variant="outline">{totalReviews} avis</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center mb-1">
                {renderStars(averageRating)}
              </div>
              <div className="text-sm text-gray-600">
                {totalReviews} avis
              </div>
            </div>
            
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter(r => r.rating === rating).length;
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-2 mb-1">
                    <span className="text-sm w-8">{rating}</span>
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-400 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire d'ajout d'avis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Laisser un avis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre évaluation
              </label>
              {renderStars(newRating, true, setNewRating)}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre commentaire
              </label>
              <Textarea
                placeholder="Partagez votre expérience avec cette propriété..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                rows={4}
              />
            </div>
            
            <Button 
              onClick={handleSubmitReview}
              disabled={!newReview.trim() || newRating === 0}
            >
              Publier l'avis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des avis */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={review.avatar} />
                  <AvatarFallback>
                    {review.author.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-gray-900">{review.author}</span>
                    {review.verified && (
                      <Badge variant="outline" className="text-xs">
                        Vérifié
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600">
                      {new Date(review.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-gray-600">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Utile ({review.helpful})
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}