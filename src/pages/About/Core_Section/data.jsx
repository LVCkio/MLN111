import React from "react";
import {
  Layers,
  GitBranch,
  RefreshCw,
  FlipHorizontal,
} from "lucide-react";

export const corePhilosophies = [
  {
    icon: <Layers className="w-12 h-12" />,
    title: "Hai Nguyên Lý Cơ Bản",
    subtitle: "Nền tảng xuất phát điểm",
    description:
      "Nguyên lý về mối liên hệ phổ biến (khách quan, đa dạng) và nguyên lý về sự phát triển (đường xoáy ốc, có kế thừa) là hai trụ cột phương pháp luận của phép biện chứng duy vật.",
    principles: [
      "Liên hệ: khách quan, phổ biến, đa dạng",
      "Phát triển: từ thấp đến cao, có kế thừa",
      "Nguyên tắc: Toàn diện & Phát triển",
    ],
  },
  {
    icon: <GitBranch className="w-12 h-12" />,
    title: "Sáu Cặp Phạm Trù",
    subtitle: "Phản ánh quan hệ phổ biến",
    description:
      "Cái riêng–Cái chung, Nguyên nhân–Kết quả, Tất nhiên–Ngẫu nhiên, Nội dung–Hình thức, Bản chất–Hiện tượng, Khả năng–Hiện thực — phản ánh những mối quan hệ phổ biến nhất của thế giới sự vật.",
    principles: [
      "Cái chung tồn tại trong và qua cái riêng",
      "Bản chất quyết định, hiện tượng phản ánh",
      "Khả năng thành hiện thực khi đủ điều kiện",
    ],
  },
  {
    icon: <RefreshCw className="w-12 h-12" />,
    title: "Quy Luật Lượng – Chất",
    subtitle: "Cách thức của sự phát triển",
    description:
      "Những thay đổi dần dần về lượng đến điểm nút sẽ gây ra bước nhảy vọt về chất. Chất mới lại tạo ra lượng mới. Phải tích lũy đủ lượng và kịp thời thực hiện bước nhảy khi điều kiện chín muồi.",
    principles: [
      "Độ – giới hạn duy trì chất của sự vật",
      "Điểm nút – thời điểm xảy ra bước nhảy",
      "Chống nôn nóng lẫn bảo thủ, trì trệ",
    ],
  },
  {
    icon: <FlipHorizontal className="w-12 h-12" />,
    title: "Quy Luật Mâu Thuẫn & Phủ Định",
    subtitle: "Nguồn gốc và xu hướng phát triển",
    description:
      "Mâu thuẫn (thống nhất và đấu tranh của các mặt đối lập) là nguồn gốc tự vận động. Phủ định biện chứng vừa bác bỏ vừa kế thừa, phát triển theo đường xoáy ốc tiến lên cao hơn.",
    principles: [
      "Mâu thuẫn: hạt nhân của phép biện chứng",
      "Phủ định: tự phủ định, kế thừa có chọn lọc",
      "Xu hướng: tiến lên quanh co theo xoáy ốc",
    ],
  },
];
