import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import { postAPI } from '../services/api';
import toast from 'react-hot-toast';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchPosts();
  }, [searchParams]);

  const fetchPosts = async () => {
    try {
      const params = {
        search: searchParams.get('search'),
        category: searchParams.get('category'),
        tag: searchParams.get('tag')
      };
      const { data } = await postAPI.getAll(params);
      setPosts(data.data);
    } catch (error) {
      toast.error('Yazılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="site-header">
        <h1>Kişisel Blogum</h1>
        <p className="site-tagline">Düşünceler, deneyimler ve keşifler...</p>
      </header>

      <main id="main-content" className="content" role="main">
        <section className="posts-grid" aria-label="Blog yazıları">
          {loading ? (
            <Loading message="Yazılar yükleniyor..." />
          ) : posts.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Henüz yazı bulunmuyor.</p>
          ) : (
            posts.map(post => <PostCard key={post._id} post={post} />)
          )}
        </section>
      </main>
    </>
  );
};

export default Home;
