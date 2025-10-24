"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

const BodyLogin = () => {
  const router = useRouter()
  const [step, setStep] = useState('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [resendTimer, setResendTimer] = useState(0)

  // Timer effect for OTP resend countdown
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleEmailSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim()) return

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL
    const API = `${BASE_URL}/auth/send-otp`

    const trimmedEmail = email.trim().toLowerCase()

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: trimmedEmail,
        }),
      })

      const data = await response.json()

      if (response.ok && data.status === 'success') {
        setEmail(trimmedEmail)
        setStep('otp')
        setResendTimer(60) // Set 60 seconds timer for resend
      } else {
        if (data?.type === "no-user") {
          setError("No user found with this email")
        } else {
          setError(data.message || 'Failed to send OTP')
        }
        alert(`Error: ${data.message || 'Failed to send OTP'}`)
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP')
      alert(`Error: ${err.message || 'Failed to send OTP'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    await handleEmailSubmit({ preventDefault: () => {} });
  }

  const handleOtpSubmit = async (event) => {
    event.preventDefault()
    if (!otp.trim()) return

    const BASE_URL = process.env.NEXT_PUBLIC_API_URL
    const API = `${BASE_URL}/auth/verify-otp`
    const trimmedOtp = otp.trim()

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: trimmedOtp }),
      })

      const data = await response.json()

      if (response.ok && data.status === 'success' && data.authToken) {
        localStorage.setItem('authToken', data.authToken)
        router.push('/my-profile')
        window.location.replace('/my-profile') // Fallback for navigation
      } else {
        if (data.error === "already-used") {
          setError("This OTP has already been used. Please request a new one.");
          setOtp('');
          // Optionally auto-switch back to email step after a delay
          setTimeout(() => {
            setStep('email');
          }, 3000);
        } else {
          setError(data.message || 'Failed to verify OTP')
        }
        alert(`Error: ${data.message || 'Failed to verify OTP'}`)
      }
    } catch (err) {
      setError(err.message || 'Failed to verify OTP')
      alert(`Error: ${err.message || 'Failed to verify OTP'}`)
    } finally {
      setLoading(false)
    }
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
                    : `We sent a 5-digit code to ${email}.`}
                </p>
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              )}

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
                      disabled={loading}
                      className="mt-2 block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <label className="block text-left text-sm font-medium text-gray-700 dark:text-gray-300">
                    One-Time Passcode
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="\d{5}"
                      maxLength={5}
                      required
                      value={otp}
                      onChange={(event) => setOtp(event.target.value)}
                      placeholder="Enter 5-digit code"
                      disabled={loading}
                      className="mt-2 tracking-[0.35em] text-center uppercase block w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-lg font-semibold text-gray-900 placeholder-gray-400 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/10 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                    />
                  </label>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600/40"
                    disabled={loading}
                  >
                    {loading ? 'Verifying...' : 'Verify & Continue'}
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

                  <div className="mt-4 text-center">
                    {resendTimer > 0 ? (
                      <p className="text-sm text-gray-500">
                        Resend OTP in {resendTimer} seconds
                      </p>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={loading || resendTimer > 0}
                        className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        Didn't receive code? Send again
                      </button>
                    )}
                  </div>
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