Ext.define('{{PROJECT_NAMESPACE}}.model.{{MODEL_NAME}}', {
    extend: 'Ext.data.Model',
    fields: [
        {{#MODEL_FIELDS}}
        { name: '{{NAME}}',  type: '{{TYPE}}'}{{^LAST}},{{#LAST}}
        {{/MODEL_FIELDS}}
    ]
});