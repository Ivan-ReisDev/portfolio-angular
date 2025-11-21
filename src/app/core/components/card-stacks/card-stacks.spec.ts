import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardStacks } from './card-stacks';

describe('CardStacks', () => {
  let component: CardStacks;
  let fixture: ComponentFixture<CardStacks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardStacks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardStacks);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
