"use client";

import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ClipboardEvent, FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useOtpCheckMutation, useResendOTPMutation } from '../../features/auth/authApi';
import { setToken } from '../../features/auth/authSlice';

function ProjexProLogo() {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/logo/logo.png"
        alt="ProjexPro Logo"
        width={220}
        height={60}
        className="h-14 w-auto object-contain"
        priority
      />
    </div>
  );
}

export default function VerifyOTPPage() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const flowType = searchParams.get('type') || 'resetPassword';

  const [email, setEmail] = useState<string>(initialEmail);
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [timer, setTimer] = useState<number>(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();

  const [otpCheck, { isLoading: isVerifying }] = useOtpCheckMutation();
  const [resendOTP, { isLoading: isResending }] = useResendOTPMutation();

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputRefs.current[index] = el;
  };

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);

    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(['', '', '', '', '', '']).slice(0, 6);
    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Email address is required');
      return;
    }

    const otpValue = otp.join('');

    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    try {
      const res = await otpCheck({
        email,
        oneTimeCode: otpValue,
      }).unwrap();

      if (res?.success || res?.statusCode === 200) {
        toast.success(res?.message || 'OTP verified successfully!');

        if (res?.data?.accessToken) {
          dispatch(setToken(res.data.accessToken));
          router.push('/');
        }
        else if (res?.data?.token) {
          router.push(`/auth/reset-password?token=${res.data.token}`);
        } else {
          router.push('/auth/login');
        }
      } else {
        setError(res?.message || 'Invalid verification code');
        toast.error(res?.message || 'Verification failed');
      }
    } catch (err: unknown) {
      console.error(err);
      const error = err as { data?: { message?: string }; message?: string };
      const errorMessage = error?.data?.message || error?.message || 'Verification failed. Please check the code and try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    if (!email.trim()) {
      setEmailError('Email address is required to resend OTP');
      return;
    }
    setEmailError('');
    setError('');

    try {
      const res = await resendOTP({
        email,
        authType: flowType,
      }).unwrap();

      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setTimer(59);
      toast.success(res?.message || 'An OTP has been sent to your email. Please verify your email.');
    } catch (err: unknown) {
      console.error(err);
      const error = err as { data?: { message?: string }; message?: string };
      const errorMessage = error?.data?.message || error?.message || 'Failed to resend code. Please try again.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen lg:h-screen w-full flex flex-col lg:flex-row bg-[#EBEBEB] overflow-x-hidden lg:overflow-hidden">
      <div className="w-full lg:w-[50%] xl:w-[50%] flex flex-col justify-between p-6 sm:p-12 lg:p-16 xl:p-20 min-h-screen lg:h-screen overflow-y-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="pt-2 sm:pt-0 max-w-lg w-full mx-auto">
          <ProjexProLogo />
        </div>

        <div className="max-w-lg w-full mx-auto my-auto py-2">
          <h1 className="text-2xl sm:text-3xl lg:text-[30px] font-bold text-gray-900 tracking-tight leading-snug">
            Verify your account
          </h1>
          <p className="text-sm text-gray-500 mt-2 mb-6 font-normal leading-relaxed">
            Please enter the 6-digit verification code sent to your email address.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {initialEmail ? null : (
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  placeholder="Enter your email Address here..."
                  className={`w-full px-4 py-3.5 bg-[#E2E2E5] border ${emailError ? 'border-red-500' : 'border-transparent'
                    } rounded-lg text-gray-900 placeholder:text-gray-400 text-sm focus:bg-white focus:outline-none transition-all mb-2`}
                />
                {emailError && <p className="mt-1 text-xs text-red-500 font-medium">{emailError}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                6-Digit Verification Code <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-6 gap-2.5 sm:gap-3 my-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={setInputRef(index)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-full h-12 sm:h-14 text-center text-xl font-bold border ${error ? 'border-red-500' : 'border-transparent'
                      } bg-[#E2E2E5] rounded-lg text-gray-900 focus:bg-white focus:outline-none transition-all`}
                  />
                ))}
              </div>
              {error && <p className="mt-1 text-xs text-red-500 font-medium text-center">{error}</p>}
            </div>

            <div className="flex items-center justify-between text-sm pt-1">
              <span className="text-gray-700 font-medium">Didn&apos;t receive the code?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending || timer > 0}
                className="text-[#6B1294] font-semibold hover:underline cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isResending
                  ? 'Resending...'
                  : timer > 0
                    ? `Resend Code (${timer}s)`
                    : 'Resend Code'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full mt-4 bg-[#6B1294] hover:bg-[#580e7d] text-white font-semibold py-3.5 px-4 rounded-lg shadow-sm transition-all duration-200 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              {isVerifying && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>{isVerifying ? 'Verifying...' : 'Verify & Continue'}</span>
            </button>

            <div className="text-center mt-6 pt-2">
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-gray-800 hover:underline"
              >
                Return to Login
              </Link>
            </div>
          </form>
        </div>

        <div className="hidden lg:block"></div>
      </div>

      <div className="hidden lg:flex lg:w-[50%] xl:w-[50%] sticky top-0 h-screen flex-shrink-0 relative flex-col justify-start p-12 lg:p-16 xl:p-20 overflow-hidden bg-gray-900">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
          style={{ backgroundImage: `url('/images/house_hero_2.png')` }}
        />
      </div>
    </div>
  );
}
