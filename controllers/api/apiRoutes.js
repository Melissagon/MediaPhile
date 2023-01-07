const router = require('express').Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require('fs');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream } = require('../s3');
const uploadImage = require('../../utils/uploadImg');
const Note = require('../../models/Note');

router.get('/images/:key', (req, res) => {
  const key = req.params.key;
  const readStream = getFileStream(key);

  readStream.pipe(res);
});

router.post('/image', upload.single('image'), async function (req, res) {
  const result = await uploadImage(req.file);
  res.send({ imagePath: `/images/${result.key}` });
  const userData = await Note.create({
    user_id: req.session.user_id,
    title: req.body.title,
    description: req.body.description,
    key: result.key,
  });
  // res.status(200).json(userData)
});

// creates a method to delete previously made notes based on their unique id.
router.delete('/api/notes/:id', (req, res) => {
  router.delete('/api/notes/:id', async (req, res) => {
    res.status(200);
    try {
      const postData = await Post.destroy({
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      });
      deletePhoto(req);

      if (!postData) {
        res.status(404).json({ message: 'No post found with this id!' });
        return;
      }

      res.status(200).json(postData);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router;

  const deletePhoto = async (req) => {
    const key = req.params.key;

    const deleteParams = {
      Bucket: bucketName,
      Key: key,
    };

    return S3.send(new DeleteObjectCommand(deleteParams));
  };
  exports.deletePhoto = deletePhoto;
});

module.exports = router;
