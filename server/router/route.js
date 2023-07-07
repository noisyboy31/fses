import { Router } from "express";

const router = Router();

/** import all controllers */
import * as controller from "../controllers/appController.js";
import { registerMail } from "../controllers/mailer.js";
import Auth, { localVariables } from "../middleware/auth.js";
import uploadsFile from "../middleware/multer.js";

/** GET Upload Methos */
// router
router
  .route("/list")
  .get(controller.getItems)
  .post(uploadsFile.single("file"), controller.addItem);
router.route("/download/:id").get(controller.downloadFile);

/** get data from mongoDB */
// router.route("/items/:ids").get(controller.exportItemData);
router
  .route("/items/:ids")
  .get(controller.exportItemData) ///here's the latest changes

/** Post submitData */
router.route("/submitData").post(controller.submitData);

/** POST Methods */
router.route("/register").post(controller.register); // register user
router.route("/registerMail").post(registerMail); // send the email
router
  .route("/authenticate")
  .post(controller.verifyUser, (req, res) => res.end()); // authenticate user
router.route("/login").post(controller.verifyUser, controller.login); // login in app
router.post("/user/:username/block", controller.blockUser); // for blocking invalid password user

/** GET Methods */
router.route("/user/:username").get(controller.getUser); // user with username
router
  .route("/generateOTP")
  .get(controller.verifyUser, localVariables, controller.generateOTP); // generate random OTP
router.route("/verifyOTP").get(controller.verifyUser, controller.verifyOTP); // verify generated OTP
router.route("/createResetSession").get(controller.createResetSession); // reset all the variables

/** PUT Methods */
router.route("/updateuser").put(Auth, controller.updateUser); // is use to update the user profile
router
  .route("/resetPassword")
  .put(controller.verifyUser, controller.resetPassword); // use to reset password

export default router;
