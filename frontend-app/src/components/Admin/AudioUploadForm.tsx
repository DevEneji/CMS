import React, { useState } from 'react';
import { audioService } from '../../services/api';

const AudioUploadForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        audio_file: null,
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // Frontend validation
        if (!formData.title.trim() || !formData.description.trim() || !formData.audio_file) {
            setMessage('Please fill in all required fields');
            setLoading(false);
            return;
        }

        try {
            const submitData = new FormData();
            submitData.append('title', formData.title.trim());
            submitData.append('description', formData.description.trim());
            if (formData.audio_file) {
                submitData.append('audio_file', formData.audio_file);
            }

            await audioService.uploadAudio(submitData);
            setMessage('Audio file uploaded successfully!');
            setFormData({ title: '', description: '', audio_file: null});
        } catch (error) {
            setMessage('Error uploading audio file');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, audio_file: e.target.files[0] });
        }
    };

    return  (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h3>Upload Audio File</h3>
            
            <div>
                <input
                    type="text"
                    placeholder="Audio Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={inputStyle}
                    required
                />
            </div>
            
            <div>
                <textarea
                    placeholder="Describe your audio file..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={textareaStyle}
                    rows={10}
                    required
                />
            </div>
            
            <div style={fileInputStyle}>
            <label>Audio File:</label>
                <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileChange}
                    required
                />
                {formData.audio_file && (
                    <p style={fileInfoStyle}>Selected: {formData.audio_file.name}</p>
                )}
            </div>

            <button type="submit" disabled={loading} style={buttonStyle}>
                {loading ? 'Uploading...' : 'Upload Audio'}
            </button>

            {message && (
                <p style={message.includes('Error') ? errorMessageStyle : successMessageStyle}>
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
    width: '100%',
};

// Add label style
const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: '500',
    color: '#374151',
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

export default AudioUploadForm;