/*! [PROJECT_NAME] | Suitmedia */

;(function ( window, document, undefined ) {

    var path = {
        css: myPrefix + 'assets/css/',
        js : myPrefix + 'assets/js/vendor/'
    };

    var assets = {
        _jquery_cdn     : 'https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js',
        _jquery_local   : path.js + 'jquery.min.js',
        _fastclick      : path.js + 'fastclick.min.js',
        _numeral        : path.js + 'numeral.min.js'
    };

    var Site = {

        init: function () {
            Site.fastClick();
            Site.enableActiveStateMobile();
            Site.WPViewportFix();
            Site.cart();

            window.Site = Site;
        },

        fastClick: function () {
            Modernizr.load({
                load    : assets._fastclick,
                complete: function () {
                    FastClick.attach(document.body);
                }
            });
        },

        enableActiveStateMobile: function () {
            if ( document.addEventListener ) {
                document.addEventListener('touchstart', function () {}, true);
            }
        },

        WPViewportFix: function () {
            if ( navigator.userAgent.match(/IEMobile\/10\.0/) ) {
                var style   = document.createElement("style"),
                    fix     = document.createTextNode("@-ms-viewport{width:auto!important}");

                style.appendChild(fix);
                document.getElementsByTagName('head')[0].appendChild(style);
            }
        },

        cart: function () {
            var $productBtn = $('.product__btn');
            var $cart = $('.cart');
            var $cartlist = $('.cart-list');
            var $total = $('.cart__total');

            $productBtn.on('click', function (e) {
                var $this = $(this);
                var productName = $this.data('name');
                var productPrice = $this.data('price');

                inputNewItem(productName, productPrice);
                calculateTotal();
                numericAllPrices();
            });

            $cartlist.on('click', '.cart-remove', function (e) {
                var isConfirmRemove = confirm('Are you sure?');

                if ( !isConfirmRemove ) return;

                var $parent = $(this).parent();
                var $uiPrice = $parent.find('.ui-price');
                var price = $uiPrice.data('price');

                subtractTotal(price);
                $parent.remove();
            });

            function inputNewItem(name, price) {
                var template = 
                    '<li class="cart-list__item">' +
                        '<dl class="cart-item cf">' + 
                            '<dt class="sr-only">Name</dt>' + 
                            '<dd class="cart-item__name">' + name + '</dd>' +
                            '<dt class="sr-only">Price</dt>' +
                            '<dd class="cart-item__price ui-price" data-price="' + price + '">' + price + '</dd>' +
                        '</dl>' +
                        '<button class="cart-remove">&times;</button>' +
                    '</li>';

                $cartlist.append(template);
            }

            function calculateTotal() {
                var $prices = $cartlist.find('.ui-price');
                var total = 0;

                $.each($prices, function(index, price) {
                    total += $(price).data('price');
                });

                $total.html(total);
                $total.attr('data-price', total);
            }

            function numericAllPrices() {
                var $prices = $cart.find('.ui-price');

                $.each($prices, function(index, price) {
                    var $price = $(price);
                    $price.text( numeral($price.text()).format('0,0') );
                });
            }

            function subtractTotal(price) {
                var total = Number($total.attr('data-price')) - price;
                var uiTotal = numeral(total).format('0,0');
                console.log(total);
                $total.attr('data-price', total);
                $total.html(uiTotal);
            }
        }

    };

    var checkJquery = function () {
        Modernizr.load([
            {
                test    : window.jQuery,
                nope    : assets._jquery_local,
                complete: Site.init
            }
        ]);
    };

    Modernizr.load([
    {
        load    : assets._jquery_cdn
    },
    {
        load    : assets._numeral,
        complete: checkJquery
    }
    ]);

})( window, document );
