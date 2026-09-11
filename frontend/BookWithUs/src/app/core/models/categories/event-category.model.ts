export interface CategoryDto {
  id: number;
  categoryId?: number;
  name: string;
  description?: string;
  eventCount?: number;
  eventsCount?: number;
  activeEventCount?: number;
  isActive?: boolean;
  createdAtUtc?: string;
}

export type EventCategory = CategoryDto;

export * from './create-category-request.model';
export * from './update-category-request.model';
