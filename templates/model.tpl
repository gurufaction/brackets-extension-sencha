/*global Ext */

Ext.define('{{PROJECT_NAMESPACE}}.model.{{NAME}}', {
    extend: 'Ext.data.Model',
    fields: [
        {{#FIELDS}}
        { name: '{{NAME}}', type: '{{TYPE}}'}{{^LAST}},{{/LAST}}
        {{/FIELDS}}
    ],
    
    {{#HAS_MANY}}
    hasMany: [
        '{{NAME}}'{{^LAST}},{{/LAST}}
    ]
    {{/HAS_MANY}}
    
    {{#PROXY}}
    proxy: {
        type: '{{TYPE}}',
        url : '/{{URL}}'
    }
    {{/PROXY}}
});