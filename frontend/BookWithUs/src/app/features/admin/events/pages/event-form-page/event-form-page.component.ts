import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../../../../core/services/events/event.service';
import { CategoryService } from '../../../../../core/services/categories/category.service';
import { VenueService } from '../../../../../core/services/venues/venue.service';
import { CategoryDto } from '../../../../../core/models/categories/category.model';
import { VenueDto } from '../../../../../core/models/venues/venue.model';
import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';
import { AlertBannerComponent } from '../../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-event-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormErrorComponent, AlertBannerComponent],
  templateUrl: './event-form-page.component.html',
  styleUrls: ['./event-form-page.component.css']
})
export class EventFormPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private eventService = inject(EventService);
  private categoryService = inject(CategoryService);
  private venueService = inject(VenueService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  eventId: number | null = null;
  isLoading = false;
  errorMessage = '';
  selectedPosterFile: File | null = null;
  posterPreviewUrl: string | null = null;

  categories: CategoryDto[] = [];
  venues: VenueDto[] = [];

  eventForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    categoryId: [null, [Validators.required]],
    venueId: [null, [Validators.required]],
    eventDate: ['2026-10-24', [Validators.required]],
    startTime: ['19:30', [Validators.required]],
    endTime: ['23:00', [Validators.required]],
    ticketPrice: [3500, [Validators.required, Validators.min(0)]],
    capacity: [1000, [Validators.required, Validators.min(1)]],
    description: ['', [Validators.maxLength(3000)]],
    stageLayout: ['EndStage']
  });

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(res => {
      this.categories = res;
      if (!this.eventForm.get('categoryId')?.value && res.length > 0) {
        this.eventForm.patchValue({ categoryId: res[0].id });
      }
    });

    this.venueService.getVenues().subscribe(res => {
      this.venues = res;
      if (!this.eventForm.get('venueId')?.value && res.length > 0) {
        this.eventForm.patchValue({
          venueId: res[0].id,
          capacity: res[0].totalCapacity || res[0].capacity || 1000
        });
      }
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.eventId = Number(id);
      this.loadEvent(this.eventId);
    }
  }

  loadEvent(id: number): void {
    this.isLoading = true;
    this.eventService.getEventById(id).subscribe({
      next: (ev) => {
        this.eventForm.patchValue({
          name: ev.name || ev.title,
          categoryId: ev.categoryId,
          venueId: ev.venueId,
          eventDate: ev.eventDate ? ev.eventDate.split('T')[0] : '',
          startTime: ev.startTime ? ev.startTime.slice(0, 5) : '19:00',
          endTime: ev.endTime ? ev.endTime.slice(0, 5) : '23:00',
          ticketPrice: ev.ticketPrice ?? ev.baseTicketPrice ?? 1000,
          capacity: ev.capacity ?? ev.totalSeats ?? 1000,
          stageLayout: ev.stageLayout || 'EndStage',
          description: ev.description || ''
        });
        if (ev.posterUrl || ev.posterImageUrl) {
          this.posterPreviewUrl = ev.posterUrl || ev.posterImageUrl || null;
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.message || 'Failed to load event details.';
      }
    });
  }

  onVenueChange(): void {
    const venueId = Number(this.eventForm.get('venueId')?.value);
    const selected = this.venues.find(v => v.id === venueId);
    if (selected && !this.isEditMode) {
      this.eventForm.patchValue({ capacity: selected.totalCapacity || selected.capacity || 1000 });
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedPosterFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.posterPreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedPosterFile);
    }
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const formVal = this.eventForm.value;

    const formData = new FormData();
    formData.append('Name', formVal.name.trim());
    formData.append('Description', (formVal.description || '').trim());
    formData.append('VenueId', formVal.venueId.toString());
    formData.append('CategoryId', formVal.categoryId.toString());
    formData.append('EventDate', formVal.eventDate);
    formData.append('StartTime', formVal.startTime.length === 5 ? formVal.startTime + ':00' : formVal.startTime);
    formData.append('EndTime', formVal.endTime.length === 5 ? formVal.endTime + ':00' : formVal.endTime);
    formData.append('TicketPrice', formVal.ticketPrice.toString());
    formData.append('Capacity', formVal.capacity.toString());
    if (formVal.stageLayout) {
      formData.append('StageLayout', formVal.stageLayout);
    }
    if (this.selectedPosterFile) {
      formData.append('Poster', this.selectedPosterFile, this.selectedPosterFile.name);
    }

    const op = this.isEditMode && this.eventId
      ? this.eventService.updateEvent(this.eventId, formData)
      : this.eventService.createEvent(formData);

    op.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/events']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.message || 'Failed to save event.';
      }
    });
  }
}
