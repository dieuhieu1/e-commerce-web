import { memo, useRef, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

const MarkdownEditor = ({ label, value, setValue, name, error }) => {
  const editorRef = useRef(null);

  // ✅ Khi form reset (value rỗng), làm sạch nội dung editor
  useEffect(() => {
    if (editorRef.current && value === "") {
      editorRef.current.setContent("");
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-2">
      {label && <label className="font-semibold text-gray-700">{label}</label>}
      <Editor
        apiKey={import.meta.env.VITE_TINYMCE_KEY}
        onInit={(_, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={(content) => setValue(name, content)}
        init={{
          height: 400,
          menubar: false,
          plugins:
            "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount",
          toolbar:
            "undo redo | formatselect | bold italic underline forecolor | " +
            "alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; background:#fff; color:#333; padding:10px; }",
        }}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default memo(MarkdownEditor);
