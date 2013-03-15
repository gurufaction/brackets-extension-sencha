Ext.define('{{PROJECT_NAMESPACE}}.model.{{MODEL_NAME}}', {
    extend: 'Ext.data.Model',
    fields: [
        {{#FIELDS}}
        { name: '{{NAME}}', type: '{{TYPE}}'}{{^LAST}},{{/LAST}}
        {{/FIELDS}}
    ]
});