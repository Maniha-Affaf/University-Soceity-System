const UserModel = require("../models/User");
const joi = require("joi");
const bcrypt = require("bcrypt");
const passwordComplexity = require("joi-password-complexity");

const getUsers = async (req, res) => {
  console.log("was here");
  UserModel.find({}, (err, result) => {
    if (err) {
      res.send(err);
    }
    console.log("User Info Requested 🎨!");
    res.send(result);
  }).clone();
};

const getLoginUser = async (req, res) => {
  await UserModel.findOne({ current: true }, (err, doc) => {
    if (err) {
      return console.log(err + " 😴!");
    }
    console.log("Loginned User Sent Your way 🎭!");
    res.send(doc);
  }).clone();
};

const addUser = async (req, res) => {
  try {
    const { error } = validateRegister(req.body);
    if (error) {
      console.log(error + " 🥱!");
      return res.status(400).send({ message: error.details[0].message });
    }

    const passwordCheck = comparePassword(
      req.body.password,
      req.body.confirmedPassword
    );
    if (!passwordCheck) {
      console.log("Passwords don't match 😥!");
      return res.status(401).send({ message: "Passwords don't match!" });
    }
    if (req.body.role === "President") {
      const AdminFind = await UserModel.findOne({ userRole: "President" });
      if (AdminFind) {
        return res.status(409).send({ message: "President already exists!" });
      }
    }
    if (req.body.role === "Departmental Head") {
      const AdminFind = await UserModel.findOne({
        userRole: "Departmental Head",
      });
      if (AdminFind) {
        return res
          .status(409)
          .send({ message: "Departmental Head already exists!" });
      }
    }
    const userFind = await UserModel.findOne({ userMail: req.body.email });
    if (userFind) {
      console.log("User Alreaedy Exists 😪!");
      return res
        .status(409)
        .send({ message: "User with that email already exists!" });
    }

    const userPri = req.body.pri;
    const userName = req.body.name;
    const userMail = req.body.email;
    const userPhone = req.body.phone;
    const userRole = req.body.role;
    const userPassword = await hashPassword(req.body.password);
    const current = req.body.current;
    console.log(userPassword);
    const user = new UserModel({
      userPri: userPri,
      userName: userName,
      userMail: userMail,
      userPhone: userPhone,
      userRole: userRole,
      userPassword: userPassword,
      current: current,
    });

    await user.save((res, err, doc) => {
      if (err) {
        console.log(err + " 🤔!");
      } else {
        console.log("New User Created 🎉!");
      }
    });
    return res.send({ message: "New User created!" });
    // return res.status(200).send({ mesage: "New user created!" });
  } catch (error) {
    console.log("An Error Occured in Creation of User 😵!");
    res.status(500).send({ message: "User Creation Error!" });
  }
};

const authUser = async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) {
      console.log(error.details[0].message + " 😶!");
      return res.status(400).send({ message: error.details[0].message });
    }

    const userFind = await UserModel.findOne({ userMail: req.body.email });
    if (!userFind) {
      console.log("Invalid Mail 🤦‍♂️!");
      return res.status(401).send({ message: "Invalid Mail!" });
    }
    const validPassword = comparePassword(
      req.body.password,
      userFind.userPassword
    );
    if (!validPassword) {
      console.log("Invalid Password 🥴!");
      return res.status(401).send({ message: "Invalid Password!" });
    }
    const validRole = req.body.role === userFind.userRole;
    if (!validRole) {
      console.log("Invalid Role 🤯!");
      return res.status(401).send({ message: "Invalid Role!" });
    }
    console.log("Logged In Successfully 🕺💃!");
    return res
      .status(200)
      .send({ data: userFind, message: "Logged In Successfully 🕺💃!" });
  } catch (error) {
    console.log("Internal Server Error 🎂!");
    return res.status(500).send({ message: "Internal Server Error 🎂!" });
  }
};

const toggleLogin = async (req, res) => {
  const id = req.body.id;
  const current = req.body.current;
  await UserModel.updateOne({ _id: id }, { current: !current }, (err, doc) => {
    if (err) {
      return console.log(err + " 🥓!");
    }
    !current
      ? console.log("Logged In Successfully 🕺💃!")
      : console.log("Logged Out Successfully 🍗!");
    res.send(doc);
  })
    .clone()
    .catch((err) => {
      console.log(err + " 🥠!");
    });
};

const validateLogin = (data) => {
  const schema = joi.object({
    email: joi.string().email().required().label("email"),
    password: joi.string().required().label("password"),
    role: joi.string().required().label("role"),
  });
  return schema.validate(data);
};

const validateRegister = (data) => {
  const schema = joi.object({
    pri: joi.number().label("pri"),
    name: joi.string().required().label("name"),
    email: joi.string().email().required().label("email"),
    password: passwordComplexity().required().label("password"),
    confirmedPassword: joi.string().required().label("confirmedPassword"),
    role: joi.string().required().label("role"),
    phone: joi.string().required().label("phone"),
    current: joi.boolean().required().label("current"),
  });
  return schema.validate(data);
};

module.exports = {
  getUsers,
  getLoginUser,
  addUser,
  authUser,
  toggleLogin,
};

const saltRounds = 10; // You can adjust the number of salt rounds as needed

// Function to hash a password
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw error;
  }
};

// Function to compare a password with its hash
const comparePassword = async (password, hashPassword) => {
  try {
    console.log(password);
    console.log(hashPassword);

    const match = await bcrypt.compare(password, hashPassword);
    return match;
  } catch (error) {
    throw error;
  }
};
