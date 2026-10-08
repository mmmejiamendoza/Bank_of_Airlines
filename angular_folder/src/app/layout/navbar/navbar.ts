import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  readonly title = input('Bank of Airlines');
  readonly menuOpen = input(false);
  readonly menuToggled = output<void>();
}
