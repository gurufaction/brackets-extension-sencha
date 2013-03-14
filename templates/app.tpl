Ext.application({
    requires: ['Ext.container.Viewport'],
    name: '{{PROJECT_NAMESPACE}}',

    appFolder: 'app',
    
    controllers: [
        {{#CONTROLLERS}}
        '{{NAME}}'{{^LAST}},{{/LAST}}
        {{/CONTROLLERS}}
    ],

    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                {
                    xtype: '{{DEFAULT_VIEW}}'
                }
            ]
        });
    }
});