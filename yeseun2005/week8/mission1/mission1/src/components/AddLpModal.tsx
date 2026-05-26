import { useState } from "react";
import usePostLp from "../hooks/mutations/usePostLp";

interface AddLpModalProps {
  onClose: () => void;
}

const AddLpModal = ({ onClose }: AddLpModalProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const { mutate, isPending } = usePostLp();

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();

    if (!trimmedTag) return;
    if (tags.includes(trimmedTag)) return;

    setTags((prev) => [...prev, trimmedTag]);
    setTagInput("");
  };

  const handleDeleteTag = (targetTag: string) => {
    setTags((prev) => prev.filter((tag) => tag !== targetTag));
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    mutate(
      {
        title,
        content,
        thumbnail,
        tags,
        published: true,
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-[420px] rounded-xl bg-white p-6 text-black shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Add LP</h2>
          <button type="button" onClick={onClose} className="text-xl font-bold">
            ×
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="LP 제목"
            className="rounded-md border px-3 py-2"
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="LP 내용"
            className="h-24 resize-none rounded-md border px-3 py-2"
          />

          <input
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="썸네일 이미지 URL"
            className="rounded-md border px-3 py-2"
          />

          <input type="file" className="rounded-md border px-3 py-2" />

          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="태그 입력"
              className="flex-1 rounded-md border px-3 py-2"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />

            <button
              type="button"
              onClick={handleAddTag}
              className="rounded-md bg-gray-800 px-4 py-2 text-white"
            >
              추가
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleDeleteTag(tag)}
                  className="font-bold"
                >
                  x
                </button>
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="mt-3 rounded-md bg-pink-500 px-4 py-2 font-semibold text-white disabled:bg-gray-400"
          >
            {isPending ? "추가 중..." : "Add LP"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLpModal;