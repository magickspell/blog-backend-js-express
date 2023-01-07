import PostModel from "../models/post.model.js";

export const createPost = async (req, res) => { // todo token expires fix
  try {
    const post = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags,
      author: req.body.author,
    });
    await post.save().then(() => console.log('[OK] - new post saved'))
      .catch((e) => {
          console.log(`[ERR] - ${e}`);
          throw new Error(e);
        }
      );
    return res.status(200).json({
      success: true,
      message: 'post created.',
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'post create error.',
      error: `error: ${e}`,
    });
  }
}

export const getPosts = async (req, res) => { // todo token expires fix
  try {
    const posts = await PostModel.find().populate('author', 'username').exec();
    return res.status(200).json({
      success: true,
      message: 'posts fetched.',
      posts: posts
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'post create error.',
      error: `error: ${e}`,
    });
  }
}

export const getOnePost = async (req, res) => { // todo token expires fix
  try {
    const post = await PostModel.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $inc: {viewsCount: 1}
      },
      {
        returnDocument: 'after'
      }
    ).populate('author', 'username');
    return res.status(200).json({
      success: true,
      message: 'postId fetched.',
      post: post
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'postId get error.',
      error: `error: ${e}`,
    });
  }
}

export const deleteOnePost = async (req, res) => { // todo token expires fix
  try {
    const result = await PostModel.findOneAndDelete({_id: req.params.id});
    if (result === null) {
      return res.status(400).json({
        success: false,
        message: 'postId nothing to delete.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'postId deleted.'
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'postId delete error.',
      error: `error: ${e}`,
    });
  }
}

export const updateOnePost = async (req, res) => { // todo token expires fix
  try {
    const result = await PostModel.findOne({_id: req.params.id}).populate('author', 'username');
    console.log(result);
    console.log(req.params.id);
    if (result === null) {
      return res.status(400).json({
        success: false,
        message: 'postId nothing to update.',
      });
    }
    await PostModel.findOneAndUpdate(
      {_id: req.params.id},
      {
        title: req.body.title ? req.body.title : result.title,
        text: req.body.text ? req.body.text : result.text,
        imageUrl: req.body.imageUrl ? req.body.imageUrl : result.imageUrl,
        tags: req.body.tags ? req.body.tags : result.tags,
      }
    );
    return res.status(200).json({
      success: true,
      message: 'post updated.'
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: 'post update error.',
      error: `error: ${e}`,
    });
  }
}
