Ext.define('{{PROJECT_NAMESPACE}}.controller.{{CONTROLLER_NAME}}', {
    extend: 'Ext.app.Controller',

    views: [
        {{#VIEWS}}
        '{{NAME}}'{{^LAST}},{{/LAST}}
        {{/VIEWS}}
    ],
    
    init: function () {
        console.log('Initialized! This happens before the Application launch function is called');
    }
});