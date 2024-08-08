import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TicketFormComponent } from '../ticket-form/ticket-form.component';
import { Ticket } from '../ticket';
import { TicketService } from '../ticket.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-add-ticket',
  standalone: true,
  imports: [TicketFormComponent, MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Add a New Ticket</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-ticket-form
          (formSubmitted)="addTicket($event)"
        ></app-ticket-form>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``,
})
export class AddTicketComponent {
  constructor(
    private router: Router,
    private ticketService: TicketService
  ) { }

  addTicket(ticket: Ticket) {
    this.ticketService.createTicket(ticket).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        alert('Failed to create ticket');
        console.error(error);
      },
    });
    this.ticketService.getTickets();
  }
}