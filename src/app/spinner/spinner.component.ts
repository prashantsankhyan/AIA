import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
// @ViewChild('backgroundVideo') backgroundVideo!: ElementRef<HTMLVideoElement>;
//      private userInteracted = false;

//      ngAfterViewInit(): void {
//          const video = this.backgroundVideo.nativeElement;
     
//          // Start muted autoplay
//          video.muted = true;
//          video.play().catch(err => {
//            console.warn('Initial autoplay failed:', err);
//          });
     
//          // Replay video every 5 seconds
//          setInterval(() => {
//            video.currentTime = 0;
//            video.play().catch(err => {
//              console.warn('Replay failed:', err);
//            });
//          }, 4000);
//        }
     
      
//          @HostListener('window:mousemove')
//        @HostListener('window:click')
//        @HostListener('window:keydown')
//        @HostListener('window:touchstart')
//        onUserInteraction() {
//          if (!this.userInteracted) {
//            this.userInteracted = true;
//            const video = this.backgroundVideo.nativeElement;
//            video.muted = false;  // Unmute on first user interaction
//            video.play().catch(err => {
//              console.warn('Play after interaction failed:', err);
//            });
//            console.log('Video unmuted and played after user interaction');
//          }
//        }
}
