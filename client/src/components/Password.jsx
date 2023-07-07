// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import avatar from "../assets/profile.png";
import toast, { Toaster } from "react-hot-toast";
import { useFormik } from "formik";
import { passwordValidate } from "../helper/validate";
import useFetch from "../hooks/fetch.hook";
import { useAuthStore } from "../store/store";
import { verifyPassword, blockUser } from "../helper/helper";
import styles from "../styles/Username.module.css";
import UserProfile from "./UserProfile/index";

export default function Password() {
  const navigate = useNavigate();
  const { username } = useAuthStore((state) => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);
  const [passwordAttempts, setPasswordAttempts] = useState(0);
  const [positionCheck, setPositionCheck] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "admin@123",
      position: "Off Assistant",
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (passwordAttempts < 2) {
        const remainingAttempts = 2 - passwordAttempts;
        const loginPromise = verifyPassword({
          username,
          password: values.password,
          position: values.position,
        });

        toast.promise(loginPromise, {
          loading: "Checking...",
          success: <b>Login Successfully...!</b>,
          error: <b>Password Not Match!</b>,
        });

        loginPromise
          .then((res) => {
            const { token } = res.data;
            const data = res?.data?.position;
            const info = res?.data;
            if (data) {
              navigate("/userProfile", {
                state: { position: data, info: info },
              });
              setPositionCheck(true);
            }
            localStorage.setItem("token", token);
          })
          .catch(() => {
            const remainingAttemptsMsg =
              remainingAttempts > 1
                ? `${remainingAttempts} attempts`
                : `${remainingAttempts} attempt`;
            toast.error(`Invalid password. ${remainingAttemptsMsg} remaining.`);
            setPasswordAttempts((prevAttempts) => prevAttempts + 1);
          });
      } else {
        navigate("/recovery");
      }
    },
  });

  useEffect(() => {
    if (passwordAttempts === 3) {
      const blockUsers = async () => {
        try {
          await blockUser(username);
          toast.error(
            "Maximum password attempts reached. Your account has been blocked."
          );
        } catch (error) {
          toast.error("An error occurred. Please try again later.");
        }
      };
      blockUsers();
    }
  }, [passwordAttempts, username]);

  if (isLoading) return <h1 className="text-2xl font-bold">isLoading</h1>;
  if (serverError)
    return <h1 className="text-xl text-red-500">{serverError.message}</h1>;

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
        <div className={styles.glass}>
          <div className="title flex flex-col items-center">
            <h4 className="text-5xl font-bold">
              Hello {isLoading ? "" : apiData?.firstName || apiData?.username}
            </h4>
            <span className="py-4 text-xl w-2/3 text-center text-gray-500">
            FIRST STAGE EVALUATION SYSTEM
            </span>
          </div>

          <form className="py-1" onSubmit={formik.handleSubmit}>
            <div className="profile flex justify-center py-4">
              <img
                src={apiData?.profile || avatar}
                className={styles.profile_img}
                alt="avatar"
              />
            </div>

            <div className="textbox flex flex-col items-center gap-6">
              <input
                {...formik.getFieldProps("password")}
                className={styles.textbox}
                type="text"
                placeholder="Password"
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: "0",
                  width: "314px",
                }}>
                {!positionCheck && (
                  <button className={styles.btn} type="submit">
                    Sign In
                  </button>
                )}
                <button
                  className={styles.btn}
                  type="submit"
                  onClick={() => navigate("/")}>
                  Back
                </button>
              </div>
            </div>
            {!positionCheck && (
              <div className="text-center py-4">
                <span className="text-gray-500">
                  Forgot Password?{" "}
                  <Link className="text-red-500" to="/recovery">
                    Recover Now
                  </Link>
                </span>
              </div>
            )}
            {positionCheck && <UserProfile />}
          </form>
        </div>
      </div>
    </div>
  );
}
