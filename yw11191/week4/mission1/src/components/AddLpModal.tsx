import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../apis/axios";

interface AddLpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddLpModal = ({ isOpen, onClose }: AddLpModalProps) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. 폼 입력값 및 파일 상태 관리
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // 모달 종료 및 입력 상태값 초기화 함수
  const handleResetAndClose = () => {
    setTitle("");
    setContent("");
    setTagInput("");
    setTags([]);
    setImageFile(null);
    setImagePreview(null);
    onClose();
  };

  // 2. 이미지 선택 핸들러
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); 
    }
  };

  // 3. 태그 추가 및 삭제 로직
  const handleAddTag = (e: React.MouseEvent) => {
    e.preventDefault();
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // 4. LP 생성 useMutation 정의
  const createLpMutation = useMutation({
    mutationFn: async (variables: { title: string; content: string; tags: string[]; published: boolean; file: File | null }) => {
      let finalThumbnailUrl = "https://example.com/thumbnail.png";

      if (variables.file) {
        const formData = new FormData();
        formData.append("file", variables.file); 

        const uploadResponse = await axiosInstance.post("/v1/uploads", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("업로드 응답:", uploadResponse.data);
        if (uploadResponse.data?.data?.imageUrl) {
          finalThumbnailUrl = uploadResponse.data.data.imageUrl;
        }
      }

      const lpData = {
        title: variables.title,
        content: variables.content,
        thumbnail: finalThumbnailUrl,
        tags: variables.tags,
        published: variables.published
      };

      const response = await axiosInstance.post("/v1/lps", lpData);
      return response.data;
    },
    onSuccess: () => {
      // 대소문자 매싱 확인: HomePage의 인피니트 쿼리 키와 일치시켜 주세요.
      queryClient.invalidateQueries({ queryKey: ["infiniteLpList"] });
      handleResetAndClose();
    },
    onError: (error) => {
      console.error("LP 작성 실패:", error);
      alert("LP 생성 중 오류가 발생했습니다.");
    },
  });

  // 배경(딤드 영역) 클릭 시 닫기 핸들러
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleResetAndClose();
    }
  };

  if (!isOpen) return null;

  // 5. ✨ [정제 완료] useMutation 양식에 맞춘 JSON 바디 가공
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return alert("LP 이름을 입력해 주세요.");

    // 스웨거 샘플 객체 규격 매핑
    const requestBody = {
      title: title,
      content: content,
      thumbnail: imagePreview || "https://example.com/thumbnail.png",
      tags: tags,
      published: true
    };

    createLpMutation.mutate(requestBody);
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div className="relative w-full max-w-md bg-[#25262e] text-white rounded-2xl shadow-2xl p-6 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* 상단 닫기 X 버튼 */}
        <button
          type="button"
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 mt-4">
          
          {/* LP 이미지 업로드 영역 */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative w-40 h-40 rounded-full bg-neutral-800 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity group overflow-hidden border border-neutral-700 shadow-inner"
          >
            {imagePreview ? (
              <img src={imagePreview} alt="LP 커버 미리보기" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-4">
                <span className="text-3xl">💿</span>
                <span className="text-xs text-gray-400 mt-2 group-hover:text-gray-200">사진 추가</span>
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            accept="image/*" 
            className="hidden" 
          />

          {/* 입력 폼 영역 */}
          <div className="w-full flex flex-col gap-3 mt-2">
            <input
              type="text"
              placeholder="LP Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1b1c21] border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />

            <textarea
              placeholder="LP Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full bg-[#1b1c21] border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />

            {/* 태그 입력란 */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="LP Tag"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag(e as any))}
                className="flex-1 bg-[#1b1c21] border border-neutral-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="bg-neutral-600 hover:bg-neutral-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Add
              </button>
            </div>

            {/* 태그 칩스 배열 렌더링 */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 py-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1.5 bg-neutral-800 text-xs border border-neutral-700 text-gray-300 px-2.5 py-1 rounded-md"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-gray-500 hover:text-rose-400 transition-colors text-xs font-bold"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 최종 제출 버튼 */}
          <button
            type="submit"
            disabled={createLpMutation.isPending}
            className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-colors text-sm"
          >
            {createLpMutation.isPending ? "Adding..." : "Add LP"}
          </button>
        </form>

      </div>
    </div>
  );
};