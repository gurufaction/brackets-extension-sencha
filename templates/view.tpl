Ext.define('{{PROJECT_NAMESPACE}}.view.{{VIEW_NAME}}', {
    extend  : 'Ext.Panel',
    alias   : 'widget.{{VIEW_ALIAS}}',

    title   : '{{VIEW_TITLE}}',
    html    : '{{VIEW_HTML}}',

    initComponent: function () {
        
        this.callParent(arguments);
    }
});