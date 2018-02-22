import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { assign } from 'lodash';

import { uiModules } from 'ui/modules';
import { AggResponseTabifyProvider } from 'ui/agg_response/tabify/tabify';
import { RegistryFieldFormatsProvider } from 'ui/registry/field_formats';

import CustomizedPivotTable from './components/pivottable';
import * as utilData from './util/generateData';
import './options/kbn_pivottable_params';

const module = uiModules.get('kibana/kbn_searchtables', ['kibana']);

module.controller('KbnPivotTableVisController', function ($scope, $rootScope, $element, Private) {
  const tabifyAggResponse = Private(AggResponseTabifyProvider);
  const fieldFormats = Private(RegistryFieldFormatsProvider);

  $scope.showList = false;
  $scope.tables = [];
  $scope.rows = [];
  $scope.dimensions = [];
  $scope.metrics = [];
  $scope.colNames = [];
  $scope.subAggregation = [];

  const uiStateCustomizedMetric = ($scope.uiState) ? $scope.uiState.get('vis.params.customizedMetric') : [];
  assign($scope.vis.params.customizedMetric, uiStateCustomizedMetric);

  const uiStateSort = ($scope.uiState) ? $scope.uiState.get('vis.params.sort') : {};
  assign($scope.vis.params.sort, uiStateSort);

  $scope.$watchMulti(['esResponse'],  ([resp]) => {
    $scope.uiState.set('vis.params.customizedMetric', []);
    if (resp) {
      const vis = $scope.vis;
      const vis_params = vis.params;

      let group = tabifyAggResponse(vis, resp, {
        partialRows: vis_params.showPartialRows,
        minimalColumns: vis.isHierarchical() && !vis_params.showMeticsAtAllLevels,
        asAggConfigResults: true
      });

      if (!group || !group.tables.length) return;

      $scope.tables = group.tables;

      $scope.renderChart();
    }
  });

  $scope.$watchMulti(['vis.params'],  ([resp]) => {
    $scope.renderChart();
  });

  $scope.renderChart = () => {
    $scope.tables.forEach((table) => {
      $scope.colNames = utilData.generateDataNames(table.columns);

      $scope.rows = utilData.generateRows($scope.colNames, table.rows);
      $scope.dimensions = utilData.generateDimensions($scope.colNames);
      $scope.metrics = utilData.generateMetrics($scope.colNames);
    });

    $scope.draw();
  }

  $scope.clearComponents = ()=> {
    ReactDOM.unmountComponentAtNode(document.getElementById('pivot'));
  }

  $scope.draw = () => {
    const vis = $scope.vis;
    const vis_params = vis.params;
    $scope.clearComponents();

    ReactDOM.render(
      <CustomizedPivotTable
        showList={$scope.showList}
        metrics={$scope.metrics}
        customizedMetric={$scope.vis.params.customizedMetric}
        rows={$scope.rows}
        dimensions={$scope.dimensions}
        activeDimensions={utilData.generateActiveDimensions($scope.dimensions)}
        nPaginateRows={vis_params.perPage}/>,
      document.getElementById('pivot')
    );
  }

  $(document).on('showList', (evt, bShowList)=> {
    $scope.showList = bShowList;
  });
});
