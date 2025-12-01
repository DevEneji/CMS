import React, { useState } from 'react';
import BlogPostForm from './BlogPostForm';
import AudioUploadForm from './AudioUploadForm';
import VideoUploadForm from './VideoUploadForm';
import BlogManagement from './BlogManagement';
import AudioManagement from './AudioManagement';
import VideoManagement from './VideoManagement';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('blog-create');

    return (
        <div style={containerStyle}>
            <h1>Content Management Dashboard</h1>

            <div style={tabsStyle}>
                {/* Create Tabs */}
                <div style={tabGroupStyle}>
                    <span style={tabGroupLabelStyle}>Create New:</span>
                    <button
                        onClick={() => setActiveTab('blog-create')}
                        style={activeTab === 'blog-create' ? activeTabStyle : tabStyle}
                    >
                        Blog Post
                    </button>
                    <button
                        onClick={() => setActiveTab('audio-create')}
                        style={activeTab === 'audio-create' ? activeTabStyle : tabStyle}
                    >
                        Audio File
                    </button>
                    <button
                        onClick={() => setActiveTab('video-create')}
                        style={activeTab === 'video-create' ? activeTabStyle : tabStyle}
                    >
                        Video File
                    </button>
                </div>

                {/* Manage Tabs */}
                <div style={tabGroupStyle}>
                    <span style={tabGroupLabelStyle}>Manage Existing:</span>
                    <button
                        onClick={() => setActiveTab('blog-manage')}
                        style={activeTab === 'blog-manage' ? activeTabStyle : tabStyle}
                    >
                        Blog Posts
                    </button>
                    <button
                        onClick={() => setActiveTab('audio-manage')}
                        style={activeTab === 'audio-manage' ? activeTabStyle : tabStyle}
                    >
                        Audio Files
                    </button>
                    <button
                        onClick={() => setActiveTab('video-manage')}
                        style={activeTab === 'video-manage' ? activeTabStyle : tabStyle}
                    >
                        Video Files
                    </button>
                </div>
            </div>

            <div style={contentStyle}>
                {activeTab === 'blog-create' && <BlogPostForm />}
                {activeTab === 'audio-create' && <AudioUploadForm />}
                {activeTab === 'video-create' && <VideoUploadForm />}
                {activeTab === 'blog-manage' && <BlogManagement />}
                {activeTab === 'audio-manage' && <AudioManagement />}
                {activeTab === 'video-manage' && <VideoManagement />}
            </div>
        </div>
    );
};

const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
};

const tabsStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: '1px solid #ddd',
    paddingBottom: '1rem',
};

const tabGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
};

const tabGroupLabelStyle: React.CSSProperties = {
    fontWeight: '600',
    color: '#666',
    fontSize: '0.9rem',
    minWidth: '100px',
};

const tabStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '1rem',
    borderRadius: '4px',
};

const activeTabStyle: React.CSSProperties = {
    ...tabStyle,
    backgroundColor: '#007bff',
    color: 'white',
};

const contentStyle: React.CSSProperties = {
    minHeight: '400px',
};

export default Dashboard;