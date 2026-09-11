import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VenueService } from '../../../../../core/services/venues/venue.service';
import { FormErrorComponent } from '../../../../../shared/components/form-error/form-error.component';
import { AlertBannerComponent } from '../../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-venue-form-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormErrorComponent, AlertBannerComponent],
  templateUrl: './venue-form-page.component.html',
  styleUrls: ['./venue-form-page.component.css']
})
export class VenueFormPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private venueService = inject(VenueService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  venueId: number | null = null;
  isLoading = false;
  errorMessage = '';

  venueForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    location: ['', [Validators.required, Validators.minLength(5)]],
    capacity: [1000, [Validators.required, Validators.min(10)]],
    parkingCapacity: [60, [Validators.required, Validators.min(0)]],
    isActive: [true]
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.venueId = Number(id);
      this.loadVenue(this.venueId);
    }
  }

  loadVenue(id: number): void {
    this.venueService.getVenueById(id).subscribe({
      next: (venue) => {
        this.venueForm.patchValue({
          name: venue.name,
          location: venue.location,
          capacity: venue.capacity,
          parkingCapacity: venue.parkingCapacity || 60,
          isActive: venue.isActive
        });
      }
    });
  }

  onSubmit(): void {
    if (this.venueForm.invalid) {
      this.venueForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formVal = this.venueForm.value;

    const op = this.isEditMode && this.venueId
      ? this.venueService.updateVenue(this.venueId, formVal)
      : this.venueService.createVenue(formVal);

    op.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/venues']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Failed to save venue.';
      }
    });
  }
}
