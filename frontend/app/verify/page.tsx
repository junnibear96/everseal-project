'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

// 타입 정의
type VerificationResult = {
    verified: boolean;
    productName: string;
    message: string;
    blockchainTx?: string; // 백엔드에서 넘겨주는 TX Hash
};

function VerifyContent() {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'LOADING' | 'VALID' | 'INVALID' | 'DUPLICATED'>('LOADING');
    const [data, setData] = useState<VerificationResult | null>(null);

    useEffect(() => {
        // 1. URL 파라미터 추출
        const uid = searchParams.get('uid');
        const ctr = searchParams.get('ctr');
        const cmac = searchParams.get('cmac');

        if (!uid || !ctr || !cmac) {
            setStatus('INVALID');
            return;
        }

        // 2. 백엔드 검증 요청 (NestJS API 호출)
        const verifyTag = async () => {
            try {
                // 실제 백엔드 주소로 변경 필요 (예: http://localhost:4000/verify)
                const response = await axios.get(`http://localhost:4000/verify`, {
                    params: { uid, ctr, cmac },
                });

                setData(response.data);
                setStatus('VALID');
            } catch (error: any) {
                // 백엔드에서 던진 에러 메시지에 따라 상태 분기
                if (error.response?.data?.message?.includes('Replay')) {
                    setStatus('DUPLICATED');
                } else {
                    setStatus('INVALID');
                }
            }
        };

        // "검증 중..." 느낌을 주기 위해 약간의 지연 후 실행 (UX 연출)
        const timer = setTimeout(() => verifyTag(), 1000);
        return () => clearTimeout(timer);
    }, [searchParams]);

    // --- UI 렌더링 ---
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            {/* 1. 로딩 상태: 분석 중 애니메이션 */}
            {status === 'LOADING' && (
                <div className="text-center animate-pulse">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <h2 className="text-xl font-bold text-gray-700">보안 코드 해독 중...</h2>
                    <p className="text-sm text-gray-500 mt-2">AES-CMAC 서명을 검증하고 있습니다.</p>
                </div>
            )}

            {/* 2. 정품 인증 성공 (Green) */}
            {status === 'VALID' && data && (
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full border-t-4 border-green-500 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">✅</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{data.productName}</h1>
                    <p className="text-green-600 font-semibold text-lg mb-6">정품이 인증되었습니다.</p>

                    {/* Web3 핵심 포인트: 블록체인 트랜잭션 링크 */}
                    {data.blockchainTx && (
                        <div className="bg-gray-100 rounded-lg p-3 text-left">
                            <p className="text-xs text-gray-500 uppercase font-bold mb-1">Blockchain Verification</p>
                            <p className="text-xs text-gray-600 truncate mb-2">Tx: {data.blockchainTx}</p>
                            <a
                                href={`https://livenet.xrpl.org/transactions/${data.blockchainTx}`} // XRPL 예시
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-blue-500 hover:underline flex items-center"
                            >
                                Explorer에서 원장 조회하기 →
                            </a>
                        </div>
                    )}
                </div>
            )}

            {/* 3. 복제 의심 (Yellow/Orange) - Replay Attack 탐지 */}
            {status === 'DUPLICATED' && (
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full border-t-4 border-orange-500 text-center">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">복제가 의심됩니다</h1>
                    <p className="text-gray-600 mb-4">
                        이미 사용된 인증 링크입니다.<br />
                        (Replay Attack Detected)
                    </p>
                    <div className="text-xs text-left bg-orange-50 p-3 rounded text-orange-800">
                        <strong>시스템 경고:</strong><br />
                        이 태그의 보안 카운터(Counter)가 유효하지 않습니다. 제품이 복제되었거나 URL이 재사용되었습니다.
                    </div>
                </div>
            )}

            {/* 4. 위조/인증 실패 (Red) */}
            {status === 'INVALID' && (
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full border-t-4 border-red-500 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">🚫</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">인증 실패</h1>
                    <p className="text-red-600 mb-4">유효하지 않은 태그입니다.</p>
                </div>
            )}
        </div>
    );
}

// Suspense 감싸기 (Next.js 빌드 에러 방지용)
export default function VerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyContent />
        </Suspense>
    );
}
