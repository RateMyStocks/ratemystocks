import {Component, AfterViewInit, Renderer2, OnDestroy, OnInit} from '@angular/core';
import { MenuService } from './app.menu.service';
import { PrimeNGConfig } from 'primeng/api';
import { AppComponent } from './app.component';

@Component({
    selector: 'app-main',
    templateUrl: './app.main.component.html'
})
export class AppMainComponent implements AfterViewInit, OnDestroy {

    rotateMenuButton: boolean;

    topbarMenuActive: boolean;

    overlayMenuActive: boolean;

    staticMenuDesktopInactive: boolean;

    staticMenuMobileActive: boolean;

    menuClick: boolean;

    topbarItemClick: boolean;

    activeTopbarItem: any;

    documentClickListener: () => void;

    configActive: boolean;

    configClick: boolean;

    rightPanelActive: boolean;

    rightPanelClick: boolean;

    menuHoverActive = false;

    searchClick = false;

    search = false;

    constructor(public renderer: Renderer2, private menuService: MenuService, private primengConfig: PrimeNGConfig,
                public app: AppComponent) { }

    ngAfterViewInit() {
        // hides the horizontal submenus or top menu if outside is clicked
        this.documentClickListener = this.renderer.listen('body', 'click', (event) => {
            if (!this.topbarItemClick) {
                this.activeTopbarItem = null;
                this.topbarMenuActive = false;
            }

            if (!this.menuClick && this.isHorizontal()) {
                this.menuService.reset();
            }

            if (this.configActive && !this.configClick) {
                this.configActive = false;
            }

            if (!this.rightPanelClick) {
                this.rightPanelActive = false;
            }

            if (!this.menuClick) {
                if (this.overlayMenuActive) {
                    this.overlayMenuActive = false;
                }
                if (this.staticMenuMobileActive) {
                    this.staticMenuMobileActive = false;
                }

                this.menuHoverActive = false;
                this.unblockBodyScroll();
            }

            if (!this.searchClick) {
                this.search = false;
            }

            this.searchClick = false;
            this.configClick = false;
            this.topbarItemClick = false;
            this.menuClick = false;
            this.rightPanelClick = false;
        });
    }

    onMenuButtonClick(event) {
        this.rotateMenuButton = !this.rotateMenuButton;
        this.topbarMenuActive = false;
        this.menuClick = true;

        if (this.app.menuMode === 'overlay' && !this.isMobile()) {
            this.overlayMenuActive = !this.overlayMenuActive;
        }

        if (this.isDesktop()) {
            this.staticMenuDesktopInactive = !this.staticMenuDesktopInactive;
        } else {
            this.staticMenuMobileActive = !this.staticMenuMobileActive;
            if (this.staticMenuMobileActive) {
                this.blockBodyScroll();
            } else {
                this.unblockBodyScroll();
            }
        }

        event.preventDefault();
    }

    onMenuClick($event) {
        this.menuClick = true;
    }

    onTopbarItemClick(event, item) {
        this.topbarItemClick = true;

        if (this.activeTopbarItem === item) {
            this.activeTopbarItem = null;
        } else {
            this.activeTopbarItem = item; }

        if (item.className === 'search-item topbar-item') {
            this.search = !this.search;
            this.searchClick = !this.searchClick;
        }

        event.preventDefault();
    }

    onTopbarSubItemClick(event) {
        event.preventDefault();
    }

    onRTLChange(event) {
        this.app.isRTL = event.checked;
    }

    onRippleChange(event) {
        this.app.ripple = event.checked;
        this.primengConfig.ripple = event.checked;
    }

    onConfigClick(event) {
        this.configClick = true;
    }

    onRightPanelButtonClick(event) {
        this.rightPanelClick = true;
        this.rightPanelActive = !this.rightPanelActive;
        event.preventDefault();
    }

    onRightPanelClick() {
        this.rightPanelClick = true;
    }

    isTablet() {
        const width = window.innerWidth;
        return width <= 1024 && width > 640;
    }

    isDesktop() {
        return window.innerWidth > 1024;
    }

    isMobile() {
        return window.innerWidth <= 640;
    }

    isOverlay() {
        return this.app.menuMode === 'overlay';
    }

    isStatic() {
        return this.app.menuMode === 'static';
    }

    isHorizontal() {
        return this.app.menuMode === 'horizontal';
    }

    blockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.add('blocked-scroll');
        } else {
            document.body.className += ' blocked-scroll';
        }
    }

    unblockBodyScroll(): void {
        if (document.body.classList) {
            document.body.classList.remove('blocked-scroll');
        } else {
            document.body.className = document.body.className.replace(new RegExp('(^|\\b)' +
                'blocked-scroll'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }

    ngOnDestroy() {
        if (this.documentClickListener) {
            this.documentClickListener();
        }
    }

}
