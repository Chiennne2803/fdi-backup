import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Flickity from 'flickity';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  animations: [],
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  @ViewChild('carousel', { static: false }) carousel!: ElementRef;
  flkty!: Flickity;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.flkty = new Flickity(this.carousel.nativeElement, {
        cellAlign: 'center',
        contain: true,
        wrapAround: true,
        autoPlay: 3000, // tự chạy 3s
        pauseAutoPlayOnHover: true,
        prevNextButtons: true,
        pageDots: true,
        draggable: true,
        imagesLoaded: true,
        adaptiveHeight: true,
        percentPosition: true,
        selectedAttraction: 0.02, // độ mượt trượt
        friction: 0.25, // giảm tốc độ dừng
        setGallerySize: true, // tự set chiều cao
        groupCells: 1, // mỗi lần hiển thị 1 ảnh
        dragThreshold: 5 // giảm giật khi kéo
      });
    }, 100); // delay 100ms

  }
  features = [
    { icon: 'assets/images/ui/media/card-dangky.png', title: 'Đăng ký &<br />Xác minh', link: 'https://linkfiin.vn/dang-ky-xac-minh' },
    { icon: 'assets/images/ui/media/card-nganhang.png', title: 'Liên kết<br />ngân hàng', link: 'https://linkfiin.vn/lien-ket-ngan-hang' },
    { icon: 'assets/images/ui/media/card-von.png', title: 'Chấm điểm<br />tín dụng', link: 'https://linkfiin.vn/lien-ket-ngan-hang' },
    { icon: 'assets/images/ui/media/card-kyhopdong.png', title: 'Ký<br />hợp đồng', link: 'https://linkfiin.vn/ky-hop-dong' },
    { icon: 'assets/images/ui/media/card-khoanvay.png', title: 'Theo dõi khoản<br />huy động vốn', link: 'https://linkfiin.vn/theo-doi-khoan-huy-dong-von' },
    { icon: 'assets/images/ui/media/card-thanhtoan.png', title: 'Rút tiền &<br />Thanh toán', link: 'https://linkfiin.vn/rut-tien-thanh-toan' },
    { icon: 'assets/images/ui/media/card-baohiem.png', title: 'Bảo hiểm<br />rủi ro', link: 'https://linkfiin.vn/bao-hiem-rui-ro' },
    { icon: 'assets/images/ui/media/card-gioithieu.png', title: 'Giới thiệu &<br />Hoàn tiền', link: 'https://linkfiin.vn/bao-hiem-rui-ro' },
    { icon: 'assets/images/ui/media/card-hotro.png', title: 'Hỗ trợ<br />khách hàng', link: 'https://linkfiin.vn/bao-hiem-rui-ro' },
    { icon: 'assets/images/ui/media/card-phantich.png', title: 'Phân tích<br />tài chính', link: 'https://linkfiin.vn/phan-tich-tai-chinh' },
  ];
  reasons = [
    {
      icon: 'assets/images/icon/euro.svg', // Thay bằng ảnh hoặc icon class  nếu cần
      title: 'Lãi suất cạnh tranh',
      description: 'Tối đa hoá lợi nhuận với các khoản vay bảo đảm.',
    },
    {
      icon: 'assets/images/icon/bank.svg',
      title: 'Minh bạch & an toàn',
      description: 'Mọi khoản vay đều có tài sản thế chấp rõ ràng.',
    },
    {
      icon: 'assets/images/icon/copy-success.svg',
      title: 'Xử lý nhanh chóng',
      description: 'Quy trình phê duyệt và giải ngân rút gọn.',
    },
    {
      icon: 'assets/images/icon/convert-card.svg',
      title: 'Đầu tư sinh lời bền vững',
      description: 'Dòng tiền ổn định, không lo quản lý phức tạp.',
    },
    {
      icon: 'assets/images/icon/technology-1.svg',
      title: 'Công nghệ hiện đại',
      description: 'Bảo mật giao dịch, hỗ trợ thông tin minh bạch.',
    }
  ];
  projects1 = [
    {
      title: 'Thương mại & dịch vụ: Linh hoạt – Bền vững – Sinh lời nhanh',
      image: 'assets/images/banner/unnamed-1401.png',
      link: 'https://linkfiin.vn/thuong-mai-dich-vu-linh-hoat-ben-vung-sinh-loi-nhanh'
    },
    {
      title: 'Đầu tư tài chính số: Bắt sóng xu hướng, tối ưu lợi nhuận',
      image: 'assets/images/banner/2156_539_Copy-768x432.jpg',
      link: 'https://linkfiin.vn/dau-tu-tai-chinh-so-bat-song-xu-huong-toi-uu-loi-nhuan'
    },
    {
      title: 'Vật liệu xây dựng: Tăng trưởng ổn định, sinh lời dài hạn',
      image: 'assets/images/banner/unnamed.jpg',
      link: 'https://linkfiin.vn/vat-lieu-xay-dung-tang-truong-on-dinh-sinh-loi-dai-han'
    },
    // ... thêm nếu muốn
  ];
  projects2 = [
    {
      title: 'Những lưu ý khi vay tiền qua nền tảng P2P',
      image: 'assets/images/banner/0553_15-1678632313582-768x542.jpg',
      link: 'https://linkfiin.vn/nhung-luu-y-quan-trong-khi-vay-tien-qua-nen-tang-p2p'
    },
    {
      title: 'P2P Lending: Xu hướng tài chính của tương lai',
      image: 'assets/images/banner/1-768x512.jpg',
      link: 'https://linkfiin.vn/p2p-lending-xu-huong-tai-chinh-cua-tuong-lai'
    },
    {
      title: 'Lợi ích khi đầu tư vào P2P Lending',
      image: 'assets/images/banner/photo-1-16221711166652055298654.jpeg',
      link: 'https://linkfiin.vn/loi-ich-khi-dau-tu-vao-p2p-lending'
    },
    // ... thêm nếu muốn
  ];
  testimonials = [
    {
      name: 'Chị Phương',
      title: 'Công Ty Công Nghệ Tài Chính',
      avatar: 'assets/images/avatars/avatar.png',
      stars: 5,
      comment: `Sản phẩm bảo hiểm đầu tư có mức sinh lời vượt kỳ vọng sau ba năm sử dụng. 
Đăng ký nhanh chóng với vài bước trực tuyến.
Thông tin được cập nhật định kỳ qua tin nhắn, giúp theo dõi dễ dàng.`,
    },
    {
      name: 'Anh Tùng',
      title: 'Giám đốc Công ty TM&DV',
      avatar: 'https://linkfiin.vn/wp-content/uploads/2025/03/Anh-profile-56.jpg-e1742281079568-150x150.webp',
      stars: 5,
      comment: `Nhờ Linkfiin, công ty tôi đã tiếp cận nguồn vốn một cách nhanh chóng để mở rộng sản xuất. 
      Mọi quy trình đều rõ ràng, minh bạch, giúp tôi hoàn toàn yên tâm khi vay vốn.`,
    },
    {
      name: 'Anh Bảo',
      title: 'CEO Startup Công nghệ',
      avatar: 'https://linkfiin.vn/wp-content/uploads/2025/03/Son-Tran-12-e1742281161164-150x150.jpg',
      stars: 5,
      comment: `Thủ tục vay tại Linkfiin cực kỳ đơn giản và hiệu quả.
       Chúng tôi nhận được vốn trong thời gian ngắn, không phải chờ đợi như khi làm việc với ngân hàng. 
       Một giải pháp tài chính đáng tin cậy!`,
    },
    // thêm nếu muốn
  ];


  activeTab: 'invest' | 'fundraise' = 'invest';
  showNewsDropdown: boolean = false;
  amount: number = 10000000; // 50 triệu
  duration: number = 0;      // 0 ngày
  interestRate: number = 0.14;
  private dropdownTimeout: any;

  get totalReturn(): number {
    const interest = this.amount * (this.interestRate * this.duration / 365);
    return Math.round(this.amount + interest);
  }
  getRangeGradient(value: number, min: number, max: number): string {
    const percentage = ((value - min) / (max - min)) * 100;

    return `linear-gradient(to right, #f97316 0%, #f97316 ${percentage}%, #2563eb ${percentage}%, #2563eb 100%)`;
  }

  toggleNewsDropdown(): void {
    this.showNewsDropdown = !this.showNewsDropdown;
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
      this.dropdownTimeout = null;
    }
  }

  onMouseEnter(): void {
    if (this.dropdownTimeout) {
      clearTimeout(this.dropdownTimeout);
      this.dropdownTimeout = null;
    }
    this.showNewsDropdown = true;
  }

  onMouseLeave(): void {
    this.dropdownTimeout = setTimeout(() => {
      this.showNewsDropdown = false;
    }, 300); // 300ms delay before closing
  }

}
