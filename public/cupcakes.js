

var Cupcake = Backbone.Model.extend({
	validate: function(attributes) {
	    if (!attributes.title) {
	      return "Needs a title"
	    }

	    if (!attributes.icing) {
	      return "Needs Icing"
	    }
	}


})



var Shop = Backbone.Collection.extend({
	url:"/cupcakes",
	model: Cupcake
})

var switchUI = function(){
	$(".addSide").toggle()
	$(".editSide").toggle()
}

var updateUI = function() {
	$("#flavor-list").html("")

	shop.each(function(flavor){
		var htmlString = templates.cup(flavor.toJSON())
		var $itemHtml = $(htmlString)
		
		$("#flavor-list").append($itemHtml)
		
		$itemHtml.find(".btn-remove").on("click",function(){
			var id = $(this).attr("data-id")
			shop.get(id).destroy({
				complete: updateUI
			})
		})
		$itemHtml.find(".btn-edit", function(){
			switchUI()
			var id = $(this).attr("data-id")
			var cup = shop.get(id)

			$("#Cake").val(cup.get("cake"))
			$("#Icing").val(cup.get("icing"))
		})
	})

}
$(".btn-cancel").on("click", switchUI)

$("#btn-edit").on("click",function(){
	var cake = $("#Cake").val()
	var icing = $("#Icing").val()

	var cupcake = shop.get(currentlyEditedId)
	cupcake.set("cake", cake)
	cupcake.set("icing", icing)

	if(cupcake.isValid()){
		cupcake.save({},{
			complete:function(){
				updateUI
				switchUI
			}
		})
	}
	else{
		alert(cupcake.validationError)
	}

})
//adding new cupcake
$("#btn-add").on("click", function(){
	var cake = $(".cakeTitle").val()
	var icing = $(".icingTitle").val()

	var cupcake = new Cupcake({
		cake: cake,
		icing: icing,
		sprinkles: false
})
	if(cupcake.isValid()=== true){
		shop.add(cupcake)
		shop.save({}, {
			complete: updateUI
		})
		$(".cakeTitle").val("")
		$(".icingTitle").val("")
	}else{
		alert(cupcake.validationError)
	}
})


var templates = {}
var shop = new Shop

$(document).on("ready", function(){

	var html = $("#cake-template").text()
	templates.cup = Handlebars.compile(html)

	shop.fetch({
		success: function(){
			updateUI()
		}
	})
})
