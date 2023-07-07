import UserModel from "../model/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from "otp-generator";
import asyncWrapper from "../middleware/asyncWrapper.js";
import Reports from "../model/Reports.model.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";
import XLSX from "xlsx";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

export const getAuthTokenPayload = (token) => {
  return jwt.verify(token, ENV.JWT_SECRET);
}

/** Fetch all items */
export const getItems = async (req, res) => {
  try {
    const criteria = {}; // getAuthTokenPayload(req.headers.authorization)?.roles.includes(["DR HAZLIFAH BINTI MOHD RUSLI"]);
    const items = await Reports.find();
    res.status(200).json({ items });
  } catch (error) {
    console.log(error);
  }
};

/** Add an item */
export const addItem = asyncWrapper(async (req, res) => {
  const { name } = req.body;
  const file = req.file.path;
  const item = await Reports.create({ name, file });
  res.status(201).json({ item });
});

/** Download a file */
export const downloadFile = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const item = await Reports.findById(new ObjectId(id));
  if (!item) {
    return next(new Error("No item found"));
  }
  const file = item.file;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = path.join(__dirname, `../${file}`);
  res.download(filePath);
});

/** Export data for a specific item based on _ID */
export const exportItemData = async (req, res) => {
  try {
    const { ids } = req.params;
    const idArray = ids.split(",");
    const items = await Reports.find({ _id: { $in: idArray } });

    if (!items || items.length === 0) {
      return res.status(404).json({ error: "Items not found" });
    }

    const jsonData = [];
    for (const item of items) {
      const workbook = XLSX.readFile(item.file);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const itemData = XLSX.utils.sheet_to_json(worksheet);
      jsonData.push({ id: item._id, data: itemData });
    }

    res.status(200).json(jsonData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/** Update item data based on existing items */
export const updateExportItemData = async (req, res) => {
  try {
    const { ids } = req.params;
    const idArray = ids.split(",");
    const items = await Reports.find({ _id: { $in: idArray } });

    if (!items || items.length === 0) {
      return res.status(404).json({ error: "Items not found" });
    }

    const jsonData = [];
    for (const item of items) {
      const workbook = XLSX.readFile(item.file);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      let itemData = XLSX.utils.sheet_to_json(worksheet);

      // Update the itemData by adding the external properties
      itemData = itemData.map((data) => ({
        ...data,
        PROPOSAL: req.body["PROPOSAL"] || "Title of the proposal",
        "EXAMINER 1": req.body["EXAMINER 1"] || "Examiner 1's name",
        "EXAMINER 2": req.body["EXAMINER 2"] || "Examiner 2's name",
        "EXAMINER 3": req.body["EXAMINER 3"] || "Examiner 3's name",
      }));

      jsonData.push({ id: item._id, data: itemData });

      // Update the items in the database
      // await Reports.findByIdAndUpdate(item._id, { data: itemData });
      const updatedItem = await Reports.findByIdAndUpdate(item._id, {
        data: itemData,
      });
      if (!updatedItem) {
        return res.status(500).json({ error: "Failed to update item data" });
      }
    }

    res.status(200).json(jsonData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

/** Update item data based on existing items */
export const updateExportItemDataNew = async (requiredUpdateData) => {
  try {
    const idArray = [...new Set(requiredUpdateData.map(item => item.excelId))];
    const items = await Reports.find({ _id: { $in: idArray } });

    if (!items || items.length === 0) {
      return { error: "Items not found" };
    }

    const jsonData = [];
    for (const item of items) {
      const file = item?.file;
      const workbook = XLSX.readFile(file);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const excelJSON = XLSX.utils.sheet_to_json(worksheet).map(excelRow => {
        const updateData = requiredUpdateData.find(data => data?.excelId === String(item._id) && data.recordNo === excelRow.NO) ?? null;

        return {
            ...excelRow,
            "PROPOSAL": updateData?.["PROPOSAL"] ?? item?.["PROPOSAL"] ?? "",
            "EXAMINER 1": updateData?.["EXAMINER 1"] ?? item?.["EXAMINER 1"] ?? "",
            "EXAMINER 2": updateData?.["EXAMINER 2"] ?? item?.["EXAMINER 2"] ?? "",
            "EXAMINER 3": updateData?.["EXAMINER 3"] ?? item?.["EXAMINER 3"] ?? "",
            "CHAIRPERSON": updateData?.["CHAIRPERSON"] ?? item?.["CHAIRPERSON"] ?? "",
        };

        item.status = true;
        item.save();
      });

      var ws = XLSX.utils.json_to_sheet(excelJSON);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "People");
      XLSX.writeFile(wb, file);
    }

    return { status: "success", message: "" };
  } catch (error) {
    console.log(error);
    return { status: "error", message: error?.message };
  }
};


export const submitData = async (req, res) => {
  try {
    const { status, message } = updateExportItemDataNew(req.body);
    return res.status(200).send({ status, message });
  } catch (error) {
    console.error("Error submitting data:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

/** middleware for verify user */
export async function verifyUser(req, res, next) {
  try {
    const { username } = req.method == "GET" ? req.query : req.body;

    // check the user existance
    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).send({ error: "Can't find User!" });
    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication Error" });
  }
}

/** POST: http://localhost:8080/api/register 
 * @param : {
  "username" : "example123",
  "password" : "admin123",
  "email": "example@gmail.com",
  "position" : "supevisor",
  "roles": ["PM"] // for Supervisor only
  "firstName" : "bill",
  "lastName": "william",
  "mobile": 8009860560,
  "address" : "Apt. 556, Kulas Light, Gwenborough",
  "profile": ""
  
}
*/
const validPositions = [
  {
    position: "Research Supervisor",
    allowedRoles: ["PM", "TS", "DR"],
  },
  "Program Coordinator",
  "Office Assistant",
];
export async function register(req, res) {
  try {
    const { username, password, profile, email, position, roles } = req.body;

    // check the existing user
    const existUsername = new Promise((resolve, reject) => {
      UserModel.findOne({ username }, function (err, user) {
        if (err) reject(new Error(err));
        if (user) reject({ error: "Please use unique username" });

        resolve();
      });
    });

    // check for existing email
    const existEmail = new Promise((resolve, reject) => {
      UserModel.findOne({ email }, function (err, email) {
        if (err) reject(new Error(err));
        if (email) reject({ error: "Please use unique Email" });

        resolve();
      });
    });

    if (position === "Office Assistant" && roles && roles.length > 0) {
      return res
        .status(400)
        .send({ error: "Office Assistant cannot have roles" });
    }

    if (
      position === "Research Supervisor" &&
      roles &&
      !roles.includes("PM") &&
      !roles.includes("TS") &&
      !roles.includes("DR")
    ) {
      return res.status(400).send({
        error:
          "Research Supervisor must have at least one of 'PM', 'TS', or 'DR' role",
      });
    }

    if (
      position === "Research Supervisor" &&
      (!roles || !roles.some((role) => ["PM", "TS", "DR"].includes(role)))
    ) {
      return res.status(400).send({
        error:
          "Research Supervisor must have at least one of 'PM', 'TS', or 'DR' role",
      });
    }

    if (position === "Program Coordinator" && roles && roles.length > 0) {
      return res
        .status(400)
        .send({ error: "Program Coordinator cannot have roles" });
    }

    Promise.all([existUsername, existEmail])
      .then(() => {
        if (password) {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              const user = new UserModel({
                username,
                password: hashedPassword,
                profile: profile || "",
                email,
                position,
                roles,
              });

              // return save result as a response
              user
                .save()
                .then((result) =>
                  res.status(201).send({ msg: "User Register Successfully" })
                )
                .catch((error) => res.status(500).send({ error }));
            })
            .catch((error) => {
              return res.status(500).send({
                error: "Enable to hashed password",
              });
            });
        }
      })
      .catch((error) => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(500).send(error);
  }
}

/** POST: http://localhost:8080/api/login 
 * @param: {
  "username" : "example123",
  "password" : "admin123"
}
*/
export async function login(req, res) {
  const { username, password, position, roles } = req.body;

  try {
    UserModel.findOne({ username })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((passwordCheck) => {
            if (!passwordCheck)
              return res.status(400).send({ error: "Don't have Password" });

            if (
              user.position === "Research Supervisor" &&
              (!user.roles ||
                !user.roles.some((role) => ["PM", "TS", "DR"].includes(role)))
            ) {
              return res.status(400).send({
                error:
                  "Research Supervisor must have at least one of 'PM', 'TS', or 'DR' role",
              });
            }

            // create jwt token
            const token = jwt.sign(
              {
                userId: user._id,
                username: user.username,
                roles: user.roles,
              },
              ENV.JWT_SECRET,
              { expiresIn: "1h" }
            );

            return res.status(200).send({
              msg: "Login Successful...!",
              username: user.username,
              position: user.position,
              roles: user.roles || [],
              token,
            });
          })
          .catch((error) => {
            return res.status(400).send({ error: "Password does not Match" });
          });
      })
      .catch((error) => {
        return res.status(404).send({ error: "Username not Found" });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/***/
export async function blockUser(req, res) {
  const { username } = req.params;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    user.status = "blocked";
    await user.save();

    return res.status(200).send({ message: "User blocked successfully" });
  } catch (error) {
    return res
      .status(500)
      .send({ error: "An error occurred while blocking the user" });
  }
}

/** GET: http://localhost:8080/api/user/example123 */
export async function getUser(req, res) {
  const { username } = req.params;

  try {
    if (!username) return res.status(501).send({ error: "Invalid Username" });

    UserModel.findOne({ username }, function (err, user) {
      if (err) return res.status(500).send({ err });
      if (!user)
        return res.status(501).send({ error: "Couldn't Find the User" });

      /** remove password from user */
      // mongoose return unnecessary data with object so convert it into json
      const { password, ...rest } = Object.assign({}, user.toJSON());

      return res.status(201).send(rest);
    });
  } catch (error) {
    return res.status(404).send({ error: "Cannot Find User Data" });
  }
}

/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
export async function updateUser(req, res) {
  try {
    // const id = req.query.id;
    const { userId } = req.user;

    if (userId) {
      const body = req.body;

      // update the data
      UserModel.updateOne({ _id: userId }, body, function (err, data) {
        if (err) throw err;

        return res.status(201).send({ msg: "Record Updated...!" });
      });
    } else {
      return res.status(401).send({ error: "User Not Found...!" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}

/** GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
}

/** GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({ msg: "Verify Successsfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}

// successfully redirect user when OTP is valid
/** GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  return res.status(440).send({ error: "Session expired!" });
}

// update the password when we have valid session
/** PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession)
      return res.status(440).send({ error: "Session expired!" });

    const { username, password } = req.body;

    try {
      UserModel.findOne({ username })
        .then((user) => {
          bcrypt
            .hash(password, 10)
            .then((hashedPassword) => {
              UserModel.updateOne(
                { username: user.username },
                { password: hashedPassword },
                function (err, data) {
                  if (err) throw err;
                  req.app.locals.resetSession = false; // reset session
                  return res.status(201).send({ msg: "Record Updated...!" });
                }
              );
            })
            .catch((e) => {
              return res.status(500).send({
                error: "Enable to hashed password",
              });
            });
        })
        .catch((error) => {
          return res.status(404).send({ error: "Username not Found" });
        });
    } catch (error) {
      return res.status(500).send({ error });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}
