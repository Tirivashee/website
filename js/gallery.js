// Gallery/Lookbook Comment and Like System
// Handles comments and likes for gallery posts

class GalleryInteraction {
  constructor() {
    this.comments = {};
    this.likes = {};
    this.initialized = false;
    this._commentsLoading = {};
    this._commentsVisibleCount = {};
    this._commentPageSize = 10;
    this._editingCommentId = {};
    this._lastCommentAt = 0;
    this._commentCooldownMs = 3000;
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
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      // Fetch user profiles for comments
      if (comments && comments.length > 0) {
        const userIds = [...new Set(comments.map(c => c.user_id))];
        const { data: profiles } = await supabaseClient
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);

        // Map profiles to comments
        const profileMap = {};
        if (profiles) {
          profiles.forEach(p => profileMap[p.id] = p);
        }

        comments.forEach(comment => {
          comment.profile = profileMap[comment.user_id] || null;
        });
      }

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

    const trimmedText = (commentText || '').trim();
    if (!trimmedText) {
      window.notificationManager?.warning('Please enter a comment');
      return { success: false };
    }
    if (trimmedText.length > 1000) {
      window.notificationManager?.warning('Comment is too long (max 1000 characters)');
      return { success: false };
    }

    if (this._commentInFlight) {
      return { success: false };
    }

    // Client-side-only deterrent against accidental double-posts/spam. Not a
    // substitute for server-side rate limiting, but there's no backend here
    // to add one to (static site, no API layer) - this is a reasonable floor.
    const now = Date.now();
    if (now - this._lastCommentAt < this._commentCooldownMs) {
      window.notificationManager?.warning('Please wait a moment before posting another comment');
      return { success: false };
    }

    this._commentInFlight = true;

    try {
      const userId = window.authManager.getUserId();

      const { data, error } = await supabaseClient
        .from('post_comments')
        .insert([{
          post_id: postId,
          user_id: userId,
          comment_text: trimmedText,
          created_at: new Date().toISOString()
        }])
        .select('*')
        .single();

      if (error) throw error;

      // Fetch user profile for the new comment
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('id, full_name, email')
        .eq('id', userId)
        .single();

      data.profile = profile || null;

      // Add to local cache
      if (!this.comments[postId]) this.comments[postId] = [];
      this.comments[postId].unshift(data);
      this._lastCommentAt = now;

      this.updateUI();
      window.notificationManager?.success('Comment posted successfully');
      return { success: true, comment: data };
    } catch (error) {
      console.error('Error adding comment:', error);
      window.notificationManager?.error('Failed to post comment');
      return { success: false, error: error.message };
    } finally {
      this._commentInFlight = false;
    }
  }

  async editComment(commentId, postId, newText) {
    const userId = window.authManager?.getUserId();
    if (!userId) {
      window.notificationManager?.warning('Please login to edit comments');
      return { success: false };
    }

    const trimmedText = (newText || '').trim();
    if (!trimmedText) {
      window.notificationManager?.warning('Comment cannot be empty');
      return { success: false };
    }
    if (trimmedText.length > 1000) {
      window.notificationManager?.warning('Comment is too long (max 1000 characters)');
      return { success: false };
    }

    try {
      const { data, error } = await supabaseClient
        .from('post_comments')
        .update({ comment_text: trimmedText, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .eq('user_id', userId) // defense-in-depth alongside the RLS policy
        .select('*')
        .single();

      if (error) throw error;

      if (this.comments[postId]) {
        const idx = this.comments[postId].findIndex(c => c.id === commentId);
        if (idx > -1) {
          // The update response has no `profile` join - keep the one we already have.
          data.profile = this.comments[postId][idx].profile;
          data._edited = true;
          this.comments[postId][idx] = data;
        }
      }

      // Exit edit mode for this comment now that the save succeeded.
      this._editingCommentId[postId] = null;

      this.updateUI();
      window.notificationManager?.success('Comment updated');
      return { success: true, comment: data };
    } catch (error) {
      console.error('Error editing comment:', error);
      window.notificationManager?.error('Failed to update comment');
      return { success: false, error: error.message };
    }
  }

  async deleteComment(commentId, postId) {
    const userId = window.authManager?.getUserId();
    if (!userId) {
      window.notificationManager?.warning('Please login to delete comments');
      return { success: false };
    }

    try {
      const { error } = await supabaseClient
        .from('post_comments')
        .delete()
        .eq('id', commentId)
        .eq('user_id', userId); // defense-in-depth alongside the RLS policy

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

    if (!this._likeInFlight) this._likeInFlight = {};
    if (this._likeInFlight[postId]) {
      return { success: false };
    }
    this._likeInFlight[postId] = true;

    try {
      const userId = window.authManager.getUserId();

      // If this post's likes haven't been fetched yet (e.g. the click landed
      // before the initial load finished), fetch them now instead of assuming
      // "not liked" - otherwise a repeat like can hit the DB's unique
      // constraint and fail with a confusing error.
      if (this.likes[postId] === undefined) {
        await this.loadPostData(postId);
      }

      const existingLike = this.likes[postId]?.find(like => like.user_id === userId);
      const wasLiked = !!existingLike;

      // Optimistic update: flip the UI immediately instead of waiting on the
      // round trip, then reconcile with (or revert from) the DB below.
      if (wasLiked) {
        this.likes[postId] = this.likes[postId].filter(like => like.user_id !== userId);
      } else {
        if (!this.likes[postId]) this.likes[postId] = [];
        this.likes[postId].push({ post_id: postId, user_id: userId, created_at: new Date().toISOString(), _optimistic: true });
      }
      this.updateUI();

      if (wasLiked) {
        const { error } = await supabaseClient
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (error) throw error;
      } else {
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

        // Replace the optimistic placeholder with the real DB row.
        const idx = this.likes[postId].findIndex(l => l._optimistic && l.user_id === userId);
        if (idx > -1) this.likes[postId][idx] = data;
      }

      this.updateUI();
      return { success: true, liked: !wasLiked };
    } catch (error) {
      console.error('Error toggling like:', error);
      // Re-sync from the DB rather than hand-reverting the optimistic change,
      // so local state can't drift out of sync with what's actually persisted.
      await this.loadPostData(postId);
      this.updateUI();
      window.notificationManager?.error('Failed to update like');
      return { success: false, error: error.message };
    } finally {
      this._likeInFlight[postId] = false;
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

      // Update count and liked state
      const count = btn.querySelector('.like-count, .count');

      if (count) count.textContent = likeCount;

      // Toggle liked class for Instagram-style fill
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
    // Not loaded yet (e.g. the comment modal was opened before the page's
    // background load finished) - fetch now instead of showing a false
    // "no comments" state, then re-render once it resolves.
    if (this.comments[postId] === undefined) {
      container.innerHTML = '<p class="no-comments">Loading comments...</p>';
      if (!this._commentsLoading[postId]) {
        this._commentsLoading[postId] = this.loadPostData(postId).then(() => {
          this._commentsLoading[postId] = null;
          this.updateUI();
        });
      }
      return;
    }

    const comments = this.comments[postId];
    const userId = window.authManager?.getUserId();
    const editingId = this._editingCommentId[postId];

    if (comments.length === 0) {
      container.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
      return;
    }

    const visibleCount = this._commentsVisibleCount[postId] || this._commentPageSize;
    const visibleComments = comments.slice(0, visibleCount);
    const remaining = comments.length - visibleComments.length;

    container.innerHTML = visibleComments.map(comment => {
      const userName = this.escapeHtml(comment.profile?.full_name || comment.profile?.email?.split('@')[0] || 'User');
      const isOwner = userId === comment.user_id;
      const commentDate = new Date(comment.created_at).toLocaleDateString();

      if (editingId === comment.id) {
        return `
          <div class="comment" data-comment-id="${comment.id}">
            <div class="comment-header">
              <span class="comment-author">${userName}</span>
              <span class="comment-date">${commentDate}</span>
            </div>
            <textarea class="comment-edit-input" data-comment-id="${comment.id}" data-post-id="${postId}" maxlength="1000">${this.escapeHtml(comment.comment_text)}</textarea>
            <div class="comment-actions">
              <button class="comment-edit-save" data-comment-id="${comment.id}" data-post-id="${postId}">Save</button>
              <button class="comment-edit-cancel" data-comment-id="${comment.id}" data-post-id="${postId}">Cancel</button>
            </div>
          </div>
        `;
      }

      return `
        <div class="comment" data-comment-id="${comment.id}">
          <div class="comment-header">
            <span class="comment-author">${userName}</span>
            <span class="comment-date">${commentDate}${comment._edited ? ' (edited)' : ''}</span>
          </div>
          <p class="comment-text">${this.escapeHtml(comment.comment_text)}</p>
          ${isOwner ? `
            <div class="comment-actions">
              <button class="comment-edit" data-comment-id="${comment.id}" data-post-id="${postId}">Edit</button>
              <button class="comment-delete" data-comment-id="${comment.id}" data-post-id="${postId}">Delete</button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('') + (remaining > 0 ? `
      <button class="comment-load-more" data-post-id="${postId}">
        Show ${Math.min(this._commentPageSize, remaining)} more (${remaining} remaining)
      </button>
    ` : '');

    // Delete
    container.querySelectorAll('.comment-delete').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const commentId = btn.dataset.commentId;
        const targetPostId = btn.dataset.postId;

        if (confirm('Are you sure you want to delete this comment?')) {
          await this.deleteComment(commentId, targetPostId);
        }
      });
    });

    // Edit
    container.querySelectorAll('.comment-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPostId = btn.dataset.postId;
        this._editingCommentId[targetPostId] = btn.dataset.commentId;
        this.renderComments(targetPostId, container);
      });
    });

    container.querySelectorAll('.comment-edit-cancel').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPostId = btn.dataset.postId;
        this._editingCommentId[targetPostId] = null;
        this.renderComments(targetPostId, container);
      });
    });

    container.querySelectorAll('.comment-edit-save').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        const commentId = btn.dataset.commentId;
        const targetPostId = btn.dataset.postId;
        const textarea = container.querySelector(`.comment-edit-input[data-comment-id="${commentId}"]`);
        if (!textarea) return;

        const originalLabel = btn.textContent;
        btn.disabled = true;
        btn.textContent = 'Saving...';

        const result = await this.editComment(commentId, targetPostId, textarea.value);
        if (!result?.success && btn.isConnected) {
          btn.disabled = false;
          btn.textContent = originalLabel;
        }
        // On success editComment() already re-rendered out of edit mode.
      });
    });

    // Load more
    container.querySelectorAll('.comment-load-more').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPostId = btn.dataset.postId;
        this._commentsVisibleCount[targetPostId] = (this._commentsVisibleCount[targetPostId] || this._commentPageSize) + this._commentPageSize;
        this.renderComments(targetPostId, container);
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
