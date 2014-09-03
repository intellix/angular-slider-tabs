describe('angularSliderTabs', function() {

    beforeEach(module('angularSliderTabs'));

    describe('sliding functionality', function() {

        var scope, element, timeout, spy;

        beforeEach(inject(function($rootScope, $compile, $timeout) {

            timeout = $timeout;
            scope = $rootScope.$new();
            scope.items = [
                {a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5},
                {a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5},
                {a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}
            ];
            scope.selectItem = function(item) {};
            spy = spyOn(scope, 'selectItem');

            element = $compile('<slider-tabs tabs-visible="3" on-select="selectItem">' +
                                    '<slider-tab class="tab-item" ng-repeat="item in items">{{item.a}}</slider-tab>' +
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

    });

    describe('tapping an item', function() {

        var scope, element, timeout, spy;

        beforeEach(inject(function($rootScope, $compile, $timeout) {

            timeout = $timeout;
            scope = $rootScope.$new();
            scope.items = [
                {a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5},
                {a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5},
                {a: 1}, {a: 2}, {a: 3}, {a: 4}, {a: 5}
            ];
            scope.selectItem = function(item) {};
            spy = spyOn(scope, 'selectItem');
            
            element = $compile('<slider-tabs tabs-visible="3" on-select="selectItem">' +
                                    '<slider-tab class="tab-item" ng-repeat="item in items">{{item.a}}</slider-tab>' +
                               '</slider-tabs>')(scope);
            scope.$digest();

        }));

        it('should call on-select with an item that is clicked', function() {
            timeout.flush();
            $('.slider-tabs tab:eq(1)').click();
            expect(spy.mostRecentCall.args[0].a).toEqual(2);
        });

        it('should call on-select only once on click', function() {
            timeout.flush();
            $('.slider-tabs tab:eq(2)').click();
            expect(scope.selectItem.callCount).toEqual(1);
        });

    });

});
