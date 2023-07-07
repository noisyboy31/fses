import toast from "react-hot-toast";
import { authenticate } from "./helper";

/** validate login page username */
export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);

  if (values.username) {
    // check user exist or not
    const { status } = await authenticate(values.username);

    if (status !== 200) {
      errors.exist = toast.error("User does not exist...!");
    }
  }

  return errors;
}

/** validate password */
export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);

  return errors;
}

/** validate reset password */
export async function resetPasswordValidation(values) {
  const errors = passwordVerify({}, values);

  if (values.password !== values.confirm_pwd) {
    errors.exist = toast.error("Password not match...!");
  }

  return errors;
}

/** validate register form */
export async function registerValidation(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);

  return errors;
}

/** validate profile page */
export async function profileValidation(values) {
  const errors = emailVerify({}, values);
  return errors;
}

/** ************************************************* */

/** validate password */
function passwordVerify(errors = {}, values) {
  /* eslint-disable no-useless-escape */
  const alphanumericalChars = /^[a-zA-Z0-9]+$/;

  if (!values.password) {
    errors.password = toast.error("Password Required...!");
  } else if (values.password.includes(" ")) {
    errors.password = toast.error("Wrong Password...!");
  } else if (values.password.length < 8) {
    errors.password = toast.error(
      "Password must be more than 8 characters short"
    );
  } else if (values.password.length > 16) {
    errors.password = toast.error(
      "Password shouldn't be more than 16 characters long"
    );
  } else if (!alphanumericalChars.test(values.password)) {
    errors.password = toast.error("Password shoudn't have special character");
  }

  return errors;
}

/** validate username */
// function usernameVerify(errors = {}, values) {
//   // const alphanumericalChars = /^[a-zA-Z0-9]+$/;

//   if (!values.username) {
//     errors.username = toast.error("Username Required...!");
//   } else if (values.username.includes(" ")) {
//     errors.username = toast.error("Invalid Username...!");
//   } else if (values.username.length < 8) {
//     errors.username = toast.error(
//       "Username must be more than 8 characters short"
//     );
//   } else if (values.username.length > 16) {
//     errors.username = toast.error(
//       "Username shouldn't be more than 16 characters long"
//     );
//   } else if (!alphanumericalChars.test(values.username)) {
//     errors.username = toast.error("Username shoudn't have special character");
//   }

//   return errors;
// }

function usernameVerify(errors = {}, values) {
  const alphanumericalChars = /^[a-zA-Z\s']+$/;

  if (!values.username) {
    errors.username = toast.error("Username Required...!");
  } else if (!alphanumericalChars.test(values.username)) {
    errors.username = toast.error("Invalid Username...!");
  } else if (values.username.length < 8) {
    errors.username = toast.error(
      "Username must be more than 8 characters short"
    );
  } else if (values.username.length > 20) {
    errors.username = toast.error(
      "Username shouldn't be more than 16 characters long"
    );
  }

  return errors;
}

/** validate email */
function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error("Email Required...!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Wrong Email...!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email address...!");
  }

  return error;
}
