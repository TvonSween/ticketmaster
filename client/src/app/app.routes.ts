import { Routes } from '@angular/router';
import { TicketsListComponent } from './tickets-list/tickets-list.component';
import { AddTicketComponent } from './add-ticket/add-ticket.component';
import { EditTicketComponent } from './edit-ticket/edit-ticket.component';

export const routes: Routes = [
    { path: '', component: TicketsListComponent, title: 'Ticketmaster' },
    { path: 'new', component: AddTicketComponent },
    { path: 'edit/:id', component: EditTicketComponent },
];
