(function () {
    'use strict';

    angular.module('angularSliderTabs').directive('sliderTab', function($timeout) {
        return {
            require: '^sliderTabs',
            restrict: 'EA',
            link: function (scope, element, attrs, sliderTabsCtrl)
            {
                sliderTabsCtrl.add(scope);

                if (scope.$last) {
                    sliderTabsCtrl.start();
                }

                // ARGH! Why is tap not simply abstracted? and why can't you event.stopPropagation() on their Ctrler
                var mousedown, mousenow;
                element.on('mousedown touchstart', function(event) {
                    mousedown = mousenow = event.pageX || event.touches[0].pageX;
                });
                element.on('mousemove touchmove', function(event) {
                    mousenow = event.pageX || event.touches[0].pageX;
                });
                element.on('mouseup touchend', function(event) {
                    if (mousenow === mousedown) {
                        $timeout(function() {
                            sliderTabsCtrl.slideTo(scope.$index);
                        });
                    }
                });

                // Cleanup
                scope.$on('$destroy', function() {
                    sliderTabsCtrl.remove(scope);
                });
            }
        };
    });

}());
