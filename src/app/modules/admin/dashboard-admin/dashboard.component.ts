import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { DashboardService } from "app/service/common-service/dashboard.service";
import { Observable } from "rxjs";
import { BaseResponse } from "app/models/base";
import { AuthService } from "../../../core/auth/auth.service";
import { User } from "../../../core/user/user.types";
import { ApexOptions } from "ng-apexcharts";
import { DateTimeformatPipe } from "../../../shared/components/pipe/date-time-format.pipe";
import { CurrencyFormatPipe } from "../../../shared/components/pipe/string-format.pipe";
import { DashboardDTO } from "../../../models/admin/DashboardDTO.model";
import { FsDocuments } from "../../../models/admin";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

@Component({
    selector: "dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrls: ["./dashboard.component.scss"],
    encapsulation: ViewEncapsulation.None,
    providers: [DateTimeformatPipe],
})
export class DashboardAdminComponent implements OnInit {
    public dashBoardValue: Observable<BaseResponse>;
    public dashboardDTO: DashboardDTO;
    public user: User;
    public avatar: string | SafeResourceUrl =
        "assets/images/avatars/brian-hughes.jpg";
    chartConfigSales: ApexOptions = {};
    chartConfigAccount: ApexOptions = {};
    chartConfigPay: ApexOptions = {};
    chartCustomerMonthly: ApexOptions = {};
    chartTask: ApexOptions = {};

    /**
     * Constructor
     */
    constructor(
        private _dashBoardService: DashboardService,
        private _authService: AuthService,
        private _datetimePipe: DateTimeformatPipe,
        private _domSanitizer: DomSanitizer
    ) {}

    ngOnInit(): void {
        this.chartTask = {
            series: [
                {
                    name: "Khách hàng doanh nghiệp",
                    data: [300, 322, 400, 270, 190, 310],
                },
                {
                    name: "Khách hàng cá nhân",
                    data: [250, 291, 300, 150, 120, 270],
                },
            ],
            chart: {
                type: "area",
                height: 350,
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth", // ✅ Đường cong mượt
                width: 2,
            },
            xaxis: {
                categories: [
                    "02/2025",
                    "03/2025",
                    "04/2025",
                    "05/2025",
                    "06/2025",
                    "07/2025",
                ],
                labels: {
                    style: {
                        fontSize: "14px",
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        fontSize: "14px",
                    },
                },
            },
            grid: {
                show: true,
                borderColor: "#E5E7EB", // Màu lưới (xám nhạt)
                strokeDashArray: 4, // Tạo hiệu ứng nét đứt
                xaxis: {
                    lines: {
                        show: false, // Không cần lưới theo chiều dọc (tuỳ chọn)
                    },
                },
                yaxis: {
                    lines: {
                        show: true, // Hiển thị lưới theo chiều ngang
                    },
                },
            },
            tooltip: {
                x: {
                    format: "MM/yyyy",
                },
                y: {
                    formatter: (val: number) => `${val}`,
                },
            },
            colors: ["#ED7632", "#1255FB"],
            fill: {
                type: "gradient",
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.4,
                    opacityTo: 0.1,
                    stops: [0, 90, 100],
                },
            },
            legend: {
                position: "bottom",
                horizontalAlign: "center",
                fontSize: "14px",
                itemMargin: {
                    horizontal: 20,
                    vertical: 8,
                },
                markers: {
                    radius: 10,
                },
            },
        };
        this.chartCustomerMonthly = {
            series: [
                {
                    name: "Khách hàng doanh nghiệp",
                    data: [300, 322, 400, 270, 190, 310],
                },
                {
                    name: "Khách hàng cá nhân",
                    data: [250, 291, 300, 150, 120, 270],
                },
            ],
            chart: {
                type: "bar",
                height: 350,
                toolbar: { show: false },
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: "50%",
                    borderRadius: 1.5,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 4,
                colors: ["transparent"],
            },
            xaxis: {
                categories: [
                    "02/2025",
                    "03/2025",
                    "04/2025",
                    "05/2025",
                    "06/2025",
                    "07/2025",
                ],
                labels: {
                    style: {
                        fontSize: "14px",
                    },
                },
            },
            yaxis: {
                labels: {
                    style: {
                        fontSize: "14px",
                    },
                },
            },
            grid: {
                show: true,
                borderColor: "#E5E7EB", // Màu lưới (xám nhạt)
                strokeDashArray: 4, // Tạo hiệu ứng nét đứt
                xaxis: {
                    lines: {
                        show: false, // Không cần lưới theo chiều dọc (tuỳ chọn)
                    },
                },
                yaxis: {
                    lines: {
                        show: true, // Hiển thị lưới theo chiều ngang
                    },
                },
            },

            fill: {
                opacity: 1,
            },
            tooltip: {
                y: {
                    formatter: function (val: number) {
                        return `${val}`;
                    },
                },
            },
            legend: {
                position: "bottom",
                horizontalAlign: "center",
                fontSize: "14px",
                markers: {
                    radius: 10,
                },
                itemMargin: {
                    horizontal: 20,
                    // vertical: 10,
                },
            },
            colors: ["#ED7632", "#1255FB"],
            responsive: [
                {
                    breakpoint: 768,
                    options: {
                        plotOptions: {
                            bar: {
                                columnWidth: "60%",
                            },
                        },
                    },
                },
            ],
        };
        this.user = this._authService.authenticatedUser;
        this.avatar = this._authService.loadDefaultAvatar();
        this._authService.getAvata.subscribe((res) => {
            if (res) {
                this.avatar =
                    this._domSanitizer.bypassSecurityTrustResourceUrl(res);
            } else {
                this.avatar = this._authService.loadDefaultAvatar();
                this._authService.loadAvataLocal();
            }
        });

        this._dashBoardService.dashboard$.subscribe((res) => {
            if (res) {
                this.dashboardDTO = res;
                if (res.tab3?.chartGrowthAccount) {
                    this.chartConfigAccount = this.chartGrowthAccount(
                        res.tab3.chartGrowthAccount
                    );
                }
                if (res.tab3?.chartGrowthSales) {
                    this.chartConfigSales = this.chartGrowthSales(
                        res.tab3.chartGrowthSales
                    );
                }
                if (res.tab3?.chartGrowthPay) {
                    this.chartConfigPay = this.chartGrowthPay(
                        res.tab3.chartGrowthPay
                    );
                }
            }
        });
    }

    private chartGrowthAccount(data): {} {
        const label = [];
        const value1 = [];
        const value2 = [];
        data.map((value) => {
            label.push(
                value.date
                    ? this._datetimePipe.transform(
                          new Date(value.date).getTime(),
                          "DD/MM/YYYY"
                      )
                    : ""
            );
            value1.push(value.value1);
            value2.push(value.value2);
        });
        let chartConfig = this.initChart();
        chartConfig.title.text = "Biểu đồ tăng trưởng tài khoản";
        chartConfig.labels = label;
        chartConfig.series = [
            {
                name: "Nhà đầu tư",
                data: value1,
            },
            {
                name: "Huy động vốn",
                data: value2,
            },
        ];
        return chartConfig;
    }

    private chartGrowthSales(data): {} {
        const label = [];
        const value1 = [];
        data.map((value) => {
            label.push(
                value.date
                    ? this._datetimePipe.transform(
                          new Date(value.date).getTime(),
                          "DD/MM/YYYY"
                      )
                    : ""
            );
            value1.push(value.value1);
        });
        let chartConfig = this.initChart();
        chartConfig.title.text = "Biểu đồ tăng trưởng doanh số";
        chartConfig.labels = label;
        chartConfig.series = [
            {
                name: "Doanh số",
                data: value1,
                cursor: "pointer",
            },
        ];

        return chartConfig;
    }

    private chartGrowthPay(data): {} {
        const label = [];
        const value1 = [];
        const value2 = [];
        data.map((value) => {
            label.push(
                value.date
                    ? this._datetimePipe.transform(
                          new Date(value.date).getTime(),
                          "DD/MM/YYYY"
                      )
                    : ""
            );
            value1.push(value.value1);
            value2.push(value.value2);
        });
        let chartConfig = this.initChart();
        chartConfig.title.text = "Biểu đồ giải ngân và hoàn trả";
        chartConfig.labels = label;
        chartConfig.series = [
            {
                name: "Tổng tiền giải ngân",
                data: value1,
            },
            {
                name: "Tổng tiền hoàn trả",
                data: value2,
            },
        ];
        return chartConfig;
    }

    private initChart(): {
        plotOptions: { bar: { columnWidth: string } };
        legend: {
            offsetX: number;
            offsetY: number;
            horizontalAlign: string;
            floating: boolean;
            position: string;
        };
        tooltip: { followCursor: boolean; theme: string };
        title: {
            offsetX: number;
            margin: number;
            offsetY: number;
            floating: boolean;
            style: {
                fontFamily: undefined;
                color: string;
                fontSize: string;
                fontWeight: string;
            };
            text: string;
            align: string;
        };
        stroke: { width: number[] };
        yaxis: {
            labels: {
                formatter: (value: number) => string;
                offsetX: number;
                minWidth: number;
                style: { colors: string };
            };
        };
        colors: string[];
        labels: any[];
        states: { hover: { filter: { type: string; value: number } } };
        dataLabels: { enabled: boolean };
        xaxis: {
            axisTicks: { color: string };
            tooltip: { enabled: boolean };
            axisBorder: { show: boolean };
            labels: { style: { colors: string } };
        };
        series: any[];
        grid: {
            borderColor: string;
            row: { opacity: number; colors: string[] };
        };
        markers: { size: number };
        chart: {
            dropShadow: {
                color: string;
                top: number;
                left: number;
                blur: number;
                opacity: number;
                enabled: boolean;
            };
            toolbar: { show: boolean };
            zoom: { enabled: boolean };
            type: string;
            height: number;
        };
    } {
        let chartConfig = {
            title: {
                text: "X",
                align: "left",
                margin: 10,
                offsetX: 0,
                offsetY: 0,
                floating: false,
                style: {
                    fontSize: "14px",
                    fontWeight: "bold",
                    fontFamily: undefined,
                    color: "#263238",
                },
            },
            labels: [],
            series: [],
            chart: {
                height: 350,
                type: "line",
                dropShadow: {
                    enabled: true,
                    color: "#000",
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 0.2,
                },
                toolbar: {
                    show: false,
                },
                zoom: {
                    enabled: true,
                },
            },
            colors: ["#135EEC", "#16E176"],
            dataLabels: {
                enabled: true,
            },

            grid: {
                borderColor: "#e7e7e7",
                row: {
                    colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
                    opacity: 0.5,
                },
            },
            markers: {
                size: 1,
            },

            legend: {
                position: "top",
                horizontalAlign: "right",
                floating: true,
                offsetY: -25,
                offsetX: -5,
            },

            plotOptions: {
                bar: {
                    columnWidth: "50%",
                },
            },
            states: {
                hover: {
                    filter: {
                        type: "darken",
                        value: 0.75,
                    },
                },
            },
            stroke: {
                width: [3, 3],
            },
            tooltip: {
                followCursor: true,
                theme: "light",
            },
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    color: "var(--fuse-border)",
                },
                labels: {
                    formatter: (value: number): string => value + "",
                    style: {
                        colors: "var(--fuse-text-secondary)",
                    },
                },
                tooltip: {
                    enabled: false,
                },
            },
            yaxis: {
                labels: {
                    minWidth: 40,
                    formatter: (value: number): string =>
                        new CurrencyFormatPipe().transform(value, 3),
                    offsetX: -16,
                    style: {
                        colors: "var(--fuse-text-secondary)",
                    },
                },
            },
        };

        return chartConfig;
    }

    public hasPermissionApprove(permission: string): boolean {
        if (permission === "" || permission === "ALL") {
            return true;
        }
        let _p = false;
        permission.split(",").forEach((item: string) => {
            const strCheck = item + "_APPROVE";
            if (this._authService.authenticatedUser.roles.includes(strCheck)) {
                _p = true;
                return;
            }
        });
        return _p;
    }
}
