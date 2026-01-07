// Gallery/Lookbook Comment and Like System
// Handles comments and likes for gallery posts

class GalleryInteraction {
  constructor() {
    this.comments = {};
    this.likes = {};
    this.init();
  }

  async init() {
    // Load comments and likes for all posts on the page
    const posts = document.querySelectorAll('[data-post-id]');
    for (const post of posts) {
      const postId = post.dataset.postId;
      await this.loadPostData(postId);
    }
    this.updateUI();
  }

  async loadPostData(postId) {
    try {
      // Load comments
      const { data: comments, error: commentsError } = await supabaseClient
        .from('post_comments')
        .select('*, profiles(full_name, email)')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;
      this.comments[postId] = comments || [];

      // Load likes
      const { data: likes, error: likesError } = await supabaseClient
        .from('post_likes')
        .select('*')
        .eq('post_id', postId);

      if (likesError) throw likesError;
      this.likes[postId] = likes || [];

    } catch (error) {
      console.error('Error loading post data:', error);
    }
  }

  async addComment(postId, commentText) {
    if (!window.authManager?.isAuthenticated()) {
      window.notificationManager.warning('Please login to comment');
      setTimeout(() => {
        window.location.href = '/users/login.html';
      }, 1500);
      return;
    }

    try {
      const userId = window.authManager.getUserId();
      const userName = window.authManager.getUserName();

      const { data, error } = await supabaseClient
        .from('post_comments')
        .insert([{
          post_id: postId,
          user_id: userId,
          comment_text: commentText,
          created_at: new Date().toISOString()
        }])
        .select('*, profiles(full_name, email)');

      if (error) throw error;

      // Add to local cache
      if (!this.comments[postId]) this.comments[postId] = [];
      this.comments[postId].unshift(data[0]);

      this.updateUI();
      return { success: true, comment: data[0] };
    } catch (error) {
      console.error('Error adding comment:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteComment(commentId, postId) {
    try {
      const { error } = await supabaseClient
        .from('post_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      // Remove from local cache
      if (this.comments[postId]) {
        this.comments[postId] = this.comments[postId].filter(c => c.id !== commentId);
      }

      this.updateUI();
      return { success: true };
    } catch (error) {
      console.error('Error deleting comment:', error);
      return { success: false, error: error.message };
    }
  }

  async toggleLike(postId) {
    if (!window.authManager?.isAuthenticated()) {
      window.notificationManager.warning('Please login to like posts');
      setTimeout(() => {
        window.location.href = '/users/login.html';
      }, 1500);
      return;
    }

    try {
      const userId = window.authManager.getUserId();
      
      // Check if already liked
      const existingLike = this.likes[postId]?.find(like => like.user_id === userId);

      if (existingLike) {
        // Unlike
        const { error } = await supabaseClient
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) throw error;

        // Remove from local cache
        if (this.likes[postId]) {
          this.likes[postId] = this.likes[postId].filter(like => like.user_id !== userId);
        }

        this.updateUI();
        return { success: true, liked: false };
      } else {
        // Like
        const { data, error } = await supabaseClient
          .from('post_likes')
          .insert([{
            post_id: postId,
            user_id: userId,
            created_at: new Date().toISOString()
          }])
          .select();

        if (error) throw error;

        // Add to local cache
        if (!this.likes[postId]) this.likes[postId] = [];
        this.likes[postId].push(data[0]);

        this.updateUI();
        return { success: true, liked: true };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      return { success: false, error: error.message };
    }
  }

  isLikedByUser(postId) {
    if (!window.authManager?.isAuthenticated()) return false;
    const userId = window.authManager.getUserId();
    return this.likes[postId]?.some(like => like.user_id === userId) || false;
  }

  getLikeCount(postId) {
    return this.likes[postId]?.length || 0;
  }

  getCommentCount(postId) {
    return this.comments[postId]?.length || 0;
  }

  updateUI() {
    // Update like buttons
    document.querySelectorAll('.like-btn').forEach(btn => {
      const postId = btn.dataset.postId;
      const likeCount = this.getLikeCount(postId);
      const isLiked = this.isLikedByUser(postId);

      btn.querySelector('.like-count').textContent = likeCount;
      btn.classList.toggle('liked', isLiked);
      btn.innerHTML = `
        <span class="like-icon">${isLiked ? '❤️' : '🤍'}</span>
        <span class="like-count">${likeCount}</span>
      `;
    });

    // Update comment counts
    document.querySelectorAll('.comment-count').forEach(el => {
      const postId = el.dataset.postId;
      el.textContent = this.getCommentCount(postId);
    });

    // Render comments
    document.querySelectorAll('.comments-container').forEach(container => {
      const postId = container.dataset.postId;
      this.renderComments(postId, container);
    });
  }

  renderComments(postId, container) {
    const comments = this.comments[postId] || [];
    const userId = window.authManager?.getUserId();

    if (comments.length === 0) {
      container.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
      return;
    }

    container.innerHTML = comments.map(comment => {
      const userName = comment.profiles?.full_name || comment.profiles?.email?.split('@')[0] || 'Anonymous';
      const isOwner = userId === comment.user_id;
      const commentDate = new Date(comment.created_at).toLocaleDateString();

      return `
        <div class="comment" data-comment-id="${comment.id}">
          <div class="comment-header">
            <span class="comment-author">${userName}</span>
            <span class="comment-date">${commentDate}</span>
          </div>
          <p class="comment-text">${this.escapeHtml(comment.comment_text)}</p>
          ${isOwner ? `
            <button class="comment-delete" onclick="galleryInteraction.deleteComment('${comment.id}', '${postId}')">
              Delete
            </button>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize Gallery Interaction
if (typeof window !== 'undefined') {
  window.galleryInteraction = new GalleryInteraction();
}
