// src/store/slices/tourismSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/apiClient";

// ----- types -----
export interface SimplePlace {
  id: number | string; // รองรับทั้ง number (TAT) และ string (local_xxx)
  name: string | null;
  introduction: string | null;
  thumbnail: string | null;
  province: string | null;
  district: string | null;
  subDistrict: string | null;
  latitude: number | null;
  longitude: number | null;
  tags: string[];
  isLocal?: boolean; // flag สำหรับแยกข้อมูล local
}

interface PaginationPayload {
  pageNumber?: number; // normalized by backend
  pageSize?: number;
  total?: number;
  totalPage?: number;
}

interface FetchResponse {
  items: SimplePlace[];
  pagination?: PaginationPayload | null;
  query?: any;
}

interface FetchParams {
  keyword?: string;
  provinceId?: number;
  categoryId?: number;
  page?: number;
  limit?: number; // << ใส่ limit ได้เพื่อคุมจำนวนต่อหน้า
}

interface TourismState {
  items: SimplePlace[];
  loading: boolean;
  error: string | null;

  keyword: string;
  provinceId: number | null;
  categoryId: number | null;

  page: number;
  totalPage: number;
}

const initialState: TourismState = {
  items: [],
  loading: false,
  error: null,

  keyword: "",
  provinceId: null,
  categoryId: null,

  page: 1,
  totalPage: 1,
};

// ----- thunk -----
export const fetchTTD = createAsyncThunk<FetchResponse, FetchParams | undefined>(
  "tourism/fetchTTD",
  async (params) => {
    const res = await api.getTTD(params);
    return res as FetchResponse; // { items, pagination, query }
  }
);

// ----- slice -----
const tourismSlice = createSlice({
  name: "tourism",
  initialState,
  reducers: {
    setKeyword(state, action: PayloadAction<string | undefined>) {
      state.keyword = action.payload ?? "";
    },
    setProvinceId(state, action: PayloadAction<number | null | undefined>) {
      state.provinceId = action.payload ?? null;
    },
    setCategoryId(state, action: PayloadAction<number | null | undefined>) {
      state.categoryId = action.payload ?? null;
    },
    setPage(state, action: PayloadAction<number | undefined>) {
      state.page = action.payload ?? 1;
    },
    // ตัวเลือก: รีเซ็ตผลลัพธ์เมื่อเริ่มค้นหาใหม่ (เรียกใช้ได้จากหน้า Explore หลังเปลี่ยนเงื่อนไข)
    resetItems(state) {
      state.items = [];
      state.page = 1;
      state.totalPage = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTTD.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTTD.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload ?? { items: [], pagination: null };
        state.items = Array.isArray(payload.items) ? payload.items : [];

        const pg = (payload.pagination ?? {}) as PaginationPayload;

        // อัปเดตหน้าและจำนวนหน้าจาก backend (มีค่าแล้วจะไม่ติด 1/1)
        const nextPage =
          typeof pg.pageNumber === "number" && pg.pageNumber > 0
            ? pg.pageNumber
            : state.page || 1;
        const nextTotalPage =
          typeof pg.totalPage === "number" && pg.totalPage > 0
            ? pg.totalPage
            : 1;

        state.page = nextPage;
        state.totalPage = nextTotalPage;

        state.error = null;
      })
      .addCase(fetchTTD.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.error?.message as string) || "Fetch failed";
      });
  },
});

export const {
  setKeyword,
  setProvinceId,
  setCategoryId,
  setPage,
  resetItems,
} = tourismSlice.actions;

const tourismReducer = tourismSlice.reducer;
export default tourismReducer;
