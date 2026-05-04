import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { signupSchema, type SignupInput } from '../utils/signupSchema';
import { useLocalStorage } from '../hooks/useLocalStorage';

const SignupPage = () => {
  const [step, setStep] = useState(1); // 1: 이메일, 2: 비밀번호, 3: 닉네임
  const [showPwd, setShowPwd] = useState(false);
  const [token, setToken] = useLocalStorage('accessToken', '');
  const navigate = useNavigate();

  const { register, handleSubmit, watch, trigger, getValues, formState: { errors } } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    mode: 'onChange',
  });


  

  const emailValue = watch('email');
  const passwordValue = watch('password');
  const passwordConfirmValue = watch('passwordConfirm');

  // 비밀번호나 비밀번호 재확인 값이 바뀔 때마다 'passwordConfirm'의 에러를 다시 체크
useEffect(() => {
  if (passwordConfirmValue) {
    trigger(['password','passwordConfirm']);
  }
}, [passwordValue, passwordConfirmValue, trigger]);

  // 다음 단계로 이동 전 현재 필드 유효성 검사
  const nextStep = async (fields: (keyof SignupInput)[]) => {
    const isValid = await trigger(fields);
    if (isValid) setStep((prev) => prev + 1);
  };

  const onSubmit = (data: SignupInput) => {
    console.log("회원가입 데이터:", data);
    setToken("mock-token-12345"); // 임시 토큰 저장
    alert("회원가입이 완료되었습니다!");
    navigate('/');
  };

  console.log("현재 에러 상태:", errors);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 relative">
      <div className="w-full max-w-sm p-8 bg-black rounded-3xl border border-gray-800 shadow-xl">
        {/* 상단 헤더: 뒤로가기 & 타이틀 */}
        <div className="flex items-center justify-center mb-10 relative">
          <button 
            onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} 
            className="absolute left-0 text-2xl text-gray-400 hover:text-white"
          >
            &lt;
          </button>
          <h1 className="text-2xl font-bold">회원가입</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* 단계별 정보 표시 (상단에 이메일 노출) */}
          {step > 1 && (
            <div className="flex items-center gap-2 text-gray-100 text-sm mb-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
              </svg>
              {emailValue}
            </div>
          )}

          {/* 1단계: 이메일 입력 */}
          {step === 1 && (
            <div className="flex flex-col gap-3">
              <input
                {...register('email')}
                placeholder="이메일을 입력해주세요!"
                className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-gray-700 outline-none focus:border-white placeholder:text-gray-100"
              />
              {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
              <button
                type="button"
                disabled={!!errors.email || !emailValue}
                onClick={() => nextStep(['email'])}
                className="w-full p-4 rounded-lg font-bold text-lg transition-all bg-[#1a1a1a] disabled:bg-[#1a1a1a] disabled:text-gray-400 disabled:cursor-not-allowed border border-gray-700 mt-4 active:scale-95"
              >
                다음
              </button>
            </div>
          )}

          {/* 2단계: 비밀번호 설정 */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="relative gap-1">
                <input
                  {...register('password')}
                  type={showPwd ? 'text' : 'password'}
                  placeholder="비밀번호를 입력해주세요!"
                  className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-gray-700 outline-none focus:border-white placeholder:text-gray-100 pr-12"
                />
                <button 
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-white"
                >
                  {showPwd ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.32m3.12-3.12A10.04 10.04 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  )}
                </button>
                {errors.password && <p className="text-red-500 text-xs ml-1 mt-1">{errors.password.message}</p>}
              </div>

              <input
                {...register('passwordConfirm')}
                type="password"
                placeholder="비밀번호를 다시 한 번 입력해주세요!"
                className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-gray-700 outline-none focus:border-white placeholder:text-gray-100 pr-12"
              />
              {passwordConfirmValue && passwordValue !== passwordConfirmValue && (
                <p className="text-red-500 text-xs ml-1">비밀번호가 일치하지 않습니다.</p>
              )}
              
              <button
                type="button"
                disabled={!!errors.password || !!errors.passwordConfirm || !passwordValue || !passwordConfirmValue || passwordValue!==passwordConfirmValue}
                onClick={() => nextStep(['password', 'passwordConfirm'])}
                className="w-full p-4 rounded-lg font-bold text-lg transition-all bg-[#1a1a1a] disabled:bg-[#1a1a1a] disabled:text-gray-400 disabled:cursor-not-allowed border border-gray-700 mt-2 active:scale-95"
              >
                다음
              </button>
            </div>
          )}

          {/* 3단계: 닉네임 설정 */}
          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="w-28 h-28 bg-gray-700 rounded-full flex items-center justify-center text-5xl">👤</div>
                <span className="text-sm text-gray-400 underline cursor-pointer hover:text-white">프로필 사진 추가(선택)</span>
              </div>
              
              <input
                {...register('nickname')}
                placeholder="사용하실 닉네임을 입력해주세요!"
                className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-gray-700 outline-none focus:border-white placeholder:text-gray-100"
              />
              {errors.nickname && <p className="text-red-500 text-xs ml-1">{errors.nickname.message}</p>}

              <button
                type="submit"
                className="w-full p-4 rounded-lg font-bold text-lg transition-all bg-[#FF007F] hover:bg-pink-700 mt-4 active:scale-95 shadow-lg shadow-pink-900/20"
              >
                회원가입 완료
              </button>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default SignupPage;

