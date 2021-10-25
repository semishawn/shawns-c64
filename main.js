var projects = [
	{
		name: "semipedia",
		size: "15",
		desc: ""
	},
	{
		name: "geovanni",
		size: "17",
		desc: ""
	},
	{
		name: "kokomo",
		size: "2",
		desc: ""
	},
	{
		name: "ppp",
		size: "7",
		desc: ""
	}
];

var screen = $(".screen");
var boot = $(".boot");
var code = $(".code");



// Run on page load
$(document).ready(function() {
	var delay = parseFloat(boot.css("animation-duration")) * 1000;

	setTimeout(function() {
		addInput();

		$(".typeable").attr("contenteditable", false);

		new Typed(".typeable", {
			strings: ["LOAD\"$\",8^500"],
			typeSpeed: 100,
			showCursor: false,
			startDelay: delay,
			onComplete: function() {
				$(".typeable").attr("contenteditable", true);
				keepFocus();
				pressEnter(".typeable");
				$(".typeable").attr("contenteditable", false);

				var input = ".input:last-of-type .typeable";
				new Typed(input, {
					strings: ["ABOUT^500"],
					typeSpeed: 100,
					showCursor: false,
					startDelay: delay,
					onComplete: function() {
						pressEnter(input);
						screen.scrollTop(0);
					}
				});
			}
		});
	}, delay);
});



// Scroll to bottom of screen
function scrollBottom() {
	screen.scrollTop(screen[0].scrollHeight);
}



// Add typeable input row
function addInput() {
	$(".cursor").remove();

	input = $.trim(`
		READY.
		<div class="input"><span class="typeable" contenteditable spellcheck="false" tabindex="-1"></span><span class="cursor">Û</span></div>
	`).replace(/\t/g, "");

	code.append("\n" + input + "\n");

	$(".input:last .typeable").focus();
}



// Programmatically press the enter key
function pressEnter(elem) {
	var e = $.Event("keydown");
	e.which = 13;
	e.keyCode = 13;
	$(elem).trigger(e);
}



function finishCommand(output) {
	code.append("\n" + output);
	addInput();
	scrollBottom();
}



// Function to ensure user is always typing in last input
function keepFocus() {
	var input = $(".input:last .typeable");
	input.focus();
	if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
		var range = document.createRange();
		range.selectNodeContents(input[0]);
		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (typeof document.body.createTextRange != "undefined") {
		var textRange = document.body.createTextRange();
		textRange.moveToElementText(input[0]);
		textRange.collapse(false);
		textRange.select();
	}
}
$(document).click(function() {keepFocus()});
$(document).keypress(function() {keepFocus()});
$(document).on("propertychange input", ".typeable", function() {
	var upVal = $(this).text().toUpperCase();
	$(this).html(upVal);
	keepFocus();
});



$(document).on("keydown", ".typeable", function(e) {
	var command = $(this).html();

	if (e.keyCode == 13) {
		e.preventDefault();

		$(".cursor").remove();

		if (command.startsWith("LOAD")) {
			var program = $.trim(command.split("LOAD\"").pop().split("\",8")[0]);

			if (projects.some(i => i.name.includes(program.toLowerCase()))) {
				var data = $.trim(`
					RUNNING ${$.trim(program)} WILL OPEN A NEW TAB.
					IS THIS OKAY?
					CLICK OPTION: <a class="yes" href="https://semishawn.github.io/${program.toLowerCase()}" target="_blank">YES</a> <span class="no">NO</span>
				`).replace(/\t/g, "");

				var output = $.trim(`
					SEARCHING FOR ${program}
					LOADING

					${data}
				`).replace(/\t/g, "");

				code.append("\n" + output);
				scrollBottom();
			}
			
			else if (program == "$") {
				var output = $.trim(`
					SEARCHING FOR $
					LOADING
				`).replace(/\t/g, "");
				finishCommand(output);
			}

			else {
				var output = $.trim(`
					SEARCHING FOR ${program}
					LOADING

					PROGRAM NOT FOUND
				`).replace(/\t/g, "");
				finishCommand(output);
			}
		}

		else if (command == "ABOUT") {
			var output = $.trim(`
				HELLO, MY NAME IS SHAWN GALLAGHER.

				IF YOU ARE READING THIS, YOU ARE MOST LIKELY A COLLEGE ADMISSIONS OFFICER.
				
				YOUR SCHOOL'S APPLICATION ASKED IF I MAINTAINED AN ONLINE PRESENCE THAT SHOWCASES MY BACKGROUND, TALENTS, OR CREATIVITY.
				
				I WAS INTRIGUED BY THIS REQUEST, AND WHILE I DO NOT NECESSARILY OWN A PROFESSIONAL PORTFOLIO, TRENDY BLOG, OR FAMOUS INSTAGRAM ACCOUNT, I HAVE BEEN CODING MY OWN WEBSITES FOR YEARS, AND DID NOT WANT TO MISS THIS OPPORTUNITY TO SHARE MY WORK.
				
				HENCE, WELCOME TO SHAWN'S C64. THIS WEBSITE IS A DISPLAY OF VARIOUS HAND-SELECTED ONLINE CODING PROJECTS I HAVE PARTAKEN IN.
				
				TYPE "HELP" (THEN PRESS ENTER) FOR A HOW-TO.
			`).replace(/\t/g, "");
			finishCommand(output);
		}

		else if (command == "HELP") {
			var output = $.trim(`
				COMMANDS:

				  "ABOUT"
				  - PRINT DETAILS ABOUT SHAWN

				  "LIST"
				  - PRINT LIST OF SHAWN'S PROJECTS

				  "INFO <PROJECT>"
				  - 

				  LOAD"<PROJECT>",8
				  - OPEN PROJECT

				  "CLEAR"
				  - CLEAR SCREEN
			`).replace(/\t/g, "");
			finishCommand(output);
		}

		else if (command == "LIST") {
			var list = "";
			var blocks = 664;

			$.each(projects, function(i, e) {
				var name = e.name.toUpperCase();
				var paddedName = (`"${name}"`).padEnd(18).substring(0, 18);
				var paddedSize = e.size.padEnd(4).substring(0, 4);
				listLine = `${paddedSize} ${paddedName} PRG\n`;
				list += listLine;
				blocks -= parseInt(e.size);
			});

			var listLine1 = `0    "PROJECT NAME"     TYP`;
			var revLine1 = "";

			for (var i = 0; i < listLine1.length; i++) {
				var rev = "E2" + listLine1.charAt(i).codePointAt(0).toString(16);
				revLine1 += String.fromCharCode(parseInt(rev, 16));
			}

			var output = $.trim(`
			${revLine1}
			${$.trim(list)}
			${blocks} BLOCKS FREE.
			`).replace(/\t/g, "");
			finishCommand(output);
		}

		else if (command == "CLEAR") {
			$(".code").empty();
			addInput();
		}

		else if (command == "") {
			var output = "ERROR";
			finishCommand(output);
		}

		else {
			var output = `UNKNOWN COMMAND "${command}"`;
			finishCommand(output);
		}
	}
});



$(document).on("click", ".yes, .no", function() {
	$(".yes").addClass("dry-particle");
	$(".no").addClass("dry-particle");
	addInput();
	scrollBottom();
});