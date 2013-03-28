/*global Ext */

Ext.define('{{PROJECT_NAMESPACE}}.view.{{NAME}}', {
    extend  : 'Ext.Panel',
    alias   : 'widget.{{ALIAS}}',

    title   : '{{TITLE}}',
    html    : '{{HTML}}',

    initComponent: function () {
        "use strict";
        
        this.callParent(arguments);
    }
});