import React from 'react'
import { Twitter, Github, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="py-6 mt-10">
      <div className="text-center text-xs text-gray-500 mt-6">
        &copy; {new Date().getFullYear()} ChavFana. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
