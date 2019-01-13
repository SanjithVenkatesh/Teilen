$(document).ready(function() {
	setTimeout(function() {
		changeOpacity(".name");
	}, 200);

	setTimeout(function() {
		changeOpacity("#intro");
	}, 900);

	$("#nav > a").each(function(i, elem) {
		setTimeout(function() {
			changeOpacity($(elem));
		}, 1500 + 300 * i);
	});

	// DECLARED
	let task = {	"•Wing Data Science Intern": {
		"img": "wing.png",
		"url": "http://getwingapp.com/",
		"descrip": "At Wing, I identify useful KPIs such as fulfiller and user activity and write respective SQL querries. I attend weekly meetings to inform officers of my personal evaluation of the Data Science team progress. "
	},
				"•UDSA": {
					"img": "udsa.jpg",
					"url": "https://www.facebook.com/udsauci/",
					"descrip": "As the Resource Acquisition for Undergraduate Data Science Association, I am responsible for inviting representatives from tech companies to educate the club of core data science skills. Occassionally, I also lead workshops and teach club members popular tools such as R."
				},
		    	
				
				"•UCI Writing & Communication Peer Tutor": {
					"img": "writing.png",
					"url": "http://www.writingcenter.uci.edu/",
					"descrip": "As a peer tutor for the UCI Writing&Communication Center, I suggest ways to improve students' writing and editing skills, as well as help students evaluate their sources. We ask open-ended questions to encourage students to think about logic in text."
				},
				"•UCI Peer Mentor": {
					"img": "paa.jpg", 
					"url": "http://paap.due.uci.edu/",
					"descrip": "As a Peer Mentor under the school of ICS, I share tips to appointed freshmen about scheduling classes, campus resources, and school-life balance. I'm always willing keep an open ear about students' specific questions!" 
				},
				
				
	}

	// ACTIVITIES

	/** Shortens length of string to given character length and adds ellipses **/
	let shorten = function(str, char) {
		return str.substring(0, char - 3) + '... '
	} 

	/** Creates DOM structure for mobile responsiveness **/
	let calculateActivities = function() {
		if ($(window).width() > 900) {
			$("#mobile-activities").hide();
			$("#together").show();
			if (!$("#tasks").text()) { // populate with tasks.
				Object.keys(task).forEach(function(tsk) {
					let t = task[tsk]
					$("#tasks").append('<a href="' + t.url + '" target="_blank">' + tsk + '</a>');
				})
			}
		} else {
			$("#together").hide();
			$("#mobile-activities").show()
			if (!$("#mobile-activities").text()) {
				Object.keys(task).forEach(function(tsk) {
					let t = task[tsk]
					let descrip = shorten(t.descrip, 85);	
					$("#mobile-activities").append('<div class="activity-card"><a href="' + t.url + '" class="card-title">' + tsk + '</a><div class="card-description short">' + descrip + '</div><a class="read-more">read more</a></div>');
				})
			}
		}
	}

	calculateActivities();

	$(window).resize(function() {
		calculateActivities();
	})

	$(".read-more").click(function() {
		let $parent = $(this).prev()
		let title = $parent.prev('.card-title').text()
		let fullText = task[title].descrip
		if ($parent.hasClass("short")) {
			$parent.removeClass("short");
			$parent.text(fullText);
			$(this).text("hide");
		} else {
			$parent.addClass("short");
			$parent.text(shorten(fullText, 85));
			$(this).text("read more");
		}
	})

	let defaultText = true;
	
	// Hovering
	$("#tasks > a").hover(function() {

		let selectedTask = task[this.textContent];
		let image = $("#background-img img");
		let description = $("#description p");
		let newSrc = "assets/img/" + selectedTask.img

		description.text(selectedTask.descrip);
		description.removeClass("flash-class");      
		$("#description").show()

		if (image.attr("src") != newSrc) {
			image.attr("src", newSrc)
			let newImage = image.clone();
			newImage.appendTo("#background-img")
			newImage.attr("src", newSrc);

			image.remove();
		}
	}, function() {}) 

	// PORTFOLIO
	let oldText;
	$(".coming-soon").hover(function() {
		oldText = $(this).text();
		$(this).text(oldText + " (Coming Soon!)");
	}, function() {
		$(this).text(oldText);
	})

	// Waypoints
	let firstScrollthrough = true;

	$("#activities").waypoint(function() {
		changeOpacity("#mobile-activities");

		if (firstScrollthrough) {
			$("#description").css("transform", "scale(1.2)");
			setTimeout(function() {
				$("#together").css("transform", "scale(1)");
				changeOpacity("#together");
				$("#description").css("transform", "scale(1)");
				$("#description p").addClass("flash-class");
			}, 900)

			$("#tasks > a").each(function(index, elem) {
				setTimeout(function() {
					changeOpacity($(elem));
				}, 500 + 250 * index);
			})
		}
		firstScrollthrough = false;
	})

	$("#portfolio").waypoint(function() {
		changeOpacity(".card:first-child, .card:nth-child(2)")
		setTimeout(function() {
			changeOpacity(".card:nth-child(3), .card:nth-child(4)");
		}, 200);

		for (i = 1; i < 4; i++) {
			var elem = $(".card li:nth-child(" + i + ")");
			(function(elem, i) {
        		setTimeout(function() {
        			changeOpacity(elem); 
        		}, 200 * (i + 2));
        	})(elem, i);
		}
	})

	$("#contact").waypoint({
		handler: function() {
			$("#background-fill").css("height", "100%");
			setTimeout(function() {
				changeOpacity("#contact .name, #contact a, #contact p");
			}, 1200)
		},
		offset: '60%'
	})

	// Scrolllll

	 // This is a functions that scrolls to #{blah}link
	let goToByScroll = function(id) {
	    // Remove "link" from the ID
	    id = id.replace("-link", "");

	    // Scroll
	    $('html,body').animate({
	        scrollTop: $("#"+id).offset().top + 20},
	        'slow');
	}

	$("#nav > a").click(function(e) { 
	      // Prevent a page reload when a link is pressed
	    e.preventDefault(); 
	      // Call the scroll function
	    goToByScroll(this.id);           
	});

	var changeOpacity = (elem) => {
		$(elem).css("opacity", 1);
	}
});
