"use client";

import { useState, useRef } from "react";
import { X, Loader2, Upload, Image as ImageIcon, FileText } from "lucide-react";
import { providerService } from "@/services/provider.service";
import { sileo } from "sileo";
import { cn } from "@/lib/utils";

interface PortfolioUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PortfolioUploadModal({
  isOpen,
  onClose,
  onSuccess,
}: PortfolioUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        sileo.error({
          title: "File too large",
          description: "Maximum image size is 5MB.",
        });
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      if (caption) formData.append("caption", caption);

      await providerService.uploadPortfolioImage(formData);
      sileo.success({
        title: "Success",
        description: "Portfolio image uploaded successfully.",
      });
      onSuccess();
      handleClose();
    } catch {
      sileo.error({
        title: "Upload Failed",
        description: "Could not upload image. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    setCaption("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="font-peculiar text-2xl font-black text-slate-900">
              Upload Work
            </h3>
            <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-widest">
              Share your best results
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white transition-all text-slate-400 hover:text-slate-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* Upload Area */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative aspect-video rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden",
              preview
                ? "border-slate-900"
                : "border-slate-100 hover:border-slate-300 hover:bg-slate-50",
            )}
          >
            {preview ? (
              <>
                <img
                  src={preview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <p className="px-4 py-2 bg-white rounded-xl text-xs font-black uppercase tracking-widest text-slate-900 shadow-xl">
                    Change Image
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center space-y-3 p-8">
                <div className="h-16 w-16 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200">
                  <Upload size={32} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 leading-tight">
                    Drop your image here
                  </p>
                  <p className="text-xs font-medium text-slate-400 mt-1">
                    PNG, JPG or WEBP (Max 5MB)
                  </p>
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Caption */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">
              Description / Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Classic Fade with Beard Sculpting..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold focus:bg-white focus:border-slate-900 transition-all outline-none resize-none"
              rows={3}
            />
          </div>
        </div>

        <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
          <button
            onClick={handleClose}
            className="flex-1 h-14 rounded-2xl border border-slate-100 bg-white text-sm font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all"
          >
            Cancel
          </button>
          <button
            disabled={!file || isUploading}
            onClick={handleUpload}
            className="flex-1 h-14 rounded-2xl bg-slate-900 text-sm font-black uppercase tracking-widest text-white hover:bg-rose-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              "Publish Work"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
