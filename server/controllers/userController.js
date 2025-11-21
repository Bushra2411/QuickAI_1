import sql from "../configs/db.js";

/*export const getUserCreations=async (req,res)=>{
    try{
        const {userId}=req.auth()
        const creations=await sql `SELECT * FROM creations WHERE user_id=${userId} ORDER BY created_at DESC`;
        res.json({success:true,creations});
    }
    catch (error){
        res.json({success:false,message:error.message});
    }
}*/

export const getAllCreations = async (req, res) => {
  try {
   const creations = await sql`
  SELECT *, COALESCE(likes, '{}') AS likes
  FROM creations
  ORDER BY created_at DESC
`;
    console.log("Backend creations:", creations); // 👈 Add this
    res.json({ success: true, creations });
  } catch (error) {
    console.error("Error fetching creations:", error);
    res.json({ success: false, message: error.message });
  }
};



export const getPublishedCreations=async (req,res)=>{
    try{
        const creations=await sql `SELECT * FROM creations WHERE publish=true ORDER BY created_at DESC`;
        res.json({success:true,creations});
    }
    catch (error){
        res.json({success:false,message:error.message});
    }
}



export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;
    if (!creation) {
      return res.json({ success: false, message: "Creation not found" });
    }

    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();  

    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((user) => user !== userIdStr);
      message = "Creation Unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation Liked";
    }

    const formattedArray = `{${updatedLikes.join(",")}}`;

    await sql`UPDATE creations SET likes = ${formattedArray}::text[] WHERE id = ${id}`;
    res.json({ success: true, message });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
