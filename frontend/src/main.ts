import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config'; // ✅ Import your central config

bootstrapApplication(AppComponent, appConfig); // ✅ Use the full config
