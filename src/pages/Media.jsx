import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Heart, Eye, Plus, X } from 'lucide-react';
import { apiFetch } from '../services/api';

export default function Media() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      const data = await apiFetch('/posts');
      setPosts(data.posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleLike = async (postId) => {
    try {
      const res = await apiFetch(`/posts/${postId}/like`, { method: 'POST' });
      setPosts((prev) =>
        prev.map((p) => ((p._id || p.id) === postId ? { ...p, likes: res.likes } : p))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setPosting(true);

    try {
      await apiFetch('/posts', {
        method: 'POST',
        body: JSON.stringify({
          title,
          description,
          type,
          mediaUrl,
        }),
      });

      setTitle('');
      setDescription('');
      setMediaUrl('');
      setShowModal(false);
      loadPosts();
    } catch (err) {
      alert(err.message || 'Failed to share post');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="app-wrapper">
      <Sidebar />
      <main className="main-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 className="page-title">Practice Feed & Media</h1>
            <p className="page-subtitle">Highlights, batting shots & bowling action photos from practice sessions</p>
          </div>
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            <Plus size={18} />
            <span>Share Highlight</span>
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <p>Loading feed...</p>
          </div>
        ) : (
          <div className="grid-3">
            {posts.map((post) => (
              <div key={post._id || post.id} className="card">
                <div style={{ position: 'relative' }}>
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    style={{ height: '240px', width: '100%', objectFit: 'cover' }}
                  />
                  <span className="badge badge-success" style={{ position: 'absolute', top: '0.75rem', right: '0.75rem' }}>
                    {post.type}
                  </span>
                </div>

                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '0.25rem' }}>{post.title}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{post.description}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>By {post.userId?.name || 'Practitioner'}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    <button
                      onClick={() => handleLike(post._id || post.id)}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#ef4444', fontWeight: '600', fontSize: '0.875rem' }}
                    >
                      <Heart size={16} fill="#ef4444" />
                      <span>{post.likes} Likes</span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                      <Eye size={14} />
                      <span>{post.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>

              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Share Session Highlight</h2>

              <form onSubmit={handleCreatePost}>
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g., Perfect Cover Drive Practice!"
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Media Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="form-control"
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Image / Media URL</label>
                  <input
                    type="url"
                    required
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="form-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Share details about your practice..."
                    className="form-control"
                  ></textarea>
                </div>

                <button type="submit" disabled={posting} className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
                  {posting ? 'Posting...' : 'Post Highlight'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
