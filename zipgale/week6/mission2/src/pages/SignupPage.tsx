import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import z, { maxLength, minLength } from "zod";
import { postSignup } from "../apis/auth";


const schema = z.object({ // 형식 맞추기 - 스키마
  email: z
    .string()
    .email({message: "올바른 이메일 형식이 아닙니다."}),
  password: z
    .string()
    .min(8, {message: '비밀번호는 8자 이상이어야 합니다.'})
    .max(20, {message: "비밀번호는 20자 이하여야 합니다."}),
  passwordCheck: z // 비밀번호 체크 
    .string()
    .min(8, {message: '비밀번호는 8자 이상이어야 합니다.'})
    .max(20, {message: "비밀번호는 20자 이하여야 합니다."}),
  name: z.string().min(1, {message: "이름을 입력해주세요"}),
})
.refine((data) => data.password === data.passwordCheck, { // 검증 - 비밀번호가 일치하지 않을 때의 조건
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordCheck']
});

type FormFields = z.infer<typeof schema> // FormFields 유추

const SignupPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting} // errors: 오류 시, isSubmitting: 데이터 요청 시 버튼의 로딩 처리에 활둉 
  } = useForm<FormFields>({ // react hook form 라이브러리의 useForm(default values) 훅
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordCheck: "",
    },
    resolver: zodResolver(schema),
    mode: "onBlur"
  });

  const onSubmit:SubmitHandler<FormFields> = async (data) => {
    const {passwordCheck, ...rest} = data; // passwordCheck는 서버에 제외하고 보내기 - 역구조분해 할당
    const response = await postSignup(rest);
    //console.log(response);
  };

  return (
    <div className='flex flex-col items-center justify-center h-full gap-4'>
      <div className='flex flex-col gap-3'>
        <input 
        {...register('email')}
        name='email'
        className={`bg-gray-100 border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] 
        ${errors?.email ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
        type={'email'}
        placeholder={"이메일"} />
        {errors.email && (
          <div className={'text-red-500 text-sm'}>{errors.email.message}</div>
        )}
      
        <input 
        {...register('password')}
        className={`bg-gray-100 border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] 
        ${errors?.password ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
        type={'password'}
        placeholder={"비밀번호"}  />
        {errors.password && (
          <div className={'text-red-500 text-sm'}>{errors.password.message}</div>
        )}

        <input 
        {...register('passwordCheck')}
        className={`bg-gray-100 border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] 
        ${errors?.passwordCheck ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
        type={'password'}
        placeholder={"비밀번호 확인"}  />
        {errors.passwordCheck && (
          <div className={'text-red-500 text-sm'}>{errors.passwordCheck.message}</div>
        )}

        <input 
        {...register('name')}
        className={`bg-gray-100 border border-[#ccc] w-[300px] p-[10px] focus:border-[#807bff] 
        ${errors?.password ? 'border-red-500 bg-red-200' : 'border-gray-300'}`}
        type={'name'}
        placeholder={"이름"}  />
        {errors.name && (
          <div className={'text-red-500 text-sm'}>{errors.name.message}</div>
        )}

        <button 
        disabled={isSubmitting} 
        type='button'
        onClick={handleSubmit(onSubmit)} 
        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-300" 
        >
          회원가입</button>
      </div>
    </div>
  )
}

export default SignupPage;