//import { clerkClient } from "@clerk/express";

/*import { clerkClient } from "@clerk/clerk-sdk-node";
import { getAuth } from "@clerk/express";

export const auth =async(req,res,next)=>{
    try {
        const {userId,has}=getAuth(req);
        const hasPremium=await has({plan: 'premium'})

        const user=await clerkClient.users.getUser(userId);
        if(!hasPremium && user.privateMetadata.free_usage){
          req.free_usage=user.privateMetadata.free_usage
        } else {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            })
            req.free_usage=0;
        }
        req.plan=hasPremium ? 'premium' : "free";
        next()
    } catch (error) {
        res.json({success: false,message:error.message})
    }

}*/






import { clerkClient } from "@clerk/express";

// Middleware to check userId and hasPremiumPlan


export const auth = async (req, res, next)=>{
    try {
        const {userId, has} = await req.auth();
        const hasPremiumPlan = await has({plan: 'premium'});

        const user = await clerkClient.users.getUser(userId);

        if(!hasPremiumPlan && user.privateMetadata.free_usage){
            req.free_usage = user.privateMetadata.free_usage
        }else{
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: 0
                }
            })
            req.free_usage = 0;
        }

        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next()
    } catch (error){
        res.json({success: false, message: error.message})
    }
}