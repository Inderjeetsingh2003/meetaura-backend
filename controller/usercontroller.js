const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../schema/userschema");
const { sendEmail } = require("../utils/sendEmail");
const generatepassword = (length) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!";
  const randombuffer = crypto.randomBytes(length);
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[randombuffer[i] % chars.length];
  }
  return password;
};

const signup = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("the login is:", name, " ", email, " ", password);
  // return res.status(200).json("got the google details")

  try {
    // finding the user in the data base
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(200)
        .json({ success: 0, message: "user already exists with this email" });
    } else {
      const hashpassword = await bcrypt.hash(password, 10);
      const username =
        name.toLowerCase().split(" ").join("") +
        Math.floor(1000 + Math.random() * 9000);

      console.log(username, " ", email, " ", hashpassword);
      user = new User({
        username,
        email,
        password: hashpassword,
      });
      await user.save();
      const data = {
        user: {
          id: user._id,
        },
      };

      const accesstoken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
      return res.status(200).json({ success: 1, accesstoken });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: 0, message: "internal server error" });
  }
};

//login manually
const logindirectly = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("the  login is:", " ", email, " ", password);
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: 0, message: "user does not exits with this email" });
    }
    const comparepass = await bcrypt.compare(password, user.password);
    if (!comparepass) {
      return res.status(400).json({ success: 0, message: "invalid password" });
    }
    const data = {
      user: {
        id: user._id,
      },
    };
    const accesstoken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
    return res.status(200).json({ success: 1, accesstoken });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: 0, message: "internal server error" });
  }
};

//coninue with google
const googlelogin = async (req, res) => {
  const { name, email, photolink } = req.body;
  console.log("the google login is:", name, " ", email);
  // return res.status(200).json("got the google details")

  try {
    // finding the user in the data base
    let user = await User.findOne({ email });
    if (user) {
      console.log("user exits");
      const data = {
        user: {
          id: user._id,
        },
      };

      const accesstoken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
      return res.status(200).json({ success: 1, accesstoken });
    } else {
      let password = generatepassword(16);
      const hashpassword = await bcrypt.hash(password, 10);
      const username =
        name.toLowerCase().split(" ").join("") +
        Math.floor(1000 + Math.random() * 9000);

      console.log(username, " ", email, " ", hashpassword);
      user = new User({
        username,
        email,
        password: hashpassword,
        photourl: photolink,
      });
      await user.save();
      const data = {
        user: {
          id: user._id,
        },
      };

      const accesstoken = jwt.sign(data, process.env.ACCESS_TOKEN_SECRET);
      return res.status(200).json({ success: 1, accesstoken });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: 0, message: "internal server error" });
  }
};

const getuserdetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: 0, message: "user not found login/signupfirst" });
    }
    return res.status(200).json({ success: 1, user });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: 0, message: "internal server error" });
  }
};

const updateuser = async (req, res) => {
  try {
    const { username, email } = req.body;
    let user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: 0, message: "user not found" });
    }
    if (username) {
      if (username !== user.username) {
        const preusername = await User.findOne({ username });
        if (preusername) {
          return res
            .status(300)
            .json({ success: 0, message: "username already exists" });
        }

        user.username = username;
      }
    }
    if (email) {
      if (email != user.email) {
        const preemailuser = await User.findOne({ email });
        if (preemailuser) {
          return res
            .status(300)
            .json({ success: 0, message: "email already exists" });
        }
        user.email = email;
      }
    }

    await user.save();
    return res
      .status(200)
      .json({ success: 1, message: "user updated successfully", user });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: 0, message: "internal server error" });
  }
};



const forgotpassword = async (req, res) => {
  const { email } = req.body;
  console.log("the email is:",email)
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: 0, message: "no user found " });
    }

    // generating token and storing it in the database for the verfication..
    const resettoken = await user.getResetToken();
    await user.save();
    const url = `${process.env.FRONTEND_URL}/resetpassword/${resettoken}`;
    const message = `Click on the link to reset your password.${url}. If you didn't request for it 
            then please ignore.`;
    await sendEmail(user.email, "Reset-password", message);
    return res
      .status(200)
      .json({
        success: 1,
        message: `password email successfully sent to ${user.email}`,
      });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: 0, message: "internal server error" });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const resetpasswordtoken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await User.findOne({
      resetpasswordtoken,
      resetpasswordexpire: { $gt: Date.now() },
    });
    if (!user) {
      return res.status(404).json({ success: 0, message: "invalid creadentials or token expired" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetpasswordtoken = undefined;
    user.resetpasswordexpire = undefined;
    await user.save();
    return res.status(200).json({ success: 1, message: "user password changed successfully" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: 0, message: "internal server error" });
  }
};

module.exports = {
  googlelogin,
  logindirectly,
  signup,
  getuserdetails,
  updateuser,
  forgotpassword,
  resetpassword,
};
