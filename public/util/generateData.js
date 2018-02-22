import Aggregators from '../config/aggregators';

export const generateDataNames = (cols) => {
  const columns = [];
  cols.forEach((col) => {
    const title = col.title;
    const type = col.aggConfig.schema.name;
    columns.push({
      "title": title,
      "type": type
    });
  });
  return columns;
};

export const generateActiveDimensions = (dimensions) => {
  return dimensions.map((dim) => {
    return dim.title;
  })
}

export const generateDimensions = (colNames) => {
  let dimensions = [];
  colNames.forEach((col) => {
    if(col.type === 'bucket') {
      dimensions.push({
        value: col.title,
        title: col.title
      });
    }
  });
  return dimensions;
}

export const generateMetrics = (colNames) => {
  let metrics = [];
  colNames.forEach((col) => {
    const existAlready = metrics.filter((metric) => {
      return metric.title === col.title;
    });

    if(col.type === 'metric' && !existAlready.length) {
      metrics.push({
        value: col.title,
        title: col.title,
        type: col.type
      });
    }
  });
  return metrics;
}

export const generateRows = (colNames, rows) => {
  let data = [];
  rows.forEach((row) => {
    let obj = {};
    row.forEach((el, index) => {
      const formatter = el.aggConfig.fieldFormatter('text');
      const value = el.value;
      const title = (index < colNames.length) ? colNames[index]['title'] : undefined;
      if(title) {
        obj[title] = formatter(value);
      }
    });
    data.push(obj);
  });
  return data;
};

export const generateReduce = (colNames, cusMetrics, rows) => {
  return (row, memo, filter) => {
    colNames.forEach((col) => {
      if(col.type === 'metric') {
        const digitIndex = row[col.title].indexOf('.');
        const l  = row[col.title].length;

        if(digitIndex > -1) {
          memo[col.title] = (memo[col.title] || 0) + parseFloat(row[col.title]);
        } else {
          memo[col.title] = (memo[col.title] || 0) + parseInt(row[col.title]);
        }
      }
    });

    if(cusMetrics && cusMetrics.length) {
      cusMetrics.forEach((metric) => {
        const reduce = metric.reduce(row, memo, filter, metric.fields, rows);
        Object.keys(reduce).forEach((key) => {
          memo[key] = reduce[key];
        })
      });
    }

    return memo;
  }
}

export const generateCalculations = (colNames, cusMetrics) => {
  let calculations = [];
  colNames.forEach((col) => {
    if(col.type === 'metric') {
      calculations.push({
        value: col.title,
        title: col.title,
        className: 'aggValue',
        template: (val, row) => {
          if(val.toFixed){
            let valArr = val.toString().split('.');
            if(valArr.length>1 && valArr[1].length>=5) {
              return val.toFixed(2);
            }
          }
          return val;
        }
      });
    }
  });

  if(cusMetrics && cusMetrics.length) {
    cusMetrics.forEach((metric) => {
      let calculation = Object.assign({}, metric.calculation);
      let title = metric.title || metric.label;
      calculation.title = title;
      calculations.push(calculation);
    });
  }

  return calculations;
}

export const findAggObject = (label) => {
  return Aggregators.filter((agg) =>{
    return agg.label === label;
  })
}

export const validateForm = (aggObj) => {
  if(!aggObj) return false;
  if(aggObj.min > aggObj.fields) return false;
  if(aggObj.max && aggObj.max < aggObj.fields) return false;

  return true;
}

export const findCustomizedMetric = (arr, metrics) => {
  const resp = [];
  arr.forEach((metric) => {
    const aggArr = findAggObject(metric.label);
    if(aggArr.length) {
      let obj = Object.assign({},
        aggArr[0],
        {
          "title": metric.title,
          "fields": metric.fields,
          "type": "metric"
        }
      );
      resp.push(obj);
    }

  })

  return resp;
}

export const generateMetricParams = (metrics) => {
  return metrics.map((metric) => {
    return {
      label: metric.label,
      type: metric.type,
      title: metric.title,
      fields: metric.fields
    }
  })
}
