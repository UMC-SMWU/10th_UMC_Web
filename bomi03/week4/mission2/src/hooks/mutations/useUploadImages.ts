import { useMutation } from "@tanstack/react-query";
import { uploadImage } from "../../apis/upload";

function useUploadImage() {
  return useMutation({
    mutationFn: uploadImage,
  });
}

export default useUploadImage;
