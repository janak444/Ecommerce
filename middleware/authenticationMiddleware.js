
import JWT from "jsonwebtoken"
import userModel from "../models/userModel.js";

//Protected routes token base
export const requireSignIn = async (request, response, next) =>{
    try {
        const token = request.headers.authorization.split(" ")[1];

        const verified = JWT.verify(token, process.env.JWT_SECRET);

        response.locals.user = verified

        next();
    } catch (error) {
        return response.status(500).send({success: false, message: error.message})
    }
}

//admin access
export const isAdmin = async(request, response,next) =>{
    try {
        const user_id = response.locals.user._id
        const user = await userModel.findById(user_id)
        if(user.role !==1){
            return response.status(401).send({
                success:false,
                message:"UnAuthorized Access"
            })
        }else{
           next() 
        }
    } catch (error) {
        console.log(error)
    }
}