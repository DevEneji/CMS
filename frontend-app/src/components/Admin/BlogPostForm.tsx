import React, { useState } from 'react';
import { blogService } from '../../services/api';

const BlogPostForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title);
            submitData.append('content', formData.content);

            // Add published_date to automatically publish the post
            
            const currentDate = new Date().toISOString();
            submitData.append('published_date', currentDate);
            
            if (formData.image) {
                submitData.append('image', formData.image);
            }

            await blogService.createPost(submitData,);
            setMessage('Blog post created successfully!');
            setFormData({ title: '', content: '', image: null});
        } catch (error) {
            setMessage('Error creating blog post');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        setFormData({ ...formData, image: e.target.files[0] });
    };

    return (
        <form onSubmit={handleSubmit} style = {formStyle}>
            <h3>Create New Blog Post</h3>

            <input
              type = 'text'
              placeholder = 'Post Title'
              value = {formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              style = {inputStyle}
              required
            />

            <textarea
              placeholder='Post Content'
              value={formData.content}
              onChange={(e) => setFormData({... formData, content: e.target.value})}
              style = {textareaStyle}
              rows = {10}
              required
            />
            <div style={fileInputStyle}>
                <label>Featured Image (optional):</label>
                <input
                  type = 'file'
                  accept = 'image/*'
                  onChange={handleImageChange}
                />
            </div>

            <button type = 'submit' disabled = {loading} style = {buttonStyle}>
                {loading ? 'Publishing...' : 'Publish Post'}
            </button>

            {message && <p style = {messageStyle}>{message}</p>}
        </form>
    );
};

const formStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
};

const inputStyle: React.CSSProperties = {
    padding: '0.75rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
};

const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    fontFamily: 'inherit',
};

const fileInputStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
};

const buttonStyle: React.CSSProperties = {
    padding: '0.75rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
};

const messageStyle: React.CSSProperties = {
    padding: '0.5rem',
    borderRadius: '4px',
    backgroundColor: '#d4edda',
    color: '#155724',
};

export default BlogPostForm