Ext.define('{{PROJECT_NAMESPACE}}.view.{{NAME}}' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.{{ALIAS}}',
    store: '{{STORE}}',
    title: '{{TITLE}}',

    initComponent: function() {
        this.columns = [
            {{#FIELDS}}
            {header: '{{HEADER}}',  dataIndex: '{{NAME}}'}{{#LAST}},{{/LAST}}
            {{/FIELDS}}
        ];

        this.callParent(arguments);
    }
});