import useForm from "../hooks/useForm";
import { type UserSigninInformation, validateSignin } from "../utils/validate";
import { useNavigate } from "react-router-dom";
import GoogleLogo from "../assets/GoogleLogo.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps } = useForm<UserSigninInformation>({
    initialValue: { email: "", password: "" },
    validate: validateSignin,
  });

  const handleSubmit = () => {
    console.log(values);
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value.length === 0);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black text-white px-6">
      {/* 상단 헤더 */}
      <div className="relative w-full max-w-[300px] mb-8 flex items-center justify-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-0 text-3xl leading-none text-white hover:text-gray-300"
        >
          &lt;
        </button>
        <h1 className="text-2xl font-bold">로그인</h1>
      </div>

      {/* 로그인 영역 */}
      <div className="flex flex-col gap-4 w-full max-w-[300px]">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-[#8E8E93] py-3 rounded-xl text-white font-semibold bg-transparent"
        >
          <img src={GoogleLogo} alt="Google Logo" className="w-6 h-6" />
          <span>구글 로그인</span>
        </button>

        <div className="flex items-center gap-4 w-full text-[#B0B0B0]">
          <div className="flex-1 h-px bg-[#6B6B6B]" />
          <span className="text-base font-semibold">OR</span>
          <div className="flex-1 h-px bg-[#6B6B6B]" />
        </div>

        <div>
          <input
            {...getInputProps("email")}
            className={`w-full p-3 rounded-md bg-[#1A1A1A] border text-white placeholder:text-[#8f8f93] focus:outline-none
              ${
                errors?.email && touched?.email
                  ? "border-red-500"
                  : "border-[#8E8E93] focus:border-[#807bff]"
              }`}
            type="email"
            placeholder="이메일을 입력해주세요!"
          />
          {errors?.email && touched?.email && (
            <div className="mt-1 text-red-500 text-sm">{errors.email}</div>
          )}
        </div>

        <div>
          <input
            {...getInputProps("password")}
            className={`w-full p-3 rounded-md bg-[#1A1A1A] border text-white placeholder:text-[#8f8f93] focus:outline-none
              ${
                errors?.password && touched?.password
                  ? "border-red-500"
                  : "border-[#8E8E93] focus:border-[#807bff]"
              }`}
            type="password"
            placeholder="비밀번호를 입력해주세요!"
          />
          {errors?.password && touched?.password && (
            <div className="mt-1 text-red-500 text-sm">{errors.password}</div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className='w-full bg-[#073cb0] text-white py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400'
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default LoginPage;