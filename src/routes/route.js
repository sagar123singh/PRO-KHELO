const router= require("express").Router()
const { register, verify, login, getAllUsers, updateUser }=require("../controllers/userController")

router.post("/customer/register",register)
router.get('/verify-email',verify)
router.post("/login",login)
router.route("/user/:id").put(updateUser)
router.get("/getUser",getAllUsers)

module.exports=router;