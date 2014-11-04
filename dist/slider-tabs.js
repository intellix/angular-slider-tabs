(function () {
    'use strict';

    angular.module('angularSliderTabs', []);
    
}());

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

(function () {
    'use strict';

    angular.module('angularSliderTabs').directive('sliderTabs', ['$window', '$document', '$timeout', function($window, $document, $timeout) {
        return {
            restrict: 'EA',
            templateUrl: 'template/slider-tabs/slider-tabs.tpl.html',
            transclude: true,
            replace: true,
            scope: {
                tabsVisible: '=',
                activeIndex: '=?'
            },
            controller: ['$scope', '$element', function($scope, $element)
            {
                var self = this;
                var inner = angular.element($element[0].querySelector('.scroll'));
                var toggler = angular.element($element[0].querySelector('.slide-container'));
                var tabsVisible = $scope.tabsVisible || 3;
                // TODO: Automatically create 3x of each tab and loop through viewItems in view
                var items = [];
                var totalTabs, tabWidth, togglerWidth, currentX, startX, minX, maxX;

                // Debounced setup
                var setupTimerId;
                function setup()
                {
                    $timeout.cancel(setupTimerId);
                    setupTimerId = $timeout(function() {

                        totalTabs = items.length;
                        if (totalTabs < 1) {
                            return;
                        }
                        
                        // 2x halves are visible on both sides
                        tabWidth = $element[0].offsetWidth / (tabsVisible + 1);
                        togglerWidth = tabWidth + 15;

                        // Positioning
                        startX = 0;
                        minX = (totalTabs * tabWidth - tabWidth * 0.5 - $element[0].offsetWidth) * -1;
                        maxX = 0;

                        // Pull back slider so we have a device width on either side
                        inner.css({'width': tabWidth * totalTabs + 'px'});
                        toggler.css({'width': togglerWidth + 'px', 'margin-left': (togglerWidth / 2) * -1 + 'px'});

                        // If user doesn't define an active index, default to middle
                        if (!angular.isDefined($scope.activeIndex)) {
                            $scope.activeIndex = 1 + Math.floor(totalTabs / 3);
                        }

                        snapTo($scope.activeIndex);

                    }, 50);
                }

                function mousedown(event)
                {
                    event.stopPropagation();
                    event.preventDefault();

                    startX = currentX = getCurrentXTransform() - (event.pageX || event.touches[0].pageX);
                    $document.on('mousemove touchmove', mousemove);
                    $document.on('mouseup touchend touchcancel', mouseup);
                }

                function mousemove(event)
                {
                    event.stopPropagation();
                    event.preventDefault();

                    currentX = startX + (event.pageX || event.touches[0].pageX);

                    // Just to be safe, don't allow outside of boundaries
                    if (currentX < minX) {
                        currentX = minX;
                    } else if (currentX > maxX) {
                        currentX = maxX;
                    }

                    inner.css({ '-webkit-transform': 'translate3d(' + parseInt(currentX, 10) + 'px, 0, 0)' });
                }

                function mouseup(event)
                {
                    event.stopPropagation();
                    event.preventDefault();

                    // Oooh, Snap!
                    if (startX !== currentX) {
                        var index = calculateTabIndex();
                        self.slideTo(index);
                    }

                    $document.off('mousemove touchmove', mousemove);
                    $document.off('mouseup touchend touchcancel', mouseup);
                }

                function getCurrentXTransform()
                {
                    var transform = $window.getComputedStyle(inner[0], null).getPropertyValue('-webkit-transform');
                    var results = transform.match(/matrix(?:(3d)\(-{0,1}\d+(?:, -{0,1}\d+)  *(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))(?:, (-{0,1}\d+)), -{0,1}\d+\)|\(-{0,1}\d+(?:, -{0,1}\d+)*(?:, (-{0,1}\d+))(?:, (-{0,1}\d+))\))/);
                    if (!results) {
                        return 0;
                    }
                    return parseInt(results[results.length - 2], 10);
                }

                function calculateTabIndex()
                {
                    return Math.round((Math.abs(currentX) + (tabsVisible / 2 + 1) * tabWidth) / tabWidth) - 1;
                }

                /**
                 * User moves to the left or right then take him back to same item in middle using delta
                 */
                function moveBackToMiddleVersion(index)
                {
                    var delta = totalTabs / 3; // 4
                    if (index < delta) {
                        // Left
                        snapTo(index + delta, true);
                    } else if (index > delta * 2) {
                        // Right
                        snapTo(index - delta, true);
                    }
                }

                function snapTo(index, silent)
                {
                    var item = items[index];
                    startX = currentX = ((index+1) * tabWidth - (tabsVisible / 2 + 1) * tabWidth) * -1;
                    inner.css({ '-webkit-transform': 'translate3d(' + parseInt(currentX, 10) + 'px, 0, 0)' });            

                    $scope.activeIndex = index;        

                    if (angular.isDefined(item.onSelect) && !silent) {
                        item.onSelect();
                    }
                }

                // Public API

                self.add = function(item)
                {
                    items.push(item);
                    setup();
                };

                self.remove = function(item)
                {
                    items = _.without(items, item);
                    setup();
                };

                // TODO: Work out how the hell to use ngAnimate -.-
                self.slideToItem = function(scope)
                {
                    angular.forEach(items, function(item, index) {
                        if (item === scope) {
                            self.slideTo(index);
                            return false;
                        }
                    });
                };
                self.slideTo = function(index)
                {
                    inner.addClass('snap');
                    snapTo(index);
                    $timeout(function() {
                        inner.removeClass('snap');
                        moveBackToMiddleVersion(index);
                    }, 100);
                };

                function orientationChange()
                {
                    var change = function() {
                        setup();
                        $window.removeEventListener('resize', change);
                    };
                    $window.addEventListener('resize', change);
                }

                // Orientation occurs... THEN the resize (but resize can be triggered by keyboard etc also)
                $window.addEventListener('orientationchange', orientationChange, false);

                // Cleanup
                $scope.$on('$destroy', function() {
                    $timeout.cancel(setupTimerId);
                    $window.removeEventListener('orientationchange', orientationChange, false);
                });
                
                $element.on('mousedown touchstart', mousedown);

            }]
        };
    }]);

}());
