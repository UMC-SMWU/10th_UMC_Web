import type { FormEvent } from "react";
import type { Language } from "../types/movie";

interface MovieFilterProps {
  title: string;
  includeAdult: boolean;
  language: Language;
  onTitleChange: (value: string) => void;
  onIncludeAdultChange: (value: boolean) => void;
  onLanguageChange: (value: Language) => void;
  onSubmit: () => void;
}

const MovieFilter = ({
  title,
  includeAdult,
  language,
  onTitleChange,
  onIncludeAdultChange,
  onLanguageChange,
  onSubmit,
}: MovieFilterProps) => {
  console.log("MovieFilter 렌더링");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
    >
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="movie-title"
            className="mb-2 block text-center font-semibold text-gray-700"
          >
            🎬 영화 제목
          </label>
          <input
            id="movie-title"
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="영화 제목을 입력하세요"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <p className="mb-2 text-center font-semibold text-gray-700">
            ⚙️ 옵션
          </p>
          <label className="flex h-[50px] items-center gap-3 rounded-lg border border-gray-300 px-4">
            <input
              type="checkbox"
              checked={includeAdult}
              onChange={(e) => onIncludeAdultChange(e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-gray-700">성인 콘텐츠 표시</span>
          </label>
        </div>
      </div>

      <div className="mt-5">
        <label
          htmlFor="language"
          className="mb-2 block text-center font-semibold text-gray-700"
        >
          🌐 언어
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => onLanguageChange(e.target.value as Language)}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="ko-KR">한국어</option>
          <option value="en-US">영어</option>
          <option value="ja-JP">일본어</option>
        </select>
      </div>

      <button
        type="submit"
        className="mt-7 w-full rounded-lg bg-blue-500 py-4 text-lg font-semibold text-white transition hover:bg-blue-600"
      >
        🔍 검색하기
      </button>
    </form>
  );
};

export default MovieFilter;
