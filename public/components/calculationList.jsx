import React from 'react';
import PropTypes from 'prop-types';

const _getFieldsNames = (fields) => {
  let name = '';
  name = fields.reduce((curr, newField) => {
    if(curr.title === '') {
      return newField.title;
    }
    return curr.title + ', ' + newField.title;
  }, {
    title: ''
  });
  return name;
}

export default class CalculationList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <table className={`${this.props.customizedMetric.length ? '': 'hidden'} calculationListTable`}>
        <tbody>
          <tr>
            <th>Label</th>
            <th>Type</th>
            <th>Field(s)</th>
            <th></th>
          </tr>
          {
            this.props.customizedMetric.map((metric, index) => {
              return (
                <tr key={index}>
                  <td><span>{metric.title}</span></td>
                  <td><span>{metric.label}</span></td>
                  <td>{
                      metric.fields.map((field, i) => {
                        return (
                          <div key={i + '_' + field.title}>{field.title}</div>
                        )
                      })}
                  </td>
                  <td className="buttonTD">
                    <button
                      data-id={index}
                      className="kuiButton kuiButton--primary kuiButton--small"
                      onClick={(evt) => {
                        const id=evt.currentTarget.getAttribute('data-id');
                        this.props.editMetric(parseInt(id));
                      }}>
                      <i className="fa fa-pencil"></i>
                    </button>
                    <button
                      data-id={index}
                      className="kuiButton kuiButton--danger kuiButton--small"
                      onClick={(evt) => {
                        const id=evt.currentTarget.getAttribute('data-id');
                        this.props.removeMetric(parseInt(id));
                      }}>
                      <i className="fa fa-times"></i>
                    </button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    )
  }
}

CalculationList.props = {
  customizedMetric: PropTypes.array,
  editMetric: PropTypes.func,
  removeMetric: PropTypes.func
}
