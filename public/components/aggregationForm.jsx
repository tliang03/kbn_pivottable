import $ from 'jquery';
import React from 'react';
import PropTypes from 'prop-types';
import Aggregators from '../config/aggregators';
import * as Util from '../util/generateData';
import { notify } from 'ui/notify';

export default class AggForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      aggLength: 0,
      currentAgg: null,
      aggTypeValue: '',
      aggFieldLabel: '',
      aggFieldValues: []
    }
    this.resetState = this.resetState.bind(this);
    this.onAdd = this.onAdd.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleMetricFieldChange = this.handleMetricFieldChange.bind(this);
    this.handleAddField = this.handleAddField.bind(this);
    this.handleDeleteField = this.handleDeleteField.bind(this);
  }

  onAdd() {
    if(!this.state.currentAgg) {
      notify.error('Please correct aggreagation form');
      return;
    }
    const aggObj = Object.assign(
      this.state.currentAgg,
      {
        "title": this.state.aggFieldLabel,
        "fields": [],
        "type": "metric"
      }
    );

    this.state.aggFieldValues.forEach((field) => {
      const metricField = this.props.metrics.filter((metric) => {
        return field === metric.title;
      });
      aggObj['fields'].push(metricField[0]);
    });

    if(Util.validateForm(aggObj)) {
      this.props.onAdd(aggObj);
      this.onCancel();
    } else {
      notify.error('Please correct aggreagation form');
    }
  }

  onUpdate() {
    const aggObj = Object.assign(
      this.state.currentAgg,
      {
        title: this.state.aggFieldLabel,
        "fields": []
      });

    this.state.aggFieldValues.forEach((field) => {
      const metricField = this.props.metrics.filter((metric) => {
        return field === metric.title;
      });
      aggObj['fields'].push(metricField[0]);
    });

    if(Util.validateForm(aggObj)) {
      this.props.onUpdate(aggObj);
      this.onCancel();
    } else {
      notify.error('Please correct aggreagation form');
    }
  }

  onCancel() {
    this.resetState();
    this.props.onCancel();
  }

  handleTypeChange(target) {
    if(target.value === '') {
      this.resetState();
      return;
    }
    const agg = Util.findAggObject(target.value);
    this.setState({
      currentAgg: agg[0],
      aggLength: agg[0].min || 1,
      aggFieldValues: [],
      aggFieldLabel: '',
      aggTypeValue: target.value,
    })
  }

  handleMetricFieldChange(target) {
    const index = parseInt($(target).attr('data-index'));
    let aggFieldValues = this.state.aggFieldValues;
    aggFieldValues[index] = target.value;

    this.setState({
      aggFieldValues: aggFieldValues
    })

    if(this.state.currentAgg.max) {
      if(this.state.currentAgg.max > this.state.aggLength) {
        this.setState({
          aggLength: this.state.aggLength + 1
        })
      }
    }
  }

  handleLabelChange(value) {
    this.setState({
      aggFieldLabel: value
    })
  }

  handleAddField() {
    this.setState({
      aggLength: this.state.aggLength + 1
    })
  }

  handleDeleteField(target){
    const index = parseInt($(target).attr('data-index'));
    let fieldsCopy = this.state.aggFieldValues.slice(0);
    fieldsCopy.splice(index, 1);

    this.setState({
      aggFieldValues: fieldsCopy,
      aggLength: this.state.aggLength - 1
    })
  }

  resetState() {
    this.setState({
      aggLength: 0,
      currentAgg: null,
      aggTypeValue: '',
      aggFieldLabel: '',
      aggFieldValues: []
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.currentMetric && nextProps.currentMetric !== this.state.currentAgg) {
      this.setState({
        aggLength: nextProps.currentMetric.fields.length,
        currentAgg: nextProps.currentMetric,
        aggTypeValue: nextProps.currentMetric.label,
        aggFieldLabel: nextProps.currentMetric.title,
        aggFieldValues: nextProps.currentMetric.fields.map((field) => {
          return field.value
        })
      })
    }
  }

  render() {
    return (
      <div id="" className={`${this.props.appandForm ? '': 'hidden'} aggForm`}>
        <div className="aggSelection">
          <table>
            <tbody>
              <tr>
                <td className="selectionLabel">Aggregation Type
                </td>
                <td className="selection">
                  <select
                    value={this.state.aggTypeValue}
                    onChange={(evt) => { this.handleTypeChange(evt.target) }}>
                    <option value='' disabled></option>
                    {
                      Aggregators.map((agg) => {
                        return (
                          <option
                            key={agg.label}
                            value={agg.label}>{agg.label}</option>
                        )
                      })
                    }
                  </select>
                </td>
                <td></td>
              </tr>
              <tr>
                <td className="selectionLabel">Label</td>
                <td>
                  <input value={this.state.aggFieldLabel}
                    onChange={(evt) => {
                      this.handleLabelChange(evt.currentTarget.value);
                    }} />
                </td>
                <td></td>
              </tr>
              {
                Array.apply(null, Array(this.state.aggLength)).map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="selectionLabel">Metric Field
                      </td>
                      <td>
                        <select
                          key={index}
                          data-index={index}
                          value={(this.state.aggFieldValues.length > index )? this.state.aggFieldValues[index] : ''}
                          onChange={(evt) => { this.handleMetricFieldChange(evt.target) }}>
                          <option value='' disabled></option>
                          {
                            this.props.metrics.map((metric) => {
                              return (
                                <option key={metric.title} value={metric.title}>{metric.title}</option>
                              )
                            })
                          }
                        </select>
                      </td>
                      <td>
                        <button
                          className={`${(this.state.aggLength > this.state.currentAgg.min) ? '': 'hidden'}
                            kuiButton kuiButton--danger kuiButton--small`}
                          data-index={index}
                          onClick={(evt) => {
                            this.handleDeleteField(evt.currentTarget);
                          }}>
                          <i className="fa fa-times"></i>
                        </button>
                        <button
                          className={`${((this.state.aggLength === index + 1) && !this.state.currentAgg.max ) ? '': 'hidden'}
                            kuiButton kuiButton--primary kuiButton--small`}
                          onClick={this.handleAddField}>
                          <i className="fa fa-plus"></i>
                        </button>
                      </td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        <div className="aggButtons">
          <button
            className={`${this.props.currentMetric ? 'hidden': ''} kuiButton kuiButton--primary kuiButton--small formButton`}
            onClick={this.onAdd}>Add</button>
          <button
            className={`${this.props.currentMetric ? '': 'hidden'} kuiButton kuiButton--primary kuiButton--small formButton`}
            onClick={this.onUpdate}>Update</button>
          <button
            className="kuiButton kuiButton--primary kuiButton--small cancel"
            onClick={this.onCancel}>Cancel</button>
        </div>
      </div>
    );
  }
}

AggForm.props = {
  currentMetric: PropTypes.object,
  appandForm: PropTypes.bool,
  metrics: PropTypes.array,
  onAdd: PropTypes.func,
  onUpdate: PropTypes.func,
  onCancel: PropTypes.func
}
