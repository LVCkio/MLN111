// ─── Ảnh nền mới từ public/images/ ───────────────────────────────────────────
// Dùng import.meta.env.BASE_URL để tự động xử lý base path (/MLN111/ trên GH Pages)
const BASE = import.meta.env.BASE_URL;
const bgImg = (name) => `${BASE}images/${name}`;

// ─────────────────────────────────────────────────────────────────
//  CÂU CHUYỆN: "Nam và Lựa chọn trước Bình minh Số"
//  Phân tích bằng Phép Biện chứng Duy vật
// ─────────────────────────────────────────────────────────────────

const sections = [
  // ── SLIDE 0 · Trang bìa ──────────────────────────────────────
  {
    title: "Nam và Lựa chọn trước Bình minh Số",
    subtitle: "Phân tích bằng Phép Biện chứng Duy vật",
    description:
      "Trong thời đại cách mạng công nghiệp 4.0, không ít sinh viên đứng trước ngưỡng cửa bước vào cuộc sống đều cảm thấy hoang mang, mất phương hướng. Nam — một sinh viên năm cuối ngành truyền thông, giỏi giang và nhiệt huyết — cũng không nằm ngoài vòng xoáy ấy.",
    quote:
      "Thay vì tiếp tục chìm đắm trong nỗi lo âu, hãy dùng triết học như công cụ để nhìn thấy rõ ràng hướng đi phía trước.",
    author: "Mở Đầu: Câu chuyện của Nam",
    backgroundImage: bgImg("bg-slide1.png"),
    hint: "Nhấn Space / PageDown để bắt đầu Phần 1.",
  },

  // ── SLIDE 1 · Mở đầu ─────────────────────────────────────────
  {
    title: "Mở Đầu: Câu chuyện của Nam",
    subtitle: "Một sinh viên trước ngưỡng cửa Bình minh Số",
    description:
      "Hàng ngày, Nam chứng kiến bạn bè dùng AI để viết tiểu luận, thiết kế hình ảnh chuyên nghiệp chỉ trong vài giây. Những tiêu đề như \"AI thay thế hàng triệu việc làm\" hay \"Châu Á mất 100 triệu việc làm trong 10 năm tới\" liên tục xuất hiện khiến anh mất ngủ. Anh tự hỏi: \"Liệu bốn năm đại học của mình có trở nên vô nghĩa khi máy móc có thể làm mọi thứ nhanh hơn và rẻ hơn?\"\n\nTrong một buổi trò chuyện với giáo sư hướng dẫn, Nam được giới thiệu một công cụ tư duy mạnh mẽ: phép biện chứng duy vật — và mọi thứ bắt đầu thay đổi.",
    quote:
      "Giáo sư giúp anh phân tích tình huống của mình thông qua ba cặp phạm trù triết học nền tảng, qua đó nhìn thấy rõ ràng hướng đi phía trước.",
    author: "Bối cảnh câu chuyện",
    backgroundImage: bgImg("bg-slide2.png"),
    hint: "Kéo xuống để vào Phần 1: Nguyên Nhân và Kết Quả.",
  },

  // ── SLIDE 2 · Phần 1a · Nguyên nhân ─────────────────────────
  {
    title: "Phần 1: Nguyên Nhân và Kết Quả",
    subtitle: "Tính khách quan · Tính phổ biến · Tính đa nguyên",
    description:
      "Nguyên nhân là những hiện tượng, sự kiện sinh ra sự biến đổi ở một hiện tượng khác; kết quả là sự biến đổi đó. Đây không phải mối quan hệ một chiều mà là quá trình tương tác đa chiều, phức tạp và liên tục vận động.\n\nNhiều người lầm tưởng AI là nguyên nhân duy nhất khiến thị trường lao động biến động. Nhưng nhìn sâu hơn ta thấy: nguyên nhân công nghệ (sức mạnh tính toán, thuật toán học sâu), nguyên nhân kinh tế (tối ưu chi phí), nguyên nhân xã hội (hệ thống giáo dục chưa cập nhật) và nguyên nhân tâm lý (thiếu định hướng) — tất cả đan xen nhau.",
    quote:
      "Mọi hiện tượng trong tự nhiên và xã hội đều có nguyên nhân — không có kết quả nào là ngẫu nhiên hoàn toàn.",
    author: "Phần 1 · Khái niệm & Phân tích nguyên nhân",
    backgroundImage: bgImg("bg-slide4.png"),
    hint: "Kéo xuống để xem biện chứng đảo ngược.",
  },

  // ── SLIDE 3 · Phần 1b · Kết quả & biện chứng đảo ngược ──────
  {
    title: "Kết Quả & Biện Chứng Đảo Ngược",
    subtitle: "Kết quả tác động trở lại Nguyên nhân",
    description:
      "Những nguyên nhân trên tạo ra nhiều kết quả đan xen: một số loại việc làm biến mất, việc làm mới được tạo ra, đòi hỏi kỹ năng mới; nạn lạm dụng AI trong học thuật nhưng cũng xuất hiện hình thức học sâu hơn; nhiều người lo âu mất ngủ như Nam, nhưng cũng có những người chủ động thích nghi.\n\nĐiểm sâu sắc của phép biện chứng: kết quả có thể truyền ngược lại thành nguyên nhân. Khi AI tạo ra sản phẩm chất lượng (kết quả), điều này lại tạo ra nhu cầu cao hơn về lao động biết quản lý AI (nguyên nhân mới). Sự lo âu của Nam nếu không được giải quyết sẽ trở thành nguyên nhân khiến anh bỏ mặc tương lai.",
    quote:
      "Thay vì sợ hãi kết quả (mất việc), hãy chủ động tác động vào nguyên nhân (năng lực bản thân) — đầu tư vào đầu vào mới để tạo ra kết quả khác.",
    author: "Bài học của Nam — Phần 1",
    backgroundImage: bgImg("bg-slide5.png"),
    hint: "Kéo xuống để vào Phần 2: Bản Chất và Hiện Tượng.",
  },

  // ── SLIDE 4 · Phần 2a · Hiện tượng & bản chất ───────────────
  {
    title: "Phần 2: Bản Chất và Hiện Tượng",
    subtitle: "Đi từ hiện tượng → bản chất → bản chất sâu hơn",
    description:
      "Hiện tượng là biểu hiện bên ngoài; bản chất là cái bên trong, bền vững, quyết định sự tồn tại của sự vật. Hiện tượng biểu hiện bản chất — nhưng chỉ một phần — và có thể xuyên tạc bản chất.\n\nMỗi ngày Nam đối mặt với bốn hiện tượng gây lo lắng: ① Bạn bè trong lớp dùng AI viết tiểu luận, thiết kế hình ảnh chuyên nghiệp chỉ trong vài giây. ② Tiêu đề báo chí \"AI thay thế hàng triệu việc làm\" liên tục xuất hiện. ③ Tiêu đề \"Châu Á mất 100 triệu việc làm trong 10 năm tới\" khiến anh mất ngủ. ④ Công ty lớn trong ngành truyền thông sa thải hàng loạt nhân viên biên tập.\n\nBản chất thực của cuộc cách mạng AI: ① Sự chuyển đổi phương thức sản xuất (nông nghiệp → công nghiệp → tri thức số). ② AI chỉ thay thế tư duy lặp lại — tư duy sáng tạo, cảm xúc, kết nối con người là đặc quyền của con người. ③ Thị trường cần người biết dùng AI — người biết dùng AI đang cạnh tranh với người không biết.",
    quote:
      "Thành công không đến với người nhìn hiện tượng, mà đến với người hiểu bản chất.",
    author: "Phần 2 · Khái niệm & Bản chất AI",
    backgroundImage: bgImg("bg-slide6.png"),
    hint: "Kéo xuống để xem ví dụ cụ thể.",
  },

  // ── SLIDE 5 · Phần 2b · Ví dụ xuyên tạc bản chất ────────────
  {
    title: "Khi Hiện Tượng Xuyên Tạc Bản Chất",
    subtitle: "Hai trường hợp điển hình Nam đã gặp",
    description:
      "Trường hợp 1 — Hiện tượng: \"Bạn A dùng ChatGPT viết tiểu luận và được điểm cao.\" Nam nghĩ: \"Kỹ năng viết không còn quan trọng.\" Bản chất thật: Bạn A chỉ qua được một bài; khi bảo vệ luận điểm trước hội đồng, khả năng bộc lộ ngay. Tư duy phân tích không thể bị sao chép.\n\nTrường hợp 2 — Hiện tượng: \"Công ty X cho thôi việc 200 nhân viên biên tập.\" Nam nghĩ: \"Ngành truyền thông sắp chết.\" Bản chất thật: Công ty đang tái cơ cấu — cắt biên tập thủ công nhưng đang tuyển gấp nhân lực định hướng AI, xây chiến lược nội dung và quản trị thương hiệu.",
    quote:
      "Nếu chỉ nhìn vào hiện tượng bên ngoài, anh sẽ thấy bế tắc. Nhưng nếu đi sâu vào bản chất, anh sẽ thấy cả một bản đồ cơ hội.",
    author: "Bài học của Nam — Phần 2",
    backgroundImage: bgImg("bg-slide7.png"),
    hint: "Kéo xuống để vào Phần 3: Khả Năng và Hiện Thực.",
  },

  // ── SLIDE 6 · Phần 3a · Khả năng & hiện thực ────────────────
  {
    title: "Phần 3: Khả Năng và Hiện Thực",
    subtitle: "Khả năng không tự động biến thành hiện thực",
    description:
      "Hiện thực là cái đang tồn tại. Khả năng là cái chưa trở thành hiện thực nhưng đã có mầm mống ngay trong lòng hiện thực đó.\n\nHiện thực của Nam hôm nay: nền tảng kiến thức truyền thông 4 năm là lợi thế thực sự; đang chứng kiến AI bùng nổ sớm — cơ hội tiếp cận trước người khác; \"khoảng trắng\" kinh nghiệm là dịp định hình lại bản thân theo hướng mới; có sự hỗ trợ từ nhà trường và giáo sư.\n\nKhả năng tiêu cực cần nhận ra để tránh: bị tê liệt bởi lo âu → \"analysis paralysis\", không hành động; lạm dụng AI thụ động → tốt nghiệp thiếu năng lực thật; chọn sai hướng do chỉ nhìn hiện tượng → đầu tư nhầm vào kỹ năng sớm lỗi thời.\n\nKhả năng tiến bộ cần nắm bắt: ① Chuyên gia truyền thông tích hợp AI. ② Nhà quản lý con người trong môi trường AI hóa — định hướng đạo đức, quản trị đội nhóm. ③ Nhà tư vấn & đào tạo kỹ năng AI. ④ Nhà sáng tạo nội dung có góc nhìn độc đáo — giọng nói cảm xúc thật ngày càng được trân trọng.",
    quote:
      "Khả năng không tự nhiên thành hiện thực — nó cần điều kiện tương ứng và hoạt động thực tiễn chủ động của con người.",
    author: "Phần 3 · Khái niệm & Khả năng tiến bộ",
    backgroundImage: bgImg("bg-slide8.png"),
    hint: "Kéo xuống để xem điều kiện hiện thực hóa.",
  },

  // ── SLIDE 7 · Phần 3b & Kết luận ─────────────────────────────
  {
    title: "Điều Kiện Hiện Thực Hóa & Kết Luận",
    subtitle: "Ba điều kiện · Ba bài học · Kế hoạch hành động",
    description:
      "Ba điều kiện để khả năng trở thành hiện thực: ① Khách quan — thị trường đang cần nhân sự AI trong truyền thông, marketing, quản trị. ② Chủ quan — Nam phải chủ động thực hành prompt engineering, chiến lược nội dung, phân tích dữ liệu. ③ Thực tiễn — cần kế hoạch và hành động cụ thể, không chờ cơ hội.\n\nBa bài học triết học nằm lòng: Tư duy toàn diện — nhìn AI như hệ thống phức tạp cần điều hướng. Tư duy phát triển — đặt mình vào dòng vận động, đón đầu thay vì bị đánh đòn. Kế thừa biện chứng — giữ lại giá trị nền tảng, loại bỏ kỹ năng lỗi thời.\n\nKế hoạch hành động cụ thể: ① Tích lũy \"Lượng\" để tạo \"Chất\" — học và thực hành đều đặn mỗi ngày cho đến điểm nút bước nhảy về chất. ② Giải quyết \"Mâu thuẫn\" nội tại — nhận diện khoảng cách giữa trình độ hiện tại và yêu cầu xã hội số, dùng nỗ lực học tập để thu hẹp nó. ③ Tập trung vào \"Khả năng thực\" — đầu tư vào tư duy sáng tạo có cảm xúc, đạo đức nghề nghiệp và kỹ năng lãnh đạo con người như tài sản lâu dài.",
    quote:
      "Cuộc cách mạng AI là hiện thực khách quan cả thế hệ đang đối mặt. Bản đồ của tương lai nằm trong những lựa chọn hôm nay — anh biết mình sẽ làm gì với nỗi lo lắng đó.",
    author: "Kết Luận — Câu chuyện của Nam",
    backgroundImage: bgImg("bg-slide9.png"),
    hint: "Kết thúc — quay lại Trang bìa hoặc tiếp tục khám phá.",
  },
];

export default sections;
