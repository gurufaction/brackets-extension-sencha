/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global define, $, brackets, window, Mustache */

/** Sencha Extension */
define(function (require, exports, module) {
    "use strict";

    var CommandManager  = brackets.getModule("command/CommandManager"),
        Menus           = brackets.getModule("command/Menus"),
        Dialogs         = brackets.getModule("widgets/Dialogs"),
        ExtensionUtils  = brackets.getModule("utils/ExtensionUtils"),
        Strings         = brackets.getModule("strings"),
        ProjectManager  = brackets.getModule("project/ProjectManager"),
        ProjectDialogTemplate  = require('text!htmlContent/wizard-dialog.html'),
        ModelDialogTemplate     = require('text!htmlContent/model-dialog.html'),
        FieldDialogTemplate     = require('text!htmlContent/field-dialog.html'),
        ModelTemplate           = require('text!templates/model.tpl'),
        ViewTemplate            = require('text!templates/view.tpl'),
        ControllerTemplate      = require('text!templates/controller.tpl'),
        AppTemplate             = require('text!templates/app.tpl'),
        IndexTemplate           = require('text!templates/index.tpl'),
        ProjectTemplate         = require('text!templates/project.tpl'),
        FileUtils               = brackets.getModule("file/FileUtils"),
        NativeFileSystem        = brackets.getModule("file/NativeFileSystem").NativeFileSystem;

    ExtensionUtils.loadStyleSheet(module, "dialog.css");
    
    function _isValidName(name) {
        var regEx = /"^[_a-zA-Z]([_a-zA-Z0-9])*([\\.][_a-zA-Z]([_a-zA-Z0-9])*)*$"/;
        var result = name.match(regEx, name);
        console.log(result + ":" + name);
        return true;
    }
    
    function _getFilename(path) {
        return path.substr(path.lastIndexOf("/") + 1);
    }
    
    function _getRootDir(path) {
        return path.substring(0, path.lastIndexOf("/"));
    }
    
    function _convertToPath(name) {
        var path = name.replace(/\./g, "/");
        return {
            "filename"      : _getFilename(path),
            "fullPath"      : path,
            "rootDir"       : _getRootDir(path)
        };
    }

    function createFile(filePath, template, entityVars, options) {
        if (options === undefined) {
            options = {create : true, exclusive: false};
        }
        var rootDir = _getRootDir(filePath);
        var filename = _getFilename(filePath);
        // Get Project Root Directory
        var projectDir = ProjectManager.getProjectRoot();
        console.log(rootDir + ":" + filename + ":" + filePath + ":" + options);
        projectDir.getDirectory(rootDir, options,
            function (dir) {
                console.log(dir);
                var file = new NativeFileSystem.FileEntry(dir.fullPath + filename, true, NativeFileSystem.FileSystem);
                console.log(file);
                FileUtils.writeText(file, Mustache.render(template, entityVars)).done(function () {
                    console.log("File created: " + file.fullPath);
                }).fail(function (err) {
                    console.log("Error writing text: " + file.fullPath);
                });
            }, function (err) {
                console.log(err.name + ":" + rootDir);
            });
    }
    
    // Function to run when the menu item is clicked
    function openNewProjectDialog() {
        
        var $dlg, promise, $name, $namespace, $defaultView, $defaultController;
        
        promise = Dialogs.showModalDialogUsingTemplate(Mustache.render(ProjectDialogTemplate, Strings), "Sencha Project")
            .done(function (id) {
                if (id === Dialogs.DIALOG_BTN_OK) {
                    
                    var projectDir = ProjectManager.getProjectRoot();
                    
                    var projectVars = $.extend({
                        PROJECT_NAME        :   $name.val().substr($name.val().lastIndexOf(".") + 1),
                        PROJECT_NAMESPACE   :   $name.val(),
                        SRC_DIR             :   "src",
                        LIB_DIR             :   "lib",
                        SDK_DIR             :   "ext",
                        CLIENT_DIR          :   "client",
                        SERVER_DIR          :   "server"
                    });
                    
                    var applicationVars = $.extend({
                        DEFAULT_VIEW        : $defaultView.val().replace(".", ""),
                        CONTROLLERS         : [
                            {
                                "NAME" : $defaultController.val(),
                                "LAST" : true
                            }
                        ]
                    }, projectVars);

                    var CLIENT_PATH = projectVars.SRC_DIR + "/" + projectVars.CLIENT_DIR;
                    createFile("project.json", ProjectTemplate, projectVars);
                    createFile(CLIENT_PATH + "/index.html", IndexTemplate, projectVars);
                    createFile(CLIENT_PATH + "/app/app.js", AppTemplate, applicationVars);
                    // Create client-side application directory structure
                    projectDir.getDirectory(CLIENT_PATH, {create: true});
                    projectDir.getDirectory(CLIENT_PATH + "/app/model", {create: true});
                    projectDir.getDirectory(CLIENT_PATH + "/app/view", {create: true});
                    projectDir.getDirectory(CLIENT_PATH + "/app/controller", {create: true});
                    projectDir.getDirectory(CLIENT_PATH + "/app/store", {create: true});
                    
                    
                    // Create Default View
                    var viewVars = $.extend({
                        "NAME"     : $defaultView.val(),
                        "ALIAS"    : $defaultView.val().replace(".", ""),
                        "TITLE"    : projectVars.PROJECT_NAME
                    }, projectVars);
                    var viewPath = _convertToPath($defaultView.val());
                    createFile(CLIENT_PATH + "/app/view/" + viewPath.fullPath + ".js", ViewTemplate, viewVars);
                    
                    // Create Default Controller
                    var controllerVars = $.extend({
                        "NAME"     : $defaultController.val(),
                        "VIEWS"    : [
                            { "NAME" : $defaultView.val(), "LAST" : true }
                        ]
                    }, projectVars);
                    var ctrlPath = _convertToPath($defaultController.val());
                    createFile(CLIENT_PATH + "/app/controller/" + ctrlPath.fullPath + ".js", ControllerTemplate, controllerVars);
                }
            });
        
        $dlg = $(".project-dialog.instance");
        $name = $dlg.find(".project-name");
        $name.focus();
        $namespace = $dlg.find(".project-namespace");
        $defaultController = $dlg.find(".project-default-controller");
        $defaultView = $dlg.find(".project-default-view");
        
    }
    
    function generateNewView() {
        var $dlg, promise, $name, fieldDlgPromise;
        
        promise = Dialogs.showModalDialogUsingTemplate(Mustache.render(ModelDialogTemplate, Strings), "Sencha View Generator")
            .done(function (id) {
                if (id === Dialogs.DIALOG_BTN_OK) {
                    if (_isValidName($name.val())) {
                        var projectDir = ProjectManager.getProjectRoot();
                        console.log(projectDir);
                        projectDir.getFile("project.json", function (fileEntry) {
                            FileUtils.readAsText(fileEntry).done(function (rawText, readTimestamp) {
                                var projectVars = JSON.parse(rawText);
                                var CLIENT_PATH = projectVars.SRC_DIR + "/" + projectVars.CLIENT_DIR;
                                var path = _convertToPath($name.val());
                                var templateVars = $.extend({
                                    "VIEW"   :   path.filename
                                }, projectVars);
                                createFile(CLIENT_PATH + "/app/view/" + path.rootDir + "/" + path.filename + ".js", ViewTemplate, templateVars);
                            }).fail(function (err) {
                                console.log("Error reading text: " + err.name);
                            });
                            
                        }, function (err) {
                            console.log("Project File Not Found!");
                        });
                    } else {
                        console.log("Invalid Name: " + $name.val());
                    }
                }
            });
        
        $dlg = $(".model-dialog.instance");
        $name = $dlg.find(".model-name");
    }
    
    function generateNewModel(modelName, fields) {

        var $dlg, promise, $name;
        var templateVars = $.extend({
            "FIELD" :   "ADD FIELD",
            "OK"    :   "DONE",
            "CANCEL":   "CANCEL",
            "FIELDS":   fields
        });

        console.log(modelName);
        console.log(fields);
        promise = Dialogs.showModalDialogUsingTemplate(Mustache.render(ModelDialogTemplate, templateVars), "Sencha Model Generator")
            .done(function (id) {
                console.log(id);
                if (id === Dialogs.DIALOG_BTN_OK) {
                    if (_isValidName($name.val())) {
                        var projectDir = ProjectManager.getProjectRoot();
                        
                        projectDir.getFile("project.json", {}, function (fileEntry) {
                            FileUtils.readAsText(fileEntry).done(function (rawText, readTimestamp) {
                                
                                var projectVars = JSON.parse(rawText);
                                var CLIENT_PATH = projectVars.SRC_DIR + "/" + projectVars.CLIENT_DIR;
                                
                                var path = _convertToPath($name.val());
                                
                                var model = {
                                    "NAME"    : path.filename,
                                    "FIELDS"  : fields
                                };
                                
                                var templateVars = $.extend({
                                    "NAME"      : path.filename,
                                    "FIELDS"    : fields,
                                    "LAST"      : true
                                }, projectVars);
                                createFile(CLIENT_PATH + "/app/model/" + path.rootDir + "/" + path.filename + ".js", ModelTemplate, templateVars);
                                // Update Project File
                                projectVars.MODELS.push(model);
                                createFile("project.json", ProjectTemplate, projectVars);
                            }).fail(function (err) {
                                console.log("Error reading text: " + err.name);
                            });
                            
                        }, function (err) {
                            console.log("Project File Not Found!");
                        });
                    } else {
                        console.log("Invalid Name: " + $name.val());
                    }
                } else if (id === "add_field") {
                    var fieldDlg, fieldName, fieldType;
                    
                    var fieldPromise = Dialogs.showModalDialogUsingTemplate(Mustache.render(FieldDialogTemplate, Strings), "Add Field")
                        .done(function (id) {
                            if (id === Dialogs.DIALOG_BTN_OK) {
                                var field = {};
                                field.NAME = fieldName.val();
                                field.TYPE = fieldType.val();
                                field.LAST = true;
                                
                                if (fields === undefined) {
                                    fields = [];
                                }
                                var x;
                                for (x = 0; x < fields.length; x++) {
                                    fields[x].LAST = false;
                                }
                                
                                fields.push(field);
                                generateNewModel($name.val(), fields);
                            }
                        });
                    
                    fieldDlg = $(".field-dialog.instance");
                    fieldName = fieldDlg.find(".field-name");
                    fieldType = fieldDlg.find(".field-type");
                    fieldName.focus();
                }
            });
        
        $dlg = $(".model-dialog.instance");
        $name = $dlg.find(".model-name");
        $name.focus();
        if (modelName) {
            $name.val(modelName);
        }
    }
    
    function generateNewController() {

        var $dlg, promise, $name;
        
        promise = Dialogs.showModalDialogUsingTemplate(Mustache.render(ModelDialogTemplate, Strings), "Sencha Controller Generator")
            .done(function (id) {
                if (id === Dialogs.DIALOG_BTN_OK) {
                    if (_isValidName($name.val())) {
                        var projectDir = ProjectManager.getProjectRoot();
                        projectDir.getFile("project.json", {create: false}, function (fileEntry) {
                            FileUtils.readAsText(fileEntry).done(function (rawText, readTimestamp) {
                                var projectVars = JSON.parse(rawText);
                                var CLIENT_PATH = projectVars.SRC_DIR + "/" + projectVars.CLIENT_DIR;
                                var path = _convertToPath($name.val());
                                var templateVars = $.extend({
                                    "NAME"   :   path.filename
                                }, projectVars);
                                createFile(CLIENT_PATH + "/app/controller/" + path.rootDir + "/" + path.filename + ".js", ControllerTemplate, templateVars);
                            }).fail(function (err) {
                                console.log("Error reading text: " + err.name);
                            });
                            
                        }, function (err) {
                            console.log("Project File Not Found!");
                        });
                        
                    } else {
                        console.log("Invalid Name: " + $name.val());
                    }
                }
            });
        
        $dlg = $(".model-dialog.instance");
        $name = $dlg.find(".model-name");
    }

    // First, register a command - a UI-less object associating an id to a handler
    var PROJECT_COMMAND_ID  = "com.gurufaction.newProject";   // package-style naming to avoid collisions
    var NEW_MODEL_ID        = "com.gurufaction.newModel";
    var NEW_VIEW_ID         = "com.gurufaction.newView";
    var NEW_CONTROLLER_ID   = "com.gurufaction.newController";
    CommandManager.register("New Sencha Project", PROJECT_COMMAND_ID, openNewProjectDialog);
    CommandManager.register("New Sencha Model", NEW_MODEL_ID, generateNewModel);
    CommandManager.register("New Sencha View", NEW_VIEW_ID, generateNewView);
    CommandManager.register("New Sencha Controller", NEW_CONTROLLER_ID, generateNewController);

    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(PROJECT_COMMAND_ID, "Ctrl-P", Menus.First);
    var contextMenu = Menus.getContextMenu(Menus.ContextMenuIds.PROJECT_MENU);
    contextMenu.addMenuItem(NEW_MODEL_ID);
    contextMenu.addMenuItem(NEW_VIEW_ID);
    contextMenu.addMenuItem(NEW_CONTROLLER_ID);
});