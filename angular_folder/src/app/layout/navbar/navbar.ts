import { Component, computed, input, output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  readonly title = input('Bank of Airlines');
  readonly menuOpen = input(false);
  readonly userName = input('');
  readonly userId = input('');
  readonly menuToggled = output<void>();

  readonly initial = computed(() => this.userName().trim().charAt(0).toUpperCase() || '?');
}