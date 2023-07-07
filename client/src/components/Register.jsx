import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { registerValidation } from "../helper/validate";
import convertToBase64 from "../helper/convert";
import { registerUser } from "../helper/helper";
import styles from "../styles/Username.module.css";
import "./indexMain.css";

export default function Register() {
  const navigate = useNavigate();
  const [file, setFile] = useState();
  const validPositions = [
    {
      position: "Research Supervisor",
      allowedRoles: ["PM", "TS", "DR"],
    },
    "Program Coordinator",
    "Office Assistant",
  ];

  const formik = useFormik({
    initialValues: {
      email: "doyol56239@cnogs.com",
      username: "example123",
      password: "admin@123",
      position: "Supervisor",
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const selectedPosition = validPositions.find((position) => {
        if (typeof position === "object") {
          return position.position === values.position;
        }
        return position === values.position;
      });

      if (!selectedPosition) {
        toast.error("Invalid position");
        return;
      }

      if (
        typeof selectedPosition === "object" &&
        selectedPosition.position === "Research Supervisor" &&
        (!values.roles ||
          !values.roles.some((role) =>
            selectedPosition.allowedRoles.includes(role)
          ))
      ) {
        toast.error(
          "Research Supervisor must have at least one of 'PM', 'TS', or 'DR' role"
        );
        return;
      }

      values = await Object.assign(values, { profile: file || "" });
      let registerPromise = registerUser(values);
      console.log("registerUser", registerUser);
      toast.promise(registerPromise, {
        loading: "Creating...",
        success: <b>Register Successfully...!</b>,
        error: <b>Could not Register.</b>,
      });

      registerPromise.then(function () {
        navigate("/");
      });
    },
  });

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  const navigateStyle = {
    App: {
      color: "var(--black)",
      background:
        "linear-gradient(106.37deg, #B47643 29.63%, #DC9E6B 51.55%, #FABC89 90.85%)",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
    },
  };

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false}></Toaster>

      <div
        style={navigateStyle.App}
        className="flex justify-center items-center h-screen">
        <div
          className={styles.glass}
          style={{ width: "45%", paddingTop: "3em" }}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">Register</h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
              Happy to join you!
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file || avatar}
                  className={styles.profile_img}
                  alt="avatar"
                />
              </label>

              <input
                onChange={onUpload}
                type="file"
                id="profile"
                name="profile"
              />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("email")}
                className={styles.textbox}
                type="text"
                placeholder="Email*"
              />
              <input
                {...formik.getFieldProps("username")}
                className={styles.textbox}
                type="text"
                placeholder="Username*"
              />
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="text"
                placeholder="Password*"
              />
              <select
                {...formik.getFieldProps("position")}
                className={styles.textbox}>
                <option value="">Position*</option>
                {validPositions?.map((position) => (
                  <option
                    key={position.position || position}
                    value={position.position || position}>
                    {position.position || position}
                  </option>
                ))}
              </select>

              {formik.values.position === "Research Supervisor" && (
                <div>
                  <label>
                    <input
                      type="checkbox"
                      name="roles"
                      value="PM"
                      onChange={formik.handleChange}
                      checked={formik.values.roles?.includes("PM")}
                    />{" "}
                    PM
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="roles"
                      value="TS"
                      onChange={formik.handleChange}
                      checked={formik.values.roles?.includes("TS")}
                    />{" "}
                    TS
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      name="roles"
                      value="DR"
                      onChange={formik.handleChange}
                      checked={formik.values.roles?.includes("DR")}
                    />{" "}
                    DR
                  </label>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: "0",
                  width: "314px",
                }}>
                <button className={styles.btn} type="submit">
                  Register
                </button>
                <button className={styles.btn} type="submit">
                  <Link to="/">Back</Link>
                </button>
              </div>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Already Register?{" "}
                <Link className="text-red-500" to="/">
                  Login Now
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
