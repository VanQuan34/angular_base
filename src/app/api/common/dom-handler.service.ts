import { Injectable } from '@angular/core';

@Injectable()
export class DomHandlerService {

	public static zIndex = 1000;

	private calculatedScrollBarWidth: number = 0;

	public checkScroll(bodyElement: any) {
		if (!bodyElement) {
			return null;
		}
		const element = bodyElement.nativeElement;
		if (element.scrollHeight > element.clientHeight) {
			return 4;
		}
		return 12;
	}

	public addClass(element: any, className: string): void {
		if (element.classList) {
			element.classList.add(className);
		} else {
			element.className += ' ' + className;
		}
	}

	public addMultipleClasses(element: any, className: string): void {
		if (element.classList) {
			const styles: string[] = className.split(' ');
			for (let i = 0; i < styles.length; i++) {
				element.classList.add(styles[i]);
			}

		} else {
			const styles: string[] = className.split(' ');
			for (let i = 0; i < styles.length; i++) {
				element.className += ' ' + styles[i];
			}
		}
	}

	public removeClass(element: any, className: string): void {
		if (element.classList) {
			element.classList.remove(className);
			return;
		}
		element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');

	}

	public hasClass(element: any, className: string): boolean {
		if (element.classList) {
			return element.classList.contains(className);
		}

		return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
	}

	public siblings(element: any): any {
		return Array.prototype.filter.call(element.parentNode.children, function (child) {
			return child !== element;
		});
	}

	public find(element: any, selector: string): any[] {
		return element.querySelectorAll(selector);
	}

	public findSingle(element: any, selector: string): any {
		return element.querySelector(selector);
	}

	public index(element: any): number {
		const children = element.parentNode.childNodes;
		let num = 0;
		for (let i = 0; i < children.length; i++) {
			if (children[i] === element) {
				return num;
			}
			if (children[i].nodeType === 1) {
				num++;
			}
		}
		return -1;
	}

	public relativePosition(element: any, target: any): void {
		let elementDimensions = { width: element.offsetWidth, height: element.offsetHeight };
		if (!element.offsetParent) {
			elementDimensions = this.getHiddenElementDimensions(element);
		}
		const targetHeight = target.offsetHeight;
		const targetWidth = target.offsetWidth;
		const targetOffset = target.getBoundingClientRect();
		const viewport = this.getViewport();
		let top = targetHeight;
		let left = 0;

		if ((targetOffset.top + targetHeight + elementDimensions.height) > viewport.height) {
			top = -1 * (elementDimensions.height);
			if (targetOffset.top + top < 0) {
				top = 0;
			}
		}

		if ((targetOffset.left + elementDimensions.width) > viewport.width) {
			left = targetWidth - elementDimensions.width;
		}

		element.style.top = top + 'px';
		element.style.left = left + 'px';
	}

	public absolutePosition(element: any, target: any): void {
		let elementDimensions = { width: element.offsetWidth, height: element.offsetHeight };
		if (!element.offsetParent) {
			elementDimensions = this.getHiddenElementDimensions(element);
		}
		const elementOuterHeight = elementDimensions.height;
		const elementOuterWidth = elementDimensions.width;
		const targetOuterHeight = target.offsetHeight;
		const targetOuterWidth = target.offsetWidth;
		const targetOffset = target.getBoundingClientRect();
		const windowScrollTop = this.getWindowScrollTop();
		const windowScrollLeft = this.getWindowScrollLeft();
		const viewport = this.getViewport();
		let top = targetOuterHeight + targetOffset.top + windowScrollTop;
		let left = targetOffset.left + windowScrollLeft;

		if (targetOffset.top + targetOuterHeight + elementOuterHeight > viewport.height) {
			top = targetOffset.top + windowScrollTop - elementOuterHeight;
			if (top < 0) {
				top = 0 + windowScrollTop;
			}
		}

		if (targetOffset.left + targetOuterWidth + elementOuterWidth > viewport.width) {
			left = targetOffset.left + windowScrollLeft + targetOuterWidth - elementOuterWidth;
		}

		element.style.top = top + 'px';
		element.style.left = left + 'px';
	}

	public getHiddenElementOuterHeight(element: any): number {
		element.style.visibility = 'hidden';
		element.style.display = 'block';
		const elementHeight = element.offsetHeight;
		element.style.display = 'none';
		element.style.visibility = 'visible';

		return elementHeight;
	}

	public getHiddenElementOuterWidth(element: any): number {
		element.style.visibility = 'hidden';
		element.style.display = 'block';
		const elementWidth = element.offsetWidth;
		element.style.display = 'none';
		element.style.visibility = 'visible';

		return elementWidth;
	}

	public getHiddenElementDimensions(element: any): any {
		const dimensions: any = {};
		element.style.visibility = 'hidden';
		element.style.display = 'block';
		dimensions.width = element.offsetWidth;
		dimensions.height = element.offsetHeight;
		element.style.display = 'none';
		element.style.visibility = 'visible';

		return dimensions;
	}

	public scrollInView(container: any, item: any) {
		const borderTopValue: string = getComputedStyle(container).getPropertyValue('borderTopWidth');
		const borderTop: number = borderTopValue ? parseFloat(borderTopValue) : 0;
		const paddingTopValue: string = getComputedStyle(container).getPropertyValue('paddingTop');
		const paddingTop: number = paddingTopValue ? parseFloat(paddingTopValue) : 0;
		const containerRect = container.getBoundingClientRect();
		const itemRect = item.getBoundingClientRect();
		const mRectTop = (itemRect.top + document.body.scrollTop);
		const mConRectTop = (containerRect.top + document.body.scrollTop);
		const offset = mRectTop - mConRectTop - borderTop - paddingTop;
		const scroll = container.scrollTop;
		const elementHeight = container.clientHeight;
		const itemHeight = this.getOuterHeight(item);

		if (offset < 0) {
			container.scrollTop = scroll + offset;
			return;
		}
		if ((offset + itemHeight) > elementHeight) {
			container.scrollTop = scroll + offset - elementHeight + itemHeight;
		}
	}

	public fadeIn(element: any, duration: number): void {
		element.style.opacity = 0;

		let last = +new Date();
		let opacity = 0;
		const tick = () => {
			opacity = +element.style.opacity + (new Date().getTime() - last) / duration;
			element.style.opacity = opacity;
			last = +new Date();

			if (+opacity < 1) {
				requestAnimationFrame(tick);
			}
		};

		tick();
	}

	public fadeOut(element: any, ms: any) {
		const interval = 50;
		const duration = ms;
		const gap = interval / duration;
		let opacity = 1;
		const fading = setInterval(() => {
			opacity = opacity - gap;

			if (opacity <= 0) {
				opacity = 0;
				clearInterval(fading);
			}

			element.style.opacity = opacity;
		}, interval);
	}

	public getWindowScrollTop(): number {
		const doc = document.documentElement;
		return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
	}

	public getWindowScrollLeft(): number {
		const doc = document.documentElement;
		return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
	}

	public matches(element: any, selector: string): boolean {
		const p: any = Element.prototype;
		// const f = p['matches'] || p.webkitMatchesSelector || p['mozMatchesSelector'] || p.msMatchesSelector || function (s) {
		// 	return [].indexOf.call(document.querySelectorAll(s), this) !== -1;
		// };
		// return f.call(element, selector);
		return false;
	}

	public getOuterWidth(el: any, margin?: any) {
		let width = el.offsetWidth;

		if (margin) {
			const style = getComputedStyle(el);
			width += parseFloat(style.marginLeft) + parseFloat(style.marginRight);
		}

		return width;
	}

	public getHorizontalPadding(el: any) {
		const style = getComputedStyle(el);
		return parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
	}

	public getHorizontalMargin(el: any) {
		const style = getComputedStyle(el);
		return parseFloat(style.marginLeft) + parseFloat(style.marginRight);
	}

	public innerWidth(el: any) {
		let width = el.offsetWidth;
		const style = getComputedStyle(el);

		width += parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
		return width;
	}

	public width(el: any) {
		let width = el.offsetWidth;
		const style = getComputedStyle(el);

		width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
		return width;
	}

	public getInnerHeight(el: any) {
		let height = el.offsetHeight;
		const style = getComputedStyle(el);
		height += parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
		return height;
	}

	public getOuterHeight(el: any, margin?: any) {
		let height = el.offsetHeight;

		if (margin) {
			const style = getComputedStyle(el);
			height += parseFloat(style.marginTop) + parseFloat(style.marginBottom);
		}

		return height;
	}

	public getHeight(el: any): number {
		let height = el.offsetHeight;
		const style = getComputedStyle(el);

		height -= parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
			+ parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);

		return height;
	}

	public getWidth(el: any): number {
		let width = el.offsetWidth;
		const style = getComputedStyle(el);

		width -= parseFloat(style.paddingLeft) + parseFloat(style.paddingRight)
			+ parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

		return width;
	}

	public getViewport(): any {
		const win = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0],
			w = win.innerWidth || e.clientWidth || g.clientWidth,
			h = win.innerHeight || e.clientHeight || g.clientHeight;

		return { width: w, height: h };
	}

	public getOffset(el: any) {
		let x = el.offsetLeft;
		let y = el.offsetTop;

		while (el = el.offsetParent) {
			x += el.offsetLeft;
			y += el.offsetTop;
		}

		return { left: x, top: y };
	}

	getUserAgent(): string {
		return navigator.userAgent;
	}

	get IsMac() {
		const ua = window.navigator.userAgent;
		if (ua.indexOf('Mac OS')) {
			return true;
		}
		return false;
	}

	isIE() {
		const ua = window.navigator.userAgent;

		const msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			return true;
		}

		const trident = ua.indexOf('Trident/');
		if (trident > 0) {
			return true;
		}

		const edge = ua.indexOf('Edge/');
		if (edge > 0) {
			return true;
		}

		// other browser
		return false;
	}

	getIEVersion() {
		if (!this.isIE()) {
			return 0;
		}
		const ua = window.navigator.userAgent;
		const msie = ua.indexOf('MSIE ');
		if (msie > 0) {
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}
		const trident = ua.indexOf('Trident/');
		if (trident > 0) {
			const rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		const edge = ua.indexOf('Edge/');
		if (edge > 0) {
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		}

		return 0;
	}

	isIE10() {
		if (this.getIEVersion() === 10) {
			return true;
		}
		return false;
	}

	isIE11() {
		if (this.getIEVersion() === 11) {
			return true;
		}
		return false;
	}

	appendChild(element: any, target: any) {
		if (this.isElement(target)) {
			target.appendChild(element);
			return;
		}
		if (target.el && target.el.nativeElement) {
			target.el.nativeElement.appendChild(element);
			return;
		}
		throw new Error('Cannot append ' + target + ' to ' + element);
	}

	removeChild(element: any, target: any) {
		if (this.isElement(target)) {
			target.removeChild(element);
			return;
		}
		if (target.el && target.el.nativeElement) {
			target.el.nativeElement.removeChild(element);
			return;
		}
		throw new Error('Cannot remove ' + element + ' from ' + target);

	}

	isElement(obj: any) {
		return (typeof HTMLElement === 'object' ? obj instanceof HTMLElement :
			obj && typeof obj === 'object' && obj !== null && obj.nodeType === 1 && typeof obj.nodeName === 'string'
		);
	}

	calculateScrollBarWidth(): number {
		if (this.calculatedScrollBarWidth !== null) {
			return this.calculatedScrollBarWidth;
		}
		const scrollDiv = document.createElement('div');
		scrollDiv.className = 'ui-scrollbar-measure';
		document.body.appendChild(scrollDiv);
		const scrollBarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
		document.body.removeChild(scrollDiv);
		this.calculatedScrollBarWidth = scrollBarWidth;
		return scrollBarWidth;
	}

	public invokeElementMethod(element: any, methodName: string, args?: any[]): void {
		(element as any)[methodName].apply(element, args);
	}

	public clearSelection(): void {
		// if (window.getSelection) {
		// 	if (window.getSelection()?.empty) {
		// 		window.getSelection()?.empty();
		// 		return;
		// 	}
		// 	if (window.getSelection()?.removeAllRanges && window.getSelection().rangeCount > 0 && window.getSelection().getRangeAt(0).getClientRects().length > 0) {
		// 		window.getSelection()?.removeAllRanges();
		// 		return;
		// 	}
		// 	return;
		// }
		// if (document['selection'] && document['selection'].empty) {
		// 	try {
		// 		document['selection'].empty();
		// 	} catch (error) {
		// 		// ignore IE bug
		// 	}
		// 	return;
		// }
	}
}
