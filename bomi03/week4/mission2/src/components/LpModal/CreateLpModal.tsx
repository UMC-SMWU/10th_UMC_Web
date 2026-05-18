import { useState } from "react";
import useCreateLp from "../../hooks/mutations/useCreateLp";
import useUploadImage from "../../hooks/mutations/useUploadImages";

type CreateLpModalProps = {
  onClose: () => void;
};

const CreateLpModal = ({ onClose }: CreateLpModalProps) => {
  const createLpMutation = useCreateLp();
  const uploadImageMutation = useUploadImage();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const handleAddTag = () => {
    const nextTag = tagInput.trim();

    if (!nextTag) return;

    if (tags.includes(nextTag)) {
      setTagInput("");
      return;
    }

    setTags((prev) => [...prev, nextTag]);
    setTagInput("");
  };

  const handleRemoveTag = (tagName: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagName));
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !imageFile) return;

    try {
      const uploadedImage = await uploadImageMutation.mutateAsync(imageFile);

      createLpMutation.mutate(
        {
          title: title.trim(),
          content: content.trim(),
          thumbnail: uploadedImage.imageUrl,
          tags,
          published: true,
        },
        {
          onSuccess: () => {
            onClose();
          },
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const isPending = uploadImageMutation.isPending || createLpMutation.isPending;

  const isDisabled =
    !title.trim() || !content.trim() || !imageFile || isPending;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="relative w-[420px] rounded-2xl bg-[#242833] px-6 py-8 text-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-4 text-xl text-white hover:text-pink-400"
        >
          ×
        </button>

        <div className="mb-6 flex justify-center">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="LP 미리보기"
              className="h-40 w-40 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gray-700 text-sm text-gray-300">
              LP 사진
            </div>
          )}
        </div>

        <label className="mb-4 block">
          <span className="mb-2 block text-sm text-gray-300">LP 사진</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleChangeFile}
            className="w-full rounded-md border border-gray-500 bg-transparent px-3 py-2 text-sm text-white file:mr-3 file:rounded file:border-0 file:bg-pink-500 file:px-3 file:py-1 file:text-white"
          />
        </label>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="LP Name"
          className="mb-3 w-full rounded-md border border-gray-500 bg-transparent px-3 py-2 text-white outline-none"
        />

        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="LP Content"
          className="mb-3 w-full rounded-md border border-gray-500 bg-transparent px-3 py-2 text-white outline-none"
        />

        <div className="mb-4 flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddTag();
            }}
            placeholder="LP Tag"
            className="flex-1 rounded-md border border-gray-500 bg-transparent px-3 py-2 text-white outline-none"
          />

          <button
            type="button"
            onClick={handleAddTag}
            className="rounded-md bg-gray-400 px-4 py-2 text-white hover:bg-pink-500"
          >
            Add
          </button>
        </div>

        {tags.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="rounded-md border border-gray-500 px-3 py-1 text-sm text-gray-100 hover:border-pink-400 hover:text-pink-400"
              >
                {tag} ×
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          disabled={isDisabled}
          onClick={handleSubmit}
          className="w-full rounded-md bg-pink-500 py-3 font-semibold text-white hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-500"
        >
          {isPending ? "추가 중..." : "Add LP"}
        </button>

        {(uploadImageMutation.isError || createLpMutation.isError) && (
          <p className="mt-3 text-center text-sm text-red-400">
            LP 생성에 실패했습니다.
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateLpModal;
