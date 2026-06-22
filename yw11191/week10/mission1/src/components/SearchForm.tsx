import React, { memo } from "react";

interface SearchFormProps {
  keyword: string;
  includeAdult: boolean;
  language: string;
  onChangeKeyword: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleAdult: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeLanguage: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SearchForm = memo(({
  keyword,
  includeAdult,
  language,
  onChangeKeyword,
  onToggleAdult,
  onChangeLanguage,
  onSubmit
}: SearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* 영화 제목 입력 */}
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-1">
            🎬 영화 제목
          </label>
          <input
            type="text"
            value={keyword}
            onChange={onChangeKeyword}
            placeholder="영화 제목을 입력하세요"
            className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* 성인 콘텐츠 표시 */}
        <div className="flex items-center justify-center md:justify-start px-2 mt-4 md:mt-0 md:pt-6">
          <label className="flex items-center gap-2 cursor-pointer border border-gray-200 p-3 rounded-lg w-full md:w-auto h-[46px]">
            <input
              type="checkbox"
              checked={includeAdult}
              onChange={onToggleAdult}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-sm text-gray-600">성인 콘텐츠 표시</span>
          </label>
        </div>
      </div>

      {/* 언어 선택 */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-500 mb-1.5 flex items-center justify-center gap-1">
          🌐 언어
        </label>
        <select
          value={language}
          onChange={onChangeLanguage}
          className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:outline-none focus:border-blue-500 cursor-pointer appearance-none text-center"
        >
          <option value="ko-KR">한국어</option>
          <option value="en-US">영어</option>
          <option value="ja-JP">일본어</option>
        </select>
      </div>

      {/* 검색 버튼 */}
      <button
        type="submit"
        className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-bold py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        🔍 검색하기
      </button>
    </form>
  );
});