describe('angularSliderTabs', function() {

    beforeEach(module('angularSliderTabs'));

    describe('setup', function() {

        var scope, element, timeout, spy;

        beforeEach(inject(function($rootScope, $compile, $timeout) {

            timeout = $timeout;
            scope = $rootScope.$new();
            scope.ui = {
                activeItem: undefined,
                items: [
                    {a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5},
                    {a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5},
                    {a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}
                ]
            };
            scope.selectItem = function(item) {};
            spy = spyOn(scope, 'selectItem');

            element = $compile('<slider-tabs tabs-visible="3" active-index="ui.activeItem">' +
                                    '<slider-tab class="tab-item" ng-repeat="item in ui.items" on-select="selectItem(item)">{{item.a}}</slider-tab>' +
                               '</slider-tabs>')(scope);
            scope.$digest();

        }));

        it('should call on-select the middle object on setup', function() {
            timeout.flush();
            expect(spy.mostRecentCall.args[0].a).toEqual(2);
        });

        it('should call on-select only once on startup', function() {
            timeout.flush();
            expect(scope.selectItem.callCount).toEqual(1);
        });

        it('should specify a width and margin-left on the slide-container', function() {
            timeout.flush();
            var style = element.find('.slide-container')[0].style;
            expect(style.width).toNotBe('');
            expect(style.marginLeft).toNotBe('');
        });

        it('can be destroyed', function() {
            scope.$destroy();
            timeout.flush();
        });

    });

    describe('preselecting an activeIndex', function() {

        var scope, element, timeout, spy;

        beforeEach(inject(function($rootScope, $compile, $timeout) {

            timeout = $timeout;
            scope = $rootScope.$new();
            scope.ui = {
                activeItem: 8,
                items: [
                    {a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5},
                    {a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5},
                    {a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}
                ]
            };
            scope.selectItem = function(item) {};
            spy = spyOn(scope, 'selectItem');

            element = $compile('<slider-tabs tabs-visible="3" active-index="ui.activeItem">' +
                                    '<slider-tab class="tab-item" ng-repeat="item in ui.items" on-select="selectItem(item)">{{item.a}}</slider-tab>' +
                               '</slider-tabs>')(scope);
            scope.$digest();

        }));

        it('should change the startup active item', function() {
            timeout.flush();
            // debugger;
            expect(spy.mostRecentCall.args[0].a).toEqual(4);
        });

    });

});
