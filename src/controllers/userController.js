const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const {
  isValid,
  isValidEmail,
  isValidMobile,
  isValidName,
  isValidStreet,
  isValidTitle,
  isValidCity,
  isValidPincode,
} = require("../validation/validation");

// ===========================================CREATING A USER==================================================//
const createUser = async function (req, res) {
  try {
    let data = req.body;

    //using destructuring.
    const { title, name, phone, email, address, password } = data;
    //  converting to lowercase.
    data["email"] = data["email"].toLowerCase();

    // checking if valid request body.
    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: false,
        message: "Data is required for creating user...",
      });
    }

    // checking title mandatory and valid.
    if (!title) {
      return res
        .status(400)
        .send({ status: false, message: "title is mandatory" });
    }

    if (!isValidTitle(title.trim())) {
      return res
        .status(400)
        .send({ status: false, message: "Please Enter Mr, Miss or Mrs..." });
    }

    // checking name mandatory and valid.
    if (!name) {
      return res
        .status(400)
        .send({ status: false, message: "name is mandatory" });
    }

    if (!isValid(name.trim()) || !isValidName(name.trim())) {
      return res.status(400).send({
        status: false,
        message: "name is required or its should contain aplhabets..",
      });
    }

    // checking phone mandatory and valid.
    if (!phone) {
      return res
        .status(400)
        .send({ status: false, message: "mobile number is mandatory..." });
    }

    if (!isValidMobile(phone.trim())) {
      return res.status(400).send({
        status: false,
        message: "please enter valid mobile number...",
      });
    }

    // checking email mandatory and valid.
    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "emailId is mandatory..." });
    }

    if (!isValidEmail(email.trim())) {
      return res
        .status(400)
        .send({ status: false, message: "please enter valid emailId..." });
    }

    //  checking if email is unique or not.
    let checkEmail = await userModel.findOne({ email: email });
    if (checkEmail) {
      return res.status(409).send({ message: "Email Already Registered..." });
    }

    //  checking if password is valid nad mandatory.
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is mandatory..." });
    }

    if (!(password.length < 16) || !(password.length > 7)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "password length should be from 8 to 15 .....",
        });
    }

    //  checking if mobile is unique or not.
    let checkMobile = await userModel.findOne({ phone: phone });
    if (checkMobile) {
      return res.status(409).send({ message: "Mobile Already Registered" });
    }

    //  checking if street is valid or not.
    if (address && address.street && !isValidStreet(address.street)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid street..." });
    }

    //  checking if city is valid or not.
    if (address && address.city && !isValidCity(address.city)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid city..." });
    }

    //  checking if pincode is valid or not.
    if (address && address.pincode && !isValidPincode(address.pincode)) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid pincode..." });
    }

    const newUser = await userModel.create(data);

    return res.status(201).send({
      status: true,
      message: " user created successfully",
      data: newUser,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

// ===========================================USER LOGIN==================================================//

const userLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    // checking request body.
    if (Object.keys(req.body).length == 0) {
      return res.status(400).send({
        status: false,
        message: "both email id and password is required",
      });
    }

    // checking email mandatory  and valid.
    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "email id is required " });
    }

    if (!isValidEmail(email)) {
      return res
        .status(400)
        .send({ status: false, message: "email id is invalid " });
    }

    // checking password mandatory  and valid.
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "password is required " });
    }

    if (!(password.length < 16) || !(password.length > 7)) {
      return res
        .status(400)
        .send({
          status: false,
          message: "password length should be from 8 to 15 .....",
        });
    }

    // checking credentials.
    let checkData = await userModel.findOne({
      email: email,
      password: password,
    });

    if (!checkData)
      return res
        .status(400)
        .send({ status: false, message: "Invalid Credentials" });

    let expiresIn = { expiresIn: "24h" };
    // creating Token
    let token = jwt.sign(
      {
        userId: checkData._id.toString(),
        group: "group-7",
      },
      "project3",
      expiresIn
    );

    res.status(200).send({
      status: true,
      message: "user Login Successful",
      data: token,
      userId: checkData._id,
      iat: new Date(),
      expiresIn: expiresIn.expiresIn,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

module.exports = { createUser, userLogin };
