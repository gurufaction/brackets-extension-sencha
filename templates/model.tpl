Ext.define('{{PROJECT_NAMESPACE}}.model.{{NAME}}', {
    extend: 'Ext.data.Model',
    fields: [
        {{#FIELDS}}
        { name: '{{NAME}}', type: '{{TYPE}}'}{{^LAST}},{{/LAST}}
        {{/FIELDS}}
    ]
});