import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from '../app-header/app-header';
import { AppSidebar } from '../app-sidebar/app-sidebar';
import { BottomNav } from '../bottom-nav/bottom-nav';

@Component({
  selector: 'lib-app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AppHeader, AppSidebar, BottomNav, RouterOutlet],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {}
