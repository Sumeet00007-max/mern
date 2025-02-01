const express = require('express');
const { loginUser, registerUser, logoutUser, updateUser, deleteAccount } = require('../controllers/authController');
const { isLoggedIn } = require('../middlewares/isLoggedIn');
const router = express.Router();


router.post('/register', registerUser)
router.post('/login', loginUser)
// router.get('/logout', logoutUser)

router.delete("/delete", isLoggedIn, deleteAccount );


router.post('/update', isLoggedIn, updateUser);





module.exports = router;