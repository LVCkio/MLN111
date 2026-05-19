// src/pages/StudyTips.jsx
import React from "react";
import { Brain } from "lucide-react";
import CoachMarkArrow from "@components/CoachMarkArrow"; // ⬅️ đường dẫn tùy cấu trúc dự án

export default function StudyTips({ darkMode = false, cardClasses = "" }) {
  return (
    <div className={`mt-12 p-6 ${cardClasses} rounded-xl shadow-lg`}>
      {/* Study Tips */}
      <h3 id="study-tips-anchor" className="text-lg font-bold mb-4 text-amber-600 flex items-center gap-2">
        <Brain className="w-5 h-5" />
        Mẹo học tập hiệu quả
      </h3>

      {/* Coachmark sẽ trỏ vào tiêu đề trên */}
      <CoachMarkArrow
        anchorId="study-tips-anchor"
        darkMode={darkMode}
        text="Đây là phần mẹo học ghi nhớ. Đọc nhanh 2–3 mẹo rồi quay lại luyện tập nhé!"
      />

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        {/* Flashcard */}
        <div className={`p-3 rounded-lg ${darkMode ? "bg-slate-800" : "bg-amber-50"}`}>
          <div className="font-medium text-amber-600 mb-1">🎯 Flashcard</div>
          <p className={darkMode ? "text-slate-300" : "text-slate-700"}>
            Đọc kỹ thuật ngữ trước khi lật. Cố gắng nhớ định nghĩa trước khi xem đáp án.
          </p>
        </div>

        {/* Trắc nghiệm */}
        <div className={`p-3 rounded-lg ${darkMode ? "bg-slate-800" : "bg-green-50"}`}>
          <div className="font-medium text-green-600 mb-1">🧠 Trắc nghiệm</div>
          <p className={darkMode ? "text-slate-300" : "text-slate-700"}>
            Loại bỏ đáp án sai trước. Đọc kỹ từng lựa chọn để tìm đáp án chính xác nhất.
          </p>
        </div>

        {/* Điền đáp án */}
        <div className={`p-3 rounded-lg ${darkMode ? "bg-slate-800" : "bg-blue-50"}`}>
          <div className="font-medium text-blue-600 mb-1">✍️ Điền đáp án</div>
          <p className={darkMode ? "text-slate-300" : "text-slate-700"}>
            Viết bằng từ ngữ của bạn. Không cần thuộc lòng, quan trọng là hiểu ý nghĩa.
          </p>
        </div>
      </div>
    </div>
  );
}
