import { Component } from '@angular/core';
import { CardStacks } from '../card-stacks/card-stacks';

@Component({
  selector: 'app-about',
  imports: [CardStacks],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {}
