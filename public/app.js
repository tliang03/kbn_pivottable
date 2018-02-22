import { VisVisTypeProvider } from 'ui/vis/vis_type';
import { TemplateVisTypeProvider } from 'ui/template_vis_type/template_vis_type';
import { VisSchemasProvider } from 'ui/vis/schemas';
import { VisTypesRegistryProvider } from 'ui/registry/vis_types';

import 'ui/agg_table';
import 'ui/agg_table/agg_table_group';

import TablesVisTemplate from 'plugins/pivottable/kbn_pivottable.html';
import 'plugins/pivottable/kbn_pivottable_controller';
import image from './icon.svg';

import './style/main';
import template from './options/kbn_pivottable_template.html';

VisTypesRegistryProvider.register((Private) => {
  const VisType = Private(VisVisTypeProvider);
  const TemplateVisType = Private(TemplateVisTypeProvider);
  const Schemas = Private(VisSchemasProvider);

  return new TemplateVisType({
    name: 'pivot-table',
    title: 'Pivot Table',
    image,
    category: VisType.CATEGORY.DATA,
    description: 'Display values in a table with ability to drag and drop column and rows',
    template: TablesVisTemplate,
    params: {
      defaults: {
        perPage: 10,
        customizedMetric: []
      },
      editor: template
    },
    implementsRenderComplete: true,
    hierarchicalData: function (vis) {
      return Boolean(vis.params.showPartialRows || vis.params.showMeticsAtAllLevels);
    },
    schemas: new Schemas([
      {
        group: 'metrics',
        name: 'metric',
        title: 'Metric',
        aggFilter: '!geo_centroid',
        min: 1,
        defaults: [
          { type: 'count', schema: 'metric' }
        ]
      },
      {
        group: 'buckets',
        name: 'bucket',
        title: 'Split Rows'
      }
    ])
  });
});
