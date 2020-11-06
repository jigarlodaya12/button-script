'use strict';

var IM = function() {
  var product_listing_keys = 'id|t|sd|d|sku|s|p|dp|so|b|c|oos|s|c|cats|pc|ai|ail|f|rs|rv|opt1|opt2|opt3|optv1|optv2|optv3|i|i2|i3|i4|i5|i6|i7|i8|i9|i0|di|di2|di3|di4|di5|di6|di7|di8|di9|di10|zi|zi2|zi3|zi4|zi5|zi6|zi7|zi8|zi9|zi10|a|moq|maxoq|g|attrs_v|vk|kgp|n|v|pwyw|prodt';
  var product_option_keys = 'o|v|ov';
  var clientData = {};
  var productData = {};
  var baseProduct = {};
  var activeProduct = {};
  var preserveActiveData = {};
  var productOptionData = [];
  var currency = 'INR';
  var resources = {
    inventory: {
      'staging': 'https://api.stores.mjc.instamojo.com',
      'staging0': 'https://api.stores.mjc0.instamojo.com',
      'production': 'https://api.stores.instamojo.com',
    }
  };
  var allProductsData = [];
  var variantData = {};
  var availableVariants = {};
  var opt1Values = [],
    opt2Values = [],
    opt3Values = [];
  var BABModal = '<div class="bab-modal-overlay" id="bab_cart_overlay" onclick="IM.hideCart()"></div>' +
    '<div class="bab-modal-dialog" id="bab_cart">' +
    ' <div class="bab-modal-content">' +
    '    <div class="bab-modal-product-popover">' +
    '      <a class="close-button" onclick="IM.hideCart()"><svg class="bab-icon" height="15"' +
    '       viewbox="0 0 24 24" width="15">' +
    '        <g>' +
    '        <path d="M.05 1.04l.99-.99 22.98 22.98-.99.99z"></path>' +
    '      <path d="M.05 22.96L23.03-.02l.99.99L1.04 23.95z"></path>' +
    '    </g></svg></a>' +
    '   <div class="bab-product-content custom-scroll" id="bab_product_content">' +
    '   </div>' +
    ' <div class="bab-product-buy-actions-block">' +
    '    <button class="bab-buy-btn bab-buy-now-btn" onclick="IM.onCheckout();">Buy Now</button>' +
    ' </div>' +
    ' </div>' +
    '</div>';

  var ProductNotFoundContent = '<div class="empty-product-state"><img src="http://gmas-core-media.s3.amazonaws.com/standalone/14/empty-cart.svg"><p>Sorry, the product you are looking for, is not available anymore.</p></div>';

  var ProductContent = '<div>' +
    ' <div class="bab-popover-image-container">' +
    '    <div id="bab-slider">' +
    '    <div id="bab">' +
    '      <div id="bab-slider-wrapper">' +
    '        {{#images}}' +
    '        <div class="slide"><img alt="" src="{{src}}"></div>{{/images}}' +
    '     </div>' +
    '     <div id="bab-slider-nav">' +
    '       {{#images}}<a data-slide="{{index}}" href="#"></a>{{/images}}' +
    '      </div>' +
    '   </div>' +
    ' </div>' +
    '<a class="bab-prod-title" href="{{user_domain}}/product/{{id}}/{{slug}}" target="_blank">' +
    '<h3>{{t}}</h3></a>' +
    ' <p class="bab-short-description">{{sd}}</p>' +
    '<div class="bab-item-detail-block">' +
    ' <div class="bab-price-label">' +
    '   {{#dp}}' +
    '    <span class="bab-price-cut">{{currency}} {{p}}</span> {{currency}} {{dp}}' +
    '   {{/dp}}' +
    '    {{^dp}}' +
    '    {{currency}} {{p}}' +
    '    {{/dp}}' +
    '  </div>' +
    ' {{>quantity}}' +
    '</div>' +
    ' <div class="bab-pwyw-widget-wrap" id="bab_pwyw_widget"></div>' +
    '<div class="" id="option_template"></div>' +
    ' <div class="bab-pincode-widget-wrap" id="bab_pincode_widget"></div>' +
    ' <div class="bab-pincode-widget-wrap" id="bab_productoption_widget"></div>' +
    '</div>';

  var BABProductContainer = '<div class="bab-product-item-img">' +
    '  <div class="bab-image-container">' +
    '    <img alt="" src="{{i}}" class="">' +
    '  </div>' +
    '</div>' +
    '<div class="bab-item-detail">' +
    '  <h2 class="bab-item-title">{{t}}</h2>' +
    '  <p class="bab-item-price">' +
    '   {{#dp}}' +
    '    <span class="bab-price-cut">{{currency}} {{p}}</span>' +
    '    <span class="bab-price-text">{{currency}} {{dp}}</span>' +
    '    {{/dp}}' +
    '    {{^dp}}' +
    '    <span class="bab-price-text">{{currency}} {{p}}</span>' +
    '    {{/dp}}' +
    '  </p>' +
    ' <p class="bab-item-price">{{sd}}</p>' +
    ' <a class="bab-button" onClick="IM.showCart({{g}});" href="javascript:void(0);">Buy Now</a>' +
    '</div>';

  var partials = {
    quantity: '<div class="bab-quantity-ctrl" id="bab_quantity_ctrl">' +
      '          <label for="">Qty</label>' +
      '          <ul class="bab-choose-quantity">' +
      '            <li class="quant-minus" onClick="IM.decreaseQuantity()">' +
      '              <svg class="" height="28" viewbox="0 0 24 24" width="28">' +
      '              <path d="M7,11.5h8v1H7V11.5z"></path></svg>' +
      '            </li>' +
      '            <li class="quant-count"><span class="bab-product-quantity-no" id="bab_product_qty">1</span></li>' +
      '            <li class="quant-plus" onClick="IM.increaseQuantity()">' +
      '              <svg class="" height="28" viewbox="0 0 24 24" width="28">' +
      '              <g>' +
      '                <path d="M11 8h1v9h-1V8z"></path>' +
      '                <path d="M7 12h9v1H7v-1z"></path>' +
      '              </g></svg>' +
      '            </li>' +
      '          </ul>' +
      '        </div>'
  };
  var paywhatyouwant = '<form class="bab-paywhatyouwant-form" novalidate>' + '    <div class="bab-input">' + '      <input id="bab_id_paywhatyouwant" name="paywhatyouwant" onKeyUp="IM.checkPWYW()" placeholder="Pay What You Want" type="number">' + '       <span id="show-error"></span>' + "    </div>" + "  </form>";
  var pincodeWidget = '<form class="bab-pincode-form" novalidate>' +
    '    <div class="bab-select-wrapper">' +
    '      <select id="bab_id_country" class="bab-select-box" name="country">' +
    '        <option value="" selected>Select Country</option>' +
    '        {{#countryList}}' +
    '        <option value="{{alpha2Code}}">{{name}}</option>' +
    '        {{/countryList}}' +
    '      </select>' +
    '      <div class="bab-select-arrow"></div>' +
    '    </div>' +
    '    <div class="bab-input">' +
    '      <input id="bab_id_pincode" name="pincode" placeholder="PIN/ZIP code" type="text">' +
    '    </div>' +
    '    <div>' +
    '      <button class="bab-button bab-pincode-btn" type="button" onClick="IM.checkPincode()">Check</button>' +
    '    </div>' +
    '  </form>' +
    '<div id="shipping_option_detail"></div>';
  
    var product_options_widget = '<form class="bab-pincode-form" id="product_options_main" onsubmit="IM.checkProductOptionsValidation()">' +
    '    <div class="bab-select-wrapper">' +
    '    {{#productOptions}} ' +
    '      {{#text}}' +
    '       <div class="product-opt">' +
    '         <div class="product-opt-text">' +
    '           <p>{{title}}</p>' +
    '           {{#chargeable}}' +
    '           <span>(Extra Charges INR {{charges}})</span>' +
    '           {{/chargeable}}' +
    '         </div>' +
    '         <div class="bab-input">' +
    '           <input id="option_{{o.id}}" onKeyUp="IM.onChangeText({{o.id}}, \'text\')" type="text" {{#required}}required{{/required}} >' +
    '         </div>' +
    '       </div>' +
    '      {{/text}}' +
    '      {{#checkbox}}' +
    '       <div id="check-req" class="product-opt {{#required}}required{{/required}}">' +
    '         <div class="product-opt-text">' +
    '           <p>{{title}}</p>' +
    '           {{#chargeable}}' +
    '           <span>(Extra Charges INR {{charges}})</span>' +
    '           {{/chargeable}}' +
    '         </div>' +
    '       {{#v}}' +
    '       <div class="bab-input multiple">' +
    '         <input id="option_{{o.id}}-{{id}}" class="check-new" onClick="IM.onChangeText(\'{{o.id}}-{{id}}\',\'checkbox\')" type="checkbox" value="{{ov.text}}">' +
    '         <span>{{ov.text}}</span>' +    
    '       </div>' +
    '       {{/v}}' +
    '       </div>' +
    '      {{/checkbox}}' +
    '      {{#radio}}' +
    '       <div class="product-opt">' +
    '         <div class="product-opt-text">' +
    '           <p>{{title}}</p>' +
    '           {{#chargeable}}' +
    '           <span>(Extra Charges INR {{charges}})</span>' +
    '           {{/chargeable}}' +
    '         </div>' +
    '       {{#v}}' +
    '       <div class="bab-input multiple">' +
    '         <input id="option_{{o.id}}-{{id}}" onClick="IM.onChangeText(\'{{o.id}}-{{id}}\',\'radio\')" type="radio" value="{{ov.text}}" name="option-radio" {{#required}}required{{/required}}>' +
    '         <span>{{ov.text}}</span>' +    
    '       </div>' +
    '       {{/v}}' +
    '       </div>' +
    '      {{/radio}}' +
    '      {{#date}}' +
    '       <div class="product-opt">' +
    '         <div class="product-opt-text">' +
    '           <p>{{title}}</p>' +
    '           {{#chargeable}}' +
    '           <span>(Extra Charges INR {{charges}})</span>' +
    '           {{/chargeable}}' +
    '         </div>' +
    '       <div class="bab-input">' +
    '         <input id="option_{{o.id}}" onchange="IM.onChangeText({{o.id}},\'date\')" type="date" {{#required}}required{{/required}}>' +
    '       </div>' +
    '       </div>' +
    '      {{/date}}' +
    '      {{#time}}' +
    '       <div class="product-opt">' +
    '         <div class="product-opt-text">' +
    '           <p>{{title}}</p>' +
    '           {{#chargeable}}' +
    '           <span>(Extra Charges INR {{charges}})</span>' +
    '           {{/chargeable}}' +
    '         </div>' +
    '       <div class="bab-input">' +
    '         <input id="option_{{o.id}}" onchange="IM.onChangeText({{o.id}},\'time\')" type="time" {{#required}}required{{/required}}>' +
    '       </div>' +
    '       </div>' +
    '      {{/time}}' +
    '      {{#datetime}}' +
    '       <div class="product-opt">' +
    '         <div class="product-opt-text">' +
    '           <p>{{title}}</p>' +
    '           {{#chargeable}}' +
    '           <span>(Extra Charges INR {{charges}})</span>' +
    '           {{/chargeable}}' +
    '         </div>' +
    '       <div class="bab-input">' +
    '         <input id="option_{{o.id}}" onchange="IM.onChangeText({{o.id}},\'datetime\')" type="datetime" {{#required}}required{{/required}}>' +
    '       </div>' +
    '       </div>' +
    '      {{/datetime}}' +
    '    {{/productOptions}} ' +
    '    </div>' +
    //  This button is used to trigger onsubmit function of the form.
    '   <button style="display:none;" type="submit" id="product_option_form_submit"></button>';
    '  </form>' +
    '<div id="shipping_option_detail"></div>';

  var checkoutForm = '<form id="bab-checkout-form" action="{{user_domain}}/checkout/" method="POST" enctype="application/x-www-form-urlencoded;charset=utf-8">' +
    ' <input type="hidden" id="bab_cart_form_total_price" name="total_price" value="{{ total_price }}" />' +
    '  <input type="hidden" id="bab_cart_form_total_items" name="total_items" value="{{ total_items }}" />' +
    '  <input type="hidden" id="bab_cart_form_username" name="username" value="{{ user_name }}" />' +
    '  <input type="hidden" id="bab_cart_form_item" name="items" value="{{ item }}" />' +
    '  <input type="hidden" id="bab_cart_form_source" name="source" value="{{ source }}" />' +
    '</form>';

  var optionsTemplate = '<select class="bab-select-box" id="{{key_id}}" name="variant-select-box" onChange="IM.renderOptionsTemplate({{key_id}})">' +
    '  {{#optionValues}}' +
    '      {{#selected}}' +
    '        <option value="{{value}}" selected>{{value}}</option>' +
    '      {{/selected}}' +
    '      {{^selected}}' +
    '        <option value="{{value}}">{{value}}</option>' + '     {{/selected}}' + '  {{/optionValues}}' + '</select>' +
    '<div class="bab-select-arrow"></div>';



  var shippingOptionTemplate = '<ul class="bab-shipping-detail-list">' +
    '  {{#cod}}' +
    ' <li class="text-success">âœ" Cash on delivery</li>' +
    '  {{/cod}}' +
    '  {{^cod}}' +
    '  <li class="text-danger">âŒ Cash on delivery</li>' +
    '  {{/cod}}' +
    '  {{#replace}}' +
    ' <li class="text-success">âœ" Replacement</li>' +
    '  {{/replace}}' +
    '  {{^replace}}' +
    '  <li class="text-danger">âŒ Replacement</li>' +
    '  {{/replace}}' +
    '  {{#returns}}' +
    ' <li class="text-success">âœ" Return</li>' +
    '  {{/returns}}' +
    '  {{^returns}}' +
    '  <li class="text-danger">âŒ Return</li>' +
    '  {{/returns}}' +
    '  {{^prepaid}}' +
    ' <li class="text-danger">âŒ Online payment</li>' +
    '  {{/prepaid}}' +
    '  {{#estimated_shipping_charge}}' +
    ' <li>Estimated Shipping Charge: <b>{{ currency }} {{estimated_shipping_charge }}</b></li>' +
    '  {{/estimated_shipping_charge}}' +
    '</ul>';


  var imojoStyles= '<style>.btn_container{display:inline}.im-checkout-btn{outline:none;text-decoration:none;cursor:pointer;text-align:center;display:block;font-family:"Open Sans", "Lucida Grande", "Lucida Sans", Tahoma, sans-serif;transition:0.3s}.im-checkout-btn.btn--light{color:#fff;letter-spacing:1px;text-shadow:rgba(0,0,0,0.6) 0 1px 1px;padding:0.6em 0.7em;border:1px solid rgba(59,122,50,0.3);border-bottom:1px solid rgba(0,0,0,0.7);border-radius:4px;background:#75c26a;background-image:-webkit-linear-gradient(top, rgba(255,255,255,0.3), rgba(0,0,0,0.25));background-image:-moz-linear-gradient(top, rgba(255,255,255,0.3), rgba(0,0,0,0.25));background-image:-o-linear-gradient(top, rgba(255,255,255,0.3), rgba(0,0,0,0.25));background-image:linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.25));box-shadow:inset 0 1px rgba(255,255,255,0.4),inset 0 0 0 1px rgba(255,255,255,0.15),inset 0 -1px 3px rgba(0,0,0,0.3),0 1px 3px rgba(0,0,0,0.2);line-height:1.2em;margin:0.3em 0}.im-checkout-btn.btn--light:focus,.im-checkout-btn.btn--light:hover{color:adjust-lightness(#fff, 5%);background:adjust-lightness(#75c26a, 5%);background-image:-webkit-linear-gradient(top, rgba(255,255,255,0.15), rgba(0,0,0,0.35));box-shadow:inset 0 1px 0px rgba(255,255,255,0.45),inset 0 0 0 1px rgba(255,255,255,0.2),inset 0 -1px 3px rgba(0,0,0,0.3),0 1px 2px 1px rgba(0,0,0,0.25)}.im-checkout-btn.btn--light:active,.im-checkout-btn.btn--light.active{text-shadow:none;color:#eeeeee;background:adjust-lightness(#75c26a, -4%);background-image:-webkit-linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));background-image:-moz-linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));background-image:-o-linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));background-image:linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));box-shadow:inset 0 1px 4px rgba(0,0,0,0.3),0 2px 2px rgba(255,255,255,0.3)}.im-checkout-btn.btn--light:hover,.im-checkout-btn.btn--light:focus,.im-checkout-btn.btn--light.active{text-decoration:none}.im-checkout-btn.btn--dark{color:#302b2f;letter-spacing:1px;text-shadow:rgba(0,0,0,0.6) 0 1px 1px;padding:0.6em 0.7em;border:1px solid rgba(186,160,19,0.3);border-bottom:1px solid rgba(0,0,0,0.7);border-radius:4px;background:#efd85d;background-image:-webkit-linear-gradient(top, rgba(255,255,255,0.3), rgba(0,0,0,0.25));background-image:-moz-linear-gradient(top, rgba(255,255,255,0.3), rgba(0,0,0,0.25));background-image:-o-linear-gradient(top, rgba(255,255,255,0.3), rgba(0,0,0,0.25));background-image:linear-gradient(to bottom, rgba(255,255,255,0.1), rgba(0,0,0,0.25));box-shadow:inset 0 1px rgba(255,255,255,0.4),inset 0 0 0 1px rgba(255,255,255,0.15),inset 0 -1px 3px rgba(0,0,0,0.3),0 1px 3px rgba(0,0,0,0.2);line-height:1.2em;margin:0.3em 0;letter-spacing:0px;font-weight:bold;text-shadow:rgba(255,255,255,0.4) 0 1px}.im-checkout-btn.btn--dark:focus,.im-checkout-btn.btn--dark:hover{color:adjust-lightness(#302b2f, 5%);background:adjust-lightness(#efd85d, 5%);background-image:-webkit-linear-gradient(top, rgba(255,255,255,0.15), rgba(0,0,0,0.35));box-shadow:inset 0 1px 0px rgba(255,255,255,0.45),inset 0 0 0 1px rgba(255,255,255,0.2),inset 0 -1px 3px rgba(0,0,0,0.3),0 1px 2px 1px rgba(0,0,0,0.25)}.im-checkout-btn.btn--dark:active,.im-checkout-btn.btn--dark.active{text-shadow:none;color:#eeeeee;background:adjust-lightness(#efd85d, -4%);background-image:-webkit-linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));background-image:-moz-linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));background-image:-o-linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));background-image:linear-gradient(top, rgba(255,255,255,0.07), rgba(0,0,0,0.1));box-shadow:inset 0 1px 4px rgba(0,0,0,0.3),0 2px 2px rgba(255,255,255,0.3)}.im-checkout-btn.btn--flat{background:#75c26a;box-shadow:none;border:1px solid adjust-lightness(#75c26a, -10%);text-shadow:none;border-radius:1.5em;padding:0.6em 1em;color:#fff}.im-checkout-btn.btn--flat:focus,.im-checkout-btn.btn--flat:hover{background:#fff;color:#75c26a;text-shadow:none;box-shadow:none}.im-checkout-btn.btn--flat-dark{background:#fff;box-shadow:none;border:1px solid adjust-lightness(#fff, -10%);text-shadow:none;border-radius:1.5em;padding:0.6em 1em;color:#75c26a}.im-checkout-btn.btn--flat-dark:focus,.im-checkout-btn.btn--flat-dark:hover{background:#75c26a;color:#fff;text-shadow:none;box-shadow:none}.im-checkout-btn.btn--default{color:#fff;background:#75c26a;letter-spacing:1px;padding:12px 8px;margin:0 auto;opacity:0.9;border-radius:4px}.im-checkout-btn.btn--default:focus,.im-checkout-btn.btn--default:hover,.im-checkout-btn.btn--default:active,.im-checkout-btn.btn--default.active{opacity:1}.im-checkout-layout{background:transparent;text-align:center;width:300px}.im-checkout-layout .layout-vertical{width:300px}.im-checkout-layout .layout-horizontal{width:600px;display:flex}.im-checkout-layout .layout-horizontal .im-checkout,.im-checkout-layout .layout-horizontal .checkout-description{margin-left:20px}.im-checkout-layout .checkout-image{height:252px;width:300px;border-radius:4px;margin-bottom:20px;max-width:300px}.im-checkout-layout .checkout-description{margin:0;overflow:auto;font-family:sans-serif;font-size:16px;color:#4d4d4d;margin-bottom:20px;max-width:300px}.im-modal{overflow-y:auto}.im-modal iframe{height:100%;width:100%}@-webkit-keyframes pace-spinner{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@-moz-keyframes pace-spinner{0%{-moz-transform:rotate(0deg);transform:rotate(0deg)}100%{-moz-transform:rotate(360deg);transform:rotate(360deg)}}@-o-keyframes pace-spinner{0%{-o-transform:rotate(0deg);transform:rotate(0deg)}100%{-o-transform:rotate(360deg);transform:rotate(360deg)}}@-ms-keyframes pace-spinner{0%{-ms-transform:rotate(0deg);transform:rotate(0deg)}100%{-ms-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes pace-spinner{0%{transform:rotate(0deg);transform:rotate(0deg)}100%{transform:rotate(360deg);transform:rotate(360deg)}}.iframe-container{height:100%}.iframe-container .iframe-loader-wrapper{display:none}.iframe-container .iframe{transition:all 0.2s;visibility:visible;opacity:1;height:100%;position:relative;background:none;display:block;border:0px none transparent;margin:0px;padding:0px}.iframe-container.loader .iframe-loader-wrapper{display:block;position:relative;height:100%}.iframe-container.loader .iframe-loader-wrapper .iframe-loader{display:block;position:fixed;top:50%;left:50%;margin-left:-20px;margin-top:-20px;width:40px;height:40px;border:solid 2px transparent;border-top-color:#46DF89;border-left-color:#46DF89;border-radius:40px;-webkit-animation:pace-spinner 800ms linear infinite;-moz-animation:pace-spinner 800ms linear infinite;-ms-animation:pace-spinner 800ms linear infinite;-o-animation:pace-spinner 800ms linear infinite;animation:pace-spinner 800ms linear infinite}.iframe-container.loader .iframe{visibility:hidden;opacity:0}.im-background-overlay{min-height:100%;transition:0.3s ease-out;position:fixed;top:0px;left:0px;width:100%;height:100%;background:rgba(241,244,242,0.94)}.im-checkout{max-width:300px;margin-bottom:20px}iframe{border:none !important}</style>';

  var BABStyles = '<style>*{box-sizing: border-box;}body{font-family:"Noto Sans", sans-serif;}#bab_pincode_widget{display:none;}.pace-loading{display:block;width:40px;height:40px;border-color:#555 transparent transparent #555;border-style:solid;border-width:2px;border-radius:40px;-webkit-animation:pace-spinner 0.4s linear infinite;animation:pace-spinner 0.4s linear infinite;top:50%;left:50%;margin-left:-20px;position:absolute;margin-top:-20px;z-index:-1;}#gmas_footer{display:none;}@keyframes pace-spinner {0% {-webkit-transform:rotate(0deg);transform:rotate(0deg);}to{-webkit-transform:(1turn);transform:rotate(1turn);}}#iframe-bg{position:fixed;left:0;top:0;width:100%;z-index:9999;height:100%;background:rgba(241,244,242,0.94);display:none;transition:all 0.4s ease;transition-delay:2s;}#iframe-bg #myIframe{width:375px;height:600px;position:absolute;left:50%;top:50%;transform:translate(-50%, -50%);}span.close{position:absolute;right:20px;top:20px;background:transparent;width:30px;height:30px;border-radius:30px;box-shadow:#555 0 0 0 2px;cursor:pointer;}span.close:before,span.close:after{position:absolute;left:14px;top:7px;content:"";width:2px;height:15px;background:#555;transform:rotate(45deg);}span.close:after{transform:rotate(-45deg);}.product-opt .bab-input.multiple {width: auto;display: inline-block;margin: 5px 5px 5px 0;}.product-opt .bab-input.multiple input {display: inline-block;width: auto;vertical-align: middle;}.product-opt span {font-size: 13px;line-height: 1;}.product-opt .bab-input input {width: 100%;}.product-opt .bab-input {width: 63%;display: inline-block;vertical-align: middle;}.product-opt-text {width: 35%;display: inline-block;vertical-align: middle;}.product-opt p {margin: 0 0 5px;}.product-opt {padding: 10px 0;text-align: left;border-bottom: #ccc solid 1px;}span#show-error {color: #a94442;font-size: 14px;margin: 0 0 10px;display: inline-block;}input#bab_id_paywhatyouwant{width: 100%;padding: 11px 15px;border: 1px solid #e5e5e5;margin: 0;box-sizing: border-box;}.bab-modal-backdrop,.bab-modal-dialog,.bab-modal-overlay{position:fixed;top:0;bottom:0}:root{--button-color:#000}.bab-modal-overlay{right:0;left:0;z-index:1040;background-color:rgba(241,244,242,0.94);display:none;opacity:1}.bab-button,.bab-button:focus,.bab-button:hover{background:var(--button-color);border-radius:var(--button-radius);color:#fff}.bab-buy-btn,.bab-quantity-ctrl label{text-transform:uppercase}.bab-product-item{display:flex;height:200px;overflow:hidden;margin:10px 0}.bab-image-container img{height:auto;width:auto;max-width:100%;max-height:90vh}.bab-item-detail{padding:20px}.bab-button{border:0;text-decoration:none;width:auto;margin:0;padding:6px 12px;cursor:pointer}.bab-modal-backdrop{right:0;left:0;z-index:1040;background-color:#000}.bab-modal-dialog{z-index:2400;right:-400px;margin:0;background-color:#fff;width:385px;-webkit-transition:right .4s ease;-moz-transition:right .4s ease;-ms-transition:right .4s ease;-o-transition:right .4s ease;transition:right .4s ease}.bab-modal-dialog .bab-modal-content{-ms-box-shadow:0;-o-box-shadow:0;box-shadow:0;border-radius:0;background:0;border:0;height:100%}.bab-modal-content{position:relative;background-color:#fff;border:1px solid #999;border:1px solid rgba(0,0,0,.2);border-radius:6px;box-shadow:0 3px 9px rgba(0,0,0,.5);background-clip:padding-box;outline:0}.bab-modal-product-popover{position:relative;height:100%;background:#fff}.bab-icon{display:inline-block;vertical-align:middle}.bab-prod-title h3{font-size:1.17em}.bab-short-description{font-size:14px}.bab-price-label{font-size:16px;font-weight:700}.bab-product-content{width:100%;text-align:center;overflow-y:scroll;position:absolute;top:0;padding-bottom:40px;bottom:0}.bab-pincode-form input,.bab-pincode-form select,.bab-product-content>div{padding:10px}.bab-product-price{margin:0 0 2px;font-size:12px;color:#666}.close-button{position:absolute;top:10px;right:25px}.bab-price-cut{text-decoration:line-through;color:#ccc}.bab-pincode-form{display:flex;margin-top:6px}.bab-pincode-form select{background-color:#fff;border:1px solid #000;width:100px}.bab-pincode-widget input{border-width:0 0 1px;border-style:none none solid;border-color:transparent transparent #ccc;padding:10px 0 10 5px;width:69%}.bab-buy-btn,.bab-pincode-btn{background:var(--button-color);border:0;color:#fff;cursor:pointer}.bab-pincode-btn{padding:12px}.bab-pincode-widget{display:flex;flex-flow:wrap;justify-content:space-between;align-items:flex-end}.bab-product-buy-actions-block{position:absolute;bottom:0;width:100%;left:0;display:flex;align-items:center;justify-content:space-between}.bab-buy-btn{width:100%;margin:0;padding:0;height:40px}.bab-item-detail-block{display:flex;align-items:center;justify-content:space-between;padding:0 12px;margin:10px 0}.bab-buy-btn.bab-add-to-cart{background:0;color:#000;border:1px solid #000}.bab-choose-quantity{padding-left:0;display:-webkit-flex;display:-moz-flex;display:-ms-flex;display:-o-flex;display:flex;-ms-align-items:center;align-items:center;justify-content:space-between;width:100px;border:1px solid #ccc;margin:0;height:36px}.bab-choose-quantity li{list-style:none;vertical-align:middle;background-color:#f9f3f3}.bab-choose-quantity li svg{padding-top:5px}.quant-count{background-color:transparent!important}.bab-quantity-ctrl label{font-size:12px;color:#111;margin:0 0 2px;padding:11px 5px}.bab-quantity-ctrl{margin:10px 0;display:flex}.bab-select-wrapper{position:relative;display:inline-block;margin-bottom:18px;width:100%}.bab-pincode-form .bab-select-wrapper{margin-bottom:12px}#option_template .bab-select-wrapper select{margin:5px 0}.bab-select-wrapper select.bab-select-box{font-family:Arial;display:inline-block;width:100%;cursor:pointer;padding:11px 15px;outline:0;border:1px solid #e5e5e5;border-radius:0;background:#fff;color:#070606;appearance:none;-webkit-appearance:none;-moz-appearance:none}.bab-select-wrapper select.bab-select-box::-ms-expand{display:none}.bab-select-wrapper select.bab-select-box:focus,.bab-select-wrapper select.bab-select-box:hover{color:#000;background:#F1F1F7}.bab-select-wrapper select.bab-select-box:disabled{opacity:.5;pointer-events:none}.bab-select-wrapper .bab-select-arrow{position:absolute;top:20px;right:15px;pointer-events:none;border-style:solid;border-width:8px 5px 0;border-color:#7B7B7B transparent transparent}.bab-select-wrapper select:focus~.bab-select-arrow,.bab-select-wrapper select:hover~.bab-select-arrow{border-top-color:#000}.bab-select-wrapper select:disabled~.bab-select-arrow{border-top-color:#CCC}.bab-pincode-form .bab-select-wrapper .bab-select-arrow{top:16px}.bab-modal-dialog .empty-product-state img{width:100%;height:90vh;max-height:300px}.bab-modal-dialog .empty-product-state p{font-size:20px;color:#bcbcbc}.bab-product-buy-actions-block button:disabled{opacity:.6;cursor:not-allowed}@media(min-width:992px){.bab-modal-product-popover .close-button{z-index:1;cursor:pointer;color:#ccc;position:absolute;right:20px;top:10px}}#bab-slider-nav a,.bab-prod-title{text-decoration:none;color:#000}#bab-slider{width:90%;overflow:hidden;margin:auto}#bab-slider-wrapper{width:9999px;transition:left .4s linear;position:relative;display:flex;margin-top:28px}#bab-slider-wrapper .slide{overflow:hidden;display:flex;align-items:center;justify-content:center;width:250px;height:300px;border:1px solid #ccc;margin:10px 28px}.slide img{height:auto;max-width:100%;max-height:100%}#bab-slider-nav{margin:1.2em 0;text-align:center}#bab-slider-nav a{width:.5em;height:.5em;text-align:center;display:inline-block;line-height:2;margin-right:.5em;border-color:#d6d6d6;border-radius:50%;background-color:#d6d6d6}#bab-slider-nav a.current{border-color:#fa5e02;background-color:#fa5e02}.bab-modal-dialog .custom-scroll::-webkit-scrollbar{width:8px;margin-right:20px}.bab-modal-dialog .custom-scroll::-webkit-scrollbar-track{width:2px;background:#ccc;border-radius:0}.bab-modal-dialog .custom-scroll::-webkit-scrollbar-thumb{border-radius:0;width:12px;background:#666}.bab-shipping-detail-list{padding-left:0;list-style:none}.bab-shipping-detail-list>li{display:inline-block;padding-right:5px;padding-left:5px}.bab-shipping-detail-list>li.text-success{color:#66b032}.bab-shipping-detail-list>li.text-danger{color:#a94442}#shipping_option_detail .text-danger{text-align:left;color:#a94442}@media(max-width:767px){.bab-modal-dialog{width:100%}}</style>';

  function isEmpty(obj) {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) return false;
    }
    return true;
  }

  function slugify(str) {
    return str ? str.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-') : "";
  }

  function request(params) {
    var param_data = '?format=json';
    if (params.method == 'POST') {
      param_data = '?format=json&t=' + Date.now();
    }
    if (!isEmpty(params.params)) {
      for (var prop in params.params) {
        if (param_data) {
          param_data = [param_data, '&', prop, '=', params.params[prop]].join('');
        } else {
          param_data = [param_data, prop, '=', params.params[prop]].join('');
        }
      }
    }
    var url = [params.url, param_data].join('');
    return fetch(url, {
      headers: params.headers,
      method: params.method || "GET",
      body: JSON.stringify(params.data)
    }).then(function(response) {
      return response.json()
        .then(function(json) {
          if (response.ok) {
            return json
          } else {
            var error = Object.assign({}, json, {
              status: response.status,
              statusText: response.statusText
            })
            return Promise.reject(error)
          }
        })
    }).catch(function(data) {
      return data;
    });
  };

  function BABextend(obj1, obj2) {
    var extended = {};
    var prop;
    for (prop in obj1) {
      if (Object.prototype.hasOwnProperty.call(obj1, prop)) {
        extended[prop] = obj1[prop];
      }
    }
    for (prop in obj2) {
      if (Object.prototype.hasOwnProperty.call(obj2, prop)) {
        extended[prop] = obj2[prop];
      }
    }
    return extended;
  };

  function fetchProductView(params) {
    var defaultParams = {
      'offset': 0,
      'limit': 1,
      'fields': product_listing_keys
    };
    request({
      url: [resources.inventory[clientData.env], clientData.store_name, 'api/v4/product/'].join('/'),
      params: BABextend(defaultParams, params),
      header: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(function(data, status) {
      createProductContainer(data.objects[0]);
    });
  };

  function fetchProductOptions(product_id) {
    var defaultParams = {
      'fields': product_option_keys
    };
    request({
      url: [resources.inventory[clientData.env], clientData.store_name, 'api/v4/product-option/'].join('/'),
      params: BABextend(defaultParams, { p: product_id }),
      header: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(function (data, status) {
      var product_options = data.objects;
      productOptionData = data.objects;
      createProductOptionWidget({ product_options: product_options });
    });
  }

  function fetchProductDetails(params) {
    var bab = this;
    var defaultParams = {
      'offset': 0,
      'limit': 500,
      'fields': product_listing_keys
    };
    request({
      url: [resources.inventory[clientData.env], clientData.store_name, 'api/v4/product/'].join('/'),
      params: BABextend(defaultParams, params),
      header: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(function(data, status) {
      var iframeHtml = Mustache.to_html('<div id="iframe-bg"><iframe id="myIframe" height="100%" width="100%"></iframe><span onclick="IM.hideIframe()" class="close"></span><div class="pace-loading"></div></div>');
      var html = Mustache.to_html(BABModal);
      var div = document.createElement('div');
      div.innerHTML = iframeHtml + html;
      document.body.appendChild(div);
      document.getElementById('bab_cart_overlay').style.display = 'block';
      document.getElementById('bab_cart').style.right = '0';
      if (data.objects.length) {
        baseProduct = data.objects.filter(function(item) {
          return item.g == item.id;
        })[0];
        if (!baseProduct.i) {
          baseProduct.i = "https://gmas-static-assets-1.s3.amazonaws.com/img/brokenimage.png";
          baseProduct.di = "https://gmas-static-assets-1.s3.amazonaws.com/img/brokenimage.png";
        }
        if (data.objects.length > 1) {
          variantData = data.objects.reduce(function(obj, item) {
            obj[item.optv1] = obj[item.optv1] || {};
            obj[item.optv1][item.optv2] = obj[item.optv1][item.optv2] || [];
            if (obj[item.optv1][item.optv2].indexOf(item.optv3) == -1) {
              obj[item.optv1][item.optv2].push(item.optv3);
            };
            return obj;
          }, {});
          availableVariants = data.objects.reduce(function(prev, curr) {
            var combo = [curr.optv1, curr.optv2, curr.optv3].filter(function(val) {
              return val;
            }).join('|');
            prev[combo] = createVariantData(curr, baseProduct);
            if (curr.id == curr.g) {
              activeProduct = prev[combo];
            }
            return prev;
          }, {});
          allProductsData = data.objects;
          opt1Values = Object.keys(variantData).map(function(item) {
            return {
              value: item,
              selected: item == activeProduct.optv1
            };
          });
        } else {
          activeProduct = data.objects[0];
          activeProduct['quantity'] = 1;
        }
        document.querySelectorAll('.bab-product-buy-actions-block button')[0].disabled = false;
        createActiveProductTemplate(activeProduct);
        preserveActiveData = BABextend(activeProduct, {});
        fetchProductOptions(params.g);
      } else {
        var html = Mustache.to_html(ProductNotFoundContent, productData, partials);
        document.getElementById('bab_product_content').innerHTML = html;
        document.querySelectorAll('.bab-product-buy-actions-block button')[0].disabled = true;
      }
    });
  };

  function createVariantData(activeItem, baseProduct) {
    activeItem = Object.assign({}, activeItem);
    activeItem.quantity = 1;
    activeItem.t = activeItem.t ? activeItem.t : baseProduct.t;
    activeItem.p = activeItem.p ? parseFloat(activeItem.p) : parseFloat(baseProduct.p);
    activeItem.opt1 = activeItem.opt1 ? activeItem.opt1 : baseProduct.opt1;
    activeItem.opt2 = activeItem.opt2 ? activeItem.opt2 : baseProduct.opt2;
    activeItem.opt3 = activeItem.opt3 ? activeItem.opt3 : baseProduct.opt3;
    activeItem.dp = activeItem.dp ? parseFloat(activeItem.dp) : null;
    activeItem.vId = activeItem.id;
    activeItem.sd = activeItem.sd ? activeItem.sd : baseProduct.sd;
    activeItem.moq = activeItem.moq ? activeItem.moq : baseProduct.moq;
    activeItem.c = activeItem.c ? activeItem.c : baseProduct.c;
    activeItem.b = activeItem.b ? activeItem.b : baseProduct.b;
    if (!activeItem.i) {
      var count = 0;
      for (count = 1; count < 11; count++) {
        var imageKey = count == 1 ? 'i' : ['i', count].join('');
        var descKey = count == 1 ? 'di' : ['di', count].join('');
        activeItem[imageKey] = baseProduct[imageKey];
        activeItem[descKey] = baseProduct[descKey];
      }
    }
    return activeItem;
  }

  function fetchCountryList() {
    request({
      url: 'https://restcountries.eu/rest/v2/',
      header: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(function(data, status) {
      var countryList = data;
      createPincodeWidget({
        "countryList": countryList
      });
    });
  };

  function createPayWhatYouWant() {
    if (document.getElementById('bab_pwyw_widget')) {
      document.getElementById('bab_pwyw_widget').innerHTML = '';
    }
    var html = Mustache.to_html(paywhatyouwant);
    var div = document.createElement('div');
    div.innerHTML = html;
    document.getElementById('bab_pwyw_widget').appendChild(div);
  }

  function createPincodeWidget(countryList) {
    if (document.getElementById('bab_pincode_widget')) {
      document.getElementById('bab_pincode_widget').innerHTML = '';
    }
    var html = Mustache.to_html(pincodeWidget, countryList);
    var div = document.createElement('div');
    div.innerHTML = html;
    document.getElementById('bab_pincode_widget').appendChild(div);
    document.getElementById('bab_id_country').value = 'IN';
  }

  function createProductOptionWidget(potn) {
    if (document.getElementById('bab_productoption_widget')) {
      document.getElementById('bab_productoption_widget').innerHTML = '';
    }
    var customizeProductOptions = potn.product_options.map(function (po, i) {
      return BABextend(po, {
        [po.o.type]: po.o.type,
        title: po.o.name
      });
    });
    var html = Mustache.to_html(product_options_widget, { productOptions: customizeProductOptions });
    var div = document.createElement('div');
    div.innerHTML = html;
    if(document.getElementById('bab_productoption_widget')) document.getElementById('bab_productoption_widget').appendChild(div);
    // document.getElementById('bab_id_country').value = 'IN';
  }

  function createProductContainer(productData) {
    productData['currency'] = currency;
    var html = Mustache.to_html(BABProductContainer, productData);
    var div = document.createElement('div');
    div.classList.add('bab-product-item');
    div.innerHTML = html;
    document.getElementById('bab_product_container_' + clientData.product_id).appendChild(div);
  }

  function createCheckoutForm(productData) {
    if (document.getElementById('bab-checkout-form')) {
      removeElement('bab-checkout-form');
    }
    var itemData = {
      "title": productData.t,
      "product_type": productData.prodt,
      "pay_what_you_want": productData.pwyw,
      "id": productData.id,
      "quantity": productData.quantity,
      "stock": productData.s,
      "moq": productData.moq,
      "image": productData.i,
      "sku": productData.sku,
      "maxoq": productData.maxoq.toString(),
      "price": parseInt(productData.p),
      "final_price": productData.dp ? parseInt(productData.dp) : parseInt(productData.p),
      "cod": productData.c,
      "bank": productData.b,
      "categories": [],
    };
    if (productData.dp) {
      itemData['discounted_price'] = parseInt(productData.dp);
    }
    if (productData.options) {
      for (let i = 0; i < productData.options.length; i++) {
        if (productData.options[i].option.chargeable) {
          itemData.final_price += parseInt(productData.options[i].option.charges);
        }        
      }
      itemData.options = productData.options;
    }
    if (productData.vId) {
      if (productData.opt1) {
        itemData.option1 = productData.opt1;
        itemData.option1_value = productData.optv1;
      }
      if (productData.opt2) {
        itemData.option2 = productData.opt2;
        itemData.option2_value = productData.optv2;
      }
      if (productData.opt3) {
        itemData.option3 = productData.opt3;
        itemData.option3_value = productData.optv3;
      }
    };
    var checkoutData = {
      'total_items': productData.quantity,
      'total_price': itemData.final_price * productData.quantity,
      'item': JSON.stringify(itemData),
      'user_name': clientData.store_name,
      'source': 'web',
      'user_domain': clientData.domain
    };

    var MyIFrame = document.getElementById("myIframe");
    var MyIFrameDoc = MyIFrame.contentWindow || MyIFrame.contentDocument;

   // var doc = MyIFrame.contentDocument;
   // doc.head.innerHTML = doc.head.innerHTML + '<style>.social-login-wrap{display:none;}</style>';

    if (MyIFrameDoc.document) MyIFrameDoc = MyIFrameDoc.document;
    var html = Mustache.to_html(checkoutForm, checkoutData);
    var div = document.createElement('div');
    div.innerHTML = html;
    MyIFrameDoc.write(html);


    setTimeout(() => { 
      var MyIFrame = document.getElementById("myIframe");
      var MyIFrameDoc = MyIFrame.contentWindow || MyIFrame.contentDocument;
      var elmnt = MyIFrameDoc.getElementsByClassName("login-mobile-wrapper");
      elmnt[0].style.display = "none";
     }, 5000);

    // document.body.appendChild(div);
  }

  function createActiveProductTemplate(productData) {
    productData['images'] = [];
    productData['slug'] = slugify(productData.t);
    productData['user_domain'] = clientData.domain;
    for (var _count = 1; _count < 11; _count++) {
      var imageKey = _count == 1 ? 'i' : ['i', _count].join('');
      var descKey = _count == 1 ? 'di' : ['di', _count].join('');
      var zoomKey = _count == 1 ? 'zi' : ['zi', _count].join('');
      if (productData[imageKey]) {
        productData['images'].push({
          'src': productData[imageKey],
          'index': _count
        });
      } else if (productData[descKey]) {
        productData['images'].push({
          'src': productData[imageKey],
          'index': _count
        });
      } else if (productData[zoomKey]) {
        productData['images'].push({
          'src': productData[imageKey],
          'index': _count
        });
      }
    }
    productData['currency'] = currency;
    if (document.getElementById('bab_product_content')) {
      document.getElementById('bab_product_content').innerHTML = '';
    }
    var html = Mustache.to_html(ProductContent, productData, partials);
    var div = document.createElement('div');
    div.innerHTML = html;
    document.getElementById('bab_product_content').appendChild(div);
    var aSlider = new Slider("#bab-slider");
    fetchCountryList();
    if (productData.pwyw) {
      createPayWhatYouWant();
    }
    if (allProductsData.length > 1) {
      createOptionsData(productData);
    }
    if (productData.s > 0) {
      document.querySelector('.bab-buy-now-btn').disabled = false;
      document.querySelector('.bab-buy-now-btn').innerHTML = 'Buy Now';
    } else {
      document.querySelector('.bab-buy-now-btn').disabled = true;
      document.querySelector('.bab-buy-now-btn').innerHTML = 'Sold Out';
    }
  };

  function createOptionsData(activeProduct) {
    if (activeProduct.optv1) {
      opt1Values = Object.keys(variantData).map(function(item) {
        return {
          value: item,
          selected: activeProduct.optv1 == item
        };
      });
      var html = Mustache.to_html(optionsTemplate, {
        optionValues: opt1Values,
        key_id: 'optv1'
      });
      var div = document.createElement('div');
      div.classList.add("bab-select-wrapper");
      div.innerHTML = html;
      document.getElementById('option_template').appendChild(div);
    }
    if (activeProduct.optv2) {
      opt2Values = Object.keys(variantData[activeProduct.optv1]).map(function(item) {
        return {
          value: item,
          selected: activeProduct.optv2 == item
        };
      });
      var html = Mustache.to_html(optionsTemplate, {
        optionValues: opt2Values,
        key_id: 'optv2'
      });
      var div = document.createElement('div');
      div.classList.add("bab-select-wrapper");
      div.innerHTML = html;
      document.getElementById('option_template').appendChild(div);
    }
    if (activeProduct.optv3) {
      opt3Values = variantData[activeProduct.optv1][activeProduct.optv2].map(function(item) {
        return {
          value: item,
          selected: activeProduct.optv3 == item
        };
      });
      var html = Mustache.to_html(optionsTemplate, {
        optionValues: opt3Values,
        key_id: 'optv3'
      });
      var div = document.createElement('div');
      div.classList.add("bab-select-wrapper");
      div.innerHTML = html;
      document.getElementById('option_template').appendChild(div);
    }
  }

  function renderOptionsTemplate(e) {
    var key_id = e.id;
    var optv1 = document.getElementById('optv1').value;
    if (key_id == 'optv1') {
      optv2 = Object.keys(variantData[optv1])[0];
      optv3 = variantData[optv1][optv2][0];
    } else if (key_id == 'optv2') {
      var optv2 = document.getElementById('optv2').value;
      optv3 = variantData[optv1][optv2][0];
    } else {
      var optv1 = document.getElementById('optv1').value;
      var optv2 = document.getElementById('optv2').value;
      var optv3 = document.getElementById('optv3').value;
    }
    var elem = document.getElementById('bab_product_content');
    elem.innerHTML = '';
    var combo = [optv1, optv2, optv3].filter(function(val) {
      return val;
    }).join('|');
    activeProduct = availableVariants[combo];
    createActiveProductTemplate(activeProduct);
  }

  function renderShippingOptionsTemplate(shippingOptionsData) {
    if (document.getElementById('shipping_option_detail')) {
      document.getElementById('shipping_option_detail').innerHTML = '';
    }
    var html = Mustache.to_html(shippingOptionTemplate, shippingOptionsData);
    var div = document.createElement('div');
    div.innerHTML = html;
    document.getElementById('shipping_option_detail').appendChild(div);
    document.getElementById('bab_pincode_widget').scrollIntoView(true);
  }

  function removeElement(element_id) {
    var elem = document.getElementById(element_id);
    elem.parentElement.removeChild(elem);
  }

  function showCart(dataString) {
    clientData = dataString;
    fetchProductDetails({
      'g': dataString.product_id
    });
  }

  function hideCart() {
    document.getElementById('bab_cart').style.right = '-400px';
    document.getElementById('bab_cart_overlay').style.display = 'none';
  }

  function hideIframe() {
    var MyIFrame = document.getElementById("myIframe");
    // var MyIFrameDoc = MyIFrame.contentWindow || MyIFrame.contentDocument;
    // if (MyIFrameDoc.document) MyIFrameDoc = MyIFrameDoc.document;
    // MyIFrameDoc.write('');
    MyIFrame.parentNode.parentNode.remove()
    // document.getElementById("iframe-bg").style.display = "none";
  }

  function increaseQuantity() {
    var qty = parseInt(document.getElementById('bab_product_qty').innerHTML);
    if (qty < activeProduct.s) {
      qty = qty + 1;
      document.getElementById('bab_product_qty').innerHTML = qty;
    }
    activeProduct['quantity'] = qty;
  }

  function decreaseQuantity() {
    var qty = parseInt(document.getElementById('bab_product_qty').innerHTML);
    if (qty > 1) {
      qty = qty - 1;
      document.getElementById('bab_product_qty').innerHTML = qty;
    }
    activeProduct['quantity'] = qty;
  }

  function renderUI(_clientData) {
    var div = document.createElement('div');
    div.innerHTML = BABStyles;
    document.body.appendChild(div);
    document.documentElement.style.setProperty('--button-color', _clientData.button_color);
    document.documentElement.style.setProperty('--button-radius', _clientData.button_radius);
    clientData = _clientData;
    clientData['env'] = clientData.env ? clientData.env : 'production';
    if (document.getElementById('bab_product_container_' + _clientData.product_id)) {
      fetchProductView({
        'id': _clientData.product_id
      });
    }
  }

  function checkPincode() {
    var product_ids = [];
    product_ids.push(activeProduct.id);
    var params = {
      country: document.getElementById('bab_id_country').value,
      pincode: document.getElementById('bab_id_pincode').value,
      productIds: product_ids
    };
    request({
      url: [resources.inventory[clientData.env], clientData.store_name, 'dapi/v1/shipping/check-delivery/'].join('/'),
      params: params,
      header: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(function(data, status) {
      if (data.status && data.status > 300) {
        delete(data.status);
        delete(data.statusText);
        if (document.getElementById('shipping_option_detail')) {
          document.getElementById('shipping_option_detail').innerHTML = '';
        }
        var html = '';
        var div = document.createElement('div');
        var errors = data;
        var fieldKeys = ['country', 'pincode']
        Object.keys(errors).forEach(function(key) {
          if (fieldKeys.indexOf(key) > -1) {
            html = html + '<p class="text-danger">' + key + ':' + errors[key] + '</p>';
          } else {
            html = html + '<p class="text-danger">' + errors[key] + '</p>';
          }
        });
        div.innerHTML = html;
        document.getElementById('shipping_option_detail').appendChild(div);
        document.getElementById('bab_pincode_widget').scrollIntoView(true);
      } else {
        renderShippingOptionsTemplate(data[activeProduct.id])
      }
    })
  }

  function checkPWYW() {
    const value = document.getElementById("bab_id_paywhatyouwant").value;
    const error = document.getElementById("show-error");

    const price = document.getElementsByClassName("bab-price-label")[0];
    //
    activeProduct.currency = !activeProduct.currency ? "INR" : activeProduct.currency;
    if (parseInt(value) < parseInt(activeProduct.p)) {
      error.innerHTML = "Minimum amount is Rs. " + activeProduct.p;
    } else {
      activeProduct["p"] = parseInt(value);
      price.innerHTML = activeProduct.dp ? '<span class="bab-price-cut">' + activeProduct.currency + " " + activeProduct.p + "</span>" + activeProduct.currency + " " + activeProduct.dp : activeProduct.currency + " " + activeProduct.p;
      error.innerHTML = "";
    }

    if (value == "") {
      activeProduct.p = preserveActiveData.p;
      price.innerHTML = activeProduct.dp ? '<span class="bab-price-cut">' + activeProduct.currency + " " + activeProduct.p + "</span>" + activeProduct.currency + " " + activeProduct.dp : activeProduct.currency + " " + activeProduct.p;
      error.innerHTML = "";
    }
  }

  function onChangeText(option_id, type) {
    var value = '';
    var checkboxOptionId = null;
    switch(type) {
        case 'text': 
        case 'date':
        case 'time':
        case 'datetime':
          value = document.getElementById('option_' + option_id).value;
          break;
        case 'radio': 
        case 'checkbox':
          value = document.getElementById('option_' + option_id).value;
          checkboxOptionId = option_id.split('-')[1];
          option_id = option_id.split('-')[0];
          break;
    }

    if (typeof activeProduct.options == 'undefined') {
      activeProduct.options = [];
    }
    var optionAlreadyExists = false;
    for (var i = 0; i < activeProduct.options.length; i++) {
      if (activeProduct.options[i].option_id == option_id) {
        optionAlreadyExists = true;
        if (type == 'checkbox') {
          var checkboxOptionDoesNotExist = true;
          for (var j = 0; j < activeProduct.options[i]['value'].length; j++) {
            if (activeProduct.options[i]['value'][j].text == value) {
              checkboxOptionDoesNotExist = false;
              activeProduct.options[i]['value'].splice(j,1);
              if (!activeProduct.options[i]['value'].length) {
                activeProduct.options.splice(i, 1);
                break;
              }
            }
          }
          if (checkboxOptionDoesNotExist) {
            activeProduct.options[i]['value'].push({ id: checkboxOptionId, text: value });
          }
        } else {
          if(value || value != '')
            activeProduct.options[i].value = value;
          else
            activeProduct.options.splice(i, 1);
        }
      }
    }
    if (!optionAlreadyExists) {
      for (var i = 0; i < productOptionData.length; i++) {
        if (productOptionData[i].o && productOptionData[i].o.id == option_id ) {
          if (type == 'checkbox') {
              activeProduct.options.push({ option: { id: productOptionData[i].id, chargeable: productOptionData[i].chargeable, name: productOptionData[i].o.name, type: productOptionData[i].o.type, charges: productOptionData[i].charges }, value: [{id:checkboxOptionId, text: value}], option_id: productOptionData[i].o.id });
          } else if (type == "radio") {
            activeProduct.options.push({ option: { id: productOptionData[i].id, chargeable: productOptionData[i].chargeable, name: productOptionData[i].o.name, type: productOptionData[i].o.type, charges: productOptionData[i].charges }, value: {id:checkboxOptionId, text: value}, option_id: productOptionData[i].o.id });
          } else {
              activeProduct.options.push({ option: { id: productOptionData[i].id, chargeable: productOptionData[i].chargeable, name: productOptionData[i].o.name, type: productOptionData[i].o.type, charges: productOptionData[i].charges }, value: value, option_id: productOptionData[i].o.id });
          }
        }
      }
    }
    let classNames = document.getElementsByClassName('check-new');
    for(let i = 0; i < classNames.length; i++ ) {
        let checked = classNames[i].required = false;
    }
  }


  // This function is used to prevent product option form from submitting.
  function checkProductOptionsValidation() {
    event.preventDefault();
    return false;
  }

  function onCheckout() {

    let checkBoxId = document.getElementById('check-req');
    if (checkBoxId) {
        let isRequired = checkBoxId.classList.contains('required');
        
        if(isRequired) {
            let classNames = document.getElementsByClassName('check-new');        
            for(let i = 0; i < classNames.length; i++ ) {
                let checked = classNames[i].checked;
                  if(checked) {
                    for(let j = 0; j < classNames.length; j++ ) {
                        classNames[j].required = false;   
                    }
                    break;
                  } else {
                    classNames[i].required = true;  
                  }
            }
            IM.hideCart();
        }
    }

    if(document.getElementById('product_options_main')){
      var value = document.getElementById('product_options_main').checkValidity();
      if (value == false) {
        document.getElementById('product_option_form_submit').click();
      } else {
        createCheckoutForm(activeProduct);
        var MyIFrame = document.getElementById("myIframe");
        var MyIFrameDoc = MyIFrame.contentWindow || MyIFrame.contentDocument;
        if (MyIFrameDoc.document) MyIFrameDoc = MyIFrameDoc.document;
        MyIFrameDoc.getElementById("bab-checkout-form").submit();
        document.getElementById("iframe-bg").style.display = "block";
        // document.getElementById('#gmas_footer').style.display = 'none'
        IM.hideCart();
        // document.getElementById('bab-checkout-form').submit();
      }
    } else {
      createCheckoutForm(activeProduct);
      var MyIFrame = document.getElementById("myIframe");
      document.getElementById('#gmas_footer').style.display = 'none'
      var MyIFrameDoc = MyIFrame.contentWindow || MyIFrame.contentDocument;
      if (MyIFrameDoc.document) MyIFrameDoc = MyIFrameDoc.document;
      MyIFrameDoc.getElementById("bab-checkout-form").submit();
      
      // document.getElementById('bab-checkout-form').submit();
    }
  }

  function getPayButtonCard(element, checkoutButtonData) {
    const randomId = Math.floor(Math.random() * 100 + 1);

    const imageDiv = convertUrlToImage(randomId, checkoutButtonData['imageUrl']);

    const descDiv = convertTextToDescription(randomId, checkoutButtonData['description']);

    const payButton = convertLinkToButton(randomId, checkoutButtonData, element);

    const getVerticalLayout = () =>
      `<div class="layout-vertical">
        ${imageDiv}
        ${descDiv}
        ${payButton}
      </div>`;

    const getHorizontalLayout = () =>
      `<div class="layout-horizontal">
        <div>
          ${imageDiv}
        </div>
        <div>
          ${descDiv}
          ${payButton}
        </div>
      </div>`;

    element.outerHTML = checkoutButtonData['layout']
      ? `<div class="im-checkout-layout layout-${randomId}">
        ${checkoutButtonData['layout'] === 'vertical' ? getVerticalLayout() : getHorizontalLayout()}
      </div>`
      : payButton;
      // renderUI(clientData);
    setButtonBehaviourAndStyles(randomId, checkoutButtonData);
  }

  function convertUrlToImage(randomId, imageUrl) {
    return imageUrl
      ? `<div class="img-${randomId}">
      <img class="checkout-image" src=${imageUrl} />
    </div>`
      : "";
  }

  function convertTextToDescription(randomId, description) {
    const encodedDescription = description ? unicodeToHtmlEntity(description) : description;
    return encodedDescription
      ? `<div class="desc-${randomId}">
      <p class="checkout-description">${encodedDescription}</p>
    </div>`
      : "";
  }

  /**
   * Converts a[rel="im-checkout"] to button which opens a modal
   */
  function convertLinkToButton(randomId, checkoutButtonData, element) {
    let cData = {
      product_id: checkoutButtonData['product_id'],
      domain: checkoutButtonData['domain'],
      store_name: checkoutButtonData['store_name'],
      env: checkoutButtonData['env'],
    }
    let changeString = `<div class=${"bab_product_container_" + checkoutButtonData.product_id}><div class="im-checkout btn-${randomId} bab-product-item-img ">
      <a href="javascript:void(0)" class="bab-button im-checkout-btn btn--default" onClick=IM.showCart(` + JSON.stringify(cData) + `);>`;
      
      if (checkoutButtonData['verb'] && checkoutButtonData['verb'] !== '') {
        changeString += unicodeToHtmlEntity(checkoutButtonData['verb']);
      } else {
        changeString += 'Pay';
      }
    changeString += "</a></div></div>";
    return changeString;
  }

  /*
   * Apply classes based on data-attribute
   */
  function setButtonBehaviourAndStyles(randomId, checkoutButtonData) {
    const checkoutButton = document.querySelector(`.btn-${randomId}`).querySelector(`a[href="javascript:void(0)"].bab-button`);

    // // for older version of embed button
    // if (checkoutButtonData["style"] === "light") {
    //   checkoutButton.class += " btn--light";
    // } else if (checkoutButtonData["style"] === "dark") {
    //   checkoutButton.class += " btn--dark";
    // } else if (checkoutButtonData["style"] === "flat") {
    //   checkoutButton.class += " btn--flat";
    // } else if (checkoutButtonData["style"] === "flat-dark") {
    //   checkoutButton.class += " btn--flat-dark";
    // } else {
    //   checkoutButton.class += " btn--default";
    // }

    // for newer version of embed button
    checkoutButton.setAttribute('style', `${checkoutButtonData["cssStyle"]}`);
  }

  /**
   * Get attributes from the original link
   */
  function getButtonData(element) {
    clientData = {
      product_id: element.getAttribute('data-id'),
      domain: element.getAttribute('data-domain'),
      store_name: element.getAttribute('data-store-name'),
      env: element.hasAttribute('data-env') ? element.getAttribute('data-env') : 'production'
    };
    return {product_id: element.getAttribute('data-id'),
      domain: element.getAttribute('data-domain'),
      store_name: element.getAttribute('data-store-name'),
      env: clientData.env ? clientData.env : 'staging',
      id: element.getAttribute('data-id'),
      behavior: element.getAttribute('data-behavior') || element.getAttribute('data-behaviour'), // due to a bug that has crept into our codebase
      link: element.href,
      style: element.getAttribute('data-style'),
      tab: element.getAttribute('data-newtab'),
      verb: element.getAttribute('data-text'),
      cssStyle: element.getAttribute('data-css-style'),
      imageUrl: element.getAttribute('data-image'),
      description: element.getAttribute('data-description'),
      layout: element.getAttribute('data-layout')
    };
  }

  function unicodeToHtmlEntity (text) {
    return text
    .replace(/[\u00A0-\u9999<>\&]/gim, (i) => {
      return (`&#${i.charCodeAt(0)};`);
    });
  }

  /**
   * Load the UI stylesheet for the Remote Checkout button.
   */
  function loadStylesheet() {
    // if (!document.getElementById('bab-button')) {
    //   const head = document.getElementsByTagName('head')[0];
    //   const embedCSSNode = document.createElement('style');
    //   embedCSSNode.setAttribute('id', 'bab-button');
    //   embedCSSNode.innerHTML = '/* inject-bab-button */';
    //   head.appendChild(embedCSSNode);
    // }
    var div = document.createElement('div');
    div.innerHTML = BABStyles;
    document.body.appendChild(div);
    var div = document.createElement('div');
    div.innerHTML = imojoStyles;
    document.body.appendChild(div);
    var style = document.createElement('link');
    style.setAttribute('href',"https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap");
    document.head.appendChild(style);
  }

  // function render() {
  //   function processButtons() {
  //     Array.prototype.slice.call(document.querySelectorAll('a[rel="im-checkout"]')).forEach(checkoutLink => {
  //       getPayButtonCard(checkoutLink, getButtonData(checkoutLink));
  //       loadStylesheet();
  //     });
  //   }

  //   if (document.readyState === "complete" || document.readyState === "interactive") {
  //     processButtons();
  //   } else {
  //     document.addEventListener("DOMContentLoaded", () => {
  //       processButtons();
  //     });
  //   }
  // }
  

  function render() {
    function processButtons() {
      Array.prototype.slice.call(document.querySelectorAll('a[rel="im-checkout"]')).forEach(checkoutLink => {
        getPayButtonCard(checkoutLink, getButtonData(checkoutLink));
        loadStylesheet();
      });
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
      processButtons();
    } else {
      document.addEventListener("DOMContentLoaded", () => {
        processButtons();
      });
    }
  }

  return {
    hideCart: hideCart,
    hideIframe: hideIframe,
    showCart: showCart,
    increaseQuantity: increaseQuantity,
    checkPincode: checkPincode,
    renderOptionsTemplate: renderOptionsTemplate,
    decreaseQuantity: decreaseQuantity,
    onCheckout: onCheckout,
    fetchProductDetails: fetchProductDetails,
    renderUI: renderUI,
    render: render,
    checkPWYW: checkPWYW,
    onChangeText: onChangeText,
    checkProductOptionsValidation: checkProductOptionsValidation
  };
}();

IM.render();

function Slider(element) {
  this.el = document.querySelector(element);
  this.init();
}
Slider.prototype = {
  init: function init() {
    this.links = this.el.querySelectorAll("#bab-slider-nav a");
    this.wrapper = this.el.querySelector("#bab-slider-wrapper");
    this.navigate();
  },
  navigate: function navigate() {
    for (var i = 0; i < this.links.length; ++i) {
      var link = this.links[i];
      this.slide(link);
    }
  },
  animate: function animate(slide) {
    var parent = slide.parentNode;
  },
  slide: function slide(element) {
    var self = this;
    element.addEventListener("click", function(e) {
      e.preventDefault();
      var a = this;
      self.setCurrentLink(a);
      var index = parseInt(a.getAttribute("data-slide"), 10);
      var currentSlide = self.el.querySelector(".slide:nth-child(" + index + ")");
      self.wrapper.style.left = "-" + (currentSlide.offsetLeft - 28) + "px";
      self.animate(currentSlide);
    }, false);
  },
  setCurrentLink: function setCurrentLink(link) {
    var parent = link.parentNode;
    var a = parent.querySelectorAll("a");
    link.className = "current";
    for (var j = 0; j < a.length; ++j) {
      var cur = a[j];
      if (cur !== link) {
        cur.className = "";
      }
    }
  }
};
/*!
 * mustache.js - Logic-less {{mustache}} templates with JavaScript
 * http://github.com/janl/mustache.js
 */

/*global define: false Mustache: true*/

(function defineMustache (global, factory) {
  if (typeof exports === 'object' && exports && typeof exports.nodeName !== 'string') {
    factory(exports); // CommonJS
  } else if (typeof define === 'function' && define.amd) {
    define(['exports'], factory); // AMD
  } else {
    global.Mustache = {};
    factory(global.Mustache); // script, wsh, asp
  }
}(this, function mustacheFactory (mustache) {

  var objectToString = Object.prototype.toString;
  var isArray = Array.isArray || function isArrayPolyfill (object) {
    return objectToString.call(object) === '[object Array]';
  };

  function isFunction (object) {
    return typeof object === 'function';
  }

  /**
   * More correct typeof string handling array
   * which normally returns typeof 'object'
   */
  function typeStr (obj) {
    return isArray(obj) ? 'array' : typeof obj;
  }

  function escapeRegExp (string) {
    return string.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
  }

  /**
   * Null safe way of checking whether or not an object,
   * including its prototype, has a given property
   */
  function hasProperty (obj, propName) {
    return obj != null && typeof obj === 'object' && (propName in obj);
  }

  // Workaround for https://issues.apache.org/jira/browse/COUCHDB-577
  // See https://github.com/janl/mustache.js/issues/189
  var regExpTest = RegExp.prototype.test;
  function testRegExp (re, string) {
    return regExpTest.call(re, string);
  }

  var nonSpaceRe = /\S/;
  function isWhitespace (string) {
    return !testRegExp(nonSpaceRe, string);
  }

  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  function escapeHtml (string) {
    return String(string).replace(/[&<>"'`=\/]/g, function fromEntityMap (s) {
      return entityMap[s];
    });
  }

  var whiteRe = /\s*/;
  var spaceRe = /\s+/;
  var equalsRe = /\s*=/;
  var curlyRe = /\s*\}/;
  var tagRe = /#|\^|\/|>|\{|&|=|!/;

  /**
   * Breaks up the given `template` string into a tree of tokens. If the `tags`
   * argument is given here it must be an array with two string values: the
   * opening and closing tags used in the template (e.g. [ "<%", "%>" ]). Of
   * course, the default is to use mustaches (i.e. mustache.tags).
   *
   * A token is an array with at least 4 elements. The first element is the
   * mustache symbol that was used inside the tag, e.g. "#" or "&". If the tag
   * did not contain a symbol (i.e. {{myValue}}) this element is "name". For
   * all text that appears outside a symbol this element is "text".
   *
   * The second element of a token is its "value". For mustache tags this is
   * whatever else was inside the tag besides the opening symbol. For text tokens
   * this is the text itself.
   *
   * The third and fourth elements of the token are the start and end indices,
   * respectively, of the token in the original template.
   *
   * Tokens that are the root node of a subtree contain two more elements: 1) an
   * array of tokens in the subtree and 2) the index in the original template at
   * which the closing tag for that section begins.
   */
  function parseTemplate (template, tags) {
    if (!template)
      return [];

    var sections = [];     // Stack to hold section tokens
    var tokens = [];       // Buffer to hold the tokens
    var spaces = [];       // Indices of whitespace tokens on the current line
    var hasTag = false;    // Is there a {{tag}} on the current line?
    var nonSpace = false;  // Is there a non-space char on the current line?

    // Strips all whitespace tokens array for the current line
    // if there was a {{#tag}} on it and otherwise only space.
    function stripSpace () {
      if (hasTag && !nonSpace) {
        while (spaces.length)
          delete tokens[spaces.pop()];
      } else {
        spaces = [];
      }

      hasTag = false;
      nonSpace = false;
    }

    var openingTagRe, closingTagRe, closingCurlyRe;
    function compileTags (tagsToCompile) {
      if (typeof tagsToCompile === 'string')
        tagsToCompile = tagsToCompile.split(spaceRe, 2);

      if (!isArray(tagsToCompile) || tagsToCompile.length !== 2)
        throw new Error('Invalid tags: ' + tagsToCompile);

      openingTagRe = new RegExp(escapeRegExp(tagsToCompile[0]) + '\\s*');
      closingTagRe = new RegExp('\\s*' + escapeRegExp(tagsToCompile[1]));
      closingCurlyRe = new RegExp('\\s*' + escapeRegExp('}' + tagsToCompile[1]));
    }

    compileTags(tags || mustache.tags);

    var scanner = new Scanner(template);

    var start, type, value, chr, token, openSection;
    while (!scanner.eos()) {
      start = scanner.pos;

      // Match any text between tags.
      value = scanner.scanUntil(openingTagRe);

      if (value) {
        for (var i = 0, valueLength = value.length; i < valueLength; ++i) {
          chr = value.charAt(i);

          if (isWhitespace(chr)) {
            spaces.push(tokens.length);
          } else {
            nonSpace = true;
          }

          tokens.push([ 'text', chr, start, start + 1 ]);
          start += 1;

          // Check for whitespace on the current line.
          if (chr === '\n')
            stripSpace();
        }
      }

      // Match the opening tag.
      if (!scanner.scan(openingTagRe))
        break;

      hasTag = true;

      // Get the tag type.
      type = scanner.scan(tagRe) || 'name';
      scanner.scan(whiteRe);

      // Get the tag value.
      if (type === '=') {
        value = scanner.scanUntil(equalsRe);
        scanner.scan(equalsRe);
        scanner.scanUntil(closingTagRe);
      } else if (type === '{') {
        value = scanner.scanUntil(closingCurlyRe);
        scanner.scan(curlyRe);
        scanner.scanUntil(closingTagRe);
        type = '&';
      } else {
        value = scanner.scanUntil(closingTagRe);
      }

      // Match the closing tag.
      if (!scanner.scan(closingTagRe))
        throw new Error('Unclosed tag at ' + scanner.pos);

      token = [ type, value, start, scanner.pos ];
      tokens.push(token);

      if (type === '#' || type === '^') {
        sections.push(token);
      } else if (type === '/') {
        // Check section nesting.
        openSection = sections.pop();

        if (!openSection)
          throw new Error('Unopened section "' + value + '" at ' + start);

        if (openSection[1] !== value)
          throw new Error('Unclosed section "' + openSection[1] + '" at ' + start);
      } else if (type === 'name' || type === '{' || type === '&') {
        nonSpace = true;
      } else if (type === '=') {
        // Set the tags for the next time around.
        compileTags(value);
      }
    }

    // Make sure there are no open sections when we're done.
    openSection = sections.pop();

    if (openSection)
      throw new Error('Unclosed section "' + openSection[1] + '" at ' + scanner.pos);

    return nestTokens(squashTokens(tokens));
  }

  /**
   * Combines the values of consecutive text tokens in the given `tokens` array
   * to a single token.
   */
  function squashTokens (tokens) {
    var squashedTokens = [];

    var token, lastToken;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      if (token) {
        if (token[0] === 'text' && lastToken && lastToken[0] === 'text') {
          lastToken[1] += token[1];
          lastToken[3] = token[3];
        } else {
          squashedTokens.push(token);
          lastToken = token;
        }
      }
    }

    return squashedTokens;
  }

  /**
   * Forms the given array of `tokens` into a nested tree structure where
   * tokens that represent a section have two additional items: 1) an array of
   * all tokens that appear in that section and 2) the index in the original
   * template that represents the end of that section.
   */
  function nestTokens (tokens) {
    var nestedTokens = [];
    var collector = nestedTokens;
    var sections = [];

    var token, section;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      token = tokens[i];

      switch (token[0]) {
        case '#':
        case '^':
          collector.push(token);
          sections.push(token);
          collector = token[4] = [];
          break;
        case '/':
          section = sections.pop();
          section[5] = token[2];
          collector = sections.length > 0 ? sections[sections.length - 1][4] : nestedTokens;
          break;
        default:
          collector.push(token);
      }
    }

    return nestedTokens;
  }

  /**
   * A simple string scanner that is used by the template parser to find
   * tokens in template strings.
   */
  function Scanner (string) {
    this.string = string;
    this.tail = string;
    this.pos = 0;
  }

  /**
   * Returns `true` if the tail is empty (end of string).
   */
  Scanner.prototype.eos = function eos () {
    return this.tail === '';
  };

  /**
   * Tries to match the given regular expression at the current position.
   * Returns the matched text if it can match, the empty string otherwise.
   */
  Scanner.prototype.scan = function scan (re) {
    var match = this.tail.match(re);

    if (!match || match.index !== 0)
      return '';

    var string = match[0];

    this.tail = this.tail.substring(string.length);
    this.pos += string.length;

    return string;
  };

  /**
   * Skips all text until the given regular expression can be matched. Returns
   * the skipped string, which is the entire tail if no match can be made.
   */
  Scanner.prototype.scanUntil = function scanUntil (re) {
    var index = this.tail.search(re), match;

    switch (index) {
      case -1:
        match = this.tail;
        this.tail = '';
        break;
      case 0:
        match = '';
        break;
      default:
        match = this.tail.substring(0, index);
        this.tail = this.tail.substring(index);
    }

    this.pos += match.length;

    return match;
  };

  /**
   * Represents a rendering context by wrapping a view object and
   * maintaining a reference to the parent context.
   */
  function Context (view, parentContext) {
    this.view = view;
    this.cache = { '.': this.view };
    this.parent = parentContext;
  }

  /**
   * Creates a new context using the given view with this context
   * as the parent.
   */
  Context.prototype.push = function push (view) {
    return new Context(view, this);
  };

  /**
   * Returns the value of the given name in this context, traversing
   * up the context hierarchy if the value is absent in this context's view.
   */
  Context.prototype.lookup = function lookup (name) {
    var cache = this.cache;

    var value;
    if (cache.hasOwnProperty(name)) {
      value = cache[name];
    } else {
      var context = this, names, index, lookupHit = false;

      while (context) {
        if (name.indexOf('.') > 0) {
          value = context.view;
          names = name.split('.');
          index = 0;

          /**
           * Using the dot notion path in `name`, we descend through the
           * nested objects.
           *
           * To be certain that the lookup has been successful, we have to
           * check if the last object in the path actually has the property
           * we are looking for. We store the result in `lookupHit`.
           *
           * This is specially necessary for when the value has been set to
           * `undefined` and we want to avoid looking up parent contexts.
           **/
          while (value != null && index < names.length) {
            if (index === names.length - 1)
              lookupHit = hasProperty(value, names[index]);

            value = value[names[index++]];
          }
        } else {
          value = context.view[name];
          lookupHit = hasProperty(context.view, name);
        }

        if (lookupHit)
          break;

        context = context.parent;
      }

      cache[name] = value;
    }

    if (isFunction(value))
      value = value.call(this.view);

    return value;
  };

  /**
   * A Writer knows how to take a stream of tokens and render them to a
   * string, given a context. It also maintains a cache of templates to
   * avoid the need to parse the same template twice.
   */
  function Writer () {
    this.cache = {};
  }

  /**
   * Clears all cached templates in this writer.
   */
  Writer.prototype.clearCache = function clearCache () {
    this.cache = {};
  };

  /**
   * Parses and caches the given `template` and returns the array of tokens
   * that is generated from the parse.
   */
  Writer.prototype.parse = function parse (template, tags) {
    var cache = this.cache;
    var tokens = cache[template];

    if (tokens == null)
      tokens = cache[template] = parseTemplate(template, tags);

    return tokens;
  };

  /**
   * High-level method that is used to render the given `template` with
   * the given `view`.
   *
   * The optional `partials` argument may be an object that contains the
   * names and templates of partials that are used in the template. It may
   * also be a function that is used to load partial templates on the fly
   * that takes a single argument: the name of the partial.
   */
  Writer.prototype.render = function render (template, view, partials) {
    var tokens = this.parse(template);
    var context = (view instanceof Context) ? view : new Context(view);
    return this.renderTokens(tokens, context, partials, template);
  };

  /**
   * Low-level method that renders the given array of `tokens` using
   * the given `context` and `partials`.
   *
   * Note: The `originalTemplate` is only ever used to extract the portion
   * of the original template that was contained in a higher-order section.
   * If the template doesn't use higher-order sections, this argument may
   * be omitted.
   */
  Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, originalTemplate);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };

  Writer.prototype.renderSection = function renderSection (token, context, partials, originalTemplate) {
    var self = this;
    var buffer = '';
    var value = context.lookup(token[1]);

    // This function is used to render an arbitrary template
    // in the current context by higher-order sections.
    function subRender (template) {
      return self.render(template, context, partials);
    }

    if (!value) return;

    if (isArray(value)) {
      for (var j = 0, valueLength = value.length; j < valueLength; ++j) {
        buffer += this.renderTokens(token[4], context.push(value[j]), partials, originalTemplate);
      }
    } else if (typeof value === 'object' || typeof value === 'string' || typeof value === 'number') {
      buffer += this.renderTokens(token[4], context.push(value), partials, originalTemplate);
    } else if (isFunction(value)) {
      if (typeof originalTemplate !== 'string')
        throw new Error('Cannot use higher-order sections without the original template');

      // Extract the portion of the original template that the section contains.
      value = value.call(context.view, originalTemplate.slice(token[3], token[5]), subRender);

      if (value != null)
        buffer += value;
    } else {
      buffer += this.renderTokens(token[4], context, partials, originalTemplate);
    }
    return buffer;
  };

  Writer.prototype.renderInverted = function renderInverted (token, context, partials, originalTemplate) {
    var value = context.lookup(token[1]);

    // Use JavaScript's definition of falsy. Include empty arrays.
    // See https://github.com/janl/mustache.js/issues/186
    if (!value || (isArray(value) && value.length === 0))
      return this.renderTokens(token[4], context, partials, originalTemplate);
  };

  Writer.prototype.renderPartial = function renderPartial (token, context, partials) {
    if (!partials) return;

    var value = isFunction(partials) ? partials(token[1]) : partials[token[1]];
    if (value != null)
      return this.renderTokens(this.parse(value), context, partials, value);
  };

  Writer.prototype.unescapedValue = function unescapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return value;
  };

  Writer.prototype.escapedValue = function escapedValue (token, context) {
    var value = context.lookup(token[1]);
    if (value != null)
      return mustache.escape(value);
  };

  Writer.prototype.rawValue = function rawValue (token) {
    return token[1];
  };

  mustache.name = 'mustache.js';
  mustache.version = '2.3.0';
  mustache.tags = [ '{{', '}}' ];

  // All high-level mustache.* functions use this writer.
  var defaultWriter = new Writer();

  /**
   * Clears all cached templates in the default writer.
   */
  mustache.clearCache = function clearCache () {
    return defaultWriter.clearCache();
  };

  /**
   * Parses and caches the given template in the default writer and returns the
   * array of tokens it contains. Doing this ahead of time avoids the need to
   * parse templates on the fly as they are rendered.
   */
  mustache.parse = function parse (template, tags) {
    return defaultWriter.parse(template, tags);
  };

  /**
   * Renders the `template` with the given `view` and `partials` using the
   * default writer.
   */
  mustache.render = function render (template, view, partials) {
    if (typeof template !== 'string') {
      throw new TypeError('Invalid template! Template should be a "string" ' +
                          'but "' + typeStr(template) + '" was given as the first ' +
                          'argument for mustache#render(template, view, partials)');
    }

    return defaultWriter.render(template, view, partials);
  };

  // This is here for backwards compatibility with 0.4.x.,
  /*eslint-disable */ // eslint wants camel cased function name
  mustache.to_html = function to_html (template, view, partials, send) {
    /*eslint-enable*/

    var result = mustache.render(template, view, partials);

    if (isFunction(send)) {
      send(result);
    } else {
      return result;
    }
  };

  // Export the escaping function so that the user may override it.
  // See https://github.com/janl/mustache.js/issues/244
  mustache.escape = escapeHtml;

  // Export these mainly for testing, but also for advanced usage.
  mustache.Scanner = Scanner;
  mustache.Context = Context;
  mustache.Writer = Writer;

  return mustache;
}));