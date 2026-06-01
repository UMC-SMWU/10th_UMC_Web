import { use, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import useForm from "../hooks/useForm";
import { validateSignin, type UserSigninInformation } from "../utils/validate";
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const {login, accessToken} = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(accessToken){
      navigate('/'); // 로그인되어있으면 홈 페이지로 이동
    }
  }, [accessToken, navigate]);

  const {getInputProps,values,errors,touched} = useForm<UserSigninInformation>(
    {
      initialValue: {
        email: '',
        password: '',
      },
      validate: validateSignin
    }
  );
  const handleSubmit = async () => {
    try{
      await login(values);
    } catch (error) {
      alert("Login failed:");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = import.meta.env.VITE_SERVER_API_URL + '/v1/auth/google/login'; // 구글 로그인 엔드포인트로 이동
  }
  

  // 오류가 하나라도 있거나, 입력값이 비어있으면 버튼을 비활성화
  const isDisabled = Object.values(errors || {}).some((error) => error.length > 0) || // 오류가 있으면 true
  Object.values(values).some((value) => value === ''); // 입력값이 비어있으면 true

  return (
    <div className='flex flex-col items-center justify-center h-full gap-4'>
      <div className='flex flex-col gap-3'>
        <input 
        {...getInputProps('email')}
        name='email'
        className={`border border-[#ccc] rounded-md bg-gray-100 w-[300px] p-[10px] focus:border-[#807bff] 
        ${errors?.email && touched?.email ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
        type={'email'}
        placeholder={"이메일"} />
        {errors?.email && touched?.email && (
          <div className='text-red-500 text-sm'>{errors.email}</div>
        )}
        <input 
        {...getInputProps('password')}
        className={`border border-[#ccc] rounded-md bg-gray-100 w-[300px] p-[10px] focus:border-[#807bff] 
        ${errors?.password && touched?.password ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
        type={'password'}
        placeholder={"비밀번호"}  />
        {errors?.password && touched?.password && (
          <div className='text-red-500 text-sm'>{errors.password}</div>
        )}
        <button 
        type='button'
        onClick={handleSubmit} 
        disabled={isDisabled} 
        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300" 
        >
          로그인</button>
        
        <div className="flex items-center justify-center gap-[13px] text-5 text-white">
          <div className="flex-1 h-[1px] bg-[#d6d6d6]" />
            <span>OR</span>
          <div className="flex-1 h-[1px] bg-[#d6d6d6]" />
        </div>
        <button 
        type='button'
        onClick={handleGoogleLogin} 
        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300" 
        >
          <div className='flex items-center justify-center gap-4'>

            <span>구글 로그인</span>
          </div>
          </button>
      </div>
    </div>
  )
}

export default LoginPage;