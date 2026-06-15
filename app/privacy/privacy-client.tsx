'use client'

import { useEffect } from 'react'
import { useTranslations } from '@/lib/translations'

export default function PrivacyPageClient() {
  const { t } = useTranslations()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-white">
      <div className="relative container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">Privacy Policy</h1>
                    {/* <p className="text-gray-600 text-lg">Last Update: 31 March 2026</p> */}

        </div>

        <div className="mt-10 space-y-8 max-w-3xl mx-auto text-gray-700">
          <section>
            <p className="text-lg font-semibold text-gray-900 mb-4">This Privacy Policy explains how **Nexlify Labs LTD** ("we", "our", "us"), operating through **True Inspectify**, collects, uses, and protects your personal information.</p>
            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-3">
              <p className="text-gray-700"><strong>Key Points:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>We collect only necessary information to provide our vehicle history services.</li>
                <li>We do not sell your personal information to third parties.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3">1.1 Personal Information</h3>
            <p className="mt-3">We may collect personal information that you voluntarily provide to us when you:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              {/* <li>Register for an account</li> */}
              <li>Purchase a vehicle history report</li>
              <li>Contact customer support</li>
              {/* <li>Subscribe to our newsletter or marketing communications</li> */}
            </ul>
            <p className="mt-4">This information may include:</p>
            <ul className="mt-2 space-y-2 list-disc list-inside">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Billing and payment information (processed securely through Paypro Global)</li>
              <li>Vehicle identification information (VIN, license plate)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3">1.2 Automatically Collected Information</h3>
            <p className="mt-3">When you visit our website, we automatically collect certain information about your device and browsing activity:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Date and time of visits</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3">1.3 Cookies and Tracking Technologies</h3>
            <p className="mt-3">We use cookies, web beacons, and similar tracking technologies to enhance your experience. These technologies help us:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Remember your preferences</li>
              <li>Understand how you use our website</li>
              <li>Improve our services</li>
              <li>Provide relevant advertising</li>
            </ul>
            <p className="mt-4">You can control cookie settings through your browser preferences. Note that disabling cookies may affect the functionality of our website.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">2. How We Use Your Information</h2>
            <p className="mt-3">We use the information we collect for the following purposes:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong>Service Delivery:</strong> To provide vehicle history reports and related services</li>
              <li><strong>Payment Processing:</strong> To process transactions securely through our payment processor</li>
              <li><strong>Customer Support:</strong> To respond to your inquiries and provide assistance</li>
              <li><strong>Improvement:</strong> To analyze usage patterns and improve our website and services</li>
              <li><strong>Communication:</strong> To send you updates, newsletters, and marketing materials (with your consent)</li>
              <li><strong>Legal Compliance:</strong> To comply with legal obligations and protect our rights</li>
              <li><strong>Fraud Prevention:</strong> To detect and prevent fraudulent activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">3. How We Share Your Information</h2>
            <p className="mt-3">We do not sell your personal information. We may share your information with:</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3">3.1 Service Providers</h3>
            <p className="mt-3">We work with third-party service providers who assist us in operating our website and services:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Payment Processors: Paypro Global (for secure payment processing)</li>
              <li>Data Providers: Vehicle history data sources</li>
              <li>Analytics Services: Google Analytics and similar tools</li>
              <li>Email Services: For sending communications</li>
              <li>Hosting Providers: For website infrastructure</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3">3.2 Legal Requirements</h3>
            <p className="mt-3">We may disclose your information if required by law or in response to valid legal requests from government authorities.</p>

            <h3 className="text-xl font-semibold text-gray-800 mt-5 mb-3">3.3 Business Transfers</h3>
            <p className="mt-3">In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">4. Data Security</h2>
            <p className="mt-3">We implement appropriate technical and organizational security measures to protect your information:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure servers and databases</li>
              <li>Access controls and authentication</li>
              <li>Regular security audits</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="mt-4">However, no method of transmission over the internet is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">5. Data Retention</h2>
            <p className="mt-3">We retain your personal information for as long as necessary to:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce our agreements</li>
            </ul>
            <p className="mt-4">When your information is no longer needed, we will securely delete or anonymize it.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">6. Your Privacy Rights</h2>
            <p className="mt-3">Depending on your location, you may have the following rights:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong>Access:</strong> Request access to your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Objection:</strong> Object to processing of your information</li>
              <li><strong>Portability:</strong> Request transfer of your information</li>
              <li><strong>Withdrawal of Consent:</strong> Withdraw consent for marketing communications</li>
            </ul>
            <p className="mt-4">To exercise these rights, please contact us at info@trueinspectify.com.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">7. California Privacy Rights (CCPA)</h2>
            <p className="mt-3">If you are a California resident, you have additional rights under the California Consumer Privacy Act:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Know what personal information is collected, used, and shared</li>
              <li>Request deletion of personal information</li>
              <li>Opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Non-discrimination for exercising your privacy rights</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">8. European Privacy Rights (GDPR)</h2>
            <p className="mt-3">If you are in the European Economic Area (EEA), you have rights under the General Data Protection Regulation:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Rights related to automated decision-making</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">9. Children's Privacy</h2>
            <p className="mt-3">Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">10. Third-Party Links</h2>
            <p className="mt-3">Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any personal information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">11. International Data Transfers</h2>
            <p className="mt-3">Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">12. Do Not Track Signals</h2>
            <p className="mt-3">Some browsers support "Do Not Track" signals. Our website does not currently respond to Do Not Track signals, but you can control cookies through your browser settings.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">13. Changes to This Privacy Policy</h2>
            <p className="mt-3">We may update this Privacy Policy from time to time. Changes will be effective immediately upon posting to our website. We will notify you of significant changes via email or prominent notice on our website. Your continued use of our services after changes are posted constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">14. Contact Us</h2>
            <p className="mt-3">If you have questions about this Privacy Policy or our privacy practices, please contact us:</p>
            <div className="mt-4 bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-2">
              <p className="text-gray-700"><strong>Nexlify Labs LTD</strong></p>
              <p className="text-gray-700"><strong>Email:</strong> <a href="mailto:info@trueinspectify.com" className="text-amber-600 hover:underline">info@trueinspectify.com</a></p>
              <p className="text-gray-700"><strong>Website:</strong> <a href="https://trueinspectify.com" className="text-amber-600 hover:underline">https://trueinspectify.com</a></p>
            </div>
            <p className="mt-4">We will respond to your inquiry within 30 days.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">15. Consent</h2>
            <p className="mt-3">By using our website and services, you consent to the collection and use of your information as described in this Privacy Policy.</p>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
            <p className="text-sm text-gray-700">This Privacy Policy is effective as of January 1st, 2026. Nexlify Labs LTD reserves the right to modify this policy at any time. Your continued use of our services constitutes your acceptance of these terms.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
