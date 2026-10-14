import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Trash2, Send, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const PostCard = ({ post, onDelete }) => {
  const { user } = useAuth();
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [isLiked, setIsLiked] = useState(
    user && post.likes ? post.likes.some(id => (typeof id === 'string' ? id : id._id) === user._id) : false
  );
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const author = post.author || {};
  const isAuthor = user && (author._id === user._id || post.author === user._id);

  const handleLike = async () => {
    if (!user) {
      alert('Please log in to like community posts!');
      return;
    }
    if (isLiking) return;

    setIsLiking(true);
    // Optimistic update
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount(prev => nextLiked ? prev + 1 : Math.max(0, prev - 1));

    try {
      const res = await api.post(`/posts/${post._id}/like`);
      setLikesCount(res.data.likesCount);
      setIsLiked(res.data.isLiked);
    } catch (err) {
      console.error('Failed to toggle like:', err);
      // Revert on error
      setIsLiked(!nextLiked);
      setLikesCount(prev => !nextLiked ? prev + 1 : Math.max(0, prev - 1));
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !user) return;

    setIsSubmittingComment(true);
    try {
      const res = await api.post(`/posts/${post._id}/comment`, { text: commentText });
      setComments(res.data.comments);
      setCommentText('');
    } catch (err) {
      console.error('Failed to add comment:', err);
      alert('Could not submit comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${post._id}`);
      if (onDelete) onDelete(post._id);
    } catch (err) {
      console.error('Delete post error:', err);
      alert('Failed to delete post.');
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      {/* Header: Author details */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '14px',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', minWidth: 0, flex: 1 }}>
          <Link to={`/profile/${author._id || post.author}`} style={{ flexShrink: 0 }}>
            <img
              src={author.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(author.name || 'User')}&backgroundColor=0F766E`}
              alt={author.name}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />
          </Link>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <Link
                to={`/profile/${author._id || post.author}`}
                style={{
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: 'var(--color-text)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '180px'
                }}
              >
                {author.name || 'Volunteer Member'}
              </Link>
              <span className={`badge ${author.role === 'worker' ? 'badge-worker' : 'badge-teal'}`}>
                {author.role === 'worker' ? 'Social Worker' : 'Volunteer'}
              </span>
              {author.totalHours > 0 && (
                <span className="badge badge-orange" style={{ fontSize: '0.7rem' }}>
                  {author.totalHours} hrs served
                </span>
              )}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.8125rem',
              color: 'var(--color-text-secondary)',
              marginTop: '2px'
            }}>
              {author.location && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <MapPin size={12} /> {author.location}
                </span>
              )}
              {author.organization && (
                <span>• {author.organization}</span>
              )}
              <span>• {formatDate(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Delete option if author */}
        {isAuthor && (
          <button
            onClick={handleDelete}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '4px'
            }}
            title="Delete post"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      {/* Cause Badge */}
      {post.cause && post.cause !== 'General' && (
        <div style={{ marginBottom: '10px' }}>
          <span className="badge badge-teal" style={{ fontSize: '0.75rem' }}>
            Cause: {post.cause}
          </span>
        </div>
      )}

      {/* Post Text */}
      <p style={{
        fontSize: '0.9375rem',
        color: 'var(--color-text)',
        lineHeight: 1.6,
        marginBottom: post.image ? '14px' : '16px',
        whiteSpace: 'pre-line'
      }}>
        {post.content}
      </p>

      {/* Optional Post Image */}
      {post.image && (
        <div style={{
          marginBottom: '16px',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          maxHeight: '420px',
          border: '1px solid var(--color-border)'
        }}>
          <img
            src={post.image}
            alt="Community update"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      {/* Interaction Bar (Like, Comment, Share) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        paddingTop: '12px',
        borderTop: '1px solid var(--color-border)',
        fontSize: '0.875rem',
        flexWrap: 'wrap'
      }}>
        {/* Like Button with Warm Orange 10% Accent */}
        <button
          onClick={handleLike}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
            color: isLiked ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <Heart
            size={19}
            color={isLiked ? 'var(--color-accent)' : 'var(--color-text-secondary)'}
            fill={isLiked ? 'var(--color-accent)' : 'none'}
          />
          <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
        </button>

        {/* Comment Toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 500,
            color: 'var(--color-text-secondary)'
          }}
        >
          <MessageCircle size={19} />
          <span>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</span>
        </button>
      </div>

      {/* Comments Expansion */}
      {showComments && (
        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px dashed var(--color-border)'
        }}>
          {/* Add Comment Input */}
          {user ? (
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px', marginBottom: '16px', width: '100%' }}>
              <input
                type="text"
                placeholder="Share your encouragement or thoughts..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="form-input"
                style={{ padding: '8px 12px', fontSize: '0.875rem', flex: 1, minWidth: 0 }}
              />
              <button
                type="submit"
                disabled={isSubmittingComment || !commentText.trim()}
                className="btn btn-primary btn-sm"
                style={{ padding: '8px 14px', flexShrink: 0 }}
              >
                <Send size={15} />
              </button>
            </form>
          ) : (
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
              <Link to="/login" style={{ fontWeight: 600 }}>Log in</Link> to join the conversation.
            </p>
          )}

          {/* Comments List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {comments.length === 0 ? (
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                No comments yet. Be the first to cheer them on!
              </p>
            ) : (
              comments.map((comm, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  gap: '10px',
                  backgroundColor: 'var(--color-bg-secondary)',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)'
                }}>
                  <img
                    src={comm.userAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(comm.userName || 'User')}`}
                    alt={comm.userName}
                    style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, fontSize: '0.8125rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{comm.userName}</span>
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
                        {formatDate(comm.createdAt)}
                      </span>
                    </div>
                    <p style={{ color: 'var(--color-text)', lineHeight: 1.4 }}>{comm.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;
