import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { postAPI } from '../services/api';
import toast from 'react-hot-toast';

const Admin = () => {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Genel',
    tags: '',
    isPublished: true
  });

  useEffect(() => {
    if (isAdmin) fetchPosts();
  }, [isAdmin]);

  const fetchPosts = async () => {
    try {
      const { data } = await postAPI.getAll();
      setPosts(data.data);
    } catch (error) {
      toast.error('Yazılar yüklenemedi');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t)
      };

      if (editingPost) {
        await postAPI.update(editingPost._id, postData);
        toast.success('Yazı güncellendi');
      } else {
        await postAPI.create(postData);
        toast.success('Yazı oluşturuldu');
      }

      resetForm();
      fetchPosts();
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      category: post.category,
      tags: post.tags.join(', '),
      isPublished: post.isPublished
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    try {
      await postAPI.delete(id);
      toast.success('Yazı silindi');
      fetchPosts();
    } catch (error) {
      toast.error('Silme hatası');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', category: 'Genel', tags: '', isPublished: true });
    setEditingPost(null);
    setShowForm(false);
  };

  if (!isAdmin) return <Navigate to="/" />;

  return (
    <div className="content">
      <h2>Admin Panel</h2>

      <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '1rem', padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
        {showForm ? 'İptal' : 'Yeni Yazı'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
          <input type="text" placeholder="Başlık" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
          <textarea placeholder="İçerik (Markdown destekli)" value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} required rows="10" style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
          <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}>
            <option>Genel</option>
            <option>Tasarım</option>
            <option>Teknoloji</option>
            <option>Yaşam</option>
            <option>Diğer</option>
          </select>
          <input type="text" placeholder="Etiketler (virgülle ayırın)" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }} />
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            <input type="checkbox" checked={formData.isPublished} onChange={(e) => setFormData({...formData, isPublished: e.target.checked})} />
            {' '}Yayınla
          </label>
          <button type="submit" style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
            {editingPost ? 'Güncelle' : 'Oluştur'}
          </button>
        </form>
      )}

      <div style={{ display: 'grid', gap: '1rem' }}>
        {posts.map(post => (
          <div key={post._id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)' }}>
            <h3>{post.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{post.category} • {post.views} görüntülenme</p>
            <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => handleEdit(post)} style={{ padding: '0.25rem 0.75rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Düzenle</button>
              <button onClick={() => handleDelete(post._id)} style={{ padding: '0.25rem 0.75rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>Sil</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
