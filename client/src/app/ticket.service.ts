import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ticket } from './ticket';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private url = 'http://localhost:5200';
  tickets$ = signal<Ticket[]>([]);
  ticket$ = signal<Ticket>({} as Ticket);

  constructor(private httpClient: HttpClient) { }

  private refreshTickets() {
    this.httpClient.get<Ticket[]>(`${this.url}/tickets`)
      .subscribe(tickets => {
        this.tickets$.set(tickets);
      });
  }

  getTickets() {
    this.refreshTickets();
    return this.tickets$();
  }

  getTicket(id: string) {
    this.httpClient.get<Ticket>(`${this.url}/tickets/${id}`).subscribe(ticket => {
      this.ticket$.set(ticket);
      return this.ticket$();
    });
  }

  createTicket(ticket: Ticket) {
    return this.httpClient.post(`${this.url}/tickets`, ticket, { responseType: 'text' });
  }

  updateTicket(id: string, ticket: Ticket) {
    return this.httpClient.put(`${this.url}/tickets/${id}`, ticket, { responseType: 'text' });
  }

  deleteTicket(id: string) {
    return this.httpClient.delete(`${this.url}/tickets/${id}`, { responseType: 'text' });
  }
}
