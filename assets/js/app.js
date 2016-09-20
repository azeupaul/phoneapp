$(function(){
    var app = {};
    var restUrl = "http://localhost/contactAPI/web/app_dev.php/contacts";

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

    app.newContact = Backbone.View.extend({
        template: _.template($('#tpl-new-contact').html()),
        render: function() {
            var html = this.template(_.extend(this.model.toJSON(), {
                isNew: this.model.isNew()
            }));
            this.$el.append(html);
            
            return this;
        },
        events: {
            'submit .contact-form': 'onFormSubmit'
        },
        
        /* ... */
        
        onFormSubmit: function(e) {
            e.preventDefault();
            
            this.trigger('form:submitted', {
                name: this.$('.contact-name-input').val(),
                tel: this.$('.contact-tel-input').val(),
                email: this.$('.contact-email-input').val()
            });
        }
    })

    app.contactList = new app.ContactList();

    app.Router = Backbone.Router.extend({
        routes:{
            "":"showContacts",
            "contacts": "showContacts",
            "contacts/new": "newContact",
            "contact/:id": "contactDetails"
        },
        showContacts:function () {
            this.contactList = app.contactList;
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
            var newContactForm = new app.newContact({
                model: new app.Contact()
            });
            newContactForm.on('form:submitted', function(attrs) {
                app.contactList.add(attrs);
                app.start.navigate('contacts', true);
            });
            $('.main-container').html(newContactForm.render().$el);
        },
        contactDetails: function(){
            console.log('Contact details');
        },
    })

    // Initializers
    app.start = new app.Router();
    Backbone.history.start();
    
    
});