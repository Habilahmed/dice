import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';

interface PhoneVerificationProps {
  onVerified: () => void;
  onClose: () => void;
}

export default function PhoneVerification({ onVerified, onClose }: PhoneVerificationProps) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [error, setError] = useState('');

  const handleSendCode = () => {
    if (!/^\+?[\d\s-]{10,}$/.test(phone)) {
      setError('Please enter a valid phone number');
      return;
    }
    setError('');
    setStep('code');
    // 
  };

  const handleVerify = () => {
    if (code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }
    // 
    onVerified();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#161B22] rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-lg hover:bg-purple-500/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <Phone className="w-6 h-6 text-purple-400" />
          <h2 className="text-xl font-bold">Phone Verification</h2>
        </div>

        {step === 'phone' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 8900"
                className="w-full bg-[#0D1117] border border-purple-500/20 rounded-lg px-4 py-2"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleSendCode}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 font-bold transition-all"
            >
              Send Code
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Verification Code</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full bg-[#0D1117] border border-purple-500/20 rounded-lg px-4 py-2"
                maxLength={6}
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleVerify}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 font-bold transition-all"
            >
              Verify Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}