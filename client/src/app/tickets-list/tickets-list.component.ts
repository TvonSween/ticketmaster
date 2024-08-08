import { Component, OnInit, WritableSignal } from '@angular/core';
import { Ticket } from '../ticket';
import { TicketService } from '../ticket.service';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-tickets-list',
  standalone: true,
  imports: [RouterModule, MatTableModule, MatButtonModule, MatCardModule],
  styles: [
    `
      table {
        width: 100%;

        button:first-of-type {
          margin-right: 1rem;
        }
      }
    `,
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Tickets List</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="tickets$()">
         <ng-container matColumnDef="col-id">
            <th mat-header-cell *matHeaderCellDef>Id</th>
            <td mat-cell *matCellDef="let element">{{ element.id }}</td>
          </ng-container>
          <ng-container matColumnDef="col-name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let element">{{ element.name }}</td>
          </ng-container>
          <ng-container matColumnDef="col-action">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let element">
              <button mat-raised-button [routerLink]="['edit/', element._id]">
                Edit
              </button>
              <button
                mat-raised-button
                color="warn"
                (click)="deleteTicket(element._id || '')"
              >
                Delete
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" [routerLink]="['new']">
          Add a New Ticket
        </button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class TicketsListComponent implements OnInit {
  tickets$ = {} as WritableSignal<Ticket[]>;
  displayedColumns: string[] = [
    'col-id',
    'col-name',
    'col-action',
  ];

  constructor(private ticketsService: TicketService) { }

  ngOnInit() {
    this.fetchTickets();
  }

  deleteTicket(id: string): void {
    this.ticketsService.deleteTicket(id).subscribe({
      next: () => this.fetchTickets(),
    });
  }

  private fetchTickets(): void {
    this.tickets$ = this.ticketsService.tickets$;
    this.ticketsService.getTickets();
  }
}