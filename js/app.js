(function ($) {
    /* Static data for application */
	var developers = [
        { name: "Developer 1", skill: "Java, PHP, HTML, JavaScript, CSS", company: "Sun", email: "mail@sun.com", type: "Software Engineer" },
        { name: "Developer 2", skill: "Java, PHP, HTML, JavaScript, CSS", company: "Sun", email: "mail@sun.com", type: "Software Engineer" },
        { name: "Developer 3", skill: "Java, PHP, HTML, JavaScript, CSS", company: "Sun", email: "mail@sun.com", type: "Software Engineer" },
        { name: "Developer 4", skill: "Java, PHP, HTML, JavaScript, CSS", company: "Sun", email: "mail@sun.com", type: "Software Engineer" },
        { name: "Developer 5", skill: "Java, PHP, HTML, JavaScript, CSS", company: "Sun", email: "mail@sun.com", type: "Software Engineer" },
        { name: "Developer 6", skill: "Java, PHP, HTML, JavaScript, CSS", company: "Sun", email: "mail@sun.com", type: "Software Engineer" }
    ];

    /* Developer model */
    var Developer = Backbone.Model.extend({
        defaults: {
            photo: "img/developer.png"
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
        /* Using Underscore's template() method */
        render: function () {
            var tmpl = _.template(this.template);
            /* $el jQuery caching object automaticly created by Backbone.js */
            this.$el.html(tmpl(this.model.toJSON()));
            return this;
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
        },

        render: function () {
            var thisFunction = this;
            /* Underscore’s each() method to iterate over each model in the collection */
             _.each(this.collection.models, function (item) {
                /* Run for each item the renderDeveloper method taking the current item as argument */
                thisFunction.renderDeveloper(item);
            }, this);
        },

        renderDeveloper: function (item) {
            /* Instantiate a new DeveloperView and set its model property to the Developer model argument */
            var developerView = new DeveloperView({
                model: item
            });
        this.$el.append(developerView.render().el);
        }
    });

    /* Create instance of DirectoryView */
    var directory = new DirectoryView();
} (jQuery));