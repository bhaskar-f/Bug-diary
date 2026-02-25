import jwt from "jsonwebtoken";
import User from "../models/user.js";

export async function protect(req, res, next) {
  try {
    //make a variable to strore the token
    let token;

    //if the reques header has the bearer then extract the token and store in token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    //if token is empty or null then return , will not forward to controller
    if (!token) return res.status(401).json({ message: "user unauthorized" });

    //if token is present then verify it with jwt secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //now decoded becomes a object and has {id:"userId",iat:12342,exp:13366}

    //we find the user with the decoded.id but without the password ("-password")
    const user = await User.findById(decoded.id).select("-password");

    //if there's a case like user is deleted for some reason but the token is still there then check user existence
    if (!user) {
      return res.status(401).json({ message: "not Authorized user not found" });
    }

    //if user found then give it to req.user(tells who is the user)
    req.user = user;

    //forward to controller
    next();
  } catch (err) {
    res
      .status(401)
      .json({ message: "not Authorized user not found", error: err.message });
  }
}
