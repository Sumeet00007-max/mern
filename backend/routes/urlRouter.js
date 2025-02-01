const express = require("express");
const router = express.Router();
const {isLoggedIn} = require('../middlewares/isLoggedIn');
const { createUrl, editUrl, deleteUrl, getAllUrls, redirectToOriginalUrl, dashboard, getAllAnalytics, getSearchUrl } = require('../controllers/urlController');

router.get('/all', isLoggedIn, getAllUrls)
router.get("/dashboard",isLoggedIn, dashboard)
router.get("/analytics", isLoggedIn, getAllAnalytics);
router.get("/search/:searchQuery", isLoggedIn, getSearchUrl)
router.get("/:shortUrl", redirectToOriginalUrl);


router.post("/shorten", isLoggedIn, createUrl)
router.put("/edit/:id", isLoggedIn, editUrl)

router.delete("/delete/:id", isLoggedIn, deleteUrl)

module.exports = router;