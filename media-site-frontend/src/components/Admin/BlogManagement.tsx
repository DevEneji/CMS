import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/api';
import { Edit, Trash2, Eye, MoreVertical } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  description: string;
  image?: string;
  created_date: string;
  published_date: string;
}

const BlogManagement = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAllPosts();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
  };

  const handleSaveEdit = async (updatedPost: BlogPost) => {
    try {
      await blogService.updatePost(updatedPost.id, updatedPost);
      setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
      setEditingPost(null);
    } catch (err) {
      setError('Failed to update post');
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      await blogService.deletePost(postId);
      setPosts(posts.filter(p => p.id !== postId));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete post');
    }
  };

  if (loading) return <div>Loading blog posts...</div>;
  if (error) return <div style={errorStyle}>{error}</div>;

  return (
    <div>
      <h2>Manage Blog Posts</h2>
      <p style={subtitleStyle}>Edit or delete existing blog posts</p>

      {posts.length === 0 ? (
        <div style={emptyStyle}>No blog posts found.</div>
      ) : (
        <div style={listStyle}>
          {posts.map((post) => (
            <div key={post.id} style={cardStyle}>
              {editingPost?.id === post.id ? (
                <EditBlogForm
                  post={editingPost}
                  onSave={handleSaveEdit}
                  onCancel={() => setEditingPost(null)}
                />
              ) : (
                <>
                  <div style={cardHeaderStyle}>
                    <h3 style={titleStyle}>{post.title}</h3>
                    <div style={actionsStyle}>
                      <button
                        onClick={() => handleEdit(post)}
                        style={actionButtonStyle}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(post.id)}
                        style={{ ...actionButtonStyle, color: '#dc3545' }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <p style={contentStyle}>{post.description || post.content.substring(0, 100)}...</p>
                  <div style={metaStyle}>
                    Created: {new Date(post.created_date).toLocaleDateString()}
                    {post.published_date && (
                      <> | Published: {new Date(post.published_date).toLocaleDateString()}</>
                    )}
                  </div>

                  {deleteConfirm === post.id && (
                    <div style={confirmStyle}>
                      <p>Are you sure you want to delete this post?</p>
                      <div style={confirmActionsStyle}>
                        <button
                          onClick={() => handleDelete(post.id)}
                          style={deleteButtonStyle}
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          style={cancelButtonStyle}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Edit Blog Form Component
const EditBlogForm: React.FC<{
  post: BlogPost;
  onSave: (post: BlogPost) => void;
  onCancel: () => void;
}> = ({ post, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: post.title,
    content: post.content,
    description: post.description,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...post, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        style={inputStyle}
        placeholder="Title"
        required
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        style={textareaStyle}
        placeholder="Description"
        rows={3}
        required
      />
      <textarea
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        style={textareaStyle}
        placeholder="Content"
        rows={6}
        required
      />
      <div style={formActionsStyle}>
        <button type="submit" style={saveButtonStyle}>Save</button>
        <button type="button" onClick={onCancel} style={cancelButtonStyle}>Cancel</button>
      </div>
    </form>
  );
};

// Styles
const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const cardStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '8px',
  padding: '1.5rem',
  backgroundColor: '#fff',
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '1rem',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.2rem',
  fontWeight: '600',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
};

const actionButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: '4px',
  color: '#666',
};

const contentStyle: React.CSSProperties = {
  color: '#666',
  marginBottom: '1rem',
  lineHeight: '1.5',
};

const metaStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#999',
};

const confirmStyle: React.CSSProperties = {
  marginTop: '1rem',
  padding: '1rem',
  backgroundColor: '#fff3cd',
  border: '1px solid #ffeaa7',
  borderRadius: '4px',
};

const confirmActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '0.5rem',
};

const deleteButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
};

const inputStyle: React.CSSProperties = {
  padding: '0.75rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
};

const textareaStyle: React.CSSProperties = {
  padding: '0.75rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
  fontFamily: 'inherit',
  resize: 'vertical',
};

const formActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  justifyContent: 'flex-end',
};

const saveButtonStyle: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const subtitleStyle: React.CSSProperties = {
  color: '#666',
  marginBottom: '2rem',
};

const emptyStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#666',
  padding: '2rem',
};

const errorStyle: React.CSSProperties = {
  color: '#dc3545',
  textAlign: 'center',
  padding: '1rem',
};

export default BlogManagement;