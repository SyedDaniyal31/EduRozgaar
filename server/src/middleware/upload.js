import multer from 'multer';

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const storage = multer.memoryStorage();

export const uploadResume = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only PDF and DOCX allowed'), false);
  },
}).single('resume');
