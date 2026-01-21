import { Link } from 'react-router-dom';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { postAPI } from '../services/api';
import toast from 'react-hot-toast';

const PostCard = ({ post }) => {
  const { isAuthenticated } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Beğenmek için giriş yapmalısınız');
      return;
    }

    try {
      const { data } = await postAPI.like(post._id);
      setLiked(data.data.liked);
      setLikesCount(data.data.likesCount);
    } catch (error) {
      toast.error('Bir hata oluştu');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.origin + `/post/${post.slug}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          copyToClipboard(shareData.url);
        }
      }
    } else {
      copyToClipboard(shareData.url);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Link kopyalandı!');
    }).catch(() => {
      toast.error('Kopyalama başarısız');
    });
  };

  return (
    <article className="post" itemScope itemType="http://schema.org/BlogPosting">
      <header className="post-header">
        <div className="post-categories">
          <span className="category" itemProp="articleSection">{post.category}</span>
        </div>
        <h2 itemProp="headline">
          <Link to={`/post/${post.slug}`}>{post.title}</Link>
        </h2>
        <div className="post-meta">
          <time dateTime={post.publishedAt} itemProp="datePublished">
            {formatDate(post.publishedAt)}
          </time>
          <span className="reading-time" aria-label="Tahmini okuma süresi">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <circle cx="10" cy="10" r="9" stroke="currentColor" fill="none"/>
              <path d="M10 5v5l3 3"/>
            </svg>
            {post.readingTime} dk okuma
          </span>
        </div>
      </header>
      <div className="post-content" itemProp="articleBody">
        <p>{post.excerpt || post.content.substring(0, 200) + '...'}</p>
      </div>
      <footer className="post-footer">
        <div className="post-tags">
          {post.tags && post.tags.map((tag, idx) => (
            <Link key={idx} to={`/?tag=${tag}`} className="tag" rel="tag">
              #{tag}
            </Link>
          ))}
        </div>
        <div className="post-actions">
          <button className="share-btn" aria-label="Paylaş" title="Paylaş" onClick={handleShare}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="15" cy="5" r="3"/>
              <circle cx="5" cy="10" r="3"/>
              <circle cx="15" cy="15" r="3"/>
              <path d="M7.5 11.5l5-2m-5 4l5-2"/>
            </svg>
          </button>
          <button className={`like-btn ${liked ? 'liked' : ''}`} aria-label="Beğen" title="Beğen" onClick={handleLike}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M10 17.5l-1.5-1.35C3.4 11.36 1 9.28 1 6.5 1 4.42 2.42 3 4.5 3c1.74 0 3.41.81 4.5 2.09C10.09 3.81 11.76 3 13.5 3 15.58 3 17 4.42 17 6.5c0 2.78-2.4 4.86-7.5 9.65L10 17.5z"/>
            </svg>
            <span className="like-count">{likesCount}</span>
          </button>
        </div>
      </footer>
    </article>
  );
};

export default PostCard;
