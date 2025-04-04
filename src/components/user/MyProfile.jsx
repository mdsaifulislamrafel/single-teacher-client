import { useState } from "react"
import { UserIcon, EnvelopeIcon } from "@heroicons/react/24/outline"
import { motion } from "framer-motion"
import { useAuth } from "../../provider/AuthContext"

const MyProfile = () => {
  const { user: userData } = useAuth()
  const [user] = useState({
    name: userData.name,
    email: userData.email,
    profession: userData.role === "user" ? "শিক্ষাথী" : "শিক্ষক",
    bio:userData.role === "user" ? "আমি একজন শিক্ষাথী" : "আমি একজন শিক্ষাক",
    profilePicture: userData.avatar.url,
  })

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full mx-auto px-4"
      >
        <motion.div
          className="bg-white shadow-lg rounded-lg p-6 md:p-8"
          whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          transition={{ duration: 0.3 }}
        >
          <motion.h1
            className="text-2xl font-bold mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            আমার প্রোফাইল
          </motion.h1>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex items-center gap-4 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <motion.div
                className="rounded-full overflow-hidden w-16 h-16 md:w-20 md:h-20 flex items-center justify-center bg-blue-100"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture || "/placeholder.svg"}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null // Prevent infinite loop
                      e.currentTarget.style.display = "none"
                      e.currentTarget.parentElement.innerHTML = `<div class="p-3"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" class="w-10 h-10 text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg></div>`
                    }}
                  />
                ) : (
                  <div className="p-3">
                    <UserIcon className="w-10 h-10 text-blue-600" />
                  </div>
                )}
              </motion.div>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-gray-600">{user.profession}</p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              whileHover={{ x: 5 }}
            >
              <EnvelopeIcon className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">ইমেইল</p>
                <p>{user.email}</p>
              </div>
            </motion.div>

            <motion.div
              className="mt-6 pt-4 border-t"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <p className="text-sm text-gray-500 mb-1">আমার সম্পর্কে</p>
              <p>{user.bio}</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default MyProfile

