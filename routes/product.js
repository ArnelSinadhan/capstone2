const express = require("express");
const productController = require("../controllers/product.js");
const { verify, verifyAdmin } = require("../auth.js");
const multer = require("multer");
const path = require("path");
const { GridFsStorage } = require("multer-gridfs-storage");
const router = express.Router();
const mongoose = require("mongoose");

const storage = new GridFsStorage({
  url: process.env.MONGODB_STRING,
  file: (req, file) => {
    console.log("File metadata:", file); // Debugging statement
    return {
      filename:
        file.fieldname + "_" + Date.now() + path.extname(file.originalname),
      bucketName: "uploads", // Bucket name to use in GridFS
    };
  },
});

const upload = multer({
  storage: storage,
});

// Route for creating product
router.post(
  "/",
  verify,
  verifyAdmin,
  upload.single("file"),
  productController.addProduct
);

// Route for retrieving all products
router.get("/all", verify, verifyAdmin, productController.getAllProduct);

// Route for retrieving all active products
router.get("/active", productController.getActiveProduct);

// Route for Retrieving single product
router.get("/:productId", productController.retrieveSingleProduct);

// Route for Updating Product information
router.patch(
  "/:productId/update",
  verify,
  verifyAdmin,
  upload.single("file"),
  productController.updateProduct
);

// Route for Archiving a product
router.patch(
  "/:productId/archive",
  verify,
  verifyAdmin,
  productController.archiveProduct
);

// Route for Activating a product
router.patch(
  "/:productId/activate",
  verify,
  verifyAdmin,
  productController.activateProduct
);

// Route to search for product by name
router.post("/search-by-name", productController.searchByName);

// Route to search for product by price range
router.post("/search-by-price", productController.searchByPrice);

// Route to fetch image by filename
router.get("/images/:filename", (req, res) => {
  const filename = req.params.filename;
  const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads",
  });

  gfs
    .openDownloadStreamByName(filename)
    .on("error", (err) => {
      return res.status(404).json({ err: "No file exists" });
    })
    .pipe(res)
    .on("finish", () => {
      console.log("Image sent successfully");
    });
});

module.exports = router;
