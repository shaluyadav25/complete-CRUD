import cors from "cors"
import express from "express"
import authRoute from "./routes/auth.Routes.js"
import productRoute from "./routes/product.Route.js"

const app=express()

app.use(
    cors({
        origin:process.env.CROSS_ORIGIN?.split(',').map((o)=>o.trim()) ?? false,
    }),
)
app.use(express.json({ limit: "8mb" }))
app.use('api/auth',authRoute)
app.use('api/product',productRoute)

app.use((req,res)=>res.status(404).json({message:"route not found"}));

app.use((err,req,res,next)=>{
    if(err.name==="validationError")
        return res.status(400).json({message:err.message})
    if(err.name==="CastError")
        return res.status(400).json({message:`invalid ${err.path}`})
    if(err.code===11000)
        return res.status(409).json({message:err.message})
    if(err.status) return res.status(err.status).json({message:err.message})
    return res.status(500).json({message:"internal server error"})
})
export default app;