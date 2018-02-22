export default {
  "agg_count": {
    "value": "agg_count",
    "className": "aggValue"
  },
  "agg_divide": {
    "value": (row) => {
      return row.agg_divide_molecular / row.agg_divide_denominator;
    },
    "template": (val, row) => {
      return val.toFixed(4);
    },
    "className": "aggValue"
  },
  "agg_minus": {
    "value": (row) => {
      return row.agg_minus_field_1 - row.agg_minus_field_2;
    },
    "template": (val, row) => {
      return val.toFixed(4);
    },
    "className": "aggValue"
  },
  "agg_percentage": {
    "value": (row) => {
      return (row.agg_percentage_total / row.agg_percentage_data_total) * 100;
    },
    "template": (val, row) => {
      return val.toFixed(2) + "%";
    },
    "className": "aggValue"
  },
  "agg_max": {
    "value": "agg_max",
    "className": "aggValue"
  },
  "agg_min": {
    "value": "agg_min",
    "className": "aggValue"
  },
  "agg_sum": {
    "value": "agg_sum",
    "template": (val, row) => {
      if(val.toFixed){
        const valArr = val.toString().split('.');
        if(valArr.length>1 && valArr[1].length>=5) {
          return val.toFixed(2);
        }
      }
      return val;
    },
    "className": "aggValue"
  },
  "agg_multiply": {
    "value": "agg_multiply",
    "template": (val, row) => {
      if(val.toFixed){
        const valArr = val.toString().split('.');
        if(valArr.length>1 && valArr[1].length>=5) {
          return val.toFixed(2);
        }
      }
      return val;
    },
    "className": "aggValue"
  },
  "agg_average": {
    "value": (row) => {
      return row.agg_average_field / row.agg_average_count;
    },
    "template": (val, row) => {
      return val.toFixed(4);
    },
    "className": "aggValue"
  }
}
