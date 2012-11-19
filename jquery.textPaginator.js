;(function ($) {
    var cutter = function (maxHeight, content) {
        var elementsList = content.children(),
            forbidden = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'tr', 'td'],
            somme = 0,
            pages = $('<div/>').addClass('pages').css ('height', maxHeight),
            currentPage = $('<div/>').attr('id', 'page-1'),
			pageNumber = 1;
        elementsList.each(function (i) {
			var elSize = $(this).outerHeight(true),
				controlSize = elSize + somme;
			if (elSize < maxHeight && controlSize < maxHeight) {
                if ($.inArray($(this)[0].tagName.toLowerCase(), forbidden) > -1) {
                    if ((controlSize + $(elementsList[i+1]).outerHeight(true)) >= maxHeight) {
                        pageNumber++;
                        pages.append(currentPage);
                        currentPage = $('<div/>').attr('id', 'page-' + pageNumber).css('display', 'none');
                        currentPage.append($(this));
                        somme = elSize;
                    } else {
                        currentPage.append($(this));
                        previous = $(this)[0].tagName;
                        somme += elSize;
                    }
                } else {
                    currentPage.append($(this));
                    previous = $(this)[0].tagName;
                    somme += elSize;
                }
            } else if (elSize > maxHeight) {
                pageNumber++;
				pages.append(currentPage);
				currentPage = $('<div/>').attr('id', 'page-' + pageNumber).css({display: 'none', height: elSize});
                currentPage.append($(this));
                somme = elSize;
            } else {
				pageNumber++;
				pages.append(currentPage);
				currentPage = $('<div/>').attr('id', 'page-' + pageNumber).css('display', 'none');
                currentPage.append($(this));
                somme = elSize;
            }
        });
        return pages;
    };
    var getPagination = function (pageNumber, paginationClass, previousText, nextText) {
            var list = $('<ul/>').addClass(paginationClass).after($('<br/>').attr('clear', 'all')),
                prev = $('<li/>').html($('<a/>').html(previousText).addClass('goto_previous disabled')).addClass('previous'),
                next = $('<li/>').html($('<a/>').html(nextText).addClass('goto_next')).addClass('next');
			list.append(prev);
            for (var i=1; i <= pageNumber; i++) {
				if (i == 1) {
					list.append($('<li/>').html($('<a/>').html(i).addClass('goto').attr('title', i)).addClass('active'));
				} else {
                    list.append($('<li/>').html($('<a/>').html(i).addClass('goto').attr('title', i)));
                }
            }
            return list.append(next);
    };
    $.fn.textPaginator = function (options) {
        // code here
        return this.each(function () {
            var $this = $(this),
                defaults = {
                    maxHeight: 350,
                    next: "Next",
                    previous: "Previous",
                    active: "active",
                    pagination_class: "pagination",
                    minimize: false,
                    effect: 'none',
                    position: "after"
                },
                settings = $.extend({}, defaults, options),
                elemHeight = $this.height(),
                pages = false;
			if (elemHeight > settings.maxHeight) {
                pages = cutter(settings.maxHeight, $this);
				var pagination = getPagination(pages.children().length, settings.pagination_class, settings.previous, settings.next);
				$this.append(pages);
				if (settings.position == "before") {
					$this.before(pagination);
				} else if (settings.position == "after") {
					$this.after(pagination);
				} else {
					$this.after(pagination);
					$this.before(pagination);
				}

				function showPage (pageId) {
                    switch (settings.effect) {
                        case 'fade':
                            $('.pages').find('div:visible').fadeOut('slow', 'swing', function () {
                                $('.pages').find('#page-'+pageId).fadeIn('slow', 'swing');
                            });
                            break;
                        case 'slide':
                            $('.pages').find('div:visible').slideUp('slow', 'swing', function () {
                                $('.pages').find('#page-'+pageId).slideDown('slow', 'swing');
                            });
                            break;
                        case 'shadow':
                            var shadows = {
                                    '-webkit-box-shadow': 'inset 0 0 500px 500px #000',
                                    'box-shadow': 'inset 0 0 500px 500px #000'
                                },
                                shadowsNone = {
                                    '-webkit-box-shadow': 'none',
                                    'box-shadow': 'none'
                                };
                            $(".pages div:visible").animate(shadows, 500, function () {
                                $(this).hide().css(shadowsNone);
                            }).hide();
                            $('.pages #page-'+pageId).css(shadows).show().animate(shadowsNone, 500);
                            break;
                        default:
                            $('.pages').children('div').hide();
                            $('.pages').children('#page-'+pageId).show();
                            break;
                    }
				}
				$(".goto").live("click", function(e){
					e.preventDefault();
					var $li = $("."+settings.pagination_class+" li"),
						pageNumber = parseInt($(this).attr("title")),
						lastPage = $li.index($li.last())-1;
					showPage(pageNumber);
					if (pageNumber == 1) {
						$("."+settings.pagination_class+" li.previous a").addClass('disabled');
						$("."+settings.pagination_class+" li.next a.disabled").removeClass('disabled');
					} else if (pageNumber == lastPage) {
						$("."+settings.pagination_class+" li.next a").addClass('disabled');
						$("."+settings.pagination_class+" li.previous a.disabled").removeClass('disabled');
					} else {
						$("."+settings.pagination_class+" li.previous a.disabled").removeClass('disabled');
						$("."+settings.pagination_class+" li.next a.disabled").removeClass('disabled');
					}
					$("."+settings.pagination_class+" li.active").removeClass('active');
					$(this).parent().addClass('active');
				});
				$(".goto_next:not(.disabled)").live("click", function(e) {
					e.preventDefault();
					var $li = $("."+settings.pagination_class+" li");
						indexOfCurrent = $li.index($('.'+settings.pagination_class+' .active')),
						newcurr = parseInt($li.eq(indexOfCurrent).find("a").attr("title")) + 1,
						lastPage = $li.index($li.last())-1;
					showPage(newcurr);
					if (newcurr == 1) {
						$("."+settings.pagination_class+" li.previous a").addClass('disabled');
						$("."+settings.pagination_class+" li.next a.disabled").removeClass('disabled');
					} else if (newcurr == lastPage) {
						$("."+settings.pagination_class+" li.next a").addClass('disabled');
						$("."+settings.pagination_class+" li.previous a.disabled").removeClass('disabled');
					} else {
						$("."+settings.pagination_class+" li.previous a.disabled").removeClass('disabled');
						$("."+settings.pagination_class+" li.next a.disabled").removeClass('disabled');
					}
					$li.eq(indexOfCurrent).removeClass('active');
					$li.eq(indexOfCurrent+1).addClass('active');
				});
				$(".goto_previous:not(.disabled)").live("click", function(e) {
					e.preventDefault();
					var $li = $("."+settings.pagination_class+" li");
						indexOfCurrent = $li.index($('.'+settings.pagination_class+' .active')),
						newcurr = parseInt($li.eq(indexOfCurrent).find("a").attr("title")) - 1,
						lastPage = $li.index($li.last())-1;
					showPage(newcurr);
					if (newcurr == 1) {
						$("."+settings.pagination_class+" li.previous a").addClass('disabled');
						$("."+settings.pagination_class+" li.next a.disabled").removeClass('disabled');
					} else if (newcurr == lastPage) {
						$("."+settings.pagination_class+" li.next a").addClass('disabled');
						$("."+settings.pagination_class+" li.previous a.disabled").removeClass('disabled');
					} else {
						$("."+settings.pagination_class+" li.previous a.disabled").removeClass('disabled');
						$("."+settings.pagination_class+" li.next a.disabled").removeClass('disabled');
					}
					$li.eq(indexOfCurrent).removeClass('active');
					$li.eq(indexOfCurrent-1).addClass('active');
				});
            }
        });
    };
})(jQuery);