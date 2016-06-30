$(function(){
	var app = {};

	//Models 
	app.Contact = Backbone.Model.extend({
		defaults: {
			name: 'contact ...',
			phonenumber: 99999999,
			favorite: false
		}
	});

	// Collections
	app.ContactList = Backbone.Collection.extend({
		model: app.Contact,
		//Save all contact on contact-backbone namespace
		localStorage: new Store("contact-backbone"),
	});

	app.contactList = new app.ContactList();

	app.ContactView = Backbone.View.extend({
		tagName: 'li',
		template: _.template($('#item-template').html()),
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
        initialize: function(){
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this); // remove: Convenience Backbone'
        }
	});

	app.AppView = Backbone.View.extend({
        el: '#phoneapp',
        initialize: function () {
            // when new elements are added to the collection render then with addOne
            app.contactList.on('add', this.addOne, this);
            app.contactList.on('reset', this.addAll, this);
            app.contactList.fetch(); // Loads list from local storage
        },
        events: {
            'click #save': 'createContact'
        },
        createContact: function(e){
            if (!this.$('#name').val().trim() || !this.$('#phone').val().trim()) { 
                return;
            }
            app.contactList.create(this.newAttributes());
            // clean input fields
            this.$('#name').val('');
            this.$('#phone').val('');
        },
        addOne: function(contact){
            var view = new app.ContactView({model: contact});
            $('#contact-list').append(view.render().el);
        },
        addAll: function(){
            this.$('#contact-list').html(''); // clean the todo list
            app.contactList.each(this.addOne, this);
        },
        newAttributes: function(){
            return {
                name: this.$('#name').val().trim(),
                phonenumber: this.$('#phone').val().trim(),
                favorite: false
            }
        }
    });

    // Initializers
    Backbone.history.start();
    app.appView = new app.AppView();
});