
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface ReviewsProps {
  productId: string;
}

const ProductReviews = ({ productId }: ReviewsProps) => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch reviews
  const { data: reviews, refetch } = useQuery({
    queryKey: ['productReviews', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          users(email)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  // Check if user already submitted a review
  const hasSubmittedReview = user ? reviews?.some(review => review.user_id === user.id) : false;

  const handleSubmitReview = async () => {
    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (hasSubmittedReview) {
      toast({
        title: "Review already submitted",
        description: "You have already submitted a review for this product.",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Review required",
        description: "Please enter your review.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: productId,
          user_id: user.id,
          rating,
          comment,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      
      setComment('');
      setRating(5);
      refetch();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Customer Reviews</h2>
      
      {/* Review submission form */}
      {isAuthenticated && !hasSubmittedReview && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-medium mb-4">Write a Review</h3>
            
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium">Your Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className="text-xl focus:outline-none"
                  >
                    <span className={value <= rating ? 'text-yellow-500' : 'text-gray-300'}>
                      ★
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="review" className="block mb-2 text-sm font-medium">
                Your Review
              </label>
              <Textarea
                id="review"
                placeholder="Share your thoughts about this product..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
              />
            </div>
            
            <Button 
              onClick={handleSubmitReview} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Reviews list */}
      {reviews && reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{review.users?.email || 'Anonymous'}</p>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-sm ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-3 text-gray-700">{review.comment}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No reviews yet. Be the first to share your thoughts!
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
