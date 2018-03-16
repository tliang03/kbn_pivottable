import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
const ReactPivot = require('../lib/react-pivot');
import Header from './subaggheader';
import aggregators from '../config/aggregators';
import * as UtilData from '../util/generateData';


export default class CustomizedPivotTable extends React.PureComponent {
  constructor (props) {
    super(props);
    const customizedMetric = UtilData.findCustomizedMetric(this.props.customizedMetric, this.props.metrics);
    this.state = {
      customizedMetric: customizedMetric,
      calculations: UtilData.generateCalculations(this.props.metrics, customizedMetric),
      reducers: UtilData.generateReduce(this.props.metrics, customizedMetric, this.props.rows)
    }
    this.appandToContainer = this.appandToContainer.bind(this);
    this.renderMetric = this.renderMetric.bind(this);
  }

  componentDidMount(){
   this.appandToContainer();
  }

  appandToContainer(reducers, calculations) {
    ReactDOM.unmountComponentAtNode(document.getElementById('pivotContainer'));

    reducers = reducers || this.state.reducers;
    calculations = calculations || this.state.calculations;

    ReactDOM.render(
      <ReactPivot
        rows={this.props.rows}
        dimensions={this.props.dimensions}
        calculations={calculations}
        reduce={reducers}
        solo={{}}
        activeDimensions={this.props.activeDimensions}
        nPaginateRows={this.props.nPaginateRows}
         />,
      document.getElementById('pivotContainer')
    );
  }

  renderMetric(customizedMetric) {
    const reducers =  UtilData.generateReduce(this.props.metrics, customizedMetric, this.props.rows);
    const calculations = UtilData.generateCalculations(this.props.metrics, customizedMetric);
    this.setState({
      reducers: reducers,
      calculations: calculations
    });

    this.appandToContainer(reducers, calculations);
    $(document).trigger('customizedMetricChanged', [customizedMetric]);
  }

  render() {
    return (
      <div>
        <Header
          showList={this.props.showList}
          customizedMetric={this.state.customizedMetric}
          metrics={this.props.metrics}
          renderMetric={this.renderMetric} />
        <div id="pivotContainer"></div>
      </div>
    );
  }
}

CustomizedPivotTable.props = {
  showList: PropTypes.bool,
  metrics : PropTypes.array,
  rows: PropTypes.array,
  dimensions: PropTypes.array,
  activeDimensions: PropTypes.array,
  nPaginateRows: PropTypes.number,
  customizedMetric: PropTypes.array
}
