(function () {
    'use strict';

    angular.module('angularSliderTabs').directive('sliderTab', function() {
        return {
            require: '^sliderTabs',
            restrict: 'EA',
            scope: {
                onSelect: '&'
            },
            link: function (scope, element, attrs, sliderTabsCtrl)
            {
                sliderTabsCtrl.add(scope);

                var down;
                element.on('mousedown touchstart', function(event) {
                    down = event.pageX || event.touches[0].pageX;
                });

                element.on('mouseup touchend', function(event) {
                    var now = event.pageX || event.changedTouches[0].pageX;
                    if (angular.isDefined(now) && down === now) {
                        sliderTabsCtrl.slideToItem(scope);
                    }
                });

                // TODO: Listen for change to active and move to it

                // Cleanup
                scope.$on('$destroy', function() {
                    sliderTabsCtrl.remove(scope);
                });
            }
        };
    });

}());
