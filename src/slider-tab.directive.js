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

                var down;
                element.on('mousedown', function(event) {
                    down = event.pageX || event.touches[0].pageX;
                });

                element.on('click', function(event) {
                    var now = event.pageX || event.touches[0].pageX;
                    if (angular.isDefined(now) && down === now) {
                        sliderTabsCtrl.slideTo(scope.$index);
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
