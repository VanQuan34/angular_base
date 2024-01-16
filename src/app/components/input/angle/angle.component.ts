import { Component, ElementRef, EventEmitter, HostListener, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { MoWbInputNumberComponent } from '../number/input-number.component';

@Component({
  selector: 'mo-wb-components-input-angle',
  templateUrl: 'angle.component.html',
  styleUrls: ['angle.component.scss']
})

export class MoWbInputAngleComponent implements OnInit {

  eventMoveHandler: any;
  eventEndHandler: any;

  @ViewChild('input', { static: true })
  inputElRef!: MoWbInputNumberComponent;

  @ViewChild('boxAngle', { static: true })
  boxAngleElRef!: ElementRef<HTMLDivElement>;

  @ViewChild('rotate', { static: true })
  rotateElRef!: ElementRef<HTMLDivElement>;

  get boxAngle(): HTMLDivElement {
    return this.boxAngleElRef.nativeElement;
  }

  get rotateBtn(): HTMLDivElement {
    return this.rotateElRef.nativeElement;
  }

  @Input('deg') set degDefault(value: number) {
    this.boxAngle.style.transform = `rotate(${value}deg)`;
    this.inputElRef.setValue(value);
  }
  @Output() onValueChange = new EventEmitter<any>();

  private destroy$ = new Subject<void>();

  constructor(
    private _element: ElementRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.handleRotating();
    // this.boxAngle.style.transform = `rotate(90deg)`;
    // this.inputElRef.setValue(90);
  }

  rotatePointer(e: any, pointerBox: any, centers: Array<any>) {
    var pointerEvent = e, mouseX = 0, mouseY = 0;
    if (e.targetTouches && e.targetTouches[0]) {
      e.preventDefault();
      pointerEvent = e.targetTouches[0];
      mouseX = pointerEvent.pageX;
      mouseY = pointerEvent.pageY;
    } else {
      mouseX = e.clientX,
      mouseY = e.clientY;
    }

    var centerY = pointerBox.top + parseInt(centers[1]) - window.pageYOffset,
      centerX = pointerBox.left + parseInt(centers[0]) - window.pageXOffset,
      radians = Math.atan2(mouseX - centerX, mouseY - centerY),
      degrees = Math.round((radians * (180 / Math.PI) * -1) + 180);

    this.boxAngle.style.transform = `rotate(${degrees}deg)`;
    // this.rotateBtn.style.transform = `rotate(${-degrees}deg)`;
    this.inputElRef.setValue(degrees);
    this.onValueChange.emit(degrees);
  }

  handleRotating(): void {
    this.ngZone.runOutsideAngular(() => {
      this.rotateBtn!.addEventListener(
        'mousedown',
        (event) => {
          this.eventMoveHandler = (event: any) => {
            const pointerBox = this._element.nativeElement.getBoundingClientRect(),
              centerPoint = window.getComputedStyle(this.boxAngle).transformOrigin,
              centers = centerPoint.split(" ");
            this.rotatePointer(event, pointerBox, centers);
          };

          this.eventEndHandler = () => {
            window.removeEventListener('mousemove', this.eventMoveHandler, false);
            window.removeEventListener('mouseup', this.eventEndHandler);
          };

          window.addEventListener('mousemove', this.eventMoveHandler, false);
          window.addEventListener('mouseup', this.eventEndHandler, false);
        },
        false
      );
    });
  }

  handleValueChange(event: any) {
    let deg = event;
    if (deg <= 0) {
      deg = 0;
    } else if (deg >= 360) {
      deg = 360
    }
    this.inputElRef.setValue(deg);
    this.boxAngle.style.transform = `rotate(${deg}deg)`;
    this.onValueChange.emit(deg);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
