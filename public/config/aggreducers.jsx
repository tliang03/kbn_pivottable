export default {
  "agg_count": (row, memo, filter, fields) => {
    return {
      "agg_count": (memo["agg_count"] || 0) + 1
    };
  },
  "agg_max": (row, memo, filter, fields) => {
    const field = fields[0].title;
    return {
      "agg_max": memo.agg_max && (memo.agg_max >= parseFloat(row[field])) ? memo.agg_max : parseFloat(row[field])
    };
  },
  "agg_min": (row, memo, filter, fields) => {
    const field = fields[0].title;
    return {
      "agg_min": memo.agg_min && (memo.agg_min <= parseFloat(row[field])) ? memo.agg_min : parseFloat(row[field])
    };
  },
  "agg_sum": (row, memo, filter, fields) => {
    const sum = fields.reduce((curr, field) => {
      return curr + parseFloat(row[field.title]);
    }, 0)
    return {
      "agg_sum": (memo.agg_sum || 0) + sum
    };
  },
  "agg_minus": (row, memo, filter, fields) => {
    const field_1 = fields[0].title;
    const field_2 = fields[1].title;
    return {
      "agg_minus_field_1": (memo.agg_minus_field_1 || 0) + parseFloat(row[field_1]),
      "agg_minus_field_2": (memo.agg_minus_field_2 || 0) + parseFloat(row[field_2])
    };
  },
  "agg_divide": (row, memo, filter, fields) => {
    const molecular = fields[0].title;
    const denominator = fields[1].title;
    return {
      "agg_divide_molecular": (memo.agg_divide_molecular || 0) + parseFloat(row[molecular]),
      "agg_divide_denominator": (memo.agg_divide_denominator || 0) + parseFloat(row[denominator])
    };
  },
  "agg_multiply": (row, memo, filter, fields) => {
    const res = fields.reduce((curr, field) => {
      return curr * parseFloat(row[field.title]);
    }, 1)
    return {
      "agg_multiply": (memo.agg_multiply || 0) + res
    };
  },
  "agg_average": (row, memo, filter, fields) => {
    const field = fields[0].title;
    return {
      "agg_average_count": (memo["agg_average_count"] || 0) + 1,
      "agg_average_field": (memo.agg_average_field || 0) + parseFloat(row[field])
    };
  },
  "agg_percentage": (row, memo, filter, fields, rows) => {
    const molecular = fields[0].title;

    const row_total = rows.reduce((total, data) => {
      if(filter && filter(data)) {
        return total + parseFloat(data[molecular]);
      } else {
        return total;
      }
    }, 0);
    return {
      "agg_percentage_total": ((memo.agg_percentage_total || 0) + parseFloat(row[molecular])),
      "agg_percentage_data_total": parseFloat(row_total)
    };
  }
}
