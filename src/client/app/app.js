Ext.application({
    requires: ['Ext.container.Viewport'],
    name: '',

    appFolder: 'app',
    
    controllers: [
        ''
    ],

    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                {
                    xtype: ''
                }
            ]
        });
    }
});