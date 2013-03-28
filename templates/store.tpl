/*global Ext */

Ext.define('{{PROJECT_NAMESPACE}}.store.{{NAME}}', {
    extend: 'Ext.data.Store',
    model: '{{PROJECT_NAMESPACE}}.model.{{NAME}}',
    remoteSort: true,
    autoLoad: {start: 0, limit: 50}
});