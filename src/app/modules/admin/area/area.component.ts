import {Component, OnInit} from '@angular/core';
import {AdmCategoriesDTO} from 'app/models/admin';
import {FuseNavigationItem} from "../../../../@fuse/components/navigation";
import {ROUTER_CONST} from "../../../shared/constants";
import {AreaService} from "../../../service/admin/area.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-category',
    templateUrl: './area.component.html',
    styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {
    public areaLst: FuseNavigationItem[];
    /**
     *
     * @param _areaService
     * @param router
     */
    constructor(private _areaService: AreaService, private router: Router) {
        this.router.navigate([`${ROUTER_CONST.config.admin.area.link}/province`]);
    }

    ngOnInit(): void {
        this.areaLst = [{
            title: 'Quản lý địa bàn',
            type: 'group',
            groupLink: `${ROUTER_CONST.config.admin.area.link}/province`,
            children: []
        }];

        this._areaService.allProvinces$.subscribe((res) => {
            if (res) {
                this.areaLst.forEach(province => {
                    res.forEach((admCategoriesDTO: AdmCategoriesDTO) => {

                        province.children.push({
                            title: admCategoriesDTO.categoriesName,
                            type: 'collapsable',
                            link: `${ROUTER_CONST.config.admin.area.link}/province/` + admCategoriesDTO.categoriesCode,
                            parentCode: 'province',
                            parentId: admCategoriesDTO.admCategoriesId,
                            code: admCategoriesDTO.categoriesCode,
                        })
                    })
                })
            }
        });
    }
}
