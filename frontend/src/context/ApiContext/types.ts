export type ApiLibTable = "artists" | "musics";

export type ApiLibError = {
  status: number;
  message: string;
};

export type ApiLibResponse<T = unknown> = {
  data: T | null;
  error: ApiLibError | null;
};

export type ApiLibSelectOptions = {
  limit?: number;
  orderBy?: {
    column: string;
    ascending?: "asc" | "desc";
  };
  like?: {
    column: string;
    value: string;
  };
  eq?: {
    column: "id";
    value: string;
  };
};

export interface ApiContextProps {
  libApi: {
    from: (table: ApiLibTable) => {
      select: <T = unknown>(
        column: string,
        options?: ApiLibSelectOptions,
      ) => Promise<ApiLibResponse<T>>;
      insert: () => void;
      update: (id: string) => void;
      delete: (id: string) => void;
    };
  };
}
