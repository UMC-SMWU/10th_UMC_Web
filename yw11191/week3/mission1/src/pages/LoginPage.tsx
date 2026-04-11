import { useNavigate } from "react-router-dom";
import useForm from "../hooks/useForm";
import { validateLogin } from "../utils/validate";
import axiosInstance from "../apis/axiosInstance";

const LoginPage = () => {
    const navigate = useNavigate();
    
    const { values, errors, touched, getInputProps } = useForm({
        initialValues: { email: "", password: "" },
        validate: validateLogin,
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/auth/login', {
                email: values.email,
                password: values.password
            });
            alert("로그인 성공!");
            navigate('/');
        } catch (error: any) {
            alert(error.response?.data?.message || "로그인 실패");
        }
    };

    const isFormValid = !errors.email && !errors.password && values.email && values.password;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
            <div className="w-full max-w-sm">
                {/* 상단 헤더: 뒤로가기 & 타이틀 */}
                <div className="flex items-center justify-center mb-10 relative">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="absolute left-0 text-xl hover:text-gray-400"
                    >
                        &lt;
                    </button>
                    <h1 className="text-2xl font-bold">로그인</h1>
                </div>

                {/* 1. 구글 로그인 버튼 */}
                <button className="w-full flex items-center justify-center gap-3 p-3 mb-6 border border-gray-600 rounded-lg hover:bg-gray-900 transition-colors">
                    <span className="font-medium">구글 로그인</span>
                </button>

                {/* 2. OR 구분선 */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-[1px] bg-gray-600"></div>
                    <span className="text-sm text-gray-400 font-bold">OR</span>
                    <div className="flex-1 h-[1px] bg-gray-600"></div>
                </div>

                {/* 3. 이메일 로그인 폼 */}
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                        <input
                            type="email"
                            placeholder="이메일을 입력해주세요!"
                            className={`w-full p-4 rounded-lg bg-[#1a1a1a] border ${
                                touched.email && errors.email ? 'border-red-500' : 'border-gray-700 focus:border-white'
                            } outline-none`}
                            {...getInputProps("email")}
                        />
                        {touched.email && errors.email && (
                            <p className="text-red-500 text-xs ml-1">{errors.email}</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-1">
                        <input
                            type="password"
                            placeholder="비밀번호를 입력해주세요!"
                            className={`w-full p-4 rounded-lg bg-[#1a1a1a] border ${
                                touched.password && errors.password ? 'border-red-500' : 'border-gray-700 focus:border-white'
                            } outline-none`}
                            {...getInputProps("password")}
                        />
                        {touched.password && errors.password && (
                            <p className="text-red-500 text-xs ml-1">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`w-full p-4 mt-2 rounded-lg font-bold transition-all ${
                            isFormValid 
                            ? "bg-pink-600 hover:bg-pink-700" 
                            : "bg-[#2a2a2a] text-gray-500 cursor-not-allowed"
                        }`}
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;