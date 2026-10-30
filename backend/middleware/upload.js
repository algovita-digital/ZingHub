import multer from 'multer';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.includes(file.mimetype)) {
      return cb(Object.assign(new Error('Only JPG, PNG or WEBP images are allowed'), { status: 400 }));
    }
    cb(null, true);
  },
});

export const uploadSingleImage = upload.single('image');
