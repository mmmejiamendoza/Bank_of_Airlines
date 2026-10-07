import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Sidebar } from '../sidebar/sidebar';
import { Toast } from '../../shared/ui/toast/toast';

@Component({
  selector: 'app-shell',
  imports: [Navbar, Sidebar, RouterOutlet, Toast],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell {
  readonly sidebarOpen = signal(true);

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }
}
