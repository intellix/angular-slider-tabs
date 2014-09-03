angular.module('angularSliderTabs').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('template/slider-tabs/slider-tabs.tpl.html',
    "<div class=\"slider-tabs\"><div class=\"viewport\"><div class=\"scroll\" ng-transclude></div></div><div class=\"slide-container\"></div></div>"
  );

}]);
