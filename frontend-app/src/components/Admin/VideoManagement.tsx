import React, { useState, useEffect } from 'react';
import { videoService, getMediaUrl } from '../../services/api';
import { Edit, Trash2, Play, Download, Video } from 'lucide-react';

interface VideoFile {
  id: number;
  title: string;
  video_file: string;
  description: string;
  uploaded_date: string;
}

const VideoManagement = () => {
  const [videoFiles, setVideoFiles] = useState<VideoFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoFile | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchVideoFiles();
  }, []);

  const fetchVideoFiles = async () => {
    try {
      setLoading(true);
      const data = await videoService.getAllVideos();
      setVideoFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load audio files');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (video: VideoFile) => {
    setEditingVideo(video);
  };

  const handleSaveEdit = async (updatedVideo: VideoFile) => {
    try {
      await videoService.updateVideo(updatedVideo.id, updatedVideo);
      setVideoFiles(videoFiles.map(v => v.id === updatedVideo.id ? updatedVideo : v));
      setEditingVideo(null);
    } catch (err) {
      setError('Failed to update video file');
    }
  };

  const handleDelete = async (videoId: number) => {
    try {
      await videoService.deleteVideo(videoId);
      setVideoFiles(videoFiles.filter(v => v.id !== videoId));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete video file');
    }
  };

  const handleDownload = (videoFile: VideoFile) => {
    const link = document.createElement('a');
    link.href = getMediaUrl(videoFile.video_file);
    link.download = videoFile.title || 'video-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div>Loading video files...</div>;
  if (error) return <div style={errorStyle}>{error}</div>;

  return (
    <div>
      <h2>Manage Video Files</h2>
      <p style={subtitleStyle}>Edit or delete existing video files</p>

      {videoFiles.length === 0 ? (
        <div style={emptyStyle}>No video files found.</div>
      ) : (
        <div style={listStyle}>
          {videoFiles.map((video) => (
            <div key={video.id} style={cardStyle}>
              {editingVideo?.id === video.id ? (
                <EditVideoForm
                  video={editingVideo}
                  onSave={handleSaveEdit}
                  onCancel={() => setEditingVideo(null)}
                />
              ) : (
                <>
                  <div style={cardHeaderStyle}>
                  <div style={titleContainerStyle}>
                      <Video size={20} style={iconStyle} />
                      <h3 style={titleStyle}>{video.title}</h3>
                    </div>
                    <div style={actionsStyle}>
                      <button
                        onClick={() => handleEdit(video)}
                        style={actionButtonStyle}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDownload(video)}
                        style={actionButtonStyle}
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(video.id)}
                        style={{ ...actionButtonStyle, color: '#dc3545' }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <p style={contentStyle}>{video.description}</p>
                  
                  <div style={videoPlayerStyle}>
                  <video
                      controls
                      style={videoElementStyle}
                      preload="metadata"
                    >
                      <source src={getMediaUrl(video.video_file)} type="video/mp4" />
                      <source src={getMediaUrl(video.video_file)} type="video/webm" />
                      <source src={getMediaUrl(video.video_file)} type="video/ogg" />
                      Your browser does not support the audio element.
                    </video>
                  </div>

                  <div style={metaStyle}>
                    Uploaded: {new Date(video.uploaded_date).toLocaleDateString()}
                  </div>

                  {deleteConfirm === video.id && (
                    <div style={confirmStyle}>
                      <p>Are you sure you want to delete this video file?</p>
                      <div style={confirmActionsStyle}>
                        <button
                          onClick={() => handleDelete(video.id)}
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

// Edit Video Form Component
const EditVideoForm: React.FC<{
  video: VideoFile;
  onSave: (video: VideoFile) => void;
  onCancel: () => void;
}> = ({ video, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: video.title,
    description: video.description,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...video, ...formData });
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        style={inputStyle}
        placeholder="Video Title"
        required
      />
      <textarea
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        style={textareaStyle}
        placeholder="Description"
        rows={4}
        required
      />
      <div style={formActionsStyle}>
        <button type="submit" style={saveButtonStyle}>Save</button>
        <button type="button" onClick={onCancel} style={cancelButtonStyle}>Cancel</button>
      </div>
    </form>
  );
};

// Styles (reuse styles from BlogManagement with additions)
const loadingStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '2rem',
  color: '#666',
};

const errorStyle: React.CSSProperties = {
  color: '#dc3545',
  textAlign: 'center',
  padding: '1rem',
  backgroundColor: '#f8d7da',
  border: '1px solid #f5c6cb',
  borderRadius: '4px',
};

const subtitleStyle: React.CSSProperties = {
  color: '#666',
  marginBottom: '2rem',
};

const emptyStyle: React.CSSProperties = {
  textAlign: 'center',
  color: '#666',
  padding: '3rem',
};

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const cardStyle: React.CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '1.5rem',
  backgroundColor: '#fff',
  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  marginBottom: '1rem',
};

const titleContainerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  flex: 1,
  minWidth: 0,
};

const iconStyle: React.CSSProperties = {
  color: '#007bff',
  flexShrink: 0,
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.2rem',
  fontWeight: '600',
  color: '#1f2937',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  flexShrink: 0,
};

const actionButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.5rem',
  borderRadius: '4px',
  color: '#6b7280',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const contentStyle: React.CSSProperties = {
  color: '#6b7280',
  marginBottom: '1rem',
  lineHeight: '1.5',
  fontSize: '0.95rem',
};

const videoPlayerStyle: React.CSSProperties = {
  margin: '1rem 0',
  borderRadius: '6px',
  overflow: 'hidden',
  backgroundColor: '#f9fafb',
};

const videoElementStyle: React.CSSProperties = {
  width: '100%',
  height: '200px',
  objectFit: 'cover',
};

const metaStyle: React.CSSProperties = {
  fontSize: '0.875rem',
  color: '#9ca3af',
  marginTop: '0.5rem',
};

const confirmStyle: React.CSSProperties = {
  marginTop: '1rem',
  padding: '1rem',
  backgroundColor: '#fef3c7',
  border: '1px solid #fcd34d',
  borderRadius: '6px',
};

const confirmActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '0.75rem',
};

const deleteButtonStyle: React.CSSProperties = {
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.875rem',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#6c757d',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.875rem',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
};

const formGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const labelStyle: React.CSSProperties = {
  fontWeight: '500',
  color: '#374151',
  fontSize: '0.875rem',
};

const inputStyle: React.CSSProperties = {
  padding: '0.75rem',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '1rem',
  fontFamily: 'inherit',
};

const textareaStyle: React.CSSProperties = {
  padding: '0.75rem',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  fontSize: '1rem',
  fontFamily: 'inherit',
  resize: 'vertical',
  minHeight: '100px',
};

const formActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.75rem',
  justifyContent: 'flex-end',
  marginTop: '1rem',
};

const saveButtonStyle: React.CSSProperties = {
  padding: '0.75rem 1.5rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '0.875rem',
  fontWeight: '500',
};

export default VideoManagement;