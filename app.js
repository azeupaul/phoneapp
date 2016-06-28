$(function(){
	var AppView = Backbone.View.extend({
		el: '#container',
		initialize: function(){
			this.render();
		},
		render: function(){
			this.$el.html("Hello word");
		}
	});

	// Lancement de l'application
	var App = new AppView;
});