import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VenueService } from '../../../../../core/services/venues/venue.service';
import { AlertBannerComponent } from '../../../../../shared/components/alert-banner/alert-banner.component';

@Component({
  selector: 'app-venue-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AlertBannerComponent],
  templateUrl: './venue-form-page.component.html',
  styleUrls: ['./venue-form-page.component.css']
})
export class VenueFormPageComponent implements OnInit {
  private venueService = inject(VenueService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  venueId: number | null = null;
  isLoading = false;
  errorMessage = '';

  venue = {
    name: '',
    address: '',
    totalCapacity: 1000,
    isActive: true
  };

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.venueId = Number(id);
      this.loadVenue(this.venueId);
    }
  }

  loadVenue(id: number): void {
    this.isLoading = true;
    this.venueService.getVenueById(id).subscribe({
      next: (v) => {
        this.venue.name = v.name;
        this.venue.address = v.address || v.location || '';
        this.venue.totalCapacity = v.totalCapacity || v.capacity || 1000;
        this.venue.isActive = v.isActive ?? true;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.message || 'Failed to load venue.';
      }
    });
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      Object.keys(form.controls).forEach(key => form.controls[key].markAsTouched());
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const payload = {
      name: this.venue.name.trim(),
      address: this.venue.address.trim(),
      totalCapacity: Number(this.venue.totalCapacity)
    };

    const op = this.isEditMode && this.venueId
      ? this.venueService.updateVenue(this.venueId, payload)
      : this.venueService.createVenue(payload);

    op.subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/admin/venues']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.message || 'Failed to save venue.';
      }
    });
  }
}
