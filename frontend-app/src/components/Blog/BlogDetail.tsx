import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Calendar, AlertCircle } from 'lucide-react';
import { blogService, getMediaUrl } from '../../services/api';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  image?: string;
  created_date: string;
  published_date: string;
}

const BlogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await blogService.getPostById(id);
        setPost(data);
      } catch (err) {
        setError('Failed to load blog post. Please try again later.');
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <Card>
          <Skeleton className="h-64 w-full" />
          <CardHeader>
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/">
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/">
            <ArrowLeft size={16} className="mr-2" />
            Back to Blog
          </Link>
        </Button>
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Blog post not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button variant="ghost" className="mb-6 hover:bg-gray-100" asChild>
        <Link to="/">
          <ArrowLeft size={16} className="mr-2" />
          Back to Blog
        </Link>
      </Button>

      {/* Article */}
      <article className="max-w-4xl mx-auto">
        <Card className="overflow-hidden">
          {/* Featured Image */}
          {post.image && (
            <div className="aspect-video overflow-hidden">
              <img
                src={getMediaUrl(post.image)}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          <CardHeader className="pb-4">
            <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {post.title}
            </CardTitle>
            
            <div className="flex items-center text-gray-500 pt-2">
              <Calendar size={16} className="mr-2" />
              <span>Published on {formatDate(post.published_date || post.created_date)}</span>
            </div>
          </CardHeader>

          <CardContent className="prose prose-lg max-w-none">
            <div 
              className="text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-8 flex justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link to="/">
              <ArrowLeft size={16} className="mr-2" />
              Back to All Posts
            </Link>
          </Button>
        </div>
      </article>
    </div>
  );
};

export default BlogDetail;