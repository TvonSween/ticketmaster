import { Component, effect, EventEmitter, input, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { Ticket } from '../ticket';

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatButtonModule,
  ],
  styles: `
    .ticket-form {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 2rem;
    }
    .mat-mdc-radio-button ~ .mat-mdc-radio-button {
      margin-left: 16px;
    }
    .mat-mdc-form-field {
      width: 100%;
    }
  `,
  template: `
    <form
      class="ticket-form"
      autocomplete="off"
      [formGroup]="ticketForm"
      (submit)="submitForm()"
    >

    <mat-form-field>
        <mat-label>Id</mat-label>
        <input matInput placeholder="Id" formControlName="id" required />
        @if (id.invalid) {
        <mat-error>Id not valid.</mat-error>
        }
      </mat-form-field>
      <mat-form-field>
        <mat-label>Name</mat-label>
        <input matInput placeholder="Name" formControlName="name" required />
        @if (name.invalid) {
        <mat-error>Name must be at least 3 characters long.</mat-error>
        }
      </mat-form-field>

      <br />
      <button
        mat-raised-button
        color="primary"
        type="submit"
        [disabled]="ticketForm.invalid"
      >
        Add
      </button>
    </form>
  `,
})
export class TicketFormComponent {
  initialState = input<Ticket>();

  @Output()
  formValuesChanged = new EventEmitter<Ticket>();

  @Output()
  formSubmitted = new EventEmitter<Ticket>();

  ticketForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor(private formBuilder: FormBuilder) {
    effect(() => {
      this.ticketForm.setValue({
        name: this.initialState()?.name || '',
      });
    });
  }

  get name() {
    return this.ticketForm.get('name')!;
  }

  submitForm() {
    this.formSubmitted.emit(this.ticketForm.value as Ticket);
  }
}