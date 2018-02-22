import React from 'react';
import PropTypes from 'prop-types';
import AggForm from './aggregationForm';
import CalculationList from './calculationList';
import * as Util from '../util/generateData';

const ADD_NEW_AGGS_TEXT = 'Add Customized Calculation';

export default class SubAggregation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appandForm: false,
      showList: this.props.showList,
      customizedMetric: this.props.customizedMetric,
      edittedMetric: null
    }
    this.toggleShowList = this.toggleShowList.bind(this);
    this.openAppandForm = this.openAppandForm.bind(this);
    this.closeAppandForm = this.closeAppandForm.bind(this);
    this.removeMetric = this.removeMetric.bind(this);
    this.handleEditMetric = this.handleEditMetric.bind(this);
    this.editMetric = this.editMetric.bind(this);
    this.addMetric = this.addMetric.bind(this);
  }
  toggleShowList() {
    this.setState({
      showList: !this.state.showList
    });
    $(document).trigger('showList', [!this.state.showList]);
  }

  openAppandForm() {
    this.setState({
      appandForm: true,
      edittedMetric: null,
      currentEditID: null
    })
  }

  closeAppandForm() {
    this.setState({
      appandForm: false
    });
  }

  handleEditMetric(id) {
    this.setState({
      currentEditID: id,
      appandForm: true,
      edittedMetric: this.state.customizedMetric[id]
    });
  }

  addMetric(newCalc) {
    let customizedMetric = this.state.customizedMetric;
    const existMetric = customizedMetric.filter((metric) => {
        return metric.label === newCalc.label;
    })
    if(!newCalc.title) {
      newCalc.title = newCalc.label + '_' + existMetric.length;
    }
    customizedMetric.push(newCalc);
    this.setState({
      showList: true,
      customizedMetric: customizedMetric
    });
    $(document).trigger('showList', [!this.state.showList]);
    this.props.renderMetric(customizedMetric);
  }

  editMetric(obj) {
    let customizedMetric = this.state.customizedMetric;
    let id = this.state.currentEditID;

    customizedMetric[id] = obj;
    this.setState({
      currentEditID: null,
      edittedMetric: null,
      customizedMetric: customizedMetric,
      appandForm: false
    });

    this.props.renderMetric(customizedMetric);
  }

  removeMetric(id) {
    let customizedMetric = this.state.customizedMetric
    customizedMetric.splice(id, 1);
    this.setState({
      customizedMetric: customizedMetric,
      currentEditID: null,
      edittedMetric: null
    });

    this.props.renderMetric(customizedMetric);
  }

  render() {
    return (
      <div className="aggHeader">
        <div className={`${this.state.showList ? '' : 'hidden'}`}>
          <CalculationList
            customizedMetric={this.state.customizedMetric}
            editMetric={this.handleEditMetric}
            removeMetric={this.removeMetric}
            />
        </div>
        <div className={`${this.state.customizedMetric.length ? '' : 'hidden'}`}>
          <button className="kuiCollapseButton" onClick={this.toggleShowList}>
            <span className={`${this.state.showList ? 'fa-chevron-circle-up': 'fa-chevron-circle-down'} kuiIcon`}></span>
          </button>
        </div>
        <button
          className={`${this.state.appandForm ? 'hidden': ''} kuiButton kuiButton--primary kuiButton--small formButton`}
          onClick={this.openAppandForm} >{ADD_NEW_AGGS_TEXT}</button>
        <AggForm
          currentMetric={this.state.edittedMetric}
          appandForm={this.state.appandForm}
          metrics={this.props.metrics}
          onAdd={this.addMetric}
          onUpdate={this.editMetric}
          onCancel={this.closeAppandForm}
          />
      </div>
    );
  }
}

SubAggregation.props = {
  showList: PropTypes.bool,
  metrics: PropTypes.array,
  customizedMetric: PropTypes.array,
  renderMetric: PropTypes.func
}
