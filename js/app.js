(function ($) {
    /* Static data for application */
	var developers = [
        { name: "Developer 1", skill: "Java, PHP, HTML, JavaScript, CSS", company: "Sun Microsystems", email: "mail@sun.com", type: "Software Engineer" },
        { name: "Developer 2", skill: "Java, PHP, HTML, JavaScript, CSS", company: "Sun Microsystems", email: "mail@sun.com", type: "Software Engineer" },
        { name: "Developer 3", skill: "Java, PHP, HTML, JavaScript, CSS", company: "Sun Microsystems", email: "mail@sun.com", type: "Software Engineer" },
        { name: "Developer 4", skill: "Java, PHP, HTML, JavaScript, CSS", company: "Sun Microsystems", email: "mail@sun.com", type: "Software Developer" },
        { name: "Developer 5", skill: "Java, PHP, HTML, JavaScript, CSS", company: "Sun Microsystems", email: "mail@sun.com", type: "Software Engineer" },
        { name: "Developer 6", skill: "Java, PHP, HTML, JavaScript, CSS", company: "Sun Microsystems", email: "mail@sun.com", type: "Software Developer" }
    ];

    /* Developer model */
    var Developer = Backbone.Model.extend({
        defaults: {
            photo: "img/developer.png",
            name: "",
            skill: "",
            company: "",
            email: "",
            type: ""
        }
    });

    /* Directory collection containing the Developer model */
    var Directory = Backbone.Collection.extend({
        model: Developer
    });

    /* View for a single Developer model within the Directory collection */
    var DeveloperView = Backbone.View.extend({
        /* Using the article HTML5 tag */
        tagName: "article",
        className: "developer-container",
        template: $("#developerTemplate").html(),
        editTemplate: $("#developerEditTemplate").html(),

        render: function () {
            /* Reference to template function */
            var tmpl = _.template(this.template);
            /* $el jQuery caching object automaticly created by Backbone.js */
            this.$el.html(tmpl(this.model.toJSON()));
            //this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        /* View events */
        events: {
            "click button.delete": "deleteDeveloper",
            "click button.edit": "editDeveloper",
            "change select.type": "addType",
            "click button.save": "saveEdits",
            "click button.cancel": "cancelEdit"
        },

        deleteDeveloper: function () {
            /* Store type attribute locally */
            var removedType = this.model.get("type");
            /* Remove model */
            this.model.destroy();
            /* Remove this view from UI */
            this.remove();
            /* If this is the only model of a certain type, remove type from filter selection */
            if (_.indexOf(directory.getTypes(), removedType) === -1) {
                directory.$el.find("#filter select").children("[value='" + removedType + "']").remove();
            }
        },

        editDeveloper: function () {
            /* Reference to template function */
            var editTmpl = _.template(this.editTemplate);
            /* $el jQuery caching object automaticly created by Backbone.js */
            this.$el.html(editTmpl(this.model.toJSON()));
            /* Create an add new option for the type selection */
            var newOpt = $("<option/>", {
                html: "<em>Add new...</em>",
                value: "addType"
            });
            /* Return a type selection from the createSelect() method
             and append it with the newOpt option created above. */
            this.select = directory.createSelect().addClass("type").val(this.$el.find("#type").val()).append(newOpt).insertAfter(this.$el.find(".name"));
            /* Remove hidden field from edit view so it won't interfere with saving */
            this.$el.find("input[type='hidden']").remove();
        },

        /* Replaces select with an input field */
        addType: function () {
            /* When select changes the selection is checked for addType.
             If it's addType, replace select with an input field. */
            if (this.select.val() === "addType") {
                this.select.remove();
                $("<input />", {
                    "class": "type"
                }).insertAfter(this.$el.find(".name")).focus();
            }
        },

        /* Saves edit and updates the data model */
        saveEdits: function (e) {
            /* Makes sure that the form is not submitted */
            e.preventDefault();
            /* Empty shell to put the new data in */
            var formData = {},
            /* Copy of previous attributes */
            prev = this.model.previousAttributes();
            /* Iterate over each input field from the form and add it to formData */
            $(e.target).closest("form").find(":input").add(".photo").each(function () {
                var el = $(this);
                formData[el.attr("class")] = el.val();
            });
            /* If the photo value is blank, we can delete it and the default photo will be used */
            if (formData.photo === "") {
                delete formData.photo;
            }
            /* Set form data to the current model */
            this.model.set(formData);
            /* Render the changes */
            this.render();
            /* If photo is same as default property, remove it */
            if (prev.photo === "/img/placeholder.png") {
                delete prev.photo;
            }
            /* Iterate over array and find an equal model with _.isEqual and update it */
            _.each(developers, function (developer) {
                if (_.isEqual(developer, prev)) {
                    /* Native JS .splice(index item to be updated, number items to be updated) */
                    developers.splice(_.indexOf(developers, developer), 1, formData);
                }
            });
        },

        /* Cancel the edit, just reverts back to non-editable mode */
        cancelEdit: function () {
            this.render();
        }
    });

    /* View for all Contacts within the Directory collection */
    var DirectoryView = Backbone.View.extend({
        el: $("#developers"),

        /* initialize() function which creates an instance of the Directory collection class
         and calls its own render() method */
        initialize: function () {
            this.collection = new Directory(developers);
            this.render();
            this.$el.find("#filter").append(this.createSelect());
            /* on(event to listen, handler to be executed, context to be used) */
            /* Links the custom event to the actual filter code
             this refers to the context, here the instance of DirectoryView */
            this.on("change:filterType", this.filterByType, this);
            /* Bind the reset collection event to the render method.
             It will repopulate the view with model instances from the collection.
             This refers to the context, here the instance of DirectoryView */
            this.collection.on("reset", this.render, this);
            /* Bind add to collection event to the renderDeveloper method.
             This will make sure that when something is added to the collection,
             a new view will be rendered for it. */
            this.collection.on("add", this.renderDeveloper, this);
            /* Bind remove from collection event to the removeDeveloper method.
             This method will remove its entry from the view */
            this.collection.on("remove", this.removeDeveloper, this);
        },

        render: function () {
            this.$el.find("article").remove();
            /* Underscore’s each() method to iterate over each model in the collection */
            _.each(this.collection.models, function (item) {
                /* Run for each item the renderDeveloper method taking the current item as argument */
                this.renderDeveloper(item);
            }, this);
        },

        renderDeveloper: function (item) {
            /* Instantiate a new DeveloperView and set its model property to the Developer model argument */
            var developerView = new DeveloperView({
                model: item
            });
            this.$el.append(developerView.render().el);
        },

        getTypes: function () {
            return _.uniq(this.collection.pluck("type"));
        },

        createSelect: function () {
            var filter = this.$el.find("#filter"),
            select = $("<select/>", {
                html: "<option>All</option>"
            });
 
            _.each(this.getTypes(), function (item) {
                var option = $("<option/>", {
                    value: item,
                    text: item
                }).appendTo(select);
            });
            return select;
        },

        /* View events */
        events: {
            "change #filter select": "setFilter",
            "click #add": "addDeveloper",
            "click #showForm": "showForm"
        },

        /* Event handler for filter events
         e as event object */
        setFilter: function (e) {
            /* Set filter property */
            this.filterType = e.currentTarget.value;
            /* Trigger change event */
            this.trigger("change:filterType");
        },

        /* The actual filter */
        filterByType: function () {
            /* If all, show all developers */
            if (this.filterType === "All") {
                this.collection.reset(developers);
                /* Update URL with router method */
                developersRouter.navigate("filter/All");
            /* Else only those with selected type */
            } else {
                /* silent:true so that there's no unnecessary re-rendering when we reset the collection
                 at the start of the second branch of the conditional. When one filters by one type,
                 and then filters by another type it won't lose any models. */
                this.collection.reset(developers, {silent: true});
 
                var filterType = this.filterType,
                    filtered = _.filter(this.collection.models, function (item) {
                        return item.get("type") === filterType;
                    });
                this.collection.reset(filtered);
                /* Update URL with router method */
                developersRouter.navigate("filter/" + filterType);
            }
        },

        /* Event handler for add events
         e as event object */
        addDeveloper: function (e) {
            /* Makes sure that the form is not submitted */
            e.preventDefault();
            /* Empty shell to put the new data in */
            var formData = {};
            /* Iterate over each input field from the form and add it to formData */
            $("#addDeveloper").children("input").each(function (i, el) {
                /* Check if the input field has input,
                 if it does, it is added to newModel: Key = input field id Value = field content.
                 If not it won't set its values and inherit the default values. */
                if ($(el).val() !== "") {
                    formData[el.id] = $(el).val();
                }
            });
            /* Place to persist the data,
             here the new entry is added to the array. */
            developers.push(formData);
            
            /* Update the filter, solves issue when one is added with a different type. 
             First check if there is indeed a new type, -1 if not found.
             _.indexOf(array, value to be found) */
            if (_.indexOf(this.getTypes(), formData.type) === -1) {
                this.collection.add(new Developer(formData));
                /* Remove current filter selection and create a new one */
                this.$el.find("#filter").find("select").remove().end().append(this.createSelect());
            } else {
                this.collection.add(new Developer(formData));
            }
        },

        /* Backbone.js passes the removed model as a parameter. */
        removeDeveloper: function (removedModel) {
            /* Store its attributed locally */
            var removed = removedModel.attributes;
            //If photo is same as default property, remove it
            if (removed.photo === "img/placeholder.png") {
                alert("removed photo");
                delete removed.photo;
            }
            /* Iterate over array and find an equal model with _.isEqual and remove it */
            _.each(developers, function (developer) {
                /* TODO: Fix this issue??? */
                if (_.isEqual(developer.name, removed.name)) {
                    /* Native JS .splice(index item to be removed, number items to be removed) */
                    developers.splice(_.indexOf(developers, developer), 1);
                }
            });
        },

        showForm: function () {
            this.$el.find("#addDeveloper").slideToggle();
        }
    });

    /* Backbone.js Routing */
    var DevelopersRouter = Backbone.Router.extend({
        /* Key = URL to match, Value = callback function when match.
         Everything after the filter/ is a match.*/
        routes: {
            "filter/:type": "urlFilter"
        },

        urlFilter: function (type) {
            /* Set filterType property */
            directory.filterType = type;
            /* Trigger change event */
            directory.trigger("change:filterType");
        }
    });

    /* Create instance of DirectoryView */
    var directory = new DirectoryView();
    /* Create instance of router */
    var developersRouter = new DevelopersRouter();
    /* Start history service, it monitors the URL for #changes.
     It enables the URL to be changed by the router's navigate() function. */
    Backbone.history.start();

} (jQuery));