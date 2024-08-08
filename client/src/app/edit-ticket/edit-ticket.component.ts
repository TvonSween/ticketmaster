import { Component, OnInit, WritableSignal } from '@angular/core';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Ticket } from '../ticket';
import { TicketService } from '../ticket.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-edit-ticket',
  standalone: true,
  imports: [TicketFormComponent, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Edit an Ticket</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-ticket-form
          [initialState]="ticket()"
          (formSubmitted)="editTicket($event)"
        ></app-ticket-form>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``,
})
export class EditTicketComponent implements OnInit {
  ticket = {} as WritableSignal<Ticket>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private ticketService: TicketService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('No id provided');
    }

    this.ticketService.getTicket(id!);
    this.ticket = this.ticketService.ticket$;
  }

  editTicket(ticket: Ticket) {
    this.ticketService
      .updateTicket(this.ticket()._id || '', ticket)
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          alert('Failed to update ticket');
          console.error(error);
        },
      });
  }
}