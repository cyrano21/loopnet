import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, ThumbsUp, MessageCircle, LogIn, User, Mail, Phone } from "lucide-react";
import { PropertySeedData } from "@/lib/seed-data";
import { useAuth } from "@/hooks/use-auth";
import { usePermissions } from "@/hooks/use-permissions";
import Link from "next/link";

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
  const { isAuthenticated, isAdmin } = useAuth();
  const { can } = usePermissions();

  // Données d'exemple pour les avis
  const reviews: Review[] = [
    {
      id: "1",
      author: "Marie Dubois",
      rating: 5,
      date: "2024-01-15",
      comment:
        "Excellente propriété, très bien située et en parfait état. Le propriétaire est très réactif et professionnel. Je recommande vivement !",
      helpful: 12,
      verified: true,
    },
    {
      id: "2",
      author: "Jean Martin",
      rating: 4,
      date: "2024-01-10",
      comment:
        "Bon rapport qualité-prix. L'emplacement est idéal, proche de tous les commerces. Quelques petits travaux à prévoir mais rien de majeur.",
      helpful: 8,
      verified: true,
    },
    {
      id: "3",
      author: "Sophie Laurent",
      rating: 5,
      date: "2024-01-05",
      comment:
        "Propriété magnifique ! Les photos ne rendent pas justice à la réalité. Très lumineux et spacieux. Parfait pour une famille.",
      helpful: 15,
      verified: false,
    },
  ];

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const totalReviews = reviews.length;

  const renderStars = (
    rating: number,
    interactive = false,
    onRate?: (rating: number) => void
  ) => {
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
      {/* Résumé des avis - Style Homez */}
      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
        <h4 className="title fz17 mb30 flex items-center justify-between">
          <span>Avis et évaluations</span>
          <Badge variant="outline">{totalReviews} avis</Badge>
        </h4>
        <div className="row">
          <div className="col-sm-12">
            <div className="rating-summary">
              <div className="overall-rating">
                <div className="overall-rating-number">
                  {averageRating.toFixed(1)}
                </div>
                <div className="overall-rating-stars">
                  {renderStars(averageRating)}
                </div>
                <div className="overall-rating-count">{totalReviews} avis</div>
              </div>

              <div className="rating-breakdown">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = reviews.filter((r) => r.rating === rating).length;
                  const percentage =
                    totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                  return (
                    <div key={rating} className="rating-breakdown-item">
                      <span className="rating-number">{rating}</span>
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <div className="rating-bar">
                        <div
                          className={`rating-bar-fill rating-bar-fill-${Math.round(percentage / 5) * 5}`}
                        ></div>
                      </div>
                      <span className="rating-count">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout d'avis - Style Homez */}
      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
        <h4 className="title fz17 mb30">Laisser un avis</h4>
        <div className="row">
          <div className="col-sm-12">
            <form className="comments_form mt30" onSubmit={(e) => e.preventDefault()}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-4">
                    <label className="fw600 ff-heading mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Nom complet
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Votre nom et prénom"
                      disabled={!isAuthenticated && !isAdmin}
                      onClick={() => !isAuthenticated && !isAdmin && (window.location.href = '/auth/signin')}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-4">
                    <label className="fw600 ff-heading mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email
                    </label>
                    <Input
                      type="email"
                      className="form-control"
                      placeholder="votre@email.com"
                      disabled={!isAuthenticated && !isAdmin}
                      onClick={() => !isAuthenticated && !isAdmin && (window.location.href = '/auth/signin')}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-4">
                    <label className="fw600 ff-heading mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Téléphone (optionnel)
                    </label>
                    <Input
                      type="tel"
                      className="form-control"
                      placeholder="06 12 34 56 78"
                      disabled={!isAuthenticated && !isAdmin}
                      onClick={() => !isAuthenticated && !isAdmin && (window.location.href = '/auth/signin')}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="widget-wrapper sideborder-dropdown mb-4">
                    <label className="fw600 ff-heading mb-2">Type d'utilisateur</label>
                    <div className="form-style2 input-group">
                      <Select
                        disabled={!isAuthenticated && !isAdmin}
                        onOpenChange={() => !isAuthenticated && !isAdmin && (window.location.href = '/auth/signin')}
                      >
                        <SelectTrigger className="custom-react_select">
                          <SelectValue placeholder="Sélectionnez votre profil" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buyer">Acheteur</SelectItem>
                          <SelectItem value="seller">Vendeur</SelectItem>
                          <SelectItem value="tenant">Locataire</SelectItem>
                          <SelectItem value="landlord">Propriétaire</SelectItem>
                          <SelectItem value="investor">Investisseur</SelectItem>
                          <SelectItem value="agent">Agent immobilier</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-4">
                    <label className="fw600 ff-heading mb-2">Titre de l'avis</label>
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="Résumez votre expérience"
                      disabled={!isAuthenticated && !isAdmin}
                      onClick={() => !isAuthenticated && !isAdmin && (window.location.href = '/auth/signin')}
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="widget-wrapper sideborder-dropdown mb-4">
                    <label className="fw600 ff-heading mb-2">Note</label>
                    <div className="form-style2 input-group">
                      <Select
                        disabled={!isAuthenticated && !isAdmin}
                        onOpenChange={() => !isAuthenticated && !isAdmin && (window.location.href = '/auth/signin')}
                      >
                        <SelectTrigger className="custom-react_select">
                          <SelectValue placeholder="Choisissez une note" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">⭐⭐⭐⭐⭐ Excellent (5 étoiles)</SelectItem>
                          <SelectItem value="4">⭐⭐⭐⭐ Très bien (4 étoiles)</SelectItem>
                          <SelectItem value="3">⭐⭐⭐ Bien (3 étoiles)</SelectItem>
                          <SelectItem value="2">⭐⭐ Moyen (2 étoiles)</SelectItem>
                          <SelectItem value="1">⭐ Décevant (1 étoile)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="mb-4">
                    <label className="fw600 ff-heading mb-2">Votre avis détaillé</label>
                    <Textarea
                      className="pt15 form-control"
                      rows={6}
                      placeholder="Partagez votre expérience avec cette propriété. Qu'avez-vous apprécié ? Quels sont les points à améliorer ?"
                      value={newReview}
                      onChange={(e) => isAuthenticated || isAdmin ? setNewReview(e.target.value) : null}
                      onClick={() => !isAuthenticated && !isAdmin && (window.location.href = '/auth/signin')}
                      disabled={!isAuthenticated && !isAdmin}
                    />
                  </div>

                  {isAuthenticated || isAdmin ? (
                    <button 
                      type="submit" 
                      className="ud-btn btn-white2"
                      onClick={handleSubmitReview}
                      disabled={!newReview.trim()}
                    >
                      Publier l'avis
                      <i className="fal fa-arrow-right-long" />
                    </button>
                  ) : (
                    <div className="login-prompt">
                      <div className="text-center">
                        <h4>🔒 Connectez-vous pour laisser un avis</h4>
                        <p>
                          Partagez votre expérience et aidez les autres utilisateurs à prendre leur décision.
                        </p>
                        <div className="space-y-2">
                          <Link href="/auth/signin">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                              <LogIn className="w-4 h-4 mr-2" />
                              Se connecter
                            </Button>
                          </Link>
                          <Link href="/auth/signup">
                            <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                              Créer un compte gratuit
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Liste des avis - Style Homez */}
      <div className="ps-widget bgc-white bdrs12 default-box-shadow2 p30 mb30 overflow-hidden position-relative">
        <h4 className="title fz17 mb30">Tous les avis</h4>
        <div className="row">
          <div className="col-sm-12">
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={review.avatar} />
                      <AvatarFallback className="avatar-fallback">
                        {review.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="review-header">
                        <span className="review-author">
                          {review.author}
                        </span>
                        {review.verified && (
                          <Badge variant="outline" className="verified-badge text-xs">
                            Vérifié
                          </Badge>
                        )}
                      </div>

                      <div className="review-meta">
                        <div className="rating-stars">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {new Date(review.date).toLocaleDateString("fr-FR")}
                        </span>
                      </div>

                      <p className="review-comment">{review.comment}</p>

                      <div className="review-actions">
                        <Button variant="ghost" size="sm" className="text-gray-600">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Utile ({review.helpful})
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
