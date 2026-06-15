'use client'

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Import Swiper core and required modules
import SwiperCore from "swiper";

// Import modules from 'swiper/modules' (v9+)
import { Navigation, Autoplay } from "swiper/modules";
import Image from 'next/image'
import { useState, useEffect } from 'react'
import GetReportForm from './GetReportForm'
import { useTranslations } from '@/lib/translations'
SwiperCore.use([Navigation, Autoplay]);
export default function WhyCarBronze() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { t } = useTranslations()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('why_title')}
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-xl text-muted-foreground leading-relaxed">
            {t('why_subtitle')}
          </p>
        </div>

        <div className="relative h-80 sm:h-96 md:h-[500px] rounded-3xl overflow-hidden mb-16 shadow-2xl">
          <Image
            src="/cars.webp"
            alt={t('why_title')}
            fill
            className="object-cover"
            priority
            loading="eager"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 100vw, (max-width: 1024px) 100vw, 100vw"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent md:from-black/60 md:via-black/40"></div>

          <div
            className={`absolute inset-0 flex items-center justify-start transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div className="px-4 sm:px-6 md:px-8 lg:px-12 max-w-xs sm:max-w-sm md:max-w-lg space-y-3 sm:space-y-4 md:space-y-6">
              <div
                className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
              >
                <div className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-1 sm:mb-2">
                  Starting from
                </div>
                <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-amber-400 animate-pulse">
                  £35
                </div>
              </div>

              <div
                className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
              >
                <p className="text-xs sm:text-base md:text-xl lg:text-2xl font-semibold text-white mb-2 sm:mb-3 md:mb-4">
                  for a vehicle history report
                </p>
                <p className="text-2xs sm:text-xs md:text-base lg:text-lg text-white/90 leading-relaxed">
                  Verify the VIN number and gain valuable insights before buying a used car. Get started today for peace of mind.
                </p>
              </div>

              <div
                className={`transform transition-all duration-1000 delay-500 space-y-3 sm:space-y-4 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0'
                  }`}
              >
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-cyan-500 to-amber-600 text-white font-bold text-xs sm:text-sm md:text-base rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 active:scale-95 animate-bounce"
                  suppressHydrationWarning
                >
                  Check VIN Now
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Statistics Section - Professional & Premium with Animations */}
        <div className="hidden md:grid md:grid-cols-1 gap-6">
          <div className="mt-20 pt-12 border-t border-gray-200 animate-fade-in">
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Comprehensive VIN Analysis</h3>
              <p className="text-gray-600 text-lg">Industry-leading data aggregation and verification</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* VIN Check Card */}
              <div className="group animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div className="bg-background border border-border rounded-2xl p-8 hover:border-primary hover:shadow-xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col md-flex-row">
                  <div className="inline-flex w-12 h-12 bg-primary/20 rounded-xl items-center justify-center text-primary font-bold text-xl mb-6 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300">
                    ✓
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Verification Method</p>
                  <p className="text-xl md:text-2xl font-black text-foreground leading-tight">By VIN & Plate</p>
                  <p className="text-xs text-muted-foreground mt-4">Multiple lookup options</p>
                </div>
              </div>

              {/* Daily VIN Searches Card */}
              <div className="group animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <div className="bg-background border border-border rounded-2xl p-8 hover:border-accent hover:shadow-xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
                  <div className="inline-flex w-12 h-12 bg-accent/20 rounded-xl items-center justify-center text-accent font-bold text-xl mb-6 group-hover:bg-accent group-hover:text-accent-foreground group-hover:scale-110 transition-all duration-300">
                    →
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Daily Searches</p>
                  <p className="text-3xl md:text-4xl font-black text-foreground group-hover:text-accent transition-colors duration-300">45K+</p>
                  <p className="text-xs text-muted-foreground mt-4">Active verifications</p>
                </div>
              </div>

              {/* VIN Checked On Card */}
              <div className="group animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <div className="bg-background border border-border rounded-2xl p-8 hover:border-secondary hover:shadow-xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
                  <div className="inline-flex w-12 h-12 bg-secondary/20 rounded-xl items-center justify-center text-secondary font-bold text-xl mb-6 group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:scale-110 transition-all duration-300">
                    ⊕
                  </div>
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Data Sources</p>
                  <p className="text-3xl md:text-4xl font-black text-foreground group-hover:text-secondary transition-colors duration-300">70+</p>
                  <p className="text-xs text-muted-foreground mt-4">Databases & sources</p>
                </div>
              </div>

              {/* Vehicle History Card */}
              <div className="group animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-amber-500 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col">
                  <div className="inline-flex w-12 h-12 bg-primary/20 rounded-xl items-center justify-center text-primary font-bold text-xl mb-6 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300">
                    ◆
                  </div>
                  <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Report Scope</p>
                  <p className="text-xl md:text-2xl font-black text-gray-900 leading-tight">Complete History</p>
                  <p className="text-xs text-gray-500 mt-4">Ownership & service records</p>
                </div>
              </div>
            </div>
          </div>

        </div>


        {/* Mobile Slider */}
        <div className="block md:hidden mt-20 pt-12 border-t border-gray-200">
          <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Comprehensive VIN Analysis</h3>
            <p className="text-gray-600 text-base sm:text-lg">Industry-leading data aggregation and verification</p>
          </div>
          <Swiper
            spaceBetween={16}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            loop={true}
            className="mobile-vin-swiper"
          >
            {/* VIN Check Card */}
            <SwiperSlide>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 min-h-64 flex flex-col justify-between transform transition-all duration-300">
                <div>
                  <div className="inline-flex w-14 h-14 bg-primary/20 rounded-xl items-center justify-center text-primary font-bold text-2xl mb-6 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300">
                    ✓
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Verification Method</p>
                  <p className="text-lg sm:text-xl font-black text-gray-900 leading-tight">By VIN & Plate</p>
                </div>
                <p className="text-xs text-gray-500">Multiple lookup options</p>
              </div>
            </SwiperSlide>

            {/* Daily VIN Searches Card */}
            <SwiperSlide>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 min-h-64 flex flex-col justify-between transform transition-all duration-300">
                <div>
                  <div className="inline-flex w-14 h-14 bg-accent/20 rounded-xl items-center justify-center text-accent font-bold text-2xl mb-6 group-hover:bg-accent group-hover:text-accent-foreground group-hover:scale-110 transition-all duration-300">
                    →
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Daily Searches</p>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900">45K+</p>
                </div>
                <p className="text-xs text-gray-500">Active verifications</p>
              </div>
            </SwiperSlide>

            {/* VIN Checked On Card */}
            <SwiperSlide>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 min-h-64 flex flex-col justify-between transform transition-all duration-300">
                <div>
                  <div className="inline-flex w-14 h-14 bg-secondary/20 rounded-xl items-center justify-center text-secondary font-bold text-2xl mb-6 group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:scale-110 transition-all duration-300">
                    ⊕
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Data Sources</p>
                  <p className="text-2xl sm:text-3xl font-black text-gray-900">70+</p>
                </div>
                <p className="text-xs text-gray-500">Databases & sources</p>
              </div>
            </SwiperSlide>

            {/* Vehicle History Card */}
            <SwiperSlide>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 min-h-64 flex flex-col justify-between transform transition-all duration-300">
                <div>
                  <div className="inline-flex w-14 h-14 bg-primary/20 rounded-xl items-center justify-center text-primary font-bold text-2xl mb-6 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300">
                    ◆
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Report Scope</p>
                  <p className="text-lg sm:text-xl font-black text-gray-900 leading-tight">Complete History</p>
                </div>
                <p className="text-xs text-gray-500">Ownership & service records</p>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
        {/* Trust & Credibility Section - Eye Catching */}
        <div className="mt-16 relative overflow-hidden rounded-3xl">
          {/* Gradient Background with Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-cyan-500 to-amber-600 animate-pulse"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>

          <div className="relative px-8 md:px-16 py-12 md:py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: User Avatars with Enhanced Stats */}
              <div className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-4">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User" className="w-14 h-14 rounded-full border-4 border-white shadow-xl" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" alt="User" className="w-14 h-14 rounded-full border-4 border-white shadow-xl" />
                    <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop" alt="User" className="w-14 h-14 rounded-full border-4 border-white shadow-xl" />
                    <div className="w-14 h-14 rounded-full border-4 border-white bg-white/20 flex items-center justify-center shadow-xl backdrop-blur-sm">
                      <span className="text-white font-bold text-sm">+99k</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white drop-shadow-lg">
                    1,000,000+
                  </h3>
                  <p className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-md">
                    Trusted Users Globally
                  </p>
                  <p className="text-sm sm:text-lg text-white/90 drop-shadow-md leading-relaxed">
                    Across 150+ nations
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <p className="text-2xl font-bold text-white">4.8★</p>
                    <p className="text-xs text-white/80">Average Rating</p>
                  </div>
                  <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <p className="text-2xl font-bold text-white">99.9%</p>
                    <p className="text-xs text-white/80">Uptime</p>
                  </div>
                </div>
              </div>

              {/* Right: Partner Logos with Enhanced Layout */}
              <div className="space-y-8">
                <div className="text-center md:text-left">
                  <p className="text-xs sm:text-sm font-bold text-white/80 mb-4 sm:mb-6 uppercase tracking-wider">Trusted by millions worldwide By Industry Leaders</p>
                  <div className="grid grid-cols-2 gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="flex items-center justify-center md:justify-start">
                      <Image
                        src="/forbes-logo.svg"
                        alt="Forbes"
                        width={100}
                        height={50}
                        className="h-10 w-auto object-contain drop-shadow-lg"
                      />
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <Image
                        src="/copart-logo.svg"
                        alt="Carfax"
                        width={100}
                        height={50}
                        className="h-10 w-auto object-contain drop-shadow-lg"
                      />
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <Image
                        src="/nmvtis-logo@1x.png"
                        alt="NHTSA"
                        width={100}
                        height={50}
                        className="h-10 w-auto object-contain drop-shadow-lg"
                      />
                    </div>
                    <div className="flex items-center justify-center md:justify-start">
                      <Image
                        src="/nicb-logo.svg"
                        alt="NICB"
                        width={100}
                        height={50}
                        className="h-10 w-auto object-contain drop-shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>



        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }

          .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0;
          }
        `}</style>

        <style>{`
          :global(.mobile-vin-swiper .swiper-button-next),
          :global(.mobile-vin-swiper .swiper-button-prev) {
            width: 48px;
            height: 48px;
            background: linear-gradient(135deg, #2A729A 0%, #5BC2E7 100%);
            border-radius: 14px;
            box-shadow: 0 4px 15px rgba(42, 114, 154, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid rgba(255, 255, 255, 0.3);
          }

          :global(.mobile-vin-swiper .swiper-button-next:hover),
          :global(.mobile-vin-swiper .swiper-button-prev:hover) {
            background: linear-gradient(135deg, #1D4363 0%, #2A729A 100%);
            box-shadow: 0 8px 25px rgba(42, 114, 154, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
            transform: translateY(-50%) scale(1.15);
            border-color: rgba(255, 255, 255, 0.5);
          }

          :global(.mobile-vin-swiper .swiper-button-next:active),
          :global(.mobile-vin-swiper .swiper-button-prev:active) {
            transform: translateY(-50%) scale(0.92);
          }

          :global(.mobile-vin-swiper .swiper-button-next::after),
          :global(.mobile-vin-swiper .swiper-button-prev::after) {
            font-size: 28px;
            font-weight: 900;
            color: white;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            letter-spacing: 0.5px;
          }

          :global(.mobile-vin-swiper .swiper-button-next) {
            right: 16px;
          }

          :global(.mobile-vin-swiper .swiper-button-prev) {
            left: 16px;
          }

          :global(.mobile-vin-swiper .swiper-pagination-bullet) {
            width: 10px;
            height: 10px;
            background-color: rgba(209, 213, 219, 0.6);
            opacity: 1;
            margin: 0 6px;
            transition: all 0.3s ease;
            cursor: pointer;
          }

          :global(.mobile-vin-swiper .swiper-pagination-bullet:hover) {
            background-color: rgba(209, 213, 219, 0.8);
          }

          :global(.mobile-vin-swiper .swiper-pagination-bullet-active) {
            background: linear-gradient(135deg, #2A729A 0%, #5BC2E7 100%);
            width: 28px;
            border-radius: 5px;
            box-shadow: 0 2px 8px rgba(42, 114, 154, 0.4);
          }
        `}</style>
      </div>

      <GetReportForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </section>
  )
}
