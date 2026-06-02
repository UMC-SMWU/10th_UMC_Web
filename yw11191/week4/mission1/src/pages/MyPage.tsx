import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, LogOut, User, FileText, Image as ImageIcon, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { axiosInstance } from "../apis/axios";

const MyPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 1. 프로필 수정 모달 및 파일 상태 관리
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 2. 리액트 쿼리로 내 정보 조회
  const { data: profileData, isPending, isError } = useQuery({
    queryKey: ["myInfo"],
    queryFn: async () => {
      const response = await axiosInstance.get("/v1/users/me");
      return response.data;
    },
  });

  // 3. 이미지 선택 핸들러 (파일을 읽어서 브라우저에 임시 프리뷰 생성)
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Blob URL 프리뷰
    }
  };

  // 4. 프로필 수정 useMutation
  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: { name: string; bio: string; avatar: string | null }) => {
      const response = await axiosInstance.patch("/v1/users", updatedData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myInfo"] });
      handleCloseModal();
    },
    onError: (error) => {
      console.error("프로필 수정 실패:", error);
      alert("수정 중 오류가 발생했습니다.");
    },
  });

  // 5. 모달 열기 및 상태 초기화
  const handleOpenEditModal = () => {
    if (!profileData?.data) return;
    const user = profileData.data;
    setEditName(user.name);
    setEditBio(user.bio || "");
    setImagePreview(user.avatar || null);
    setImageFile(null); // 새 파일 선택 상태 초기화
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setImageFile(null);
    setImagePreview(null);
  };

  // 6. 제출 핸들러
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return alert("이름은 필수 항목입니다.");

    // 스웨거 포맷(JSON) 구조 설계
    const requestBody = {
      name: editName,
      bio: editBio,
      // 새 파일이 없으면 기존 프리뷰 주소(기존 avatar URL)를 그대로 유지하거나 null 처리
      avatar: imagePreview 
    };

    // 만약 사용자가 컴퓨터에서 새 이미지 파일을 골랐다면?
    if (imageFile) {
      // 💡 파일을 텍스트 문자열(Base64)로 인코딩하는 자바스크립트 마법
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = () => {
        const base64String = reader.result as string;
        requestBody.avatar = base64String; // avatar 자리에 주소 문자열 주입!
        
        // 인코딩이 완료된 시점에 JSON 덩어리를 서버로 출발시킵니다.
        updateProfileMutation.mutate(requestBody);
      };
    } else {
      // 이미지를 바꾸지 않았다면 텍스트 정보만 담아서 바로 JSON 출발
      updateProfileMutation.mutate(requestBody);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (isPending) return <div className="p-20 text-white text-center">사용자 정보를 불러오는 중입니다...</div>;
  if (isError) return <div className="p-20 text-white text-center">정보를 불러오는 데 실패했습니다.</div>;

  const user = profileData.data;

  return (
    <div className="max-w-2xl mx-auto mt-16 px-4 text-white">
      {/* 마이페이지 프로필 카드 레이아웃 */}
      <div className="bg-[#1b1c21] border border-neutral-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-6 right-6 flex gap-3">
          <button 
            onClick={handleOpenEditModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            <Settings size={16} />
            정보 수정
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-rose-950/40 text-gray-400 hover:text-rose-400 border border-neutral-800 rounded-xl text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            로그아웃
          </button>
        </div>

        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mt-6">
          <div className="w-24 h-24 bg-neutral-800 rounded-full flex-shrink-0 overflow-hidden border-2 border-indigo-500 shadow-lg flex items-center justify-center">
            {user.avatar ? (
              <img src={user.avatar} alt="프로필 이미지" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-indigo-400">{user.name?.charAt(0)}</span>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight">{user.name}님 환영합니다!</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
            
            <div className="pt-2">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">소개글 (Bio)</span>
              <p className="text-sm text-gray-300 bg-neutral-900/50 rounded-xl p-3 border border-neutral-800/60 min-h-[50px] leading-relaxed">
                {user.bio || "아직 작성된 소개글이 없습니다. 프로필을 수정해 보세요!"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 🛠️ 프로필 수정 모달 팝업 */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121318] border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Settings size={20} className="text-indigo-400" />
                내 정보 수정
              </h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-5">
              
              {/* 파일 인풋 */}
              <div className="flex flex-col items-center gap-2 mb-2">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity relative group"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="프리뷰" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl text-gray-500">📸</span>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[10px] font-medium text-white">변경</span>
                  </div>
                </div>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <span className="text-[11px] text-gray-500">프로필 사진 클릭 시 이미지 변경 가능</span>
              </div>

              {/* 이름 필드 */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                  <User size={12} /> 이름 <span className="text-rose-500">*</span>
                </label>
                <input 
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#1b1c21] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="이름을 입력해주세요"
                />
              </div>

              {/* Bio 필드 (선택) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 flex items-center gap-1">
                  <FileText size={12} /> 한 줄 소개 (Bio) <span className="text-gray-600">(선택)</span>
                </label>
                <textarea 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-[#1b1c21] border border-neutral-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  placeholder="자기소개를 적어주세요 (비워두기 가능)"
                  rows={3}
                />
              </div>

              {/* 하단 버튼 그룹 */}
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 bg-neutral-800 hover:bg-neutral-700 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-gray-500 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  {updateProfileMutation.isPending ? "저장 중..." : "변경사항 저장"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;