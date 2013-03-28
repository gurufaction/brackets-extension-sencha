Ext.define('.view.', {
    extend  : 'Ext.Panel',
    alias   : 'widget.',

    title   : '',
    html    : '',

    initComponent: function () {
        
        this.callParent(arguments);
    }
});