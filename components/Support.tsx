"use client"

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Megaphone, Clock, Mail } from 'lucide-react'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import SwiperCore from "swiper";
import { Navigation, Autoplay } from "swiper/modules";
SwiperCore.use([Navigation, Autoplay]);

const supportStats = [
  {
    icon: Megaphone,
    value: '97%',
    label: 'satisfaction rate',
    color: 'from-[#b08a5a] to-[#7a5a33]',   // 🔴 changed
    iconColor: 'text-[#b08a5a]',           // 🔴 changed
    bgColor: 'bg-[#f3e6e6]',               // 🔴 light red bg
  },
  {
    icon: Clock,
    value: '24/7',
    label: 'always available',
    color: 'from-[#b08a5a] to-[#3a0000]',  // 🔴 changed
    iconColor: 'text-[#b08a5a]',
    bgColor: 'bg-[#f3e6e6]',
  },
  {
    icon: Mail,
    value: '12-24h',
    label: 'avg. response time',
    color: 'from-[#b08a5a] to-[#8b0000]',  // 🔴 changed
    iconColor: 'text-[#b08a5a]',
    bgColor: 'bg-[#f3e6e6]',
  },
]

const avatarImages = [
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=200',
  'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=200',
]

export default function Support() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current)
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-20 md:py-28 bg-gradient-to-b from-[#eff8ff] to-[#eaf5ff] overflow-hidden"
    >
      {/* 🔴 blobs color change only */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-[#b08a5a]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-20 right-20 w-64 h-64 bg-[#7a5a33]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* avatars unchanged */}
        <div className="flex items-center -space-x-3 justify-center mb-10">
          {avatarImages.map((image, index) => (
            <img
              key={index}
              src={image}
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-full border-2 sm:border-4 border-white shadow-lg"
            />
          ))}
        </div>

        {/* heading unchanged */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center leading-tight">
          Got questions?
          <br />
          <span className="text-[#b08a5a]">
            We’re here to help 24/7
          </span>
        </h2>

        {/* stats */}
        <div className="hidden md:grid grid-cols-3 gap-6 mt-10">
          {supportStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
              
              <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </div>

              <p className="text-gray-600">{stat.label}</p>

              <stat.icon className={`w-8 h-8 mt-4 ${stat.iconColor}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}