const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs').promises;

// Dosya yükleme için storage yapılandırması
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../../uploads');
        try {
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Dosya filtreleme
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Desteklenmeyen dosya formatı. Sadece JPEG, PNG ve WEBP formatları kabul edilir.'), false);
    }
};

// Multer yapılandırması
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Resim işleme fonksiyonu
const processImage = async (file, options = {}) => {
    const {
        width = 800,
        height = 800,
        quality = 80,
        format = 'webp'
    } = options;

    const filename = path.parse(file.filename).name;
    const outputPath = path.join(
        path.dirname(file.path),
        `${filename}-processed.${format}`
    );

    try {
        await sharp(file.path)
            .resize(width, height, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .toFormat(format, { quality })
            .toFile(outputPath);

        // Orijinal dosyayı sil
        await fs.unlink(file.path);

        return {
            filename: path.basename(outputPath),
            path: outputPath,
            size: (await fs.stat(outputPath)).size,
            mimetype: `image/${format}`
        };
    } catch (error) {
        // Hata durumunda orijinal dosyayı koru
        return {
            filename: file.filename,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype
        };
    }
};

module.exports = {
    upload,
    processImage
}; 