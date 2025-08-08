/* eslint-disable id-blacklist */
// export interface ISearchResponse {
//     errorCode?: string;
//     message?: string;
//     content: object[];
//     empty: boolean;
//     first: boolean;
//     last: boolean;
//     number: number;
//     numberOfElements: number;
//     pageable: object;
//     size: number;
//     sort: object;
//     totalElements: number;
//     totalPages: number;
// }

// export class DataSearchModel implements ISearchResponse {
//     public constructor(
//         public content: object[] = [],
//         public empty: boolean = false,
//         public first: boolean = false,
//         public last: boolean = false,
//         public number: number = 0,
//         public numberOfElements: number = 0,
//         public pageable: object = {},
//         public size: number = 0,
//         public sort: object = {},
//         public totalElements: number = 0,
//         public totalPages: number = 0
//     ) { }
// }

// export interface ISearchPayload {
//     page: number;
//     limit: number;
//     valSearch?: string | null;
// }

// export class SearchPayload implements ISearchPayload {
//     public constructor(
//         public page: number = 0,
//         public limit: number = 10,
//         public valSearch: string | null = null,
//     ) {
//     }
// }

// export interface BaseResponse {
//     errorCode?: string;
//     message?: string;
//     paramMessage?: string;
//     payload: any;
// }
