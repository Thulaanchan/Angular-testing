export interface EventQueryDto {
  search?: string;
  venue?: number;
  category?: number;
  date?: string;
  time?: string;
  page?: number;
  pageSize?: number;
  includePast?: boolean;
}

export type EventFilter = EventQueryDto;
