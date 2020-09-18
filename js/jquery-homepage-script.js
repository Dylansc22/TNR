/*
		$(document).ready(function () {
			$('.cases').hover(
	       		function(){ $(this).addClass('hovered') },
	       		function(){ $(this).removeClass('hovered') },
			)
		});
		$(document).ready(function () {
			$('.cases').hover(
	       		function(){$(this).find("div").toggleClass("hidden")},
	       		/*some line of code needs to go here but i havent figured it out yet


			)
		});
		*/

$(document).ready(function () {
  $(".cases").hover(
    function () {
      $(".cases").not(this).addClass("dimmed");
    },
    function () {
      $(".cases").not(this).removeClass("dimmed");
    }
  );
});

/*Initialized My Slick Carousel, and custom settings on Homepage */
$("#whyride").slick({
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  centerPadding: "12vw",
  //centerMode: true,
  arrows: true,
  autoplay: true,
  touchThreshold: 20,
  autoplaySpeed: 8000,
  nextArrow: '<i class="fa fa-2x fa-arrow-right"></i>',
  prevArrow: '<i class="fa fa-2x fa-arrow-left"></i>',
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
});

/*Initialized My Slick Carousel, and custom settings on Homepage */
$("#stats").slick({
  infinite: true,
  slidesToShow: 4,
  slidesToScroll: 1,
  centerPadding: "12vw",
  //centerMode: true,
  arrows: true,
  autoplay: false,
  autoplaySpeed: 8000,
  nextArrow: '<i class="fa fa-2x fa-arrow-right"></i>',
  prevArrow: '<i class="fa fa-2x fa-arrow-left"></i>',
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
});
/*This below code is part of what I need to highlight/darken the slick slides on screen,
			so when i activate it, and create a css class with color red, and border-color red, it will 
			make that slick box red on screen. But its kinda not working the way I like so I'm just deactiving it
			and will work on it later. 


			$('#whyride').on('afterChange', function(event, slick, currentSlide, nextSlide){
				$(".slick-slide").removeClass('works');
				$('.slick-current').addClass('works'); 
			});
			*/
