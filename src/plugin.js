import { dsMergeOptions, dsMergeValidate, dsValidate, dsDefaults, dsBind, dsMerge } from './functions';
import { default as Component } from './component';
import * as ComponentMap from './components'
import * as DS from 'dayspan'

const DayspanVuetify = {

  install(Vue, options)
  {
    // register all components globally
    for (var componentName in ComponentMap)
    {
      Vue.component( componentName, ComponentMap[ componentName ] );
    }

    // $dayspan is just another reactive component
    var $dayspan = new Vue( options
      ? dsMergeOptions( options, Component )
      : Component );


    // allow directives to access $dayspan
    Vue.$dayspan = $dayspan;

    // allow components to access $dayspan
    Vue.prototype.$dayspan = $dayspan;
    Vue.FC = {
      dsMerge : dsMerge,
    }
    Vue.DS = DS;

    // allow components to pull & merge default component props into given
    // component props.
    Vue.prototype.$dsValidate = dsMergeValidate;
    Vue.prototype.$dsDefaults = dsDefaults;

    // allow v-bind="{$scopedSlots}"
    Vue.prototype._b = dsBind(Vue.prototype._b);

    // Call initialization functions
    $dayspan.init();
  }

};


if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(DayspanVuetify)
}

export default DayspanVuetify