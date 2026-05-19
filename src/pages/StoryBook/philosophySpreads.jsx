import React from "react";
import AutoFitPage from "./AutoFitPage";
import Coverbook from "../../assets/picture/Coverbook.png";

const PageHeader = ({ title }) => (
  <div className="page-header">
    <h2>{title}</h2>
    <div className="chapter-ornament">❦</div>
  </div>
);

const PageNumber = ({ value }) => <div className="page-number">{value}</div>;

const Principle = ({ icon, children }) => (
  <div className="principle">
    <span className="principle-icon">{icon}</span>
    <div>{children}</div>
  </div>
);

const QuoteCard = ({ quote, author }) => (
  <div className="philosophy-quote">
    <div className="quote-symbol">❝</div>
    <p>{quote}</p>
    <div className="quote-author">— {author}</div>
  </div>
);

const WisdomList = ({ title, items }) => (
  <div className="wisdom-section">
    <h4>{title}</h4>
    {items.map((item, index) => (
      <div className="wisdom-item" key={`${title}-${index}`}>
        <span className="wisdom-number">{index + 1}</span>
        <div>{item}</div>
      </div>
    ))}
  </div>
);

export const spreads = [
  // ── COVER ──────────────────────────────────────────────────────────────────
  {
    left: null,
    right: (
      <AutoFitPage
        className="cover-front"
        style={{
          background: `
            radial-gradient(circle at 18% 20%, rgba(251,191,36,.18) 0%, transparent 36%),
            radial-gradient(circle at 78% 82%, rgba(34,197,94,.14) 0%, transparent 42%),
            url(${Coverbook}) center / cover no-repeat,
            linear-gradient(135deg, #101828 0%, #172033 50%, #0f172a 100%)
          `,
        }}
      >
        <div className="cover-design">
          <div className="cover-stars">
            <div className="star star-1" />
            <div className="star star-2" />
            <div className="star star-3" />
            <div className="star star-4" />
            <div className="star star-5" />
          </div>

          <div className="cover-ornament top" />

          <div className="cover-title">
            <div className="title-backdrop" />
            <h1 className="main-title">
              <span className="title-line-1">GIÁO TRÌNH</span>
              <span className="title-line-2">TRIẾT HỌC MÁC - LÊNIN</span>
            </h1>
            <div className="subtitle">
              Dành cho bậc đại học hệ không chuyên lý luận chính trị
            </div>
          </div>

          <div className="cover-quote">
            <div className="quote-marks">"</div>
            <div className="quote-text">
              Triết học không treo lơ lửng ở ngoài thế giới, cũng như bộ óc không tồn tại bên ngoài con người.
            </div>
            <div className="quote-author">— Karl Marx</div>
            <div className="quote-marks closing">"</div>
          </div>

          <div className="cover-ornament bottom" />
          <div className="cover-glow" />
        </div>
      </AutoFitPage>
    ),
  },

  // ── SPREAD 1: Lời giới thiệu ───────────────────────────────────────────────
  {
    left: (
      <AutoFitPage className="page-left">
        <PageHeader title="Lời giới thiệu" />
        <div className="page-body">
          <h3>Về giáo trình này</h3>
          <p className="first-letter">
            Giáo trình Triết học Mác - Lênin được Bộ Giáo dục và Đào tạo phối hợp
            cùng Nhà xuất bản Chính trị Quốc gia Sự thật biên soạn và phát hành năm
            2021, dành cho sinh viên đại học hệ không chuyên lý luận chính trị. Đây là
            một trong 5 môn lý luận chính trị bắt buộc trong chương trình đại học tại
            Việt Nam.
          </p>
          <p>
            Giáo trình gốc gồm 3 chương, 220 trang, trình bày hệ thống toàn diện về
            Chủ nghĩa duy vật biện chứng và Chủ nghĩa duy vật lịch sử — nền tảng thế
            giới quan và phương pháp luận của chủ nghĩa Mác-Lênin.
          </p>
          <QuoteCard
            quote="Các nhà triết học đã chỉ giải thích thế giới bằng nhiều cách khác nhau; vấn đề là phải cải tạo thế giới."
            author="Marx, Luận cương về Feuerbach"
          />
        </div>
        <PageNumber value="2" />
      </AutoFitPage>
    ),
    right: (
      <AutoFitPage className="page-right">
        <div className="life-principles">
          <h4>Mục tiêu học tập</h4>
          <Principle icon="🎯">
            <strong>Thế giới quan:</strong> hình thành hệ thống quan điểm toàn diện,
            khoa học về thế giới và vị trí con người.
          </Principle>
          <Principle icon="🧭">
            <strong>Phương pháp luận:</strong> nắm phép biện chứng duy vật làm
            công cụ nhận thức và cải tạo thực tiễn.
          </Principle>
          <Principle icon="📚">
            <strong>Lý luận:</strong> hiểu chủ nghĩa duy vật lịch sử, học thuyết
            hình thái kinh tế - xã hội và triết học về con người.
          </Principle>
          <Principle icon="🛡️">
            <strong>Vận dụng:</strong> phân tích thực tiễn Việt Nam trong quá trình
            xây dựng chủ nghĩa xã hội.
          </Principle>
        </div>
        <div className="reflection-box">
          <div className="reflection-title">Ba chương cốt lõi</div>
          <p>
            Chương 1: Khái luận về Triết học • Chương 2: Chủ nghĩa duy vật biện chứng
            • Chương 3: Chủ nghĩa duy vật lịch sử
          </p>
        </div>
        <PageNumber value="3" />
      </AutoFitPage>
    ),
  },

  // ── SPREAD 2: Chương 1 – Nguồn gốc và khái niệm triết học ─────────────────
  {
    left: (
      <AutoFitPage className="page-left">
        <PageHeader title="Chương 1 — Phần I" />
        <div className="page-body">
          <h3>Nguồn gốc, khái niệm và đối tượng của triết học</h3>
          <p className="first-letter">
            Triết học ra đời ở cả phương Đông và phương Tây vào khoảng thế kỷ VIII - VI TCN
            tại các trung tâm văn minh lớn (Hy Lạp, Trung Quốc, Ấn Độ). Triết học không xuất
            hiện ngẫu nhiên mà có nguồn gốc xác định.
          </p>
          <WisdomList
            title="Hai nguồn gốc"
            items={[
              <span>
                <strong>Nguồn gốc nhận thức:</strong> Tư duy trừu tượng và năng lực khái quát
                đạt trình độ đủ cao để rút ra cái chung từ muôn vàn sự kiện riêng lẻ; thay thế
                tư duy huyền thoại bằng tư duy lý luận có hệ thống.
              </span>,
              <span>
                <strong>Nguồn gốc xã hội:</strong> Xã hội có phân công lao động, xuất hiện giai
                cấp, nhà nước và tầng lớp trí thức. Triết học mang tính giai cấp sâu sắc từ khi
                ra đời.
              </span>,
            ]}
          />
          <QuoteCard
            quote="Triết học là hệ thống quan điểm lý luận chung nhất về thế giới và vị trí con người trong thế giới đó; là khoa học về những quy luật vận động, phát triển chung nhất của tự nhiên, xã hội và tư duy."
            author="Định nghĩa triết học Mác-Lênin"
          />
        </div>
        <PageNumber value="4" />
      </AutoFitPage>
    ),
    right: (
      <AutoFitPage className="page-right">
        <PageHeader title="Chương 1 — Phần I (tiếp)" />
        <div className="page-body">
          <h3>Vấn đề cơ bản của triết học</h3>
          <p className="first-letter">
            Vấn đề cơ bản của triết học là mối quan hệ giữa tư duy và tồn tại, giữa ý thức
            và vật chất. Căn cứ vào cách trả lời, triết học phân chia thành hai trường phái lớn.
          </p>
          <WisdomList
            title="Hai trường phái chính"
            items={[
              <span>
                <strong>Chủ nghĩa duy vật:</strong> Vật chất có trước, ý thức có sau; vật chất
                quyết định ý thức. Gồm 3 hình thức: duy vật chất phác cổ đại, duy vật siêu hình
                (TK XV-XVIII) và duy vật biện chứng (Marx-Engels).
              </span>,
              <span>
                <strong>Chủ nghĩa duy tâm:</strong> Ý thức có trước, vật chất có sau. Gồm: duy
                tâm chủ quan (Berkeley — thế giới là tổ hợp cảm giác) và duy tâm khách quan
                (Plato, Hegel — ý niệm tuyệt đối).
              </span>,
              <span>
                <strong>Mặt thứ hai (nhận thức luận):</strong> Thuyết bất khả tri (Hume, Kant)
                cho rằng con người không thể nhận thức được bản chất sự vật.
              </span>,
            ]}
          />
        </div>
        <PageNumber value="5" />
      </AutoFitPage>
    ),
  },

  // ── SPREAD 3: Phương pháp biện chứng & Lịch sử triết học Mác ──────────────
  {
    left: (
      <AutoFitPage className="page-left">
        <PageHeader title="Chương 1 — Phần I (tiếp)" />
        <div className="page-body">
          <h3>Phương pháp biện chứng và phương pháp siêu hình</h3>
          <WisdomList
            title="Đối lập nhau"
            items={[
              <span>
                <strong>Phương pháp siêu hình:</strong> Xem xét sự vật trong trạng thái cô lập,
                tách rời, bất biến, không có mâu thuẫn nội tại. Phù hợp giai đoạn đầu của khoa
                học tự nhiên nhưng không giải thích được sự vận động và phát triển.
              </span>,
              <span>
                <strong>Phương pháp biện chứng:</strong> Xem xét sự vật trong mối liên hệ phổ
                biến, trong sự vận động và phát triển không ngừng, thông qua giải quyết mâu
                thuẫn. Lịch sử có 3 hình thức: biện chứng tự phát cổ đại, biện chứng duy tâm
                (Hegel), biện chứng duy vật (Marx-Engels — đỉnh cao).
              </span>,
            ]}
          />
          <div className="reflection-box">
            <div className="reflection-title">Ghi nhớ</div>
            <p>
              Biện chứng duy vật Mác-Engels = kế thừa "hạt nhân hợp lý" của phép biện chứng
              Hegel + lập trường duy vật của Feuerbach.
            </p>
          </div>
        </div>
        <PageNumber value="6" />
      </AutoFitPage>
    ),
    right: (
      <AutoFitPage className="page-right">
        <PageHeader title="Chương 1 — Phần II" />
        <div className="page-body">
          <h3>Điều kiện, tiền đề ra đời triết học Mác</h3>
          <WisdomList
            title="Ba tiền đề lý luận"
            items={[
              <span>
                <strong>Triết học cổ điển Đức:</strong> Kant, Hegel, Feuerbach — Marx kế thừa
                phép biện chứng Hegel và duy vật Feuerbach.
              </span>,
              <span>
                <strong>Kinh tế chính trị học Anh:</strong> Adam Smith, Ricardo — cơ sở lý luận
                kinh tế.
              </span>,
              <span>
                <strong>CNXH không tưởng Pháp:</strong> Saint-Simon, Fourier, Owen — tiền đề
                xã hội.
              </span>,
            ]}
          />
          <WisdomList
            title="Ba phát minh khoa học tự nhiên"
            items={[
              <span>Định luật bảo toàn và chuyển hóa năng lượng (Helmholtz, 1847).</span>,
              <span>Học thuyết tế bào (Schleiden, Schwann, 1838-1839).</span>,
              <span>Học thuyết tiến hóa (Darwin, 1859).</span>,
            ]}
          />
        </div>
        <PageNumber value="7" />
      </AutoFitPage>
    ),
  },

  // ── SPREAD 4: Các giai đoạn & Chức năng triết học Mác ─────────────────────
  {
    left: (
      <AutoFitPage className="page-left">
        <PageHeader title="Chương 1 — Phần II (tiếp)" />
        <div className="page-body">
          <h3>Các giai đoạn hình thành và phát triển</h3>
          <WisdomList
            title="Ba giai đoạn lớn"
            items={[
              <span>
                <strong>1842–1848 (Hình thành):</strong> Marx và Engels chuyển từ duy tâm sang
                duy vật, từ dân chủ cách mạng sang cộng sản. Tác phẩm: Bản thảo kinh tế-triết
                học 1844, Hệ tư tưởng Đức, Tuyên ngôn Đảng Cộng sản (1848).
              </span>,
              <span>
                <strong>1848–1895 (Phát triển):</strong> Bổ sung từ thực tiễn đấu tranh giai cấp
                và thành tựu khoa học. Đỉnh cao là bộ Tư bản (tập I, 1867).
              </span>,
              <span>
                <strong>1895–1924 (Giai đoạn Lênin):</strong> Bảo vệ và phát triển trong điều
                kiện mới. Tác phẩm tiêu biểu: Chủ nghĩa duy vật và chủ nghĩa kinh nghiệm phê
                phán (1909). Lãnh đạo Cách mạng Tháng Mười 1917 thành công.
              </span>,
            ]}
          />
        </div>
        <PageNumber value="8" />
      </AutoFitPage>
    ),
    right: (
      <AutoFitPage className="page-right">
        <PageHeader title="Chương 1 — Phần II (tiếp)" />
        <div className="page-body">
          <h3>Đối tượng, chức năng và vai trò</h3>
          <WisdomList
            title="Hai chức năng cơ bản"
            items={[
              <span>
                <strong>Chức năng thế giới quan:</strong> Cung cấp hệ thống quan điểm toàn diện
                và khoa học về thế giới. Thế giới quan duy vật biện chứng là cơ sở lý luận để
                xây dựng nhân sinh quan cách mạng và khoa học.
              </span>,
              <span>
                <strong>Chức năng phương pháp luận:</strong> Phép biện chứng duy vật cung cấp
                phương pháp nhận thức và cải tạo thế giới — phương pháp luận chung nhất định
                hướng hoạt động thực tiễn cho cả khoa học tự nhiên lẫn khoa học xã hội.
              </span>,
            ]}
          />
          <QuoteCard
            quote="Triết học Mác-Lênin là cơ sở lý luận của Đảng Cộng sản; là vũ khí tư tưởng của giai cấp vô sản trong đấu tranh giải phóng."
            author="Vai trò triết học Mác-Lênin"
          />
        </div>
        <PageNumber value="9" />
      </AutoFitPage>
    ),
  },

  // ── SPREAD 5: Chương 2 – Vật chất ─────────────────────────────────────────
  {
    left: (
      <AutoFitPage className="page-left">
        <PageHeader title="Chương 2 — Phần I" />
        <div className="page-body">
          <h3>Phạm trù vật chất</h3>
          <p className="first-letter">
            Cuối TK XIX, các phát minh vật lý (tia X - Röntgen 1895, phóng xạ - Becquerel 1896,
            điện tử - Thomson 1897, thuyết tương đối - Einstein 1905) làm sụp đổ quan niệm siêu
            hình về nguyên tử, tạo ra "cuộc khủng hoảng vật lý".
          </p>
          <QuoteCard
            quote="Vật chất là một phạm trù triết học dùng để chỉ thực tại khách quan, được đem lại cho con người trong cảm giác, được cảm giác của chúng ta chép lại, chụp lại, phản ánh, và tồn tại không lệ thuộc vào cảm giác."
            author="Lênin, 1909"
          />
          <WisdomList
            title="Hai nội dung định nghĩa"
            items={[
              <span>
                Thuộc tính cơ bản của vật chất là <strong>tồn tại khách quan</strong> — tiêu chí
                phân biệt duy vật và duy tâm.
              </span>,
              <span>
                Vật chất <strong>có thể nhận thức được</strong> — chống lại thuyết bất khả tri.
              </span>,
            ]}
          />
        </div>
        <PageNumber value="10" />
      </AutoFitPage>
    ),
    right: (
      <AutoFitPage className="page-right">
        <PageHeader title="Chương 2 — Phần I (tiếp)" />
        <div className="page-body">
          <h3>Ý thức — nguồn gốc, bản chất, kết cấu</h3>
          <WisdomList
            title="Hai nguồn gốc ý thức"
            items={[
              <span>
                <strong>Nguồn gốc tự nhiên:</strong> Bộ não người là cơ quan vật chất đặc biệt —
                tiền đề sinh học của ý thức. Tính phản ánh là thuộc tính phổ biến của vật chất.
              </span>,
              <span>
                <strong>Nguồn gốc xã hội:</strong> Lao động và ngôn ngữ là hai yếu tố quyết định
                sự hình thành ý thức người. Ngôn ngữ là "vỏ vật chất" của tư duy.
              </span>,
            ]}
          />
          <WisdomList
            title="Kết cấu ý thức"
            items={[
              <span><strong>Tri thức</strong> — phương thức tồn tại và nền tảng của ý thức (quan trọng nhất).</span>,
              <span><strong>Tình cảm</strong> — thái độ của con người với thực tại.</span>,
              <span><strong>Ý chí</strong> — khả năng điều chỉnh hành vi.</span>,
            ]}
          />
          <div className="reflection-box">
            <div className="reflection-title">Ý nghĩa phương pháp luận</div>
            <p>Tôn trọng thực tế khách quan + phát huy tính năng động sáng tạo = thống nhất lý luận và thực tiễn.</p>
          </div>
        </div>
        <PageNumber value="11" />
      </AutoFitPage>
    ),
  },

  // ── SPREAD 6: Hai nguyên lý ────────────────────────────────────────────────
  {
    left: (
      <AutoFitPage className="page-left">
        <PageHeader title="Chương 2 — Phần II" />
        <div className="page-body">
          <h3>Phép biện chứng duy vật — Hai nguyên lý cơ bản</h3>
          <WisdomList
            title="Nguyên lý 1: Mối liên hệ phổ biến"
            items={[
              <span>
                <strong>Tính khách quan:</strong> Liên hệ vốn có của sự vật, không phụ thuộc ý
                muốn con người.
              </span>,
              <span>
                <strong>Tính phổ biến:</strong> Mọi sự vật đều có liên hệ; liên hệ tồn tại ở
                mọi lĩnh vực.
              </span>,
              <span>
                <strong>Tính đa dạng:</strong> Bên trong - bên ngoài; cơ bản - không cơ bản;
                chủ yếu - thứ yếu; trực tiếp - gián tiếp; tất yếu - ngẫu nhiên...
              </span>,
            ]}
          />
          <WisdomList
            title="Nguyên lý 2: Sự phát triển"
            items={[
              <span>Phát triển là thuộc tính vốn có, do mâu thuẫn nội tại quyết định (tính khách quan).</span>,
              <span>Diễn ra trong mọi lĩnh vực tự nhiên, xã hội và tư duy (tính phổ biến).</span>,
              <span>Không đơn giản, thẳng tắp — có thể có bước quanh co, thụt lùi; theo đường xoáy ốc (tính đa dạng).</span>,
            ]}
          />
        </div>
        <PageNumber value="12" />
      </AutoFitPage>
    ),
    right: (
      <AutoFitPage className="page-right">
        <PageHeader title="Chương 2 — Phần II (tiếp)" />
        <div className="page-body">
          <h3>Sáu cặp phạm trù cơ bản</h3>
          <WisdomList
            title="Các cặp phạm trù"
            items={[
              <span><strong>Cái riêng - Cái chung:</strong> Cái chung chỉ tồn tại trong cái riêng, thông qua cái riêng.</span>,
              <span><strong>Nguyên nhân - Kết quả:</strong> Quan hệ nhân quả là khách quan, tất yếu; kết quả có thể tác động ngược lại nguyên nhân.</span>,
              <span><strong>Tất nhiên - Ngẫu nhiên:</strong> Tất nhiên bộc lộ qua ngẫu nhiên; ngẫu nhiên là hình thức biểu hiện của tất nhiên.</span>,
              <span><strong>Nội dung - Hình thức:</strong> Nội dung quyết định hình thức; hình thức tác động trở lại nội dung.</span>,
              <span><strong>Bản chất - Hiện tượng:</strong> Bản chất quy định hiện tượng; hiện tượng phong phú hơn bản chất.</span>,
              <span><strong>Khả năng - Hiện thực:</strong> Dựa vào hiện thực, đồng thời tạo điều kiện biến khả năng tốt thành hiện thực.</span>,
            ]}
          />
        </div>
        <PageNumber value="13" />
      </AutoFitPage>
    ),
  },

  // ── SPREAD 7: Ba quy luật ──────────────────────────────────────────────────
  {
    left: (
      <AutoFitPage className="page-left">
        <PageHeader title="Chương 2 — Phần II (tiếp)" />
        <div className="page-body">
          <h3>Quy luật 1: Thống nhất và đấu tranh của các mặt đối lập</h3>
          <p className="first-letter">
            Đây là hạt nhân của phép biện chứng, chỉ ra nguồn gốc của sự vận động và phát triển.
            Mọi sự vật đều chứa đựng những mặt vừa thống nhất vừa đấu tranh với nhau.
          </p>
          <WisdomList
            title="Các loại mâu thuẫn"
            items={[
              <span>Bên trong / bên ngoài; cơ bản / không cơ bản; chủ yếu / thứ yếu.</span>,
              <span>
                <strong>Đối kháng / không đối kháng</strong> (quan trọng nhất): Mâu thuẫn đối
                kháng giữa các giai cấp có lợi ích đối lập, chỉ giải quyết được bằng cách mạng
                xã hội.
              </span>,
            ]}
          />
          <h3>Quy luật 2: Chuyển hóa lượng-chất</h3>
          <WisdomList
            title="Các khái niệm cốt lõi"
            items={[
              <span><strong>Độ:</strong> Giới hạn mà trong đó lượng biến đổi chưa làm thay đổi chất.</span>,
              <span><strong>Điểm nút:</strong> Điểm tích lũy đủ để gây ra bước nhảy về chất.</span>,
              <span><strong>Bước nhảy:</strong> Chất cũ bị xóa bỏ, chất mới ra đời (đột biến / dần dần).</span>,
            ]}
          />
        </div>
        <PageNumber value="14" />
      </AutoFitPage>
    ),
    right: (
      <AutoFitPage className="page-right">
        <PageHeader title="Chương 2 — Phần II (tiếp)" />
        <div className="page-body">
          <h3>Quy luật 3: Phủ định của phủ định</h3>
          <p className="first-letter">
            Phát triển trải qua các lần phủ định, nhưng đó là phủ định biện chứng — phủ định
            có kế thừa. Sau hai lần phủ định, sự vật trở về điểm xuất phát nhưng ở trình độ
            cao hơn — phát triển theo đường xoáy ốc.
          </p>
          <WisdomList
            title="Phân biệt hai loại phủ định"
            items={[
              <span>
                <strong>Phủ định biện chứng:</strong> Tự phủ định, do mâu thuẫn bên trong, có
                tính kế thừa — lọc bỏ tiêu cực, giữ lại tích cực.
              </span>,
              <span>
                <strong>Phủ định siêu hình:</strong> Xóa bỏ hoàn toàn, không kế thừa, do lực
                lượng bên ngoài gây ra.
              </span>,
            ]}
          />
          <div className="reflection-box">
            <div className="reflection-title">Ý nghĩa 3 quy luật</div>
            <p>
              Nguồn gốc phát triển (mâu thuẫn) • Cách thức phát triển (lượng-chất) • Xu hướng
              phát triển (phủ định của phủ định)
            </p>
          </div>
        </div>
        <PageNumber value="15" />
      </AutoFitPage>
    ),
  },

  // ── SPREAD 8: Lý luận nhận thức ───────────────────────────────────────────
  {
    left: (
      <AutoFitPage className="page-left">
        <PageHeader title="Chương 2 — Phần III" />
        <div className="page-body">
          <h3>Thực tiễn và vai trò của thực tiễn</h3>
          <p className="first-letter">
            Thực tiễn là toàn bộ hoạt động vật chất có mục đích, mang tính lịch sử - xã hội
            của con người nhằm cải tạo tự nhiên và xã hội.
          </p>
          <WisdomList
            title="Ba hình thức cơ bản"
            items={[
              <span><strong>Hoạt động sản xuất vật chất</strong> — nền tảng của xã hội (cơ bản nhất).</span>,
              <span><strong>Hoạt động chính trị - xã hội</strong> — cải tạo quan hệ xã hội.</span>,
              <span><strong>Hoạt động thực nghiệm khoa học</strong> — tiến hành trong điều kiện nhân tạo.</span>,
            ]}
          />
          <WisdomList
            title="Bốn vai trò của thực tiễn"
            items={[
              <span>Là <strong>cơ sở và nguồn gốc</strong> của nhận thức.</span>,
              <span>Là <strong>động lực</strong> thúc đẩy nhận thức.</span>,
              <span>Là <strong>mục đích</strong> của nhận thức.</span>,
              <span>Là <strong>tiêu chuẩn của chân lý</strong> — tiêu chuẩn khách quan duy nhất.</span>,
            ]}
          />
        </div>
        <PageNumber value="16" />
      </AutoFitPage>
    ),
    right: (
      <AutoFitPage className="page-right">
        <PageHeader title="Chương 2 — Phần III (tiếp)" />
        <div className="page-body">
          <h3>Con đường biện chứng của nhận thức và Chân lý</h3>
          <QuoteCard
            quote="Từ trực quan sinh động đến tư duy trừu tượng, và từ tư duy trừu tượng đến thực tiễn — đó là con đường biện chứng của sự nhận thức chân lý."
            author="Lênin"
          />
          <WisdomList
            title="Hai giai đoạn nhận thức"
            items={[
              <span>
                <strong>Nhận thức cảm tính:</strong> Tiếp xúc trực tiếp qua cảm giác, tri giác,
                biểu tượng. Phản ánh bề ngoài, sinh động nhưng chưa nắm bắt được bản chất.
              </span>,
              <span>
                <strong>Nhận thức lý tính:</strong> Thông qua khái niệm, phán đoán, suy luận
                để nắm bắt bản chất, quy luật bên trong — bước nhảy về chất trong nhận thức.
              </span>,
            ]}
          />
          <WisdomList
            title="Tính chất của chân lý"
            items={[
              <span><strong>Tính khách quan:</strong> Nội dung phản ánh đúng thực tại.</span>,
              <span><strong>Tính tuyệt đối và tương đối:</strong> Tương đối chứa yếu tố tuyệt đối; nhận thức tiến từ tương đối đến tuyệt đối.</span>,
              <span><strong>Tính cụ thể:</strong> Gắn với điều kiện, hoàn cảnh, không gian và thời gian xác định.</span>,
            ]}
          />
        </div>
        <PageNumber value="17" />
      </AutoFitPage>
    ),
  },

  // ── SPREAD 9: Chương 3 – Hình thái kinh tế-xã hội ─────────────────────────
  {
    left: (
      <AutoFitPage className="page-left">
        <PageHeader title="Chương 3 — Phần I" />
        <div className="page-body">
          <h3>Sản xuất vật chất và Phương thức sản xuất</h3>
          <p className="first-letter">
            Để tồn tại, con người phải tiến hành sản xuất. Sản xuất vật chất là nền tảng cơ bản
            nhất, là tiền đề của mọi hoạt động lịch sử, tạo ra quan hệ kinh tế và từ đó hình
            thành các quan hệ xã hội khác.
          </p>
          <WisdomList
            title="Lực lượng sản xuất gồm"
            items={[
              <span>
                <strong>Người lao động</strong> — với thể lực, trí lực, kinh nghiệm. Yếu tố
                quan trọng nhất, năng động nhất.
              </span>,
              <span>
                <strong>Tư liệu sản xuất:</strong> Đối tượng lao động + tư liệu lao động. Trong
                đó, công cụ lao động là yếu tố cách mạng nhất.
              </span>,
              <span>
                Ngày nay, <strong>khoa học đã trở thành lực lượng sản xuất trực tiếp</strong> —
                xâm nhập vào mọi yếu tố và nhân lên sức mạnh của chúng.
              </span>,
            ]}
          />
        </div>
        <PageNumber value="18" />
      </AutoFitPage>
    ),
    right: (
      <AutoFitPage className="page-right">
        <PageHeader title="Chương 3 — Phần I (tiếp)" />
        <div className="page-body">
          <h3>Quan hệ sản xuất và Quy luật phù hợp</h3>
          <WisdomList
            title="QHSX gồm 3 mặt"
            items={[
              <span><strong>Quan hệ sở hữu</strong> về tư liệu sản xuất — quan trọng nhất, quyết định các quan hệ khác.</span>,
              <span>Quan hệ trong <strong>tổ chức, quản lý</strong> sản xuất.</span>,
              <span>Quan hệ trong <strong>phân phối</strong> sản phẩm lao động.</span>,
            ]}
          />
          <QuoteCard
            quote="LLSX quyết định tính chất và trình độ của QHSX. QHSX phải phù hợp với trình độ LLSX — đây là quy luật cơ bản nhất chi phối sự vận động của lịch sử xã hội."
            author="Học thuyết hình thái kinh tế - xã hội"
          />
          <div className="reflection-box">
            <div className="reflection-title">CSHT và KTTT</div>
            <p>
              CSHT (toàn bộ QHSX) quyết định KTTT (quan điểm chính trị, pháp luật, triết học,
              tôn giáo... + thiết chế tương ứng). KTTT phản ánh và tác động ngược lại CSHT.
            </p>
          </div>
        </div>
        <PageNumber value="19" />
      </AutoFitPage>
    ),
  },

  // ── SPREAD 10: Hình thái KT-XH, Giai cấp ─────────────────────────────────
  {
    left: (
      <AutoFitPage className="page-left">
        <PageHeader title="Chương 3 — Phần I (tiếp)" />
        <div className="page-body">
          <h3>Sự phát triển các hình thái kinh tế - xã hội</h3>
          <p className="first-letter">
            Lịch sử loài người đã trải qua 5 hình thái (phương thức sản xuất). Đây là quá
            trình lịch sử - tự nhiên: vận động theo quy luật khách quan, không phụ thuộc ý
            muốn chủ quan.
          </p>
          <WisdomList
            title="Năm hình thái kinh tế - xã hội"
            items={[
              <span>Cộng sản nguyên thủy</span>,
              <span>Chiếm hữu nô lệ</span>,
              <span>Phong kiến</span>,
              <span>Tư bản chủ nghĩa</span>,
              <span>Cộng sản chủ nghĩa (CNXH là giai đoạn thấp)</span>,
            ]}
          />
          <div className="reflection-box">
            <div className="reflection-title">Việt Nam</div>
            <p>
              Tiến trình không đơn giản, thẳng tắp — có thể bỏ qua một số giai đoạn nếu có
              điều kiện thích hợp (Việt Nam quá độ lên CNXH bỏ qua giai đoạn TBCN).
            </p>
          </div>
        </div>
        <PageNumber value="20" />
      </AutoFitPage>
    ),
    right: (
      <AutoFitPage className="page-right">
        <PageHeader title="Chương 3 — Phần II" />
        <div className="page-body">
          <h3>Giai cấp và đấu tranh giai cấp</h3>
          <QuoteCard
            quote="Giai cấp là những tập đoàn người lớn khác nhau về địa vị trong hệ thống sản xuất xã hội nhất định, khác nhau về quan hệ với tư liệu sản xuất, về vai trò trong tổ chức lao động và về cách thức hưởng thụ phần của cải xã hội."
            author="Lênin, Định nghĩa giai cấp"
          />
          <WisdomList
            title="Hình thức đấu tranh giai cấp"
            items={[
              <span><strong>Kinh tế:</strong> đình công, phá hoại.</span>,
              <span><strong>Tư tưởng:</strong> tuyên truyền, đấu tranh học thuyết.</span>,
              <span><strong>Chính trị:</strong> đấu tranh giành chính quyền — hình thức <strong>cao nhất</strong>.</span>,
            ]}
          />
          <p>Đấu tranh giai cấp là động lực trực tiếp của xã hội có giai cấp. Giai cấp sẽ mất đi khi xóa bỏ chế độ tư hữu.</p>
        </div>
        <PageNumber value="21" />
      </AutoFitPage>
    ),
  },

  // ── SPREAD 11: Nhà nước, Cách mạng, Ý thức xã hội ────────────────────────
  {
    left: (
      <AutoFitPage className="page-left">
        <PageHeader title="Chương 3 — Phần III" />
        <div className="page-body">
          <h3>Nhà nước và Cách mạng xã hội</h3>
          <WisdomList
            title="Nhà nước"
            items={[
              <span>
                <strong>Nguồn gốc:</strong> Nhà nước là sản phẩm của xã hội có giai cấp và mâu
                thuẫn giai cấp không thể điều hòa được (Engels, 1884).
              </span>,
              <span>
                <strong>Bản chất:</strong> Là công cụ của giai cấp thống trị về kinh tế để thực
                hiện sự thống trị chính trị. Mọi nhà nước đều mang tính giai cấp.
              </span>,
              <span>
                <strong>Chức năng:</strong> Đối nội (trấn áp, quản lý xã hội) và đối ngoại (bảo
                vệ lãnh thổ, ngoại giao).
              </span>,
            ]}
          />
          <WisdomList
            title="Cách mạng xã hội"
            items={[
              <span>Nguyên nhân sâu xa: mâu thuẫn LLSX - QHSX; CSHT - KTTT.</span>,
              <span>Điều kiện: tình thế cách mạng (khách quan) + lực lượng cách mạng trưởng thành (chủ quan).</span>,
              <span>Cách mạng vô sản là triệt để nhất vì xóa bỏ mọi chế độ bóc lột.</span>,
            ]}
          />
        </div>
        <PageNumber value="22" />
      </AutoFitPage>
    ),
    right: (
      <AutoFitPage className="page-right">
        <PageHeader title="Chương 3 — Phần IV" />
        <div className="page-body">
          <h3>Ý thức xã hội</h3>
          <WisdomList
            title="Tính độc lập tương đối của ý thức xã hội"
            items={[
              <span>Thường <strong>lạc hậu</strong> so với tồn tại xã hội (tàn dư tư tưởng cũ dai dẳng).</span>,
              <span>Có thể <strong>vượt trước</strong> tồn tại xã hội (tư tưởng tiên tiến, dự báo tương lai).</span>,
              <span>Có tính <strong>kế thừa</strong> trong sự phát triển (lịch sử tư tưởng không đứt đoạn).</span>,
              <span><strong>Tác động trở lại</strong> tồn tại xã hội: ý thức tiến bộ thúc đẩy; ý thức lạc hậu kìm hãm.</span>,
            ]}
          />
          <div className="reflection-box">
            <div className="reflection-title">Các hình thái ý thức xã hội</div>
            <p>
              Chính trị • Pháp quyền • Đạo đức • Tôn giáo • Nghệ thuật • Khoa học • Triết học.
              Mỗi hình thái có quy luật riêng và tác động qua lại với nhau.
            </p>
          </div>
        </div>
        <PageNumber value="23" />
      </AutoFitPage>
    ),
  },

  // ── SPREAD 12: Triết học về con người ─────────────────────────────────────
  {
    left: (
      <AutoFitPage className="page-left">
        <PageHeader title="Chương 3 — Phần V" />
        <div className="page-body">
          <h3>Triết học về con người</h3>
          <QuoteCard
            quote="Bản chất con người không phải là cái gì trừu tượng, cố hữu của cá nhân riêng lẻ. Trong tính hiện thực của nó, bản chất con người là tổng hòa những quan hệ xã hội."
            author="Marx, Luận cương về Feuerbach, 1845"
          />
          <WisdomList
            title="Quan hệ cá nhân và xã hội"
            items={[
              <span>
                Xã hội là điều kiện tồn tại và phát triển của cá nhân; cá nhân là tế bào sống
                của xã hội. Lợi ích cá nhân và xã hội vừa thống nhất vừa mâu thuẫn.
              </span>,
              <span>
                Tránh <strong>CNCH cực đoan</strong> (đặt lợi ích cá nhân lên trên tất cả) và
                <strong> CN tập thể cực đoan</strong> (xóa bỏ hoàn toàn lợi ích cá nhân).
              </span>,
            ]}
          />
        </div>
        <PageNumber value="24" />
      </AutoFitPage>
    ),
    right: (
      <AutoFitPage className="page-right">
        <PageHeader title="Chương 3 — Phần V (tiếp)" />
        <div className="page-body">
          <h3>Quần chúng nhân dân và giải phóng con người</h3>
          <WisdomList
            title="Vai trò quần chúng nhân dân"
            items={[
              <span>Là lực lượng sản xuất cơ bản — tạo ra của cải vật chất.</span>,
              <span>Là động lực của mọi cuộc cách mạng — biến đổi xã hội.</span>,
              <span>Sáng tạo ra các giá trị tinh thần — văn hóa, khoa học, nghệ thuật.</span>,
            ]}
          />
          <p>
            Cá nhân — đặc biệt là lãnh tụ — có vai trò quan trọng: phát hiện quy luật, định ra
            đường lối, tổ chức và lãnh đạo quần chúng. Tránh sùng bái cá nhân hoặc phủ nhận
            vai trò cá nhân.
          </p>
          <QuoteCard
            quote="Thay thế xã hội tư sản cũ, với những giai cấp và đối kháng giai cấp của nó, sẽ xuất hiện một liên hợp, trong đó sự phát triển tự do của mỗi người là điều kiện cho sự phát triển tự do của tất cả mọi người."
            author="Tuyên ngôn Đảng Cộng sản, 1848"
          />
        </div>
        <PageNumber value="25" />
      </AutoFitPage>
    ),
  },

  // ── SPREAD 13: Tổng kết ────────────────────────────────────────────────────
  {
    left: (
      <AutoFitPage className="page-left">
        <div className="final-content">
          <div className="conclusion-title">
            <h2>Tổng kết nhanh</h2>
          </div>
          <div className="wisdom-section">
            <div className="wisdom-item">
              <span className="wisdom-number">1</span>
              <div>
                <strong>Chương 1:</strong> Triết học là khoa học về quy luật chung nhất của tự nhiên, xã hội và tư duy.
                Triết học Mác ra đời từ 3 nguồn lý luận và 3 phát minh khoa học tự nhiên lớn.
              </div>
            </div>
            <div className="wisdom-item">
              <span className="wisdom-number">2</span>
              <div>
                <strong>Chương 2 — Vật chất & Ý thức:</strong> Vật chất có trước, quyết định ý thức; ý thức
                có tính độc lập tương đối và tác động ngược lại.
              </div>
            </div>
            <div className="wisdom-item">
              <span className="wisdom-number">3</span>
              <div>
                <strong>Phép biện chứng:</strong> 2 nguyên lý + 6 cặp phạm trù + 3 quy luật (mâu thuẫn,
                lượng-chất, phủ định của phủ định).
              </div>
            </div>
            <div className="wisdom-item">
              <span className="wisdom-number">4</span>
              <div>
                <strong>Chương 3 — Lịch sử:</strong> LLSX quyết định QHSX; CSHT quyết định KTTT. Lịch sử
                phát triển qua 5 hình thái kinh tế - xã hội.
              </div>
            </div>
            <div className="wisdom-item">
              <span className="wisdom-number">5</span>
              <div>
                <strong>Con người:</strong> Bản chất con người là tổng hòa những quan hệ xã hội. Mục tiêu
                cuối cùng là giải phóng con người khỏi mọi áp bức, bóc lột.
              </div>
            </div>
          </div>
        </div>
        <PageNumber value="26" />
      </AutoFitPage>
    ),
    right: (
      <AutoFitPage
        className="cover-back"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(251,191,36,.14) 0%, transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(59,130,246,.14) 0%, transparent 40%),
            linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #111827 100%)
          `,
        }}
      >
        <div className="back-cover-design">
          <div className="back-title">
            <div className="back-title-backdrop" />
            <h1>TRIẾT HỌC MÁC - LÊNIN</h1>
          </div>
          <div className="cover-quote">
            <div className="quote-marks">"</div>
            <div className="quote-text">
              Trang bị thế giới quan duy vật biện chứng, phương pháp luận khoa học
              và nhân sinh quan cách mạng cho thế hệ trẻ Việt Nam.
            </div>
            <div className="quote-author">— NXB Chính trị Quốc gia Sự thật, 2021</div>
            <div className="quote-marks closing">"</div>
          </div>
        </div>
      </AutoFitPage>
    ),
  },
];

export const spreadsToPages = (bookSpreads, { onTocClick } = {}) => {
  const pages = [];

  pages.push(
    <div className="page" key="cover-front">
      {bookSpreads[0].right}
    </div>
  );

  const OFFSET = 2;
  const idxFor = (spreadIndex, side = "left") => {
    if (spreadIndex <= 0) return 0;
    const base = side === "left" ? 2 * spreadIndex - 1 : 2 * spreadIndex;
    return base + OFFSET;
  };

  const toc = [
    { label: "Lời giới thiệu và mục tiêu học tập", s: 1, side: "left" },
    { label: "Ch.1: Nguồn gốc, khái niệm và vấn đề cơ bản triết học", s: 2, side: "left" },
    { label: "Ch.1: Phương pháp biện chứng & lịch sử triết học Mác", s: 3, side: "left" },
    { label: "Ch.1: Các giai đoạn phát triển & chức năng triết học Mác", s: 4, side: "left" },
    { label: "Ch.2: Phạm trù vật chất, ý thức", s: 5, side: "left" },
    { label: "Ch.2: Hai nguyên lý & sáu cặp phạm trù", s: 6, side: "left" },
    { label: "Ch.2: Ba quy luật cơ bản của phép biện chứng", s: 7, side: "left" },
    { label: "Ch.2: Lý luận nhận thức và chân lý", s: 8, side: "left" },
    { label: "Ch.3: Hình thái kinh tế-xã hội, LLSX, QHSX", s: 9, side: "left" },
    { label: "Ch.3: Năm hình thái & giai cấp, đấu tranh giai cấp", s: 10, side: "left" },
    { label: "Ch.3: Nhà nước, cách mạng, ý thức xã hội", s: 11, side: "left" },
    { label: "Ch.3: Triết học về con người và giải phóng", s: 12, side: "left" },
    { label: "Tổng kết nhanh", s: 13, side: "left" },
  ];

  const mid = Math.ceil(toc.length / 2);
  const tocLeft = toc.slice(0, mid);
  const tocRight = toc.slice(mid);

  const renderTocList = (items) => (
    <div className="wisdom-section">
      <h4>MỤC LỤC</h4>
      {items.map((item, index) => {
        const targetIdx = idxFor(item.s, item.side);
        const printedPage = 2 * item.s;
        return (
          <div className="principle" key={`${item.label}-${index}`}>
            <span className="principle-icon">📖</span>
            <a
              href="#"
              className="toc-link"
              data-goto={targetIdx}
              title={`Tới trang ${printedPage}`}
              onClick={onTocClick}
            >
              <strong>{item.label}</strong>
              <span className="toc-page"> — tr. {printedPage}</span>
            </a>
          </div>
        );
      })}
    </div>
  );

  pages.push(
    <div className="page" key="toc-left">
      <AutoFitPage className="page-left">
        <PageHeader title="Mục lục" />
        <div className="page-body">{renderTocList(tocLeft)}</div>
      </AutoFitPage>
    </div>
  );

  pages.push(
    <div className="page" key="toc-right">
      <AutoFitPage className="page-right">
        <PageHeader title="Mục lục (tiếp)" />
        <div className="page-body">{renderTocList(tocRight)}</div>
      </AutoFitPage>
    </div>
  );

  for (let i = 1; i < bookSpreads.length; i += 1) {
    const spread = bookSpreads[i];
    if (spread.left) {
      pages.push(
        <div className="page" key={`page-${i}-left`}>
          {spread.left}
        </div>
      );
    }
    if (spread.right) {
      pages.push(
        <div className="page" key={`page-${i}-right`}>
          {spread.right}
        </div>
      );
    }
  }

  return pages;
};
