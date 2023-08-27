const User = require("../models/user");
const jwt = require("jsonwebtoken");

module.exports.signUp = async function (request, response) {
  try {
    const { email, password } = request.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(409).json({ error: "Email Already Exists" });
    }

    const newUser = new User({ email, password });
    await newUser.save();

    response.status(201).json({ message: "User Created Successfully" });
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.signIn = async function (request, response) {
  const secret_key = "amanpatel23";
  try {
    const { email, password } = request.body;
    console.log(email);
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return response.status(401).json({ error: "Invalid Credentials" });
    }

    const didPasswordMatch = await user.comparePassword(password);
    if (!didPasswordMatch) {
      return response.status(401).json({ error: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id }, secret_key, {
      expiresIn: "24h",
    });
    console.log(token);

    response.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    return response.status(200).json({ message: "SignIn Successfull" });
  } catch (error) {
    return response.status(500).json({ error: "Internal Server Error" });
  }
};
