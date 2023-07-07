import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //where to store the file
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
    // cb(null, new Date().toString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  //reject a file if it's not a jpg or png
  if (
    file.mimetype === "application/vnd.ms-excel" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadsFile = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

export default uploadsFile;
