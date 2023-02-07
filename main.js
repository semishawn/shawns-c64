var projects = [
	{
		name: "semipedia",
		size: "23",
		desc: "A blog-like pseudo-encyclopedia, of sorts.",
		url: "https://semipedia.cool/"
	},
	{
		name: "geovanni",
		size: "18",
		desc: "A curious little geometry calculator.",
		url: "https://semishawn.github.io/geovanni/"
	},
	{
		name: "sendmebreadclips",
		size: "134",
		desc: "An online interface to send me bread clips for my collection.",
		url: "https://sendmebreadclips.com"
	},
	{
		name: "plate game",
		size: "124",
		desc: "A digital license plate minigame.",
		url: "https://semishawn.github.io/plate-game/"
	},
	{
		name: "kokomo",
		size: "2",
		desc: "A happy and healthy in-browser text editor engine.",
		url: "https://semishawn.github.io/kokomo/"
	},
	{
		name: "pixelartfonts",
		size: "37",
		desc: "An archive of freely downloadable pixel art fonts.",
		url: "https://semishawn.github.io/pixelartfonts/"
	},
	{
		name: "tcd",
		size: "9",
		desc: "Triple Cat Deluxe, the best game about cats fighting since the underground cat fighting ring that was outlawed in 2010",
		url: "https://hedgy134117.github.io/tcd-new/"
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
					}
				});
			}
		});
	}, delay);
});



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



// Scroll to bottom of screen
function scrollBottom() {
	screen.scrollTop(screen[0].scrollHeight);
}



// Programmatically press the enter key
function pressEnter(elem) {
	var e = $.Event("keydown");
	e.which = 13;
	e.keyCode = 13;
	$(elem).trigger(e);
}



// Print output, add new input line, and scroll to bottom of code
function finishCommand(output) {
	code.append("\n" + output);
	addInput();
	scrollBottom();
}



// Print output, add new input line, but don't scroll to bottom
function finishCommandNoScroll(output) {
	var scrollHeight = screen[0].scrollTop;
	var ch = screen.height() / 25;
	code.append("\n" + output);
	addInput();
	screen.scrollTop(3 * ch + scrollHeight);
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

	if (e.keyCode == 37) return false;
	if (e.keyCode == 38) return false;
	if (e.keyCode == 39) return false;
	if (e.keyCode == 40) return false;

	if (e.keyCode == 13) {
		e.preventDefault();

		$(".cursor").remove();

		if (command == "ABOUT") {
			var output = $.trim(`
				HELLO, MY NAME IS SHAWN GALLAGHER.

				I'M A 19 YEAR OLD FRESHMAN ATTENDING BLOOMSBURG UNIVERSITY. THIS WEBSITE IS A DISPLAY OF VARIOUS ONLINE CODING PROJECTS I HAVE PARTAKEN IN.
				
				TYPE "HELP" (THEN PRESS ENTER) FOR A SITE HOW-TO.
			`).replace(/\t/g, "");
			finishCommandNoScroll(output);
		}

		else if (command == "HELP") {
			var output = $.trim(`
				WELCOME TO SHAWN'S C64, VISUALLY BASED UPON AN ORIGINAL COMMODORE 64'S INTERFACE. INFORMATION ON THIS SITE CAN BE ACCESSED VIA CONSOLE COMMANDS.

				BELOW IS A COMPREHENSIVE LIST OF COMMANDS. PAY CLOSE ATTENTION TO CHARACTER PLACEMENTS AND USE OF QUOTES WHEN REFERRING TO PROJECTS/PROGRAMS.
				
				COMMANDS:
				  ABOUT
				  - PRINT DETAILS ABOUT SHAWN

				  LIST
				  - PRINT LIST OF SHAWN'S PROJECTS

				  INFO"PROJECT NAME"
				  - PRINT DESCRIPTION OF PROJECT

				  LOAD"PROJECT NAME",8
				  - OPEN PROJECT IN NEW TAB

				  CLEAR
				  - CLEAR SCREEN
			`).replace(/\t/g, "");
			finishCommandNoScroll(output);
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

			var listLine1 = `SIZE "PROJECT NAME"     TYP`;
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

		else if (command.startsWith("INFO")) {
			var program = $.trim(command.split("\"")[1].split("\"")[0]);

			if (projects.some(e => e.name == program.toLowerCase())) {
				var output = projects.find(e => e.name === program.toLowerCase()).desc.toUpperCase();
				finishCommand(output);
			}
		}

		else if (command.startsWith("LOAD")) {
			var program = $.trim(command.split("\"")[1].split("\"")[0]);

			if (projects.some(e => e.name == program.toLowerCase())) {
				var href = projects.find(e => e.name === program.toLowerCase()).url;
				
				var data = $.trim(`
					RUNNING "${$.trim(program)}" WILL OPEN A NEW TAB.
					IS THIS OKAY?
					CLICK OPTION: <a class="yes" href="${href}" target="_blank">YES</a> <span class="no">NO</span>
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

		else if (command == "CLEAR") {
			code.empty();
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