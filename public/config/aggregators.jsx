import React from 'react';
import reducers from './aggreducers';
import calculators from './aggcalculators';


export default [
  {
    label: "Count",
    value: "agg_count",
    reduce: reducers['agg_count'],
    calculation: calculators['agg_count'],
    min: 1,
    max: 1
  },
  {
    label: "Sum",
    value: "agg_sum",
    reduce: reducers['agg_sum'],
    calculation: calculators['agg_sum'],
    min: 1
  },
  {
    label: "Minus",
    value: "agg_minus",
    reduce: reducers['agg_minus'],
    calculation: calculators['agg_minus'],
    min: 2,
    max: 2
  },
  {
    label: "Multiply",
    value: "agg_multiply",
    reduce: reducers['agg_multiply'],
    calculation: calculators['agg_multiply'],
    min: 1
  },
  {
    label: "Divide",
    value: "agg_divide",
    reduce: reducers['agg_divide'],
    calculation: calculators['agg_divide'],
    min: 2,
    max: 2
  },
  {
    label: "Percentage",
    value: "agg_percentage",
    reduce: reducers['agg_percentage'],
    calculation: calculators['agg_percentage'],
    min: 1,
    max: 1
  },
  {
    label: "Max",
    value: "agg_max",
    reduce: reducers['agg_max'],
    calculation: calculators['agg_max'],
    min: 1,
    max: 1
  },
  {
    label: "Min",
    value: "agg_min",
    reduce: reducers['agg_min'],
    calculation: calculators['agg_min'],
    min: 1,
    max: 1
  },
  {
    label: "Average",
    value: "agg_average",
    reduce: reducers['agg_average'],
    calculation: calculators['agg_average'],
    min: 1,
    max: 1
  }
];
