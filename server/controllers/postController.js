import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

// @desc    Get all posts
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { category, tag, search, sort } = req.query;

    // Build query
    let query = { isPublished: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'popular') sortOption = { views: -1 };
    if (sort === 'likes') sortOption = { likesCount: -1 };

    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .sort(sortOption)
      .limit(limit)
      .skip(skip)
      .lean();

    const total = await Post.countDocuments(query);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:slug
// @access  Public
export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate('author', 'name avatar bio');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Yazı bulunamadı'
      });
    }

    // Increment views
    post.views += 1;
    await post.save();

    // Get comments
    const comments = await Comment.find({ post: post._id, isApproved: true })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        ...post.toObject(),
        comments
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create post
// @route   POST /api/posts
// @access  Private/Admin
export const createPost = async (req, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      author: req.user._id
    });

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private/Admin
export const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Yazı bulunamadı'
      });
    }

    // Make sure user is post owner or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bu yazıyı güncelleme yetkiniz yok'
      });
    }

    post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private/Admin
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Yazı bulunamadı'
      });
    }

    // Make sure user is post owner or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Bu yazıyı silme yetkiniz yok'
      });
    }

    await post.deleteOne();

    // Delete all comments for this post
    await Comment.deleteMany({ post: post._id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Yazı bulunamadı'
      });
    }

    // Check if post has already been liked
    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      // Unlike
      post.likes = post.likes.filter(
        like => like.toString() !== req.user._id.toString()
      );
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();

    res.status(200).json({
      success: true,
      data: {
        liked: !alreadyLiked,
        likesCount: post.likesCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
