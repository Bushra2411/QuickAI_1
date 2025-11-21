/*import React, { useEffect, useState } from 'react'
import {useUser} from '@clerk/clerk-react'
import {dummyPublishedCreationData} from '../assets/assets'
import { Heart } from 'lucide-react'
import axios from "axios";
import {useAuth} from '@clerk/clerk-react'
import toast from 'react-hot-toast';
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations,setCreations]=useState([])
  const {user}=useUser()
  const [loading, setLoading] = useState(false)
  const {getToken}=useAuth() 
  
  const fetchCreations=async()=>{
    try {
      const {data}=await axios.get('/api/user/get-all-creations',{
        headers:{Authorization:`Bearer ${await getToken()}`}
        
      }) 
      if(data.success){
          setCreations(data.creations)
      }else{
          toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }
  const imageLikeToggle=async(id)=>{
    try {
      const {data}=await axios.post('/api/user/toggle-like-creation',{id},{
        headers:{Authorization:`Bearer ${await getToken()}`}
      }) 
      if(data.success){
        toast.success(data.message)
        await fetchCreations()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  
  useEffect(()=>{
    if(user){
      fetchCreations()
    }
  },[user])
 
  return !loading? (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
       Creations
       <div className='bg-white h-full w-full rounded-xl overflow-y-scroll'>
        {creations.map((creations,index)=> (
          <div key={index} className='relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3'>
            <img src={creations.content} alt="" className='w-full rounded-lg h-full object-cover' /> 
          <div className='absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3  group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg'>
            <p className='text-sm hidden group-hover:block'>{creations.prompt}</p>
          <div className='flex gap-1 items-center'>
          <p>{creations.likes.length}</p>
          <Heart onClick={()=> imageLikeToggle(creations.id)} className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${creations.likes.includes(user.id)?'fill-red-500 text-red-600':'text-white'}`}/>
          </div>
        </div>
        </div>
        ))}
       </div>
    </div>
  ) :(
    <div className='flex justify-center items-center h-full'>
      <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
    </div>
  )
}

export default Community*/ 


import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import axios from "axios";
import { useAuth } from '@clerk/clerk-react'
import toast from 'react-hot-toast';
import { Heart } from 'lucide-react'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([])
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const { getToken } = useAuth()

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get('/api/user/get-all-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })

      if (data.success) {
        setCreations(data.creations)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        '/api/user/toggle-like-creation',
        { id },
        {
          headers: { Authorization: `Bearer ${await getToken()}` }
        }
      )

      if (data.success) {
        toast.success(data.message)
        await fetchCreations()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (user) fetchCreations()
  }, [user])

  // 🔥 Show ONLY image generations (no text-only creations)
  const imageCreations = creations.filter(
    c => c.content && c.content.startsWith("http")
  )

  return !loading ? (
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      Creations

      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll'>
        {imageCreations.map((crea, index) => (
          <div
            key={index}
            className='relative group inline-block pl-3 pt-3 w-full sm:max-w-1/2 lg:max-w-1/3'
          >
            {/* Image */}
            <img
              src={crea.content}
              alt=""
              className='w-full h-72 object-cover rounded-lg'
            />

            {/* Prompt + Like button (hover visible prompt) */}
            <div className='absolute bottom-0 top-0 right-0 left-3 flex gap-2 items-end justify-end group-hover:justify-between p-3 group-hover:bg-gradient-to-b from-transparent to-black/80 text-white rounded-lg'>
              
              {/* PROMPT should show */}
              <p className='text-sm hidden group-hover:block'>
                {crea.prompt}
              </p>

              {/* Like button */}
              <div className='flex gap-1 items-center'>
                <p>{crea.likes.length}</p>
                <Heart
                  onClick={() => imageLikeToggle(crea.id)}
                  className={`min-w-5 h-5 hover:scale-110 cursor-pointer ${
                    crea.likes.includes(user.id)
                      ? 'fill-red-500 text-red-600'
                      : 'text-white'
                  }`}
                />
              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className='flex justify-center items-center h-full'>
      <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
    </div>
  )
}

export default Community
