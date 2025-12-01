import React, { useState } from 'react';
import {videoService } from '../../services/api';

const VideoUploadForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        video_file: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e)=> {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Frontend validation
        if (!formData.title.trim() || !formData.description.trim() || !formData.video_file) {
            setMessage('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title.trim());
            submitData.append('description', formData.description.trim());
            if (formData.video_file) {
                submitData.append('video_file', formData.video_file);
            }

            await videoService.uploadVideo(submitData);
            setMessage('Video file uploaded successfully!');
            setFormData({title: '', description: '', video_file: null});
        } catch (error) {
            setMessage('Error uploading video file');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, video_file: e.target.files[0] });
        }
    };

    return (
        <form onSubmit={handleSubmit} style = {formStyle}>
            <h3>Upload Video File</h3>

            <input
              type='text'
              placeholder  = 'Video Title'
              value = {formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value})}
              style={inputStyle}
              required
            />

            <textarea
              placeholder='Description'
              value = {formData.description}
              onChange = {(e) => setFormData({ ...formData, description: e.target.value})}
              style={textareaStyle}
              rows = {10}
              required
            />

            <div style = {fileInputStyle}>
                <label>Video File:</label>
                <input
                  type='file'
                  accept='video/*'
                  onChange={handleFileChange}
                  required
                />
                {formData.video_file &&(
                    <p style = {fileInfoStyle}>Selected: {formData.video_file.name}</p>
                )}
            </div>

            <button type = 'submit' disabled = {loading} style = {buttonStyle}>
                {loading ? 'Uploading...' : 'Upload Video'}
            </button>

            {message && (
                <p style = {message.includes('Error') ? errorMessageStyle : successMessageStyle}>
                    {message}
                </p>
            )}
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

const fileInfoStyle: React.CSSProperties = {
    fontSize: '0.9rem',
    color: '#666',
    margin: 0,
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

const successMessageStyle: React.CSSProperties = {
    padding: '0.5rem',
    borderRadius: '4px',
    backgroundColor: '#d4edda',
    color: '#155724',
};

const errorMessageStyle: React.CSSProperties = {
    padding: '0.5rem',
    borderRadius: '4px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
};

export default VideoUploadForm;