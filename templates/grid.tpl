/*global Ext */

Ext.define('{{PROJECT_NAMESPACE}}.view.{{NAME}}' ,{
    extend: 'Ext.grid.Panel',
    alias: 'widget.{{ALIAS}}',
    store: '{{STORE}}',
    title: '{{TITLE}}',

    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: '{{STORE}}',
        dock: 'bottom',
        displayInfo: true
    }],
    
    initComponent: function() {
        "use strict";
        
        this.columns = [
            {{#FIELDS}}
            {header: '{{HEADER}}',  dataIndex: '{{NAME}}'}{{#LAST}},{{/LAST}}
            {{/FIELDS}}
        ];

        this.callParent(arguments);
    }
});