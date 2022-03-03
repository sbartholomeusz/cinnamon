import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Material UI
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Drag and drop
import {DragDropModule} from '@angular/cdk/drag-drop';

// App pages
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { EditMeetingAgendaComponent } from './pages/home/components/edit-meeting-agenda/edit-meeting-agenda.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { AgendaPrintPreviewComponent } from './pages/home/components/agenda-print-preview/agenda-print-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EditMeetingAgendaComponent,
    AboutComponent,
    AgendaPrintPreviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatDividerModule,
    MatFormFieldModule,
    MatStepperModule,
    MatSelectModule,
    MatTableModule,
    MatInputModule,
    MatDatepickerModule,
    HttpClientModule,
    MatNativeDateModule,
    DragDropModule,
    MatTooltipModule,
    MatSlideToggleModule
  ],
  providers: [
    {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
    {provide: MAT_DATE_LOCALE, useValue: 'en-AU'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
