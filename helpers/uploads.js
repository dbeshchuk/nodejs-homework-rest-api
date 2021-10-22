const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "tmp/avatars");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now().toString()}_${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes("image")) {
      return cb(null, true);
    }

    cb(new Error("Wrong format for avatar!"));
  },
});

module.exports = upload;
