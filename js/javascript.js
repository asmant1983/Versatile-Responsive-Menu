"use strict";
(function ($) {
    /* Responsive Menu Plugin */
    $.fn.responsiveMenu = function (userOptions) {
        // --- 1. SETTINGS & VARIABLES ---
        const settings = $.extend({
            resizeWidth: 799,
            animationSpeed: 300,
            accordionExpandAll: false
        }, userOptions);
        const $menu = $(this);
        const $menuToggleBtn = $('.menu-toggle');
        const $menuBtn = $('#menu-btn');
        const initialMenuStyle = $menu.attr('data-menu-style') || '';
        const isMegaMenu = initialMenuStyle === 'megamenu';
        const isAccordionMenu = initialMenuStyle === 'accordion';
        // --- 2. FUNCTIONS ---
        const toggleMenuState = () => {
            const isMobileView = window.matchMedia(`(max-width: ${settings.resizeWidth}px)`).matches;
            if (isMobileView) {
                if ($menu.attr('data-menu-style') !== '') {
                    $menu.attr('data-menu-style', '');
                    $menu.addClass('collapse hide-menu');
                    $menuToggleBtn.show();
                    $menu.find('.menu-active, .slide').removeClass('menu-active slide').removeAttr('style');
                    // Accessibility reset for mobile view
                    $menuBtn.removeClass('open').attr('aria-expanded', 'false');
                }
            }
            else {
                if ($menu.attr('data-menu-style') === '') {
                    $menu.attr('data-menu-style', initialMenuStyle);
                    $menu.removeClass('collapse hide-menu').removeAttr('style');
                    $menuToggleBtn.hide();
                    $menu.find('.menu-active, .slide').removeClass('menu-active slide').removeAttr('style');
                }
            }
        };
        // --- 3. EVENT HANDLERS ---
        // A. Desktop Hover Logic
        $menu.on('mouseenter.desktop', 'li', function () {
            if ($menu.hasClass('collapse') || isAccordionMenu)
                return;
            const $listItem = $(this);
            const isTopLevelItem = $listItem.parent().is($menu);
            if (isMegaMenu && !isTopLevelItem) {
                $listItem.addClass('menu-active');
                return;
            }
            $listItem.addClass('menu-active');
            const $submenu = $listItem.children('.sub-menu');
            if ($submenu.length > 0) {
                if (isMegaMenu) {
                    $submenu.stop(true, true).css({ 'display': 'flex', 'opacity': 0 }).animate({ 'opacity': 1 }, settings.animationSpeed).addClass('slide');
                    $submenu.find('.sub-menu').show();
                }
                else {
                    $submenu.stop(true, true).fadeIn(settings.animationSpeed).addClass('slide');
                }
            }
        }).on('mouseleave.desktop', 'li', function () {
            if ($menu.hasClass('collapse') || isAccordionMenu)
                return;
            const $listItem = $(this);
            const isTopLevelItem = $listItem.parent().is($menu);
            if (isMegaMenu && !isTopLevelItem) {
                $listItem.removeClass('menu-active');
                return;
            }
            $listItem.removeClass('menu-active');
            const $submenu = $listItem.children('.sub-menu');
            $submenu.stop(true, true).fadeOut(settings.animationSpeed, function () {
                if (isMegaMenu)
                    $(this).find('.sub-menu').hide();
            }).removeClass('slide');
        });
        // B. Combined logic for Mobile & Accordion clicks
        $menu.on('click.submenu', 'li > a', function (e) {
            // Only execute click logic if the menu is collapsed (mobile) or if it's a desktop accordion
            if (!$menu.hasClass('collapse') && !isAccordionMenu)
                return;
            const $link = $(this);
            const $parentLi = $link.parent('li');
            const $submenu = $link.siblings('.sub-menu');
            if ($submenu.length > 0) {
                e.preventDefault();
                if ($parentLi.hasClass('menu-active')) {
                    $submenu.slideUp(settings.animationSpeed).removeClass('slide');
                    $parentLi.removeClass('menu-active');
                }
                else {
                    if (!settings.accordionExpandAll) {
                        $parentLi.siblings('.menu-active').removeClass('menu-active')
                            .children('.sub-menu').slideUp(settings.animationSpeed).removeClass('slide');
                    }
                    $submenu.slideDown(settings.animationSpeed).addClass('slide');
                    $parentLi.addClass('menu-active');
                }
            }
        });
        // --- 4. INITIALIZATION ---
        $menu.find('ul').addClass('sub-menu');
        $menu.find('li:has(ul)').children('a').append('<span class="arrow"></span>');
        // Mobile Hamburger Button
        $menuBtn.off('click').on('click', function (e) {
            e.preventDefault();
            $menu.stop(true, true).slideToggle(settings.animationSpeed).toggleClass('hide-menu');
            const isOpen = $(this).toggleClass('open').hasClass('open');
            $(this).attr('aria-expanded', isOpen.toString());
        });
        toggleMenuState();
        // Optimized resize event (Debounce)
        let resizeTimer;
        $(window).on('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(toggleMenuState, 150);
        });
        return this;
    };
    // Wait until the document is ready, then initialize the menu
    $(document).ready(() => {
        $('#respMenu').responsiveMenu();
    });
})(jQuery);
//# sourceMappingURL=menu.js.map
