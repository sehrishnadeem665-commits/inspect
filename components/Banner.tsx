"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Car, Truck, Bus, Ship, CheckCircle2, HelpCircle, Key, Hash, X, Loader, Bike } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import GetReportForm from './GetReportForm'
import { useTranslations } from '@/lib/translations'

export default function Banner() {
  const [vin, setVin] = useState('')
  const [vinError, setVinError] = useState('')
  const [vehicleIdType, setVehicleIdType] = useState<'vin' | 'plate' | null>(null)
  const [plateNumber, setPlateNumber] = useState('')
  const [plateError, setPlateError] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isBasicReportOpen, setIsBasicReportOpen] = useState(false)
  const [basicReportData, setBasicReportData] = useState<any>(null)
  const [isLoadingReport, setIsLoadingReport] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const { t } = useTranslations()

  // Initialize state after hydration
  useEffect(() => {
    setVehicleIdType('vin')
    setIsHydrated(true)
  }, [])

  const handleDecodeVIN = async () => {
    if (!vin.trim()) {
      setVinError(t('vin_no_vin_alert'))
      setTimeout(() => setVinError(''), 3000)
      return
    }

    // Direct to manual form as requested
    setIsFormOpen(true)
  }

  const handleGetReport = () => {
    if (vehicleIdType === 'vin') {
      if (!vin.trim()) {
        setVinError(t('vin_no_vin_alert'))
        setTimeout(() => setVinError(''), 3000)
        return
      }
    } else {
      if (!plateNumber.trim()) {
        setPlateError('Please enter a plate number to continue')
        setTimeout(() => setPlateError(''), 3000)
        return
      }
    }

    setIsFormOpen(true)
  }

  return (
    <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/banner-vedio.mp4" type="video/mp4" />
        </video>
        {/* Premium Overlay for readability and visual appeal */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-amber-900/40 to-black/50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-2 sm:space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.2] sm:leading-tight drop-shadow-lg">
                {t('banner_title')}
              </h1>
              <p className="text-xs sm:text-base md:text-lg lg:text-xl text-white/95 drop-shadow-md leading-relaxed">
                {t('banner_subtitle')}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center bg-white/10 p-1 rounded-full gap-0.5 sm:gap-1">
                    <button 
                      type="button" 
                      onClick={() => setVehicleIdType('vin')} 
                      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full transition-all text-xs sm:text-sm font-medium ${isHydrated && vehicleIdType === 'vin' ? 'bg-[#b08a5a] text-white shadow' : 'text-black hover:bg-white/10'}`}
                      suppressHydrationWarning
                    >
                      <Key className="w-3 sm:w-4 h-3 sm:h-4" />
                      <span className="hidden sm:inline">By VIN</span>
                      <span className="sm:hidden">VIN</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setVehicleIdType('plate')} 
                      className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full transition-all text-xs sm:text-sm font-medium ${isHydrated && vehicleIdType === 'plate' ? 'bg-gradient-to-r from-amber-500 to-cyan-400 text-white shadow' : 'text-black hover:bg-white/10'}`}
                      suppressHydrationWarning
                    >
                      <Hash className="w-3 sm:w-4 h-3 sm:h-4" />
                      <span className="hidden sm:inline">By Plate</span>
                      <span className="sm:hidden">Plate</span>
                    </button>
                  </div>
                </div>

                <div className="relative">
                  {/* VIN Input - Show based on vehicleIdType */}
                  <div className={isHydrated && vehicleIdType === 'vin' ? 'block' : 'hidden'}>
                    <Input
                      type="text"
                      placeholder={t('banner_input_placeholder')}
                      value={vin}
                      onChange={(e) => { setVin(e.target.value.toUpperCase()); if (vinError) setVinError('') }}
                      className="h-12 pr-10 text-base sm:text-lg w-full bg-white"
                    />
                    {vinError && (
                      <p className="text-xs text-amber-500 mt-1">{vinError}</p>
                    )}
                  </div>

                  {/* Plate Input - Show based on vehicleIdType */}
                  <div className={isHydrated && vehicleIdType === 'plate' ? 'block' : 'hidden'}>
                    <Input
                      type="text"
                      placeholder="Enter Plate Number"
                      value={plateNumber}
                      onChange={(e) => { setPlateNumber(e.target.value.toUpperCase()); if (plateError) setPlateError('') }}
                      className="h-12 pr-10 text-base sm:text-lg w-full bg-white"
                    />
                    {plateError && (
                      <p className="text-xs text-amber-500 mt-1">{plateError}</p>
                    )}
                  </div>

                  {/* Default render - both inputs in DOM for hydration match */}
                  {!isHydrated && (
                    <>
                      <Input
                        type="text"
                        placeholder={t('banner_input_placeholder')}
                        value={vin}
                        onChange={(e) => { setVin(e.target.value.toUpperCase()); if (vinError) setVinError('') }}
                        className="h-12 pr-10 text-base sm:text-lg w-full bg-white"
                      />
                    </>
                  )}

                  <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" suppressHydrationWarning>
                    <HelpCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-2 sm:mt-3 md:mt-4 flex">
                  <Button
                    onClick={isHydrated && vehicleIdType === 'vin' ? handleDecodeVIN : handleGetReport}
                    className="bg-[#b08a5a] hover:bg-[#7a5a33] text-white font-bold h-10 sm:h-12 px-4 sm:px-8 w-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                    disabled={isHydrated && vehicleIdType === 'vin' ? !vin.trim() || isLoadingReport : !plateNumber.trim()}
                    suppressHydrationWarning
                  >
                    {isLoadingReport ? (
                      <span className="flex items-center gap-2">
                        <Loader className="w-4 h-4 animate-spin" />
                        Loading...
                      </span>
                    ) : (
                      t('banner_get_report')
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/90">
                <span className="font-semibold whitespace-nowrap">{t('banner_we_check')}</span>
                <div className="flex gap-2 sm:gap-3">
                  <Car className="w-4 sm:w-5 h-4 sm:h-5 drop-shadow" />
                  <Truck className="w-4 sm:w-5 h-4 sm:h-5 drop-shadow" />
                  <Bus className="w-4 sm:w-5 h-4 sm:h-5 drop-shadow" />
                  <Ship className="w-4 sm:w-5 h-4 sm:h-5 drop-shadow" />
                  <Bike className="w-4 sm:w-5 h-4 sm:h-5 drop-shadow" />
                </div>
              </div>

              <div className="space-y-2 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                <p className="text-xs sm:text-sm font-bold text-white">{t('banner_report_title')}</p>
                <p className="text-xs sm:text-sm text-white/90">{t('banner_report_subtitle')}</p>
                <div className="grid grid-cols-2 gap-x-3 sm:gap-x-6 gap-y-1.5 sm:gap-y-2 mt-2 sm:mt-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/95">
                    <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-[#b08a5a] flex-shrink-0" />
                    <span>{t('banner_checks_damage')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/95">
                    <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-[#b08a5a] flex-shrink-0" />
                    <span>{t('banner_checks_market_value')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/95">
                    <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-[#b08a5a] flex-shrink-0" />
                    <span>{t('banner_checks_mileage')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/95">
                    <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-[#b08a5a] flex-shrink-0" />
                    <span>{t('banner_checks_more')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/95">
                    <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-[#b08a5a] flex-shrink-0" />
                    <span>{t('banner_checks_specs')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/95">
                    <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-[#b08a5a] flex-shrink-0" />
                    <span>{t('banner_checks_title_check')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/95">
                    <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-[#b08a5a] flex-shrink-0" />
                    <span>{t('banner_checks_safety_ratings')}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white/95">
                    <CheckCircle2 className="w-3 sm:w-4 h-3 sm:h-4 text-[#b08a5a] flex-shrink-0" />
                    <span>{t('banner_checks_natural_disaster')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="hidden md:flex justify-center items-center relative">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>

              <div className="relative animate-float">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#b08a5a] via-amber-500 to-cyan-500 rounded-3xl opacity-30 blur-2xl animate-spin-slow"></div>

                <div className="relative bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20 transform hover:scale-105 transition-transform duration-500">
                  <div className="relative h-96">
                    <Image
                      src="/banner-hero.png"
                      alt="Banner hero image"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/40 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                        <h3 className="font-bold text-gray-900 mb-1">Comprehensive Report</h3>
                        <p className="text-sm text-gray-600">Complete vehicle history in seconds</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#b08a5a] rounded-full flex items-center justify-center shadow-xl animate-bounce-slow z-10">
                <CheckCircle2 className="w-12 h-12 text-gray-900" strokeWidth={2.5} />
              </div>

              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center shadow-xl animate-pulse-slow z-10">
                <Car className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
            </div>
          </div> */}
        </div>
      </div>
      </div>

      {/* GetReportForm Disabled */}
      <GetReportForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        prefilledIdentType={vehicleIdType || undefined}
        prefilledIdentValue={vehicleIdType === 'vin' ? vin : plateNumber}
      />

      {/* Basic Report Modal - PDF Style */}
      {isBasicReportOpen && basicReportData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Professional Header with Logo Area */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-8 flex items-start justify-between">
              <div className="flex-1">
                <div className="text-amber-400 text-sm font-semibold tracking-widest mb-2">VEHICLE REPORT</div>
                <h2 className="text-3xl font-bold text-white mb-1">Basic Vehicle Information</h2>
                <p className="text-slate-400 text-sm">Decoded from VIN Database</p>
              </div>
              <button
                onClick={() => setIsBasicReportOpen(false)}
                className="text-slate-400 hover:text-white transition flex-shrink-0 mt-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* VIN Section */}
              <div className="border-b-2 border-slate-200 pb-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider w-24">VIN Number</span>
                  <p className="text-2xl font-mono font-bold text-slate-900">{basicReportData.vin}</p>
                </div>
              </div>

              {/* Vehicle Details Grid */}
              <div>
                <h3 className="text-sm font-bold text-slate-600 uppercase tracking-widest mb-6 pb-3 border-b border-slate-300">Vehicle Specifications</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Year */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Year</p>
                    <p className="text-2xl font-bold text-amber-600">{basicReportData.vehicle?.year || 'N/A'}</p>
                  </div>

                  {/* Make */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Make</p>
                    <p className="text-2xl font-bold text-slate-900">{basicReportData.vehicle?.make || 'N/A'}</p>
                  </div>

                  {/* Model */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Model</p>
                    <p className="text-2xl font-bold text-slate-900">{basicReportData.vehicle?.model || 'N/A'}</p>
                  </div>

                  {/* Body Type */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Body Type</p>
                    <p className="text-lg font-semibold text-slate-900">{basicReportData.vehicle?.bodyType || 'N/A'}</p>
                  </div>

                  {/* Engine */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Engine</p>
                    <p className="text-lg font-semibold text-slate-900">{basicReportData.vehicle?.engine || 'N/A'}</p>
                  </div>

                  {/* Fuel Type */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Fuel Type</p>
                    <p className="text-lg font-semibold text-slate-900">{basicReportData.vehicle?.fuelType || 'N/A'}</p>
                  </div>

                  {/* Transmission */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Transmission</p>
                    <p className="text-lg font-semibold text-slate-900">{basicReportData.vehicle?.transmission || 'N/A'}</p>
                  </div>

                  {/* Drive Type */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Drive Type</p>
                    <p className="text-lg font-semibold text-slate-900">{basicReportData.vehicle?.driveType || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Information Box */}
              <div className="bg-amber-50 border-l-4 border-amber-600 p-5 rounded-r">
                <p className="text-sm text-slate-700 leading-relaxed">
                  <span className="font-semibold text-amber-900">Information Notice:</span> This report contains basic vehicle information extracted from the National Highway Traffic Safety Administration (NHTSA) VIN decoder database. For a comprehensive vehicle history report including accident records, ownership history, title information, and more, please upgrade to the Full Report.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-4 pt-6 border-t border-slate-200">
                <button
                  onClick={() => setIsBasicReportOpen(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-3 px-6 rounded transition duration-200"
                >
                  Close Report
                </button>
                <Link
                  href="/pricing"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded transition duration-200 text-center"
                >
                  Get Full Report
                </Link>
              </div>
            </div>

            {/* Professional Footer */}
            <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 text-center text-xs text-slate-500">
              <p>True Inspectify Vehicle Report • Report Generated from NHTSA Database</p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}