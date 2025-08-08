import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-swiper-slide',
  templateUrl: './swiper-slide.component.html',
  styles: [
  ]
})
export class SwiperSlideComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  slides = [
    {
      image: 'assets/images/banner-1.png',
      title: 'Tăng doanh số, tiếp cận khách hàng tiềm năng',
      description: 'Quảng bá thương hiệu và khuyến mãi đến người dùng nhanh chóng.'
    },
    {
      image: 'assets/images/banner-2.png',
      title: 'Công cụ quản lý khách hàng hiệu quả',
      description: 'Tích điểm, tặng quà, chăm sóc khách hàng dễ dàng.'
    },
    {
      image: 'assets/images/banner-3.png',
      title: 'Tích hợp ZNS và Mini Game',
      description: 'Gửi tin nhắn chăm sóc và tạo minigame tăng tương tác.'
    },
  ];

}
