'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { formatFamilyCode } from '@/lib/utils/family-auth';
import { X, Copy, Share2, MessageCircle, Link2, Check, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ShareFamilyCodeProps {
  code: string;
  familyName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareFamilyCode({
  code,
  familyName,
  isOpen,
  onClose
}: ShareFamilyCodeProps) {
  const [copied, setCopied] = useState<'link' | 'code' | null>(null);
  const [canShare, setCanShare] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'link'>('qr');

  // Generate share URL
  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/auth/child-login?code=${code}`
    : '';

  const formattedCode = formatFamilyCode(code);

  // Check if Web Share API is available
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  // Handle copy
  const handleCopy = async (type: 'link' | 'code') => {
    const textToCopy = type === 'link' ? shareUrl : code;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    }
  };

  // Handle native share
  const handleShare = async () => {
    if (!navigator.share) return;

    try {
      await navigator.share({
        title: `${familyName} - 아이 로그인`,
        text: `${familyName}의 아이 로그인 코드: ${formattedCode}\n\n아래 링크로 접속하면 코드가 자동 입력돼요!`,
        url: shareUrl
      });
    } catch (err) {
      // User cancelled or error
      console.log('Share cancelled or failed:', err);
    }
  };

  // Handle SMS share
  const handleSmsShare = () => {
    const message = encodeURIComponent(
      `${familyName} 아이 로그인\n\n가족 코드: ${formattedCode}\n\n링크: ${shareUrl}`
    );
    window.location.href = `sms:?body=${message}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-500" />
            아이에게 공유하기
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5">
          {/* Family Name */}
          <div className="text-center">
            <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium">
              {familyName}
            </span>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === 'qr'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <QrCode className="w-4 h-4" />
              QR 코드
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === 'link'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Link2 className="w-4 h-4" />
              링크 공유
            </button>
          </div>

          {/* QR Code Tab */}
          {activeTab === 'qr' && (
            <div className="space-y-4">
              {/* QR Code */}
              <div className="bg-white border-2 border-gray-100 rounded-2xl p-6 flex flex-col items-center">
                <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100">
                  <QRCodeSVG
                    value={shareUrl}
                    size={180}
                    level="M"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#4338ca"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  아이 기기의 카메라로 스캔하세요
                </p>
              </div>

              {/* Code Display */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-2">가족 코드</p>
                  <p className="text-2xl font-mono font-bold text-indigo-600 tracking-wider">
                    {formattedCode}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Link Tab */}
          {activeTab === 'link' && (
            <div className="space-y-4">
              {/* Share URL */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">공유 링크</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 truncate">
                    {shareUrl}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleCopy('link')}
                    className="rounded-xl shrink-0"
                  >
                    {copied === 'link' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  이 링크로 접속하면 가족 코드가 자동 입력됩니다
                </p>
              </div>

              {/* Code Copy */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">가족 코드만 복사</label>
                <div className="flex gap-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-mono font-bold text-indigo-600 text-center">
                    {formattedCode}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleCopy('code')}
                    className="rounded-xl shrink-0"
                  >
                    {copied === 'code' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Share Buttons */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">공유 방법</p>
            <div className="grid grid-cols-2 gap-3">
              {/* Native Share (if available) */}
              {canShare && (
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="rounded-xl py-6 flex flex-col items-center gap-2 border-2 hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <Share2 className="w-6 h-6 text-indigo-600" />
                  <span className="text-sm font-medium">공유하기</span>
                </Button>
              )}

              {/* SMS */}
              <Button
                variant="outline"
                onClick={handleSmsShare}
                className="rounded-xl py-6 flex flex-col items-center gap-2 border-2 hover:border-green-300 hover:bg-green-50"
              >
                <MessageCircle className="w-6 h-6 text-green-600" />
                <span className="text-sm font-medium">문자 보내기</span>
              </Button>

              {/* Copy Link */}
              <Button
                variant="outline"
                onClick={() => handleCopy('link')}
                className={`rounded-xl py-6 flex flex-col items-center gap-2 border-2 ${
                  copied === 'link'
                    ? 'border-green-300 bg-green-50'
                    : 'hover:border-blue-300 hover:bg-blue-50'
                }`}
              >
                {copied === 'link' ? (
                  <Check className="w-6 h-6 text-green-600" />
                ) : (
                  <Link2 className="w-6 h-6 text-blue-600" />
                )}
                <span className="text-sm font-medium">
                  {copied === 'link' ? '복사됨!' : '링크 복사'}
                </span>
              </Button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <h4 className="font-medium text-yellow-800 flex items-center gap-2 mb-2">
              <span>💡</span> 사용 방법
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• QR 코드를 아이 기기 카메라로 스캔하거나</li>
              <li>• 링크를 아이에게 공유하세요</li>
              <li>• 로그인 시 별도로 설정한 PIN이 필요해요</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 rounded-b-2xl border-t border-gray-100 px-5 py-4">
          <Button
            onClick={onClose}
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700"
          >
            닫기
          </Button>
        </div>
      </div>
    </div>
  );
}
