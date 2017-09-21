var total = 17;
var zWin = $(window);
var render = function() {
	var padding = 2;
	var winWidth = zWin.width();
	var picWidth = Math.floor((winWidth - padding*3) / 4);
	var tmpl = '';
	for (var i = 1; i <= total; i++) {
		var pad = padding;
		if (i%4 == 1) {
			pad = 0;
		}
		var imgSrc = 'image/' + i + '.jpg';
		tmpl += '<li data-id="'+i+'" class="animated bounceIn" style="width:'+picWidth+'px;height:'+picWidth+'px;padding-left:'+pad+'px;padding-top:'+padding+'px"><canvas id="cvs_'+i+'"></canvas></li>';
		var imgObj = new Image();
		imgObj.index = i;
		imgObj.onload = function() {
			var cvs = $('#cvs_'+this.index)[0].getContext('2d');
			cvs.width = this.width;
			cvs.height = this.height;
			cvs.drawImage(this, 0, 0);
		};
		imgObj.src = imgSrc;
	}
	$('#container').html(tmpl);
};
render();
var wImage = $('#large_img');
var domImage = wImage[0];
var loadImg = function(id, callback) {
	$('#large_container').css({
		width: zWin.width(),
		height: zWin.height()
	}).show();
	var imgSrc = 'image/'+id+'.large.jpg';
	var imgObj = new Image();
	imgObj.onload = function() {
		var w = this.width;
		var h = this.height;
		var winWidth = zWin.width();
		var winHeight = zWin.height();
		var realw = winHeight*w/h;
		var realh = winWidth*h/w;
		var paddingLeft = parseInt((winWidth-realw)/2);
		var paddingTop = parseInt((winHeight-realh)/2);
		wImage.css('width', 'auto').css('height', 'auto');
		wImage.css('padding-top', '0px').css('padding-left', '0px');
		if(h/w > 1.2) {
			// 如果为竖图
			wImage.attr('src',imgSrc).css('height',winHeight).css('padding-left',paddingLeft);
		} else {
			// 如果为横图
			wImage.attr('src',imgSrc).css('width',winWidth).css('padding-top',paddingTop);
		}
		callback && callback();
	}
	imgObj.src = imgSrc;
};
var picId = null;
$('#container').delegate('li', 'tap', function() {
	var id = picId =  $(this).attr('data-id');
	loadImg(id);
});
$('#large_container').tap(function() {
	$(this).hide();
}).swipeLeft(function(e) {
	// 向左滑动 图片向后展示
	e.preventDefault();
	picId++;
	if (picId > total) {
		picId = total;
	} else {
		loadImg(picId, function() {
			domImage.addEventListener('webkitAnimationEnd', function() {
				wImage.removeClass('animated bounceInRight');
				domImage.removeEventListener('webkitAnimationEnd');
			}), false;
			wImage.addClass('animated bounceInRight');
		});
	}
}).swipeRight(function(e) {
	// 向右滑动 图片向前展示
	e.preventDefault();
	picId--;
	if (picId < 1) {
		picId = 1;
	} else {
		loadImg(picId, function() {
			domImage.addEventListener('webkitAnimationEnd', function() {
				wImage.removeClass('animated bounceInLeft');
				domImage.removeEventListener('webkitAnimationEnd');
			}, false);
			wImage.addClass('animated bounceInLeft');
		});
	}
});