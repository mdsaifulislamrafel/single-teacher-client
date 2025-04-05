
import { useState } from "react"
import { motion } from "framer-motion"
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ArrowRightIcon, ChevronUpIcon } from "@heroicons/react/24/outline"

const Footer = () => {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
      setTimeout(() => setIsSubscribed(false), 3000)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Footer links
  const footerLinks = [
    {
      title: "প্লাটফর্ম",
      links: [
        { name: "আমাদের সম্পর্কে", url: "/about" },
        { name: "কেন আমরা", url: "/why-us" },
        { name: "সাফল্যের গল্প", url: "/success-stories" },
        { name: "ক্যারিয়ার", url: "/careers" },
      ],
    },
    {
      title: "কোর্স",
      links: [
        { name: "প্রোগ্রামিং", url: "/courses/programming" },
        { name: "ডিজাইন", url: "/courses/design" },
        { name: "ভাষা শিক্ষা", url: "/courses/language" },
        { name: "একাডেমিক", url: "/courses/academic" },
      ],
    },
    {
      title: "সাপোর্ট",
      links: [
        { name: "সাধারণ জিজ্ঞাসা", url: "/faq" },
        { name: "যোগাযোগ", url: "/contact" },
        { name: "হেল্প সেন্টার", url: "/help" },
        { name: "প্রাইভেসি পলিসি", url: "/privacy" },
      ],
    },
  ]

  // Social media links
  const socialLinks = [
    { name: "Facebook", icon: "facebook", url: "#" },
    { name: "YouTube", icon: "youtube", url: "#" },
    { name: "Instagram", icon: "instagram", url: "#" },
    { name: "LinkedIn", icon: "linkedin", url: "#" },
  ]

  // Contact info
  const contactInfo = [
    { icon: EnvelopeIcon, text: "info@shikkhaplatform.com" },
    { icon: PhoneIcon, text: "+880 1712-345678" },
    { icon: MapPinIcon, text: "মিরপুর-১০, ঢাকা, বাংলাদেশ" },
  ]

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 relative">
      {/* Back to Top Button - Repositioned for better visibility */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          onClick={scrollToTop}
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
          initial={{ opacity: 0.6 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
        >
          <ChevronUpIcon className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-8 border-b border-gray-800">
          {/* Company Info - Simplified */}
          <div className="lg:col-span-4">
            <div className="mb-4">
              <h2 className="text-2xl font-bold">শিক্ষা প্লাটফর্ম</h2>
              <p className="text-gray-400 text-sm mt-1">আপনার শিক্ষা যাত্রা শুরু করুন আজই</p>
            </div>

            {/* Contact Info - More compact */}
            <div className="space-y-2 mb-4">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                  <item.icon className="w-4 h-4 text-blue-400" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((item, index) => (
                <motion.a
                  key={index}
                  href={item.url}
                  whileHover={{ y: -3, backgroundColor: "#3B82F6" }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                >
                  <SocialIcon name={item.icon} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections - More compact */}
          {footerLinks.map((section, index) => (
            <div key={index} className="lg:col-span-2">
              <h3 className="text-md font-bold mb-3 text-white">{section.title}</h3>
              <ul className="space-y-1">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.url}
                      className="text-gray-400 hover:text-blue-400 transition-colors text-sm inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter - Simplified */}
          <div className="lg:col-span-4">
            <h3 className="text-md font-bold mb-3 text-white">আমাদের নিউজলেটার</h3>

            {isSubscribed ? (
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-3 text-green-400 text-sm">
                <p>ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="mb-0">
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="আপনার ইমেইল ঠিকানা"
                    className="flex-1 px-3 py-2 bg-gray-800 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white text-sm"
                    required
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-2 bg-blue-600 rounded-r-lg hover:bg-blue-700 transition-colors"
                  >
                    <ArrowRightIcon className="w-4 h-4" />
                  </motion.button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar - Simplified */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="text-gray-400 mb-2 md:mb-0">
            &copy; {new Date().getFullYear()} শিক্ষা প্লাটফর্ম। সর্বস্বত্ব সংরক্ষিত।
          </div>

          <div className="flex gap-4 text-gray-400">
            <a href="/privacy" className="hover:text-blue-400 transition-colors">
              প্রাইভেসি
            </a>
            <a href="/terms" className="hover:text-blue-400 transition-colors">
              শর্তাবলী
            </a>
            <a href="/cookies" className="hover:text-blue-400 transition-colors">
              কুকি পলিসি
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Helper component for social icons
const SocialIcon = ({ name }) => {
  switch (name) {
    case "facebook":
      return (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
        </svg>
      )
    case "youtube":
      return (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.244 4c.534.003 1.87.016 3.29.073l.504.022c1.429.067 2.857.183 3.566.38a2.5 2.5 0 0 1 1.754 1.755c.197.71.313 2.138.38 3.567l.022.504c.057 1.42.07 2.756.073 3.29v.818c-.003.534-.016 1.87-.073 3.29l-.022.504c-.067 1.429-.183 2.857-.38 3.566a2.5 2.5 0 0 1-1.754 1.754c-.71.197-2.138.313-3.567.38l-.504.022c-1.42.057-2.756.07-3.29.073h-.818c-.534-.003-1.87-.016-3.29-.073l-.504-.022c-1.429-.067-2.857-.183-3.566-.38a2.5 2.5 0 0 1-1.755-1.754c-.197-.71-.313-2.138-.38-3.567l-.022-.504c-.057-1.42-.07-2.756-.073-3.29v-.818c.003-.534.016-1.87.073-3.29l.022-.504c.067-1.429.183-2.857.38-3.566A2.5 2.5 0 0 1 4.06 4.476c.71-.197 2.137-.313 3.566-.38l.504-.022c1.42-.057 2.756-.07 3.29-.073h.818ZM10 9v6l5.25-3L10 9Z" />
        </svg>
      )
    case "instagram":
      return (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0-2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm6.5-.25a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0ZM12 4c-2.474 0-2.878.007-4.029.058-.784.037-1.31.142-1.798.332-.434.168-.747.369-1.08.703a2.89 2.89 0 0 0-.704 1.08c-.19.49-.295 1.015-.331 1.798C4.006 9.075 4 9.461 4 12c0 2.474.007 2.878.058 4.029.037.783.142 1.31.331 1.797.17.435.37.748.702 1.08.337.336.65.537 1.08.703.494.191 1.02.297 1.8.333C9.075 19.994 9.461 20 12 20c2.474 0 2.878-.007 4.029-.058.782-.037 1.309-.142 1.797-.331.433-.169.748-.37 1.08-.702.337-.337.538-.65.704-1.08.19-.493.296-1.02.332-1.8.052-1.104.058-1.49.058-4.029 0-2.474-.007-2.878-.058-4.029-.037-.782-.142-1.31-.332-1.798a2.911 2.911 0 0 0-.703-1.08 2.884 2.884 0 0 0-1.08-.704c-.49-.19-1.016-.295-1.798-.331C14.925 4.006 14.539 4 12 4Zm0-2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2Z" />
        </svg>
      )
    case "linkedin":
      return (
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68Z" />
        </svg>
      )
    default:
      return null
  }
}

export default Footer

