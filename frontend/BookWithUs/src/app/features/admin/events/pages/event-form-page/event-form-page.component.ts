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

  categories: CategoryDto[] = [];
  venues: VenueDto[] = [];

  eventForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    categoryId: [1, [Validators.required]],
    venueId: [1, [Validators.required]],
    eventDate: ['2026-10-24', [Validators.required]],
    startTime: ['19:30', [Validators.required]],
    endTime: ['23:00', [Validators.required]],
    baseTicketPrice: [85.00, [Validators.required, Validators.min(1)]],
    posterImageUrl: ['https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80', [Validators.required]],
    description: ['', [Validators.required, Validators.minLength(20)]],
    stageLayout: ['EndStage'] // 'EndStage' | 'CenterStage' | 'Theatre'
  });

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(res => this.categories = res);
    this.venueService.getVenues().subscribe(res => this.venues = res);

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.eventId = Number(id);
      this.loadEvent(this.eventId);
    }
  }

  loadEvent(id: number): void {
    this.eventService.getEventById(id).subscribe({
      next: (ev) => {
        this.eventForm.patchValue({
          title: ev.title,
          categoryId: ev.categoryId,
          venueId: ev.venueId,
          eventDate: ev.eventDate.split('T')[0],
          baseTicketPrice: ev.baseTicketPrice,
          posterImageUrl: ev.posterImageUrl,
          description: ev.description
        });
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      this.eventForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formVal = this.eventForm.value;

    const op = this.isEditMode && this.eventId
      ? this.eventService.updateEvent(this.eventId, formVal)
      : this.eventService.createEvent(formVal);

    op.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/events']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Failed to save event.';
      }
    });
  }
}
