import jwt from "jsonwebtoken"
export const protect=(req,res,next)=>{
    const token=req.headers.authentication?.split('')[1]
    if(!token)
        return res.status(401).json({message:"no token please login"})
    try {
        req.user=jwt.verify(token,process.env.JWT_SECRET)
        next()
    } catch (error) {
        return res.status(401).json({message:"invalid or expired token"})
    }
}