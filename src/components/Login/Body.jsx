import React, { useState } from 'react'

const BodyLogin = () => {
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')

  const handleEmailSubmit = (event) => {
    event.preventDefault()
    if (!email.trim()) return
    setStep('otp')
  }

  const handleOtpSubmit = (event) => {
    event.preventDefault()
    if (!otp.trim()) return
    // TODO: verify OTP
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col">
      <div className="max-w-md md:max-w-3xl lg:max-w-4xl mx-auto w-full h-full flex flex-col">
        {/* Header */}
        <header className="p-4 bg-gray-50 dark:bg-gray-900 flex-shrink-0">
          <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 uppercase">
              Study Jams '25
            </h1>
          </div>
          <h2 className="text-lg font-bold text-center mt-1 text-gray-900 dark:text-gray-100">
            Login
          </h2>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-16 scrollbar-hide">
          <main className="flex items-center justify-center px-4 py-10">
            <section className="w-full max-w-xl space-y-6 rounded-3xl border border-gray-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-sm dark:border-gray-800/60 dark:bg-gray-800/70">
              <div className="space-y-2 text-center">
                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {step === 'email' ? 'Sign in with Email' : 'Enter OTP'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {step === 'email'
                    ? 'Receive a one-time passcode to continue.'
                    : `We sent a 6-digit code to ${email}.`}
                </p>
              </div>

              {step === 'email' ? (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      className="mt-2 block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    />
                  </label>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  >
                    Send OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    One-Time Passcode
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="\d{6}"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(event) => setOtp(event.target.value)}
                      placeholder="Enter 6-digit code"
                      className="mt-2 tracking-[0.35em] text-center uppercase block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-lg font-semibold text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    />
                  </label>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                  >
                    Verify &amp; Continue
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('email')
                      setOtp('')
                    }}
                    className="w-full text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Use a different email
                  </button>
                </form>
              )}
            </section>
          </main>
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  )
}

export default BodyLogin