/* skel-baseline v1.0.1 | (c) n33 | getskel.com | MIT licensed */
(function($) {
	skel.init({
		reset: 'full',
		breakpoints: {
			// Global.
			global: {
				href: 'css/style.css',
				containers: 1400,
				grid: {
					gutters: {
						vertical: '2em',
						horizontal: 0
					}
				}
			},
			// XLarge.
			xlarge: {
				media: '(max-width: 1680px)',
				href: 'css/style-xlarge.css',
				containers: 1200
			},
			// Large.
			large: {
				media: '(max-width: 1280px)',
				href: 'css/style-large.css',
				containers: 960,
				grid: {
					gutters: {
						vertical: '1.5em'
					}
				},
				viewport: {
					scalable: false
				}
			},
			// Medium.
			medium: {
				media: '(max-width: 980px)',
				href: 'css/style-medium.css',
				containers: '90%',
				grid: {
					collapse: 1
				}
			},
			// Small.
			small: {
				media: '(max-width: 736px)',
				href: 'css/style-small.css',
				containers: '90%',
				grid: {
					gutters: {
						vertical: '1.25em'
					}
				}
			},
			// XSmall.
			xsmall: {
				media: '(max-width: 480px)',
				href: 'css/style-xsmall.css',
				grid: {
					collapse: 2
				}
			}
		},
		plugins: {
			layers: {

				// Config.
				config: {
					transform: true
				},

				// Navigation Panel.
				navPanel: {
					animation: 'pushX',
					breakpoints: 'medium',
					clickToHide: true,
					height: '100%',
					hidden: true,
					html: '<div data-action="moveElement" data-args="nav"></div>',
					orientation: 'vertical',
					position: 'top-left',
					side: 'left',
					width: 250
				},

				// Navigation Button.
				navButton: {
					breakpoints: 'medium',
					height: '4em',
					html: '<span class="toggle" data-action="toggleLayer" data-args="navPanel"></span>',
					position: 'top-left',
					side: 'top',
					width: '6em'
				}

			}
		}
	});
	//parse init
	$.parse.init({
		app_id: "jKuxDqRjG1fhq0BicqOqXmJprz0S52OWMRRAzXVo", // <-- enter your Application Id here 
		rest_key: "wMpBB4SyP7nvn3E4PUmuzjPAhR0yAs8f1fnJp5Ys" // <--enter your REST API Key here    
	});
	
	$(function() {

		// add rule page
		if ($("body").hasClass("addRule")) {
			//load cates
			var optionItem = $("<option/>");
			$.parse.get("category", function(json) {
				console.log(json);
				var itemArray = [];
				$.each(json.results, function(idx, obj) {
					var tempItem = optionItem.clone();
					tempItem.val(obj.typeNum).text(obj.title);
					itemArray.push(tempItem);
				});
				$("#category").append(itemArray);
			});
			//add cate toggle
			$("#addCategoryToggle").click(function(evt) {
				evt = evt || window.event;
				evt.preventDefault();
				var currEle = $(this);
				if (currEle.hasClass("hide")) {
					currEle.removeClass("fa-chevron-circle-left hide").addClass("fa-plus-circle")
						.parent().siblings(".addCate").fadeOut()
				} else {
					currEle.removeClass("fa-plus-circle").addClass("fa-chevron-circle-left hide")
						.parent().siblings(".addCate").fadeIn();
				}
			});
			//add cate button
			$("#addCategory").click(function(evt) {
				evt = evt || window.event;
				evt.preventDefault();
				var currEle = $(this);

				var cateItem = {},
					num = $("#category").find("option").length;
				cateItem.typeNum = num;
				cateItem.name = $("#cateName").val();
				cateItem.title = $("#cateTitle").val();
				cateItem.icon = $("#cateiconClass").val();
				optionItem.text(cateItem.title).val(cateItem.typeNum).attr("selected", "");
				$.parse.post("category", cateItem, function(json) {
					console.log(json);
					$("#addCategoryToggle").trigger("click");
					$("#category").append(optionItem);

				});
			});
			//reset click
			$("#reset").click(function(evt) {
				evt = evt || window.event;
				evt.preventDefault();
				$(".canReset").val("");
				$("#category").find("option:first").attr("selected", "");
			});


			//add rule click event
			$("#commit").click(function(evt) {
				evt = evt || window.event;
				evt.preventDefault();
				$(this).attr("disabled","");
				$("#tipIcon").attr("class","icon fa-spin fa-spinner tip").show();
				postRuleInputs();
			});

			function postRuleInputs() {
				var cate = Number($("#category").find("option:selected").val()),
					type=Number($("input[name=rule-type]:checked").val()),
					title = $("#title").val(),
					des = $("#description").val(),
					remark = $("#remark").val(),
					unrecom = $("#example-unrecom").val(),
					recom = $("#example-recom").val();
				var ruleItem = {
					cate: cate,
					type:type,
					title: title,
					description: des,
					remark: remark,
					example: {
						unrecom: unrecom,
						recom: recom
					}
				};
				console.log(ruleItem);
				$.parse.post("Codestyle", ruleItem, function(json) {
					console.log(json);
					if (json.objectId) {
						$("#tipIcon").removeClass("fa-spinner fa-spin").addClass("fa-check");
					} else {
						$("#tipIcon").removeClass("fa-spinner fa-spin").addClass("fa-warning");
					}
					$("#commit").removeAttr("disabled");
				});
			};
		} else {
			
			//rule index page
//			//load cates
//			var optionItem = $("<option/>");
//			$.parse.get("category", function(json) {
//				console.log(json);
//				var cateItem = $('<li><a class="button special" ></a></li>');
//				var itemArray = [];
//				$.each(json.results, function(idx, obj) {
//					var tempItem = cateItem.clone();
//					var populateLink = tempItem.find("a");
//					populateLink.attr("data-jumpto", obj.name).addClass(obj.icon ? obj.icon + " icon" : "").attr("href", "#" + obj.name).text(obj.title);
//					itemArray.push(tempItem);
//				});
//				$("#nav ul").prepend(itemArray);
//				//bind event
//				bindTopNavs();
//			});
			//bind top nav event
			var jumptoLinks = $("#nav a[data-jumpto]");
			jumptoLinks.click(function(evt) {
				evt = evt || window.event;
				evt.preventDefault();
				var currEle = $(this);
				var jumptoEle = $('#' + currEle.attr("data-jumpto"));
				var scrollTo = jumptoEle.offset().top;
				$('html, body').animate({
					scrollTop: scrollTo - 20
				}, 500);
				jumptoLinks.removeClass("curr");
				currEle.addClass("curr");
			});
			//load rule items
			var ruleItem=$('<div class="container box">'+
				'<div class="row double">'+
					'<section class="6u">'+
						'<h3 class="title"></h3>'+
						'<p class="des"></p>'+
					'</section>'+
					'<section class="6u remark">'+
						'<blockquote class="remark"></blockquote>'+
					'</section>'+
				'</div>'+
				'<a href="#" class="button forExample special small icon fa-angle-double-down">举例</a>'+
				'<div class="row double defaultHidden">'+
					'<section class="6u">'+
						'<pre>  '+
						'  <code class="warning">'+
						'  </code>'+
						'  </pre>'+
					'</section>'+
					'<section class="6u">'+
						'<pre>  '+
						'  <code class="recommend">'+
						'  </code>'+
						'  </pre>'+
					'</section>'+
				'</div>'+
			'</div>');
			$.parse.get("Codestyle",function(json){
				console.log(json);

				var commonArray = [],
					htmlcssArray=[],
					jsArray=[];
				$.each(json.results, function(idx, obj) {
					var tmpItem = ruleItem.clone(),hit=0;
					tmpItem.attr("data-objId",obj.objectId).find(".title").text(obj.title)
					.end().find(".des").text(obj.description);
					obj.remark?
						tmpItem.find("blockquote.remark").text(obj.remark):
						tmpItem.find("blockquote.remark").remove();
					obj.example.unrecom?
						tmpItem.find(".warning").text(obj.example.unrecom):
						tmpItem.find(".warning").parents("section").remove();
					obj.example.recom?
						tmpItem.find(".recommend").text(obj.example.recom):
						tmpItem.find(".recommend").parents("section").remove();
					tmpItem.find(".defaultHidden section").length>0?
						"":
						tmpItem.find(".forExample").remove();
					switch(obj.cate){
						case 1:
						//common
						commonArray.push(tmpItem);
						break;
						case 2:
						//htmlcss
						htmlcssArray.push(tmpItem);
						break;
						case 3:
						//js
						jsArray.push(tmpItem);
						break;
					}
				});
				$("#common").append(commonArray);
				$("#htmlcss").append(htmlcssArray);
				$("#js").append(jsArray);
				//bind event
				bindToggleAll();
				bindToggleExample();
			});
		}
	});

	function bindToggleAll() {

		//展开和收起-----全部举例
		$("a.expandAll").click(function(evt) {
			evt = evt || window.event;
			evt.preventDefault();
			var currEle = $(this);
			var exampleLinks = currEle.parent().siblings("div.container").find("a.forExample");
			if (currEle.hasClass("fa-angle-double-down")) {
				currEle.removeClass("fa-angle-double-down")
					.addClass("fa-angle-double-up").text("收起全部举例");
				exampleLinks.filter(function() {
					return $(this).hasClass("fa-angle-double-down");
				}).trigger("click");
			} else {
				currEle.removeClass("fa-angle-double-up")
					.addClass("fa-angle-double-down").text("展开全部举例");
				exampleLinks.filter(function() {
					return $(this).hasClass("fa-angle-double-up");
				}).trigger("click");
			}
		});
	}

	function bindToggleExample() {

		//展开和收起-----举例
		$("a.forExample").click(function(evt) {
			evt = evt || window.event;
			evt.preventDefault();
			var currEle = $(this);
			if (currEle.hasClass("fa-angle-double-down")) {
				currEle.next("div.row").slideDown()
					.end().removeClass("fa-angle-double-down")
					.addClass("fa-angle-double-up");
			} else {
				currEle.next("div.row").slideUp()
					.end().removeClass("fa-angle-double-up")
					.addClass("fa-angle-double-down");
			}
		});
	}
})(jQuery);