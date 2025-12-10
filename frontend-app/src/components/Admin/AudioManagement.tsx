import React, { useState, useEffect } from 'react';
import { audioService, getMediaUrl } from '../../services/api';
import { Edit, Trash2, Play, Download } from 'lucide-react';

interface AudioFile {
  id: number;
  title: string;
  audio_file: string;
  description: string;
  uploaded_date: string;
}

const AudioManagement = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingAudio, setEditingAudio] = useState<AudioFile | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    fetchAudioFiles();
  }, []);

  const fetchAudioFiles = async () => {
    try {
      setLoading(true);
      const data = await audioService.getAllAudio();
      setAudioFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load audio files');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (audio: AudioFile) => {
    setEditingAudio(audio);
  };

  const handleSaveEdit = async (updatedAudio: AudioFile) => {
    try {
      await audioService.updateAudio(updatedAudio.id, updatedAudio);
      setAudioFiles(audioFiles.map(a => a.id === updatedAudio.id ? updatedAudio : a));
      setEditingAudio(null);
    } catch (err) {
      setError('Failed to update audio file');
    }
  };

  const handleDelete = async (audioId: number) => {
    try {
      await audioService.deleteAudio(audioId);
      setAudioFiles(audioFiles.filter(a => a.id !== audioId));
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to delete audio file');
    }
  };

  const handleDownload = (audioFile: AudioFile) => {
    const link = document.createElement('a');
    link.href = getMediaUrl(audioFile.audio_file);
    link.download = audioFile.title || 'audio-file';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div>Loading audio files...</div>;
  if (error) return <div style={errorStyle}>{error}</div>;

  return (
    <div>
      <h2>Manage Audio Files</h2>
      <p style={subtitleStyle}>Edit or delete existing audio files</p>

      {audioFiles.length === 0 ? (
        <div style={emptyStyle}>No audio files found.</div>
      ) : (
        <div style={listStyle}>
          {audioFiles.map((audio) => (
            <div key={audio.id} style={cardStyle}>
              {editingAudio?.id === audio.id ? (
                <EditAudioForm
                  audio={editingAudio}
                  onSave={handleSaveEdit}
                  onCancel={() => setEditingAudio(null)}
                />
              ) : (
                <>
                  <div style={cardHeaderStyle}>
                    <h3 style={titleStyle}>{audio.title}</h3>
                    <div style={actionsStyle}>
                      <button
                        onClick={() => handleEdit(audio)}
                        style={actionButtonStyle}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDownload(audio)}
                        style={actionButtonStyle}
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(audio.id)}
                        style={{ ...actionButtonStyle, color: '#dc3545' }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <p style={contentStyle}>{audio.description}</p>
                  
                  <div style={audioPlayerStyle}>
                    <audio controls style={{ width: '100%' }}>
                      <source src={getMediaUrl(audio.audio_file)} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>

                  <div style={metaStyle}>
                    Uploaded: {new Date(audio.uploaded_date).toLocaleDateString()}
                  </div>

                  {deleteConfirm === audio.id && (
                    <div style={confirmStyle}>
                      <p>Are you sure you want to delete this audio file?</p>
                      <div style={confirmActionsStyle}>
                        <button
                          onClick={() => handleDelete(audio.id)}
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

// Edit Audio Form Component
const EditAudioForm: React.FC<{
  audio: AudioFile;
  onSave: (audio: AudioFile) => void;
  onCancel: () => void;
}> = ({ audio, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: audio.title,
    description: audio.description,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...audio, ...formData });
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
const audioPlayerStyle: React.CSSProperties = {
  margin: '1rem 0',
};

const errorStyle: React.CSSProperties = {
  color: '#721c24',
  backgroundColor: '#f8d7da',
  padding: '0.75rem 1rem',
  borderRadius: 4,
  margin: '1rem 0',
};

const subtitleStyle: React.CSSProperties = {
  color: '#6c757d',
  marginBottom: '1rem',
};

const emptyStyle: React.CSSProperties = {
  padding: '1rem',
  color: '#6c757d',
};

const listStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '1rem',
};

const cardStyle: React.CSSProperties = {
  border: '1px solid #e0e0e0',
  borderRadius: 6,
  padding: '1rem',
  backgroundColor: '#fff',
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.1rem',
};

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  alignItems: 'center',
};

const actionButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: '0.25rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const contentStyle: React.CSSProperties = {
  margin: '0.5rem 0',
  color: '#333',
};

const metaStyle: React.CSSProperties = {
  fontSize: '0.85rem',
  color: '#6c757d',
};

const confirmStyle: React.CSSProperties = {
  marginTop: '0.75rem',
  padding: '0.75rem',
  backgroundColor: '#fff3cd',
  borderRadius: 4,
  border: '1px solid #ffeeba',
};

const confirmActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '0.5rem',
};

const deleteButtonStyle: React.CSSProperties = {
  backgroundColor: '#dc3545',
  color: '#fff',
  border: 'none',
  padding: '0.5rem 0.75rem',
  borderRadius: 4,
  cursor: 'pointer',
};

const cancelButtonStyle: React.CSSProperties = {
  backgroundColor: '#6c757d',
  color: '#fff',
  border: 'none',
  padding: '0.5rem 0.75rem',
  borderRadius: 4,
  cursor: 'pointer',
};

const formStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
};

const inputStyle: React.CSSProperties = {
  padding: '0.5rem',
  border: '1px solid #ced4da',
  borderRadius: 4,
};

const textareaStyle: React.CSSProperties = {
  padding: '0.5rem',
  border: '1px solid #ced4da',
  borderRadius: 4,
  resize: 'vertical',
};

const formActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.5rem',
  marginTop: '0.5rem',
};

const saveButtonStyle: React.CSSProperties = {
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  padding: '0.5rem 0.75rem',
  borderRadius: 4,
  cursor: 'pointer',
};

export default AudioManagement;