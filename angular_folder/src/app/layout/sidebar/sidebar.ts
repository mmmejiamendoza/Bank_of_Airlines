import { Component, computed, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

export interface SidebarLink {
  label: string;
  path: string;
  icon: string;
  enabled: boolean; // set to true when the page and its route exist
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  readonly open = input(false);
  readonly userName = input('');
  readonly closeRequested = output<void>();

  readonly links = input<SidebarLink[]>([
    { path: '/dashboard',    label: 'Dashboard',    icon: 'images/nav-home.png',         enabled: true },
    { path: '/profile',      label: 'Profile',      icon: 'images/nav-profile.png',      enabled: false },
    { path: '/transactions', label: 'Transactions', icon: 'images/nav-transactions.png', enabled: true },
    { path: '/help',         label: 'Help',         icon: 'images/nav-help.png',         enabled: false },
  ]);

  readonly initial = computed(() => this.userName().trim().charAt(0).toUpperCase() || '?');
}