import { uiModules } from 'ui/modules';
const module = uiModules.get('app/visualize');

import _ from 'lodash';
import $ from 'jquery';

import * as utilData from 'plugins/pivottable/util/generateData';

module.directive('kbnPivotCustomMetricsOptions', function () {
  return {
    restrict: 'E',
    template: '<div></div>',
    replace: true,
    link: function ($scope, $rootScope, $state) {
      $(document).on('customizedMetricChanged', (evt, metrics)=> {
        $scope.vis.params.customizedMetric = utilData.generateMetricParams(metrics);
        const stateCopy = $scope.vis.getState();
        $scope.vis.setState(stateCopy);
        setTimeout(() => {
          $('.fa-play').parent().click();
        }, 0);
      });
    }
  };
});
