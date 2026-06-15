'use client'

import { useEffect } from 'react'
import { useTranslations } from '@/lib/translations'

export default function RefundPolicyPageClient() {
  const { t } = useTranslations()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-white">
      <div className="container mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl font-bold text-gray-900">Refund Policy</h1>
          {/* <p className="text-gray-600 text-lg">Effective Date: 31 March 2026</p> */}
        </div>

        <div className="mt-10 space-y-8 max-w-3xl mx-auto text-gray-700">

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Introduction to the Services</h2>
            <p className="mt-3">These Terms and Conditions ("Agreement") form a legally binding contract between you ("Buyer", "you", or "your"), <strong>Merchant</strong> (as defined below), and <strong>Nexlify Labs LTD</strong> ("Supplier", "we", "our", or "us") and govern your use of the services provided via <strong>True Inspectify</strong>.</p>
            <p className="mt-3"><strong>Merchant is the Merchant of Record and authorised reseller</strong> of the Products offered by Nexlify Labs LTD. This means that payments are processed by Merchant, but the Product is <strong>licensed and provided by Nexlify Labs LTD</strong>.</p>
            <p className="mt-3">By placing an order through Merchant, you agree to both:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>These Terms & Conditions, and</li>
              <li>The Supplier Agreement provided by Nexlify Labs LTD</li>
            </ul>
          </section>

          {/* <section className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <h2 className="text-xl font-semibold text-gray-900">Important Notice for Digital Content</h2>
            <p className="mt-3 font-semibold text-gray-900">WHERE A PRODUCT IS DIGITAL CONTENT AND IS MADE AVAILABLE IMMEDIATELY, BY DOWNLOADING OR ACCESSING THE PRODUCT, YOU EXPRESSLY CONSENT TO IMMEDIATE PERFORMANCE OF THIS AGREEMENT AND ACKNOWLEDGE THAT YOU WILL LOSE YOUR RIGHT OF WITHDRAWAL ONCE ACCESS OR DOWNLOAD HAS BEGUN.</p>
          </section> */}

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Consumer Rights</h2>
            <p className="mt-3">If you are a Consumer, you benefit from mandatory consumer protection laws applicable in your country of residence. Nothing in this Agreement limits those statutory rights.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Definitions</h2>
            <ul className="mt-3 space-y-3">
              <li><strong>Consumer:</strong> A Buyer purchasing for personal, non-commercial use</li>
              <li><strong>Digital Content:</strong> Data supplied in digital form, including vehicle history reports</li>
              <li><strong>Merchant:</strong> Merchant of Record and authorised reseller of the Products offered by Nexlify Labs LTD.</li>
              <li><strong>Product:</strong> Digital vehicle history reports and related services provided by Nexlify Labs LTD</li>
              <li><strong>Supplier:</strong> Nexlify Labs LTD</li>
              <li><strong>Services:</strong> Online services enabling the purchase and delivery of Products via Merchant</li>
              <li><strong>Transaction:</strong> Purchase of a Product through the Services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Contract Formation</h2>
            <p className="mt-3">A contract is formed when:</p>
            <ol className="mt-3 space-y-2 list-decimal list-inside">
              <li>You select a Product on True Inspectify</li>
              <li>You agree to the Supplier's terms</li>
              <li>Merchant issues an invoice or processes payment</li>
              <li>Payment is successfully completed and the Product is delivered</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Nature of the Product</h2>
            <p className="mt-3">All Products provided by <strong>Nexlify Labs LTD</strong> are <strong>digital vehicle information reports</strong> generated using third-party data sources. Reports are provided <strong>as-is</strong> and reflect information available at the time of generation.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Payments, Taxes & Pricing</h2>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Payments are processed securely by Merchant</li>
              <li>Applicable taxes (VAT, GST, sales tax) are calculated and collected by Merchant</li>
              <li>Prices may change at any time without notice</li>
              <li>You agree to receive invoices and receipts electronically</li>
            </ul>
            <p className="mt-3">Nexlify Labs LTD is not responsible for delivery failure caused by incorrect customer information.</p>
          </section>

          <section>
            {/* <h2 className="text-2xl font-semibold text-gray-900">Refund Policy</h2> */}
            {/* <div className="mt-4 ml-4">
              <h3 className="text-xl font-semibold text-gray-900">Digital Product Refunds</h3>
              <p className="mt-2">Due to the nature of digital vehicle reports:</p>
              <ul className="mt-2 space-y-2 list-disc list-inside">
                <li><strong>No refunds are available once a report has been generated or accessed</strong></li>
                <li>Refunds may be considered only if:
                  <ul className="mt-2 ml-4 space-y-1 list-disc list-inside">
                    <li>The report was not delivered due to a technical error</li>
                    <li>Duplicate payment occurred</li>
                    <li>The Product was not as described</li>
                  </ul>
                </li>
              </ul>
              <p className="mt-3">All refund requests are handled <strong>at Merchant's discretion</strong>.</p>
            </div> */}

            {/* <div className="mt-6 ml-4">
              <h3 className="text-xl font-semibold text-gray-900">Fraud & Abuse</h3>
              <p className="mt-2">Refunds will be refused in cases of:</p>
              <ul className="mt-2 space-y-2 list-disc list-inside">
                <li>Fraudulent activity</li>
                <li>Abuse of refund requests</li>
                <li>Manipulative or malicious behavior</li>
              </ul>
            </div> */}

            <div className="mt-6 ml-4">
              <h3 className="text-xl font-semibold text-gray-900">Refund Policy</h3>
              <p className="mt-2 font-semibold text-gray-900">All plans are charged as a one-time payment. No monthly or recurring fees.</p>
              <p className="mt-2">We offer a 14-day money-back guarantee on all purchases. If you are not satisfied for any reason within 14 days of purchase, simply contact support with your order details and we will issue a full refund. Refunds are processed through Merchant and returned via the original payment method.</p> <br />
              ✔ No conditions <br />
              ✔ No exceptions <br />
              ✔ No discretionary language <br />
              ✔ Fully Merchant-compliant
            </div>

            <div className="mt-6 ml-4">
              <h3 className="text-xl font-semibold text-gray-900">How to Request a Refund</h3>
              <p className="mt-2">Provide the VIN or license plate number
                Include your order number or transaction ID. Providing additional context is optional but can help us process your request faster.</p>
              {/* <ul className="mt-2 space-y-2 list-disc list-inside">
                <li>Email: <a href="mailto:info@trueinspectify.com" className="text-amber-600 hover:underline">info@trueinspectify.com</a></li>
                <li>Include your order number or transaction ID</li>
                <li>Provide the VIN or license plate number used</li>
                <li>Explain the reason for your refund request</li>
                <li>Include relevant screenshots or documentation</li>
              </ul> */}
            </div>

            {/* <div className="mt-6 ml-4">
              <h3 className="text-xl font-semibold text-gray-900">Refund Window</h3>
              <p className="mt-2">We offer a 14-day refund policy from the date of purchase in accordance with Merchant’s refund requirements.</p>
              <ul className="mt-2 space-y-2 list-disc list-inside">
                <li>Refunds will be processed within 3-5 business days</li>
                <li>The refund will be issued to the original payment method</li>
                <li>Bank processing may add an additional 5-10 business days</li>
                <li>You will receive a confirmation email once processed</li>
              </ul>
            </div> */}

            {/* <div className="mt-6 ml-4">
              <h3 className="text-xl font-semibold text-gray-900">Chargebacks</h3>
              <p className="mt-2">If you initiate a chargeback without contacting us first, we reserve the right to permanently ban your account and dispute the chargeback. Please contact us directly to resolve issues.</p>
            </div> */}
            {/* 
            <div className="mt-6 ml-4">
              <h3 className="text-xl font-semibold text-gray-900">Partial Refunds</h3>
              <p className="mt-2">In certain situations, Nexlify Labs LTD may offer partial refunds at its discretion when:</p>
              <ul className="mt-2 space-y-2 list-disc list-inside">
                <li>The report contains some data but is incomplete</li>
                <li>There was a minor technical issue causing inconvenience</li>
                <li>Other circumstances deemed appropriate by our support team</li>
              </ul>
            </div> */}
          </section>

          {/* <section>
            <h2 className="text-2xl font-semibold text-gray-900">Consumer Right to Cancel</h2>
            <p className="mt-3">If you are a Consumer, you may cancel your order within <strong>14 days</strong> <strong>only if the Digital Content has NOT been accessed or delivered</strong>.</p>
            <p className="mt-3">Once the report is generated or accessed, the right to cancel is forfeited.</p>
          </section> */}

          {/* <section>
            <h2 className="text-2xl font-semibold text-gray-900">Subscriptions (If Applicable)</h2>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Subscriptions automatically renew until cancelled</li>
              <li>Cancellation must be requested <strong>at least 48 hours before renewal</strong></li>
              <li>No refunds for unused subscription periods</li>
            </ul>
          </section> */}

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Limitation of Liability</h2>
            <p className="mt-3">Nexlify Labs LTD and Merchant shall not be liable for:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Indirect or consequential damages</li>
              <li>Inaccurate third-party vehicle data</li>
              <li>Decisions made based on report information</li>
            </ul>
            <p className="mt-3">Vehicle reports are provided for <strong>informational purposes only</strong>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Intellectual Property</h2>
            <p className="mt-3">All content, reports, branding, and systems on True Inspectify are the intellectual property of <strong>Nexlify Labs LTD</strong> and may not be copied, resold, or redistributed.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Confidentiality & Privacy</h2>
            <p className="mt-3">All user data is processed securely in accordance with:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li>Merchant's Privacy Policy</li>
              <li>Applicable data protection laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Governing Law</h2>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong>US Consumers:</strong> Laws of the State of New York</li>
              <li><strong>All Other Consumers:</strong> Laws of England & Wales</li>
            </ul>
            <p className="mt-3">The United Nations Convention on Contracts for the International Sale of Goods does not apply.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900">Contact Information</h2>
            <div className="mt-4 bg-amber-50 p-4 rounded-lg border border-amber-200 space-y-2">
              <p className="text-gray-700"><strong>Supplier:</strong> Nexlify Labs LTD</p>
              <p className="text-gray-700"><strong>Website:</strong> <a href="https://trueinspectify.com" className="text-amber-600 hover:underline">https://trueinspectify.com</a></p>
              <p className="text-gray-700"><strong>Support:</strong> <a href="mailto:info@trueinspectify.com" className="text-amber-600 hover:underline">info@trueinspectify.com</a></p>
              <p className="text-gray-700">We aim to respond within 24-48 hours during business days</p>
            </div>
          </section>

          <section className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
            <p className="text-sm text-gray-700"><em>Last updated: January 2026. Nexlify Labs LTD values customer satisfaction and is committed to resolving issues promptly and fairly.</em></p>
          </section>

        </div>
      </div>
    </div>
  )
}
