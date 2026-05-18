import { validateSignin, type UserSigninInformation } from "../utils/validate";
import useForm from "../hooks/useForm";
import { useNavigate } from "react-router-dom";
import GoogleLogo from "../assets/GoogleLogo.png";
import { useAuth } from "../context/AuthContext";
import useLogin from "../hooks/mutations/useLogin";

const LoginPage = () => {
  const { login } = useAuth();
  const loginMutation = useLogin(login);
  const navigate = useNavigate();

  const { values, errors, touched, getInputProps } =
    useForm<UserSigninInformation>({
      initialValue: { email: "", password: "" },
      validate: validateSignin,
    });

  const handleSubmit = () => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        sessionStorage.removeItem("redirectAfterLogin");
        navigate("/", { replace: true });
      },
    });
  };

  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_SERVER_API_URL + "/v1/auth/google/login";
  };

  const isDisabled =
    Object.values(errors || {}).some((error) => error.length > 0) ||
    Object.values(values).some((value) => value.length === 0) ||
    loginMutation.isPending;

  return (
    <div className="flex h-full flex-col items-center justify-center bg-black px-6 text-white">
      <div className="relative mb-8 flex w-full max-w-[300px] items-center justify-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-0 text-3xl leading-none text-white hover:text-gray-300"
        >
          &lt;
        </button>

        <h1 className="text-2xl font-bold">로그인</h1>
      </div>

      <div className="flex w-full max-w-[300px] flex-col gap-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-[#8E8E93] bg-transparent py-3 font-semibold text-white"
        >
          <img src={GoogleLogo} alt="Google Logo" className="h-6 w-6" />
          <span>구글 로그인</span>
        </button>

        <div className="flex w-full items-center gap-4 text-[#B0B0B0]">
          <div className="h-px flex-1 bg-[#6B6B6B]" />
          <span className="text-base font-semibold">OR</span>
          <div className="h-px flex-1 bg-[#6B6B6B]" />
        </div>

        <div>
          <input
            {...getInputProps("email")}
            className={`w-full rounded-md border bg-[#1A1A1A] p-3 text-white placeholder:text-[#8f8f93] focus:outline-none ${
              errors?.email && touched?.email
                ? "border-red-500"
                : "border-[#8E8E93] focus:border-[#807bff]"
            }`}
            type="email"
            placeholder="이메일을 입력해주세요!"
          />

          {errors?.email && touched?.email && (
            <div className="mt-1 text-sm text-red-500">{errors.email}</div>
          )}
        </div>

        <div>
          <input
            {...getInputProps("password")}
            className={`w-full rounded-md border bg-[#1A1A1A] p-3 text-white placeholder:text-[#8f8f93] focus:outline-none ${
              errors?.password && touched?.password
                ? "border-red-500"
                : "border-[#8E8E93] focus:border-[#807bff]"
            }`}
            type="password"
            placeholder="비밀번호를 입력해주세요!"
          />

          {errors?.password && touched?.password && (
            <div className="mt-1 text-sm text-red-500">{errors.password}</div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isDisabled}
          className="w-full cursor-pointer rounded-md bg-[#073cb0] py-3 text-lg font-medium text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loginMutation.isPending ? "로그인 중..." : "로그인"}
        </button>

        {loginMutation.isError && (
          <p className="text-center text-sm text-red-400">
            로그인에 실패했습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
