import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
  PLATFORM_ID,
  signal,
  computed,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  state,
  AnimationEvent,
} from '@angular/animations';

type NoahSide = 'left' | 'right';
type NoahEntrance = 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'pop';

type PopupPosition = 'above' | 'below';

type SectionConfig = {
  message: string;
  delay: number;
  duration: number;
  top: string;
  bottom: string;
  left: string;
  right: string;
  side: NoahSide;
  entrance: NoahEntrance;
  popup: PopupPosition;
};

type QuickAction = {
  label: string;
  icon: string;
  action: string;
};

const SECTION_CONFIGS: Record<string, SectionConfig> = {
  inicio: {
    message: 'E aí! Sou o Noah, bem-vindo ao nosso espaço. Fica à vontade pra explorar e qualquer coisa me chama!',
    delay: 3000,
    duration: 8000,
    top: 'auto', bottom: '30px', left: 'auto', right: '30px',
    side: 'right',
    entrance: 'slide-right',
    popup: 'above',
  },
  sobre: {
    message: 'Aqui você conhece um pouco mais sobre nós. Curtiu? Bora trocar uma ideia!',
    delay: 2000,
    duration: 7000,
    top: 'auto', bottom: '80px', left: '100px', right: 'auto',
    side: 'left',
    entrance: 'slide-left',
    popup: 'above',
  },
  projetos: {
    message: 'Esses são alguns dos nossos trabalhos. Podemos criar algo incrível juntos também!',
    delay: 2000,
    duration: 7000,
    top: '140px', bottom: 'auto', left: 'auto', right: '40px',
    side: 'right',
    entrance: 'slide-down',
    popup: 'below',
  },
  progresso: {
    message: 'Nossa jornada até aqui. Estamos sempre evoluindo pra entregar o melhor!',
    delay: 2000,
    duration: 7000,
    top: '140px', bottom: 'auto', left: '100px', right: 'auto',
    side: 'left',
    entrance: 'slide-up',
    popup: 'below',
  },
  contato: {
    message: 'Chegou até aqui? Manda uma mensagem pra gente, adoramos conhecer novos projetos!',
    delay: 1000,
    duration: 8000,
    top: 'auto', bottom: '100px', left: '50%', right: 'auto',
    side: 'right',
    entrance: 'pop',
    popup: 'above',
  },
};

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Vamos trabalhar juntos', icon: 'fas fa-handshake', action: 'contact' },
  { label: 'Ver nossos projetos', icon: 'fas fa-laptop-code', action: 'projects' },
  { label: 'Chamar no WhatsApp', icon: 'fab fa-whatsapp', action: 'whatsapp' },
];

const CHAT_RESPONSES: Record<string, string> = {
  contact: 'Boa! Vou te levar pro nosso formulário. Conta pra gente sobre o seu projeto que respondemos rapidinho!',
  projects: 'Bora dar uma olhada no que já construímos. Quem sabe o próximo não é o seu?',
  whatsapp: 'Abrindo o WhatsApp pra você falar direto com a gente!',
};

const ENTRANCE_TRANSFORMS: Record<NoahEntrance, string> = {
  'slide-left': 'translateX(-140px) scale(0.5)',
  'slide-right': 'translateX(140px) scale(0.5)',
  'slide-up': 'translateY(120px) scale(0.5)',
  'slide-down': 'translateY(-120px) scale(0.5)',
  'pop': 'scale(0) rotate(-20deg)',
};

@Component({
  selector: 'app-noah',
  imports: [],
  templateUrl: './noah.html',
  styleUrl: './noah.scss',
  animations: [
    trigger('noahPresence', [
      transition(':enter', [
        style({ opacity: 0, transform: '{{enterTransform}}' }),
        animate('650ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'translateX(0) translateY(0) scale(1) rotate(0deg)' })),
      ], { params: { enterTransform: 'translateX(140px) scale(0.5)' } }),
      transition(':leave', [
        animate('350ms ease-in', style({ opacity: 0, transform: 'scale(0.3) translateY(20px)' })),
      ]),
    ]),
    trigger('bubbleAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px) scale(0.9)' }),
        animate('300ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px) scale(0.9)' })),
      ]),
    ]),
    trigger('chatAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8) translateY(20px)' }),
        animate('350ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.8) translateY(20px)' })),
      ]),
    ]),
    trigger('messageAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class Noah implements OnChanges, OnDestroy {
  @Input() activeSection = 'inicio';
  @Output() navigateTo = new EventEmitter<string>();

  private readonly platformId = inject(PLATFORM_ID);

  readonly showNoah = signal(false);
  readonly showBubble = signal(false);
  readonly bubbleText = signal('');
  readonly isChatOpen = signal(false);
  readonly chatMessages = signal<string[]>([]);
  readonly isBlinking = signal(false);
  readonly isWaving = signal(false);
  readonly quickActions = QUICK_ACTIONS;
  readonly hasInteracted = signal(false);
  readonly currentSide = signal<NoahSide>('right');
  readonly currentPopup = signal<PopupPosition>('above');
  readonly enterTransform = signal('translateX(140px) scale(0.5)');

  readonly currentConfig = signal<SectionConfig>(SECTION_CONFIGS['inicio']);

  readonly showQuickActions = computed(() => this.chatMessages().length <= 1);

  private bubbleTimer: ReturnType<typeof setTimeout> | null = null;
  private bubbleHideTimer: ReturnType<typeof setTimeout> | null = null;
  private blinkInterval: ReturnType<typeof setInterval> | null = null;
  private waveTimer: ReturnType<typeof setTimeout> | null = null;
  private entranceTimer: ReturnType<typeof setTimeout> | null = null;
  private dismissedSections = new Set<string>();
  private currentSection = '';
  private initialized = false;
  private pendingSection = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeSection'] && isPlatformBrowser(this.platformId)) {
      if (!this.initialized) {
        this.initialized = true;
        this.startBlinking();
        this.showInSection(this.activeSection, true);
      } else {
        this.moveToSection(this.activeSection);
      }
    }
  }

  ngOnDestroy(): void {
    this.clearAllTimers();
  }

  toggleChat(): void {
    this.isChatOpen() ? this.closeChat() : this.openChat();
  }

  openChat(): void {
    this.hasInteracted.set(true);
    this.hideBubble();
    this.isChatOpen.set(true);
    this.chatMessages.set([
      'Oi! Sou o Noah. Em que posso te ajudar? Estamos prontos pra transformar sua ideia em realidade!',
    ]);
  }

  closeChat(): void {
    this.isChatOpen.set(false);
    this.chatMessages.set([]);
  }

  onQuickAction(action: string): void {
    const response = CHAT_RESPONSES[action];
    if (response) {
      this.chatMessages.update((msgs) => [...msgs, response]);
    }

    setTimeout(() => {
      this.closeChat();
      switch (action) {
        case 'contact':
          this.navigateTo.emit('contato');
          break;
        case 'projects':
          this.navigateTo.emit('projetos');
          break;
        case 'whatsapp':
          window.open(
            'https://wa.me/5521985598348?text=Ol%C3%A1!%20Vim%20pelo%20seu%20site%20e%20gostaria%20de%20conversar%20sobre%20trabalharmos%20juntos.%20Podemos%20trocar%20uma%20ideia%3F',
            '_blank'
          );
          break;
      }
    }, 1500);
  }

  dismissBubble(): void {
    this.dismissedSections.add(this.currentSection);
    this.hideBubble();
  }

  onLeaveFinished(event: AnimationEvent): void {
    if (event.toState === 'void' && this.pendingSection) {
      const section = this.pendingSection;
      this.pendingSection = '';
      this.showInSection(section, false);
    }
  }

  private moveToSection(section: string): void {
    if (section === this.currentSection) return;
    if (this.isChatOpen()) this.closeChat();

    this.hideBubble();
    this.clearTimers();

    this.pendingSection = section;
    this.showNoah.set(false);
  }

  private showInSection(section: string, isFirst: boolean): void {
    this.currentSection = section;

    const config = SECTION_CONFIGS[section];
    if (!config) return;

    this.currentConfig.set(config);
    this.currentSide.set(config.side);
    this.currentPopup.set(config.popup);
    this.enterTransform.set(ENTRANCE_TRANSFORMS[config.entrance]);

    const delay = isFirst ? 800 : 50;
    this.entranceTimer = setTimeout(() => {
      this.showNoah.set(true);

      if (isFirst) {
        this.triggerWave();
      }

      this.scheduleBubble(section, config);
    }, delay);
  }

  private scheduleBubble(section: string, config: SectionConfig): void {
    if (this.dismissedSections.has(section)) return;

    this.bubbleTimer = setTimeout(() => {
      if (this.isChatOpen() || this.currentSection !== section) return;
      this.bubbleText.set(config.message);
      this.showBubble.set(true);

      this.bubbleHideTimer = setTimeout(() => {
        this.hideBubble();
      }, config.duration);
    }, config.delay);
  }

  private triggerWave(): void {
    this.isWaving.set(true);
    this.waveTimer = setTimeout(() => this.isWaving.set(false), 1200);
  }

  private hideBubble(): void {
    this.showBubble.set(false);
  }

  private clearTimers(): void {
    if (this.bubbleTimer) { clearTimeout(this.bubbleTimer); this.bubbleTimer = null; }
    if (this.bubbleHideTimer) { clearTimeout(this.bubbleHideTimer); this.bubbleHideTimer = null; }
    if (this.entranceTimer) { clearTimeout(this.entranceTimer); this.entranceTimer = null; }
    if (this.waveTimer) { clearTimeout(this.waveTimer); this.waveTimer = null; }
  }

  private clearAllTimers(): void {
    this.clearTimers();
    if (this.blinkInterval) { clearInterval(this.blinkInterval); this.blinkInterval = null; }
  }

  private startBlinking(): void {
    this.blinkInterval = setInterval(() => {
      this.isBlinking.set(true);
      setTimeout(() => this.isBlinking.set(false), 200);
    }, 4000);
  }
}
