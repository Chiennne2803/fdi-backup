// import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  animations: [],
  styles: [
    `input[type='range'] {
  -webkit-appearance: none;
  appearance: none;
}

input[type='range']::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  background-color: #f97316;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  margin-top: -4.1px;
}

input[type='range']::-moz-range-thumb {
  height: 20px;
  width: 20px;
  background-color: #f97316;
  border-radius: 50%;
  border: none;
  cursor: pointer;
}
`
  ]
})
export class HomeComponent {
  features = [
    { icon: 'assets/images/ui/media/card-dangky.png', title: 'Đăng ký &<br />Xác minh' },
    { icon: 'assets/images/ui/media/card-nganhang.png', title: 'Liên kết<br />ngân hàng' },
    { icon: 'assets/images/ui/media/card-von.png', title: 'Chấm điểm<br />tín dụng' },
    { icon: 'assets/images/ui/media/card-kyhopdong.png', title: 'Ký<br />hợp đồng' },
    { icon: 'assets/images/ui/media/card-khoanvay.png', title: 'Theo dõi khoản<br />huy động vốn' },
    { icon: 'assets/images/ui/media/card-thanhtoan.png', title: 'Rút tiền &<br />Thanh toán' },
    { icon: 'assets/images/ui/media/card-baohiem.png', title: 'Bảo hiểm<br />rủi ro' },
    { icon: 'assets/images/ui/media/card-gioithieu.png', title: 'Giới thiệu &<br />Hoàn tiền' },
    { icon: 'assets/images/ui/media/card-hotro.png', title: 'Hỗ trợ<br />khách hàng' },
    { icon: 'assets/images/ui/media/card-phantich.png', title: 'Phân tích<br />tài chính' },
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
      title: 'Hồ sơ mở rộng trang trại hữu cơ',
      image: 'assets/images/banner/project.jpg',
    },
    {
      title: 'Hồ sơ mở rộng trang trại hữu cơ',
      image: 'assets/images/banner/project.jpg',
    },
    {
      title: 'Hồ sơ mở rộng trang trại hữu cơ',
      image: 'assets/images/banner/project.jpg',
    },
    // ... thêm nếu muốn
  ];
  projects2 = [
    {
      title: 'Hồ sơ mở rộng trang trại hữu cơ',
      image: 'assets/images/banner/project-2.png',
    },
    {
      title: 'Hồ sơ mở rộng trang trại hữu cơ',
      image: 'assets/images/banner/project-3.png',
    },
    {
      title: 'Hồ sơ mở rộng trang trại hữu cơ',
      image: 'assets/images/banner/project.jpg',
    },
    // ... thêm nếu muốn
  ];
  testimonials = [
    {
      name: 'Đặng Trần Phương B',
      title: 'Trưởng phòng Tài chính Công Ty Công nghệ Tài chính ABCXYZ',
      avatar: 'assets/images/avatars/avatar.png',
      stars: 5,
      comment: `Sản phẩm bảo hiểm đầu tư có mức sinh lời vượt kỳ vọng sau ba năm sử dụng. 
Đăng ký nhanh chóng với vài bước trực tuyến.
Thông tin được cập nhật định kỳ qua tin nhắn, giúp theo dõi dễ dàng.`,
    },
    {
      name: 'Nguyễn Văn A',
      title: 'CEO Công Ty ABC',
      avatar: 'assets/images/avatars/avatar.png',
      stars: 5,
      comment: `Tôi rất hài lòng về sự minh bạch và hiệu quả khi đầu tư. Giao diện dễ sử dụng, chăm sóc khách hàng tốt.`,
    },
    {
      name: 'Nguyễn Văn A',
      title: 'CEO Công Ty ABC',
      avatar: 'assets/images/avatars/avatar.png',
      stars: 5,
      comment: `Tôi rất hài lòng về sự minh bạch và hiệu quả khi đầu tư. Giao diện dễ sử dụng, chăm sóc khách hàng tốt.`,
    },
    // thêm nếu muốn
  ];


  activeTab: 'invest' | 'fundraise' = 'invest';

  amount: number = 50000000; // 50 triệu
  duration: number = 0;      // 0 ngày


  interestRate: number = 0.14;

  get totalReturn(): number {
    const interest = this.amount * (this.interestRate * this.duration / 365);
    return Math.round(this.amount + interest);
  }
  getRangeGradient(value: number, min: number, max: number): string {
    
    const percentage = ((value - min) / (max - min)) * 100;

    return `linear-gradient(to right, #f97316 0%, #f97316 ${percentage}%, #2563eb ${percentage}%, #2563eb 100%)`;
  }

}
