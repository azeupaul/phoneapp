$(function(){
    var app = {};
    var restUrl = "http://localhost/contact/web/app_dev.php/contacts";

    //Models 
    app.Contact = Backbone.Model.extend({
        urlRoot: restUrl,
        defaults: {
            name: 'contact ...',
            phoneNumber: "",
            email: "",
            favory: false
        }
    });

    // Collections
    app.ContactList = Backbone.Collection.extend({
        model: app.Contact,
        url: restUrl
    });

    //app.contactList = new app.ContactList();

    app.ContactView = Backbone.View.extend({
        tagName: 'li',
        className: 'media col-md-4 col-lg-3',
        template: _.template($('#item-contact').html()),
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    app.ContactListView = Backbone.View.extend({
        template: _.template($('#list-contacts').html()),
        renderOne: function(contact) {
            var itemView = new app.ContactView({model: contact});
            this.$('.contacts-container').append(itemView.render().$el);
        },
        render: function() {
            var html = this.template(this.model.toJSON());
            this.$el.html(html);
            this.model.each(this.renderOne, this);
            
            return this;
        }
    });

    app.Router = Backbone.Router.extend({
        routes:{
            "":"showContacts",
            "contacts": "showContacts",
            "contacts/new": "newContact",
            "contact/:id": "contactDetails"
        },
        showContacts:function () {
            this.contactList = new app.ContactList();
            var self = this;
            this.contactList.fetch({
                success:function () {
                    self.contactListView = new app.ContactListView({model:self.contactList});
                    $('.main-container').html(self.contactListView.render().el);
                    //if (self.requestedId) self.contactDetails(self.requestedId);
                }
            });
        },
        newContact: function(){
            console.log('add contact here');
        },
        contactDetails: function(){
            console.log('Contact details');
        },
    })

    // Initializers
    app.start = new app.Router();
    Backbone.history.start();
    
    
});