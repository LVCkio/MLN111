import os

content = r"""import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Sparkles, ShieldCheck, BookOpen, ScrollText,
  CheckCircle2, ChevronDown, Copy, TerminalSquare,
  Link2, GraduationCap, Search, Wand2, Info,
} from "lucide-react";

const EASE = [0.2, 0, 0, 1];

const Surface = ({ children, className = "" }) => (
  <div className={[
    "rounded-2xl border border-slate-500/25 bg-slate-800/55",
    "shadow-[0_18px_60px_rgba(15,23,42,0.32)] backdrop-blur-xl ring-1 ring-white/5",
    className,
  ].join(" ")}>{children}</div>
);

function AccordionItem({ title, children, open, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-400/25 bg-slate-800/55 ring-1 ring-white/5 backdrop-blur-xl">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left hover:bg-slate-800/70 transition"
      >
        <span className="font-semibold text-slate-50/90">{title}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: EASE }}
          className="text-slate-100/70"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <div className="px-4 pb-4 text-sm leading-7 text-slate-100/70">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PromptCard({ group, title, desc, prompt, onCopy }) {
  const groupColor =
    group.includes("1") ? "text-amber-300 border-amber-300/25 bg-amber-900/20"
    : group.includes("2") ? "text-blue-300 border-blue-300/25 bg-blue-900/20"
    : "text-green-300 border-green-300/25 bg-green-900/20";

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl border border-slate-400/25 bg-slate-800/55 p-5
                 backdrop-blur-xl ring-1 ring-white/5 transition-colors hover:bg-slate-800/70"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: EASE }}
    >
      <div className="relative z-10">
        <div className={`mb-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${groupColor}`}>
          {group}
        </div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-base font-semibold text-slate-50/90">{title}</div>
            <div className="mt-1 text-sm text-slate-100/65">{desc}</div>
          </div>
          <button
            type="button"
            onClick={() => onCopy(prompt)}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300/25 bg-slate-700/40
                       px-3 py-2 text-sm font-semibold text-slate-50/80 transition hover:bg-slate-700/60 flex-shrink-0"
          >
            <Copy size={16} /> Copy
          </button>
        </div>
        <div className="mt-4 rounded-xl border border-slate-300/20 bg-slate-900/40 p-4">
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold text-slate-50/70">
            <TerminalSquare size={16} /> Prompt
          </div>
          <pre className="max-h-[200px] overflow-auto whitespace-pre-wrap text-xs leading-6 text-slate-50/75">
            <code>{prompt}</code>
          </pre>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-24 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100
                   bg-[radial-gradient(circle_at_25%_25%,rgba(251,191,36,0.15),transparent_55%)]"
      />
    </motion.div>
  );
}

const CHECKLIST = [
  { icon: BookOpen,       label: "Chuẩn kiến thức",  text: "Kiến thức phải bám sát nội dung mục Sách — không suy diễn, không tự ý thêm ngoài giáo trình." },
  { icon: Search,         label: "Chuẩn thuật ngữ",  text: "Dùng đúng tên quy luật, phạm trù; không viết tắt 'chủ nghĩa xã hội'; ngôn ngữ nhất quán." },
  { icon: GraduationCap,  label: "Chuẩn mục tiêu",   text: "Câu hỏi Ôn tập phải kiểm tra đúng mục tiêu học tập đã nêu ở mục Giới thiệu (Tầm nhìn)." },
  { icon: ShieldCheck,    label: "Kiểm chứng",        text: "Luôn đối chiếu với Giáo trình Triết học Mác-Lênin (Bộ GD&ĐT, 2021) trước khi dùng." },
  { icon: Link2,          label: "Tính kết nối",      text: "Mỗi nội dung AI tạo phải thể hiện rõ liên kết: Tổng quan → Tầm nhìn → Sách → Ôn tập." },
];

const PROMPTS = [
  {
    group: "Nhóm 1 — Tóm tắt (từ Sách)",
    title: "Tóm tắt chương theo biện chứng duy vật",
    desc: "Chiết xuất điểm chính từng chương để hỗ trợ Ôn tập.",
    prompt: `Dựa vào nội dung Chương [SỐ CHƯƠNG] — [TÊN CHƯƠNG] trong Giáo trình Triết học Mác-Lênin, hãy:
1. Liệt kê 5 khái niệm/quy luật cốt lõi (kèm định nghĩa ngắn gọn).
2. Vẽ sơ đồ mối liên hệ giữa các khái niệm bằng văn bản.
3. Nêu 2 ví dụ thực tiễn Việt Nam minh họa.
Ngôn ngữ: Tiếng Việt. Không thêm kiến thức ngoài giáo trình.`,
  },
  {
    group: "Nhóm 2 — Mở rộng kiến thức",
    title: "Liên hệ thực tiễn Việt Nam",
    desc: "Gắn phép biện chứng duy vật vào thực tế hiện đại.",
    prompt: `Áp dụng [TÊN QUY LUẬT / PHẠM TRÙ] của phép biện chứng duy vật vào thực tiễn Việt Nam:
1. Phân tích một ví dụ cụ thể từ kinh tế hoặc xã hội hiện đại.
2. Chỉ ra mâu thuẫn biện chứng trong ví dụ đó.
3. Đề xuất hướng giải quyết theo quan điểm duy vật biện chứng.
Ngôn ngữ: Tiếng Việt. Trích dẫn nguồn từ giáo trình nếu có thể.`,
  },
  {
    group: "Nhóm 3 — Tự kiểm tra (Ôn tập)",
    title: "Tạo câu hỏi trắc nghiệm A/B/C/D",
    desc: "Bám sát kiến thức mục Sách, phù hợp phần Ôn tập.",
    prompt: `Tạo 10 câu hỏi trắc nghiệm A/B/C/D về: [CHỦ ĐỀ].
Yêu cầu:
- Mỗi câu có 4 lựa chọn A/B/C/D.
- Ghi rõ đáp án đúng (A/B/C/D).
- Giải thích 1–2 câu, trích nguồn từ giáo trình.
- Không viết tắt "chủ nghĩa xã hội".
- Ngôn ngữ: Tiếng Việt.
Đầu ra dạng JSON: [{question, options:[A,B,C,D], correct, explain}]`,
  },
  {
    group: "Nhóm 3 — Tự kiểm tra (Ôn tập)",
    title: "Rà soát lỗi sai khi làm bài Ôn tập",
    desc: "AI đối chiếu bài làm với kiến thức chuẩn từ mục Sách.",
    prompt: `Tôi vừa làm bài Ôn tập và mắc các lỗi sau:
[DÁN CÁC CÂU SAI + CÂU TRẢ LỜI CỦA TÔI]

Hãy:
1. Phân tích nguyên nhân sai theo lý thuyết biện chứng duy vật.
2. Trích dẫn chính xác khái niệm/quy luật liên quan từ giáo trình.
3. Gợi ý cách ghi nhớ để không sai lần sau.
Không thêm kiến thức ngoài Giáo trình Triết học Mác-Lênin (2021).`,
  },
];

export default function AiAppendix() {
  const [openAcc, setOpenAcc] = useState(0);
  const [toast, setToast] = useState(null);

  const onCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ ok: true, msg: "Đã copy prompt!" });
    } catch {
      setToast({ ok: false, msg: "Copy thất bại. Hãy copy thủ công." });
    } finally {
      setTimeout(() => setToast(null), 1800);
    }
  };

  const NAV_NODES = [
    { label: "Trang chủ", sub: "Tổng quan", col: "border-slate-400/30 bg-slate-700/30" },
    { label: "Giới thiệu", sub: "Tầm nhìn", col: "border-blue-400/30 bg-blue-900/20" },
    { label: "Sách",       sub: "Nội dung cốt lõi", col: "border-amber-400/40 bg-amber-900/20" },
    { label: "Ôn tập",    sub: "Thực hành", col: "border-green-400/30 bg-green-900/20" },
  ];

  return (
    <div className="relative min-h-[calc(100vh-24px)] overflow-hidden bg-slate-900 text-slate-50">
      {/* Background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(1100px_700px_at_20%_10%,rgba(251,191,36,0.10),transparent_55%),radial-gradient(900px_600px_at_80%_20%,rgba(96,165,250,0.10),transparent_55%),radial-gradient(1000px_700px_at_70%_80%,rgba(148,163,184,0.08),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,rgba(226,232,240,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(226,232,240,0.06)_1px,transparent_1px)] bg-[length:56px_56px] [mask-image:radial-gradient(circle_at_35%_15%,black,transparent)]"
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-xl border border-slate-300/25 bg-slate-800/70 px-4 py-3 text-sm font-semibold text-slate-50/85 backdrop-blur-xl shadow-lg ${toast.ok ? "outline outline-1 outline-amber-300/20" : "outline outline-1 outline-rose-300/25"}`}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <CheckCircle2 size={16} /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative mx-auto max-w-[1160px] px-4 py-7 lg:px-6">

        {/* ── HERO ── */}
        <section className="mb-10">
          <div className="inline-flex items-center gap-3 text-sm font-semibold text-slate-200/80">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300 shadow-[0_0_0_6px_rgba(251,191,36,0.14)]" />
            Phụ lục AI • Cầu nối kiến thức thông minh
          </div>

          <h1 className="mt-3 text-[36px] font-extrabold leading-[1.1] tracking-[-0.5px] lg:text-[44px]">
            AI là{" "}
            <span className="text-amber-300 [text-shadow:0_8px_30px_rgba(251,191,36,0.18)]">
              cầu nối
            </span>{" "}
            giữa
            <br className="hidden lg:block" />
            <span className="text-slate-300"> Sách — Ôn tập</span>
          </h1>

          <p className="mt-3 max-w-[68ch] text-[15px] leading-7 text-slate-100/70">
            Sử dụng AI để{" "}
            <b className="text-slate-50/90">hiểu sâu nội dung Sách</b>,{" "}
            <b className="text-slate-50/90">tạo câu hỏi Ôn tập</b> bám sát kiến thức và{" "}
            <b className="text-slate-50/90">rà soát lỗi sai</b> dựa trên dữ liệu chuẩn của dự án.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/sach"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-300/30 bg-gradient-to-b from-amber-300/20 to-amber-300/10 px-4 py-2.5 text-sm font-bold text-slate-50/90 transition hover:-translate-y-0.5"
            >
              <BookOpen size={16} /> Trang Sách
            </a>
            <a
              href="/on-tap"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300/25 bg-slate-800/55 px-4 py-2.5 text-sm font-bold text-slate-50/80 backdrop-blur-xl transition hover:-translate-y-0.5"
            >
              <GraduationCap size={16} /> Trang Ôn tập
            </a>
            <a
              href="#prompt"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300/25 bg-slate-800/55 px-4 py-2.5 text-sm font-bold text-slate-50/80 backdrop-blur-xl transition hover:-translate-y-0.5"
            >
              <Wand2 size={16} /> Prompt Library
            </a>
            <a
              href="#rules"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300/25 bg-slate-800/55 px-4 py-2.5 text-sm font-bold text-slate-50/80 backdrop-blur-xl transition hover:-translate-y-0.5"
            >
              <Info size={16} /> Hướng dẫn tích hợp
            </a>
          </div>

          {/* Bridge diagram */}
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {NAV_NODES.map((node, i) => (
              <div key={node.label} className={`rounded-xl border p-3 text-center text-sm backdrop-blur-xl ${node.col}`}>
                <div className="font-bold text-slate-50/90">{node.label}</div>
                <div className="text-xs text-slate-100/60 mt-0.5">{node.sub}</div>
                {i < 3 && (
                  <div className="mt-2 text-amber-300 text-xs font-semibold">AI ▸</div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── AI CHECKLIST ── */}
        <section className="mb-10">
          <Surface className="p-5">
            <div className="flex items-center justify-between mb-5">
              <div className="inline-flex items-center gap-2 text-base font-semibold text-slate-50/90">
                <Bot size={18} /> AI Checklist — Độ chuẩn kiến thức
              </div>
              <span className="rounded-full border border-slate-300/25 bg-slate-700/40 px-3 py-1 text-xs font-semibold text-slate-50/70">
                5 tiêu chí
              </span>
            </div>
            <div className="space-y-2.5">
              {CHECKLIST.map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-xl border border-slate-300/20 bg-slate-700/30 px-3 py-3"
                >
                  <span className="mt-0.5 text-amber-300 flex-shrink-0">
                    <CheckCircle2 size={16} />
                  </span>
                  <div>
                    <div className="text-xs font-bold text-amber-300/90 mb-0.5">{item.label}</div>
                    <div className="text-sm text-slate-50/75">{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </Surface>
        </section>

        {/* ── HƯỚNG DẪN TÍCH HỢP ── */}
        <section id="rules" className="mb-10">
          <h2 className="text-2xl font-extrabold text-slate-50/90 mb-2">
            Hướng dẫn tích hợp AI
          </h2>
          <p className="text-sm leading-7 text-slate-100/70 mb-4">
            Quy trình 4 bước kết nối AI với các mục của dự án.
          </p>
          <div className="space-y-3">
            <AccordionItem
              title="① Dùng AI để hiểu sâu nội dung mục Sách"
              open={openAcc === 0}
              onToggle={() => setOpenAcc(openAcc === 0 ? -1 : 0)}
            >
              Sau khi đọc mỗi chương trong mục <b>Sách</b>, dùng <b>Nhóm Prompt Tóm tắt</b> để AI:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Liệt kê 5 khái niệm cốt lõi kèm định nghĩa chính xác.</li>
                <li>Vẽ sơ đồ mối liên hệ giữa các quy luật, phạm trù.</li>
                <li>Minh họa bằng ví dụ thực tiễn Việt Nam.</li>
              </ul>
              <p className="mt-2 text-amber-300/80 font-medium">
                → Kết quả này là nền tảng để tạo câu hỏi Ôn tập chính xác.
              </p>
            </AccordionItem>

            <AccordionItem
              title="② Tạo câu hỏi Ôn tập bám sát kiến thức"
              open={openAcc === 1}
              onToggle={() => setOpenAcc(openAcc === 1 ? -1 : 1)}
            >
              Dùng <b>Nhóm Prompt Tự kiểm tra</b> để sinh câu hỏi trắc nghiệm A/B/C/D hoặc điền khuyết.
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Mỗi câu hỏi phải trích được nguồn cụ thể từ Sách (tên quy luật, phạm trù).</li>
                <li>Không được thêm kiến thức ngoài giáo trình chính thức.</li>
                <li>Mục tiêu học tập phải khớp với nội dung ở mục Giới thiệu.</li>
              </ul>
            </AccordionItem>

            <AccordionItem
              title="③ Rà soát lỗi sai sau khi làm Ôn tập"
              open={openAcc === 2}
              onToggle={() => setOpenAcc(openAcc === 2 ? -1 : 2)}
            >
              Sau khi hoàn thành Ôn tập, dán các câu sai vào <b>Prompt Rà soát lỗi</b>. AI sẽ:
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Phân tích nguyên nhân sai theo lý thuyết biện chứng duy vật.</li>
                <li>Trích dẫn chính xác từ giáo trình.</li>
                <li>Đề xuất cách ghi nhớ để không sai lần sau.</li>
              </ul>
              <p className="mt-2 text-amber-300/80 font-medium">
                → Luôn đối chiếu kết quả với nguồn gốc trong mục Sách.
              </p>
            </AccordionItem>

            <AccordionItem
              title="④ Lưu ý quan trọng khi dùng AI"
              open={openAcc === 3}
              onToggle={() => setOpenAcc(openAcc === 3 ? -1 : 3)}
            >
              <ul className="space-y-1 list-disc list-inside">
                <li>AI có thể sai — luôn đối chiếu với <b>Giáo trình Triết học Mác-Lênin (Bộ GD&ĐT, 2021)</b>.</li>
                <li>Không viết tắt "chủ nghĩa xã hội" trong câu hỏi và đáp án.</li>
                <li>Thuật ngữ phải nhất quán giữa Sách và Ôn tập.</li>
                <li>Không để AI tự ý mở rộng ngoài phạm vi giáo trình chính thức.</li>
              </ul>
            </AccordionItem>
          </div>
        </section>

        {/* ── PROMPT LIBRARY ── */}
        <section id="prompt" className="mb-10">
          <h2 className="text-2xl font-extrabold text-slate-50/90 mb-2">Prompt Library</h2>
          <p className="text-sm leading-7 text-slate-100/70 mb-5">
            Chia thành 3 nhóm:{" "}
            <b className="text-amber-300">Tóm tắt</b> từ Sách,{" "}
            <b className="text-blue-300">Mở rộng</b> kiến thức và{" "}
            <b className="text-green-300">Tự kiểm tra</b> cho Ôn tập.
            Thay <b className="text-slate-50/90">[CHỦ ĐỀ]</b> và nhấn Copy.
          </p>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {PROMPTS.map((p) => (
              <PromptCard key={p.title} {...p} onCopy={onCopy} />
            ))}
          </div>
        </section>

        {/* ── FOOTER NOTE ── */}
        <Surface className="p-5">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border border-amber-300/25 bg-gradient-to-b from-amber-300/20 to-amber-300/10">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-50/90">
                Sử dụng AI có trách nhiệm
              </div>
              <div className="mt-1 text-sm leading-7 text-slate-100/70">
                AI là công cụ hỗ trợ — không phải nguồn kiến thức chính thống.
                Mọi nội dung phải đối chiếu với{" "}
                <b className="text-slate-50/90">Giáo trình Triết học Mác-Lênin (NXB Chính trị Quốc gia Sự thật, 2021)</b>{" "}
                và thống nhất thuật ngữ trước khi đưa vào hệ thống Ôn tập.
              </div>
            </div>
          </div>
        </Surface>

      </div>
    </div>
  );
}
"""

with open("src/pages/AiAppendix/index.jsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done:", len(content), "chars")
