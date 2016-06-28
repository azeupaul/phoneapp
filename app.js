$(function(){
	var app = {};

	//Models 
	app.Contact = Backbone.Model.extend({
		defaults: {
			name: 'contact ...',
			phonenumber: 99999999,
			favorite: false
		},
	});

	// Collections
	app.ContactList = Backbone.Collection.extend({
		model: app.Contact,
		//Save all contact on contact-backbone namespace
		localStorage: new Backbone.LocalStorage("contact-backbone"),
	});
});