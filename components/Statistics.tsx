// "use client"

// import { useState, useEffect, useRef } from 'react'
// import { ThumbsUp, Mail, Clock } from 'lucide-react'
// import Image from 'next/image'
// import { useTranslations } from '@/lib/translations'

// export default function Statistics() {
//   const { t } = useTranslations()
//   const [isVisible, setIsVisible] = useState(false)
//   const sectionRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             setIsVisible(true)
//             observer.disconnect()
//           }
//         })
//       },
//       { threshold: 0.2 }
//     )

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current)
//     }

//     return () => observer.disconnect()
//   }, [])

//   const supportMetrics = [
//     {
//       icon: ThumbsUp,
//       value: '98%',
//       label: 'Satisfaction rate',
//       color: 'from-amber-400 to-amber-600',
//       bgColor: 'bg-amber-100',
//       iconColor: 'text-amber-600',
//     },
//     {
//       icon: Mail,
//       value: '10 minutes',
//       label: 'Avg. response time',
//       color: 'from-cyan-400 to-cyan-600',
//       bgColor: 'bg-cyan-100',
//       iconColor: 'text-cyan-600',
//     },
//     {
//       icon: Clock,
//       value: '24/7',
//       label: 'Chat Availability',
//       color: 'from-purple-400 to-purple-600',
//       bgColor: 'bg-purple-100',
//       iconColor: 'text-purple-600',
//     },
//   ]

//   // Placeholder avatars - you can replace with actual user images
//   const avatars = [
//     { initials: 'JD', color: 'bg-gradient-to-br from-amber-400 to-amber-600' },
//     { initials: 'SM', color: 'bg-gradient-to-br from-orange-400 to-orange-600' },
//     { initials: 'AC', color: 'bg-gradient-to-br from-green-400 to-green-600' },
//   ]

//   return (
//     <section ref={sectionRef} className="py-16 md:py-24 bg-white relative overflow-hidden">
//       <div className="absolute inset-0 bg-gradient-to-br from-amber-50/20 via-transparent to-purple-50/20"></div>

//       <div className="container mx-auto px-6 relative z-10">
//         {/* Avatar Section */}
//         <div className={`flex justify-center mb-12 transition-all duration-1000 ${
//           isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
//         }`}>
//           <div className="flex -space-x-4">
//             {avatars.map((avatar, index) => (
//               <div
//                 key={index}
//                 className={`w-16 h-16 rounded-full border-4 border-white shadow-lg ${avatar.color} flex items-center justify-center text-white font-bold text-sm transform transition-all duration-500 hover:scale-110 hover:z-10 cursor-pointer`}
//                 style={{
//                   transitionDelay: `${index * 100}ms`,
//                 }}
//               >
//                 {avatar.initials}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Title and Description */}
//         <div className="text-center max-w-4xl mx-auto mb-16">
//           <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 delay-200 ${
//             isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
//           }`}>
//             Dedicated Customer Support: We're Here to Help
//           </h2>
//           <p className={`text-lg text-gray-600 max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
//             isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
//           }`}>
//             Our support team is always ready to assist you. Simply drop us a message, and we'll promptly respond to ensure a seamless experience.
//           </p>
//         </div>

//         {/* Metrics Grid */}
//         <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
//           {supportMetrics.map((metric, index) => {
//             const Icon = metric.icon

//             return (
//               <div
//                 key={index}
//                 className={`group text-center transform transition-all duration-700 ${
//                   isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
//                 }`}
//                 style={{
//                   transitionDelay: `${400 + index * 100}ms`,
//                 }}
//               >
//                 {/* Icon Container */}
//                 <div className="relative inline-block mb-8">
//                   <div className={`absolute inset-0 ${metric.bgColor} rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 animate-pulse`}></div>

//                   <div className={`relative ${metric.bgColor} rounded-full p-8 group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-2xl`}>
//                     <Icon className={`w-10 h-10 md:w-14 md:h-14 ${metric.iconColor} group-hover:scale-110 transition-transform duration-300`} strokeWidth={1.5} />
//                   </div>

//                   {/* Floating accent */}
//                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-bounce"></div>
//                 </div>

//                 {/* Metric Value and Label */}
//                 <div className="space-y-3">
//                   <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-br ${metric.color} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300 inline-block`}>
//                     {metric.value}
//                   </div>
//                   <p className="text-base md:text-lg text-gray-700 font-medium">
//                     {metric.label}
//                   </p>
//                 </div>

//                 {/* Animated underline */}
//                 <div className="mt-8 h-1 w-16 mx-auto bg-gradient-to-r from-transparent via-gray-300 to-transparent group-hover:via-amber-500 transition-all duration-500 rounded-full"></div>
//               </div>
//             )
//           })}
//         </div>
//       </div>

//       {/* Animated background elements */}
//       <div className="absolute top-20 right-10 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
//       <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
//     </section>
//   )
// }
