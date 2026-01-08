// Gallery/Lookbook Comment and Like System
// Handles comments and likes for gallery posts

class GalleryInteraction {
  constructor() {
    this.comments = {};
    this.likes = {};
    this.initialized = false;
    this.init();
  }

  async init() {
    try {
      // Load comments and likes for all posts on the page
      const posts = document.querySelectorAll('[data-post-id]');
      const promises = [];
      
      for (const post of posts) {
        const postId = post.dataset.postId;
        promises.push(this.loadPostData(postId));
      }
      
      // Wait for all data to load
      await Promise.all(promises);
      
      this.initialized = true;
      this.updateUI();
      console.log('Gallery interaction initialized successfully');
    } catch (error) {
      console.error('Error initializing gallery interaction:', error);
    }
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
      window.notificationManager?.warning('Please login to comment');
      setTimeout(() => {
        window.location.href = '/users/login.html?redirect=gallery.html';
      }, 1500);
      return { success: false };
    }

    try {
      const userId = window.authManager.getUserId();

      const { data, error } = await supabaseClient
        .from('post_comments')
        .insert([{
          post_id: postId,
          user_id: userId,
          comment_text: commentText,
          created_at: new Date().toISOString()
        }])
        .select('*, profiles(full_name, email)')
        .single();

      if (error) throw error;

      // Add to local cache
      if (!this.comments[postId]) this.comments[postId] = [];
      this.comments[postId].unshift(data);

      this.updateUI();
      window.notificationManager?.success('Comment posted successfully');
      return { success: true, comment: data };
    } catch (error) {
      console.error('Error adding comment:', error);
      window.notificationManager?.error('Failed to post comment');
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
      window.notificationManager?.success('Comment deleted');
      return { success: true };
    } catch (error) {
      console.error('Error deleting comment:', error);
      window.notificationManager?.error('Failed to delete comment');
      return { success: false, error: error.message };
    }
  }

  async toggleLike(postId) {
    if (!window.authManager?.isAuthenticated()) {
      window.notificationManager?.warning('Please login to like posts');
      setTimeout(() => {
        window.location.href = '/users/login.html?redirect=gallery.html';
      }, 1500);
      return { success: false };
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
          .select()
          .single();

        if (error) throw error;

        // Add to local cache
        if (!this.likes[postId]) this.likes[postId] = [];
        this.likes[postId].push(data);

        this.updateUI();
        return { success: true, liked: true };
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      window.notificationManager?.error('Failed to update like');
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

      // Update icon and count without replacing the entire button
      const icon = btn.querySelector('.like-icon');
      const count = btn.querySelector('.like-count');
      
      if (icon) icon.textContent = isLiked ? '❤️' : '🤍';
      if (count) count.textContent = likeCount;
      
      btn.classList.toggle('liked', isLiked);
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
            <button class="comment-delete" data-comment-id="${comment.id}" data-post-id="${postId}">
              Delete
            </button>
          ` : ''}
        </div>
      `;
    }).join('');
    
    // Add event listeners for delete buttons
    container.querySelectorAll('.comment-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const commentId = btn.dataset.commentId;
        const postId = btn.dataset.postId;
        
        if (confirm('Are you sure you want to delete this comment?')) {
          await this.deleteComment(commentId, postId);
        }
      });
    });
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
