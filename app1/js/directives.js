'use strict';

/* Directives */


angular.module('myApp.directives', []).

  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).

  directive('derpyXhrModal', function($compile,$timeout) {
    return {
      link: function(scope, element, attrs) {
        scope.inModal = false;
        scope.activeModal = false;
        scope.openIt = function() {
          console.log("derpy xhr open modal stage 1");
          scope.activeModal = false;
          scope.inModal = true;
          scope.$apply();
          $timeout(function(){
            console.log("derpy xhr open modal stage 2");
            scope.activeModal = true;
          });
        };
        scope.closeIt = function() {
          console.log("derpy xhr close modal stage 1");
          scope.activeModal = false;
          $timeout(function(){
            console.log("derpy  xhr close modal stage 2");
            scope.inModal = false;
          }, 200);
        };
        scope.didLoad = function() {
          console.log("derpy xhr content loaded");
        }
        var derp = $compile('<div ng-class="{showing: inModal, hidden: !inModal, on: activeModal, off: !activeModal}" class="fade off modal-outer"><div class="modal-inner-1"><div class="modal-inner-2"><div class="modal-inner-3"><div class="modal-bg" ng-click="closeIt()"></div><div ng-class="{showing: inModal, hidden: !inModal, on: activeModal, off: !activeModal}" class="modal-content zoom off"><div ng-include="\''+attrs.derpyXhrModal+'\'" onload="didLoad()"></div></div></div></div></div></div>')(scope);
        element.after(derp);
        element.bind('click',scope.openIt);
      }
    };
  }).

  directive('fancyfoo', function(){
    return {
      transclude: true,
      templateUrl: 'partials/fancyfoo.html',
    }
  }).


  directive('modalLayout', function(){
    return {
      transclude: true,
      templateUrl: 'partials/modal-layout.html',
    }
  }).

  directive('betterXhrModal', ['$compile','$timeout','$document','$http',function($compile,$timeout,$document,$http){
    return {
      link: function(scope, element, attrs) {
        function loadModal() {
          var spinnerOpts = {
            lines: 9, // The number of lines to draw
            length: 0, // The length of each line
            width: 3, // The line thickness
            radius: 5, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 0, // The rotation offset
            direction: 1, // 1: clockwise, -1: counterclockwise
            color: '#000', // #rgb or #rrggbb or array of colors
            speed: 1.5, // Rounds per second
            trail: 33, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
          };
          var spinner = new Spinner(spinnerOpts).spin(element[0]);
          element.addClass('cleartext');
          var fetchPromise = $http.get(attrs.betterXhrModal);
          fetchPromise.then(function(result){
            console.log("better xhr modal got remote modal content",result);
            var content = result.data;
            var modalScope = scope.$new();
            var modalDomEl = $compile(angular.element('<div modal-layout></div>').html(content))(modalScope);
            modalScope.inModal = false;
            modalScope.activeModal = false;
            modalScope.openIt = function() {
              console.log("better xhr open modal stage 1");
              modalScope.activeModal = false;
              modalScope.inModal = true;
              //modalScope.$apply();
              $timeout(function(){
                console.log("better xhr open modal stage 2");
                modalScope.activeModal = true;
              });
            };
            modalScope.closeIt = function() {
              console.log("better xhr close modal stage 1");
              modalScope.activeModal = false;
              $timeout(function(){
                console.log("better xhr close modal stage 2");
                modalScope.inModal = false;
                modalScope.$destroy();
                modalDomEl.remove();
              }, 200);
            };
            var body = $document.find('body').eq(0); // todo: use root app element instead?
            body.append(modalDomEl);
            modalScope.openIt();
            spinner.stop();
            element.removeClass('cleartext');
          }, function(error){
            spinner.stop();
            element.removeClass('cleartext');
            console.log("better xhr modal failed to get modal content", error);
            //... eventually i want the modal directive to implement error handling with a specific error modal
          })
        }
        element.bind('click',loadModal);
      }
    }
  }]).

  directive('inlineModal', ['$compile','$timeout','$document',function($compile,$timeout,$document,$http){
    return {
      link: function(scope, element, attrs) {
        function loadModal() {
          var inlineEl = angular.element(document.getElementById(attrs.inlineModal));
          if (!inlineEl) {
            throw new Error("couldn't locate the inline element div ("+attrs.inlineModal+")");
            return;
          }
          var modalScope = scope.$new();
          var modalDomEl = $compile(angular.element('<div modal-layout></div>').html(inlineEl.html()))(modalScope);
          modalScope.inModal = false;
          modalScope.activeModal = false;
          modalScope.openIt = function() {
            console.log("inline open modal stage 1");
            modalScope.activeModal = false;
            modalScope.inModal = true;
            //modalScope.$apply();
            $timeout(function(){
              console.log("inline modal stage 2");
              modalScope.activeModal = true;
            });
          };
          modalScope.closeIt = function() {
            console.log("inline close modal stage 1");
            modalScope.activeModal = false;
            $timeout(function(){
              console.log("inline close modal stage 2");
              modalScope.inModal = false;
              modalScope.$destroy();
              modalDomEl.remove();
            }, 200);
          };
          var body = $document.find('body').eq(0); // todo: use root app element instead?
          body.append(modalDomEl);
          modalScope.openIt();
        }
        element.bind('click',loadModal);
      }
    }
  }]).

  directive('titleCaps', function(){
    return {
      scope: {
        text: "@titleCaps", // need this in order to evaluate titleCaps as an ng template text that can contain expressions
      },
      link: function(scope, element, attrs){
        scope.$watch('text',function(){
          var el = angular.element('<div></div>');
          for (var i=0; i < scope.text.length; i++) {
            var ch = scope.text.charAt(i);
            if (ch.toUpperCase() == ch) {
              el.append($('<span style="font-size: 150%"></span>').text(ch));
            } else {
              el.append($('<span></span>').text(ch.toUpperCase()));
            }
          }
          element.empty();
          element.append(el);
          // trigger card layout now that the title is rendered. can't do it
          // before, because the title height dynamically affects the card
          // layout.
          element.closest('.card').trigger('layout-card');
        });
      }
    };
  });

  //directive('cardLayoutText', function(){
  //  return {
  //    scope: {
  //      original: "@cardLayoutText",
  //    },
  //    link: function(scope, element, attrs){
  //      scope.$watch('original',function(){
  //        element.trigger('layout-card');
  //      });
  //    }
  //  };
  //})

;

$('body').on('layout-card',function(e){
  var card = $(e.target);
  var frontText = card.find('.front .description');
  // make an offscreen dupe of the card so we don't have ugly flickr on
  // the real card
  var dupeCard = card.clone();
  dupeCard.css({
    'position': 'fixed',
    'top': '-2000px',
    'right': '-2000px',
  });
  // remove script in case the call to layoutCard is actually inside the card div
  dupeCard.find('script').remove();
  // ensure dupe card is front-facing
  dupeCard.find('.front').show();
  dupeCard.find('.back').hide();
  $('body').append(dupeCard);
  var dupeFrontText = dupeCard.find('.front .description');
  // this is the div whose height we'll optimize
  var dupeInnerContent = dupeCard.find('.front .inner-content');
  var maxHeight = 261;
  //var original = scope.original + '';
  var original = card.data('card-text');
  original = original.replace(/\s+/gm," ");
  original = original.replace(/<\/p>/gm,"\n");
  original = original.replace(/<p>/gm,"");
  original = original.replace(/\s+$/gm,"");
  original = original.replace(/^\s+/gm,"");
  // support the use of an ellipsis or three periods on it's own line to trigger
  // a "page break", everything after the first instance of it renders on the
  // backside.
  var page_broken = original.split(/(\n\s*\.\.\.s*\n|\n\s*…s*\n)/);
  original = page_broken[0];
  // if (page_broken.length > 1) {
  //   original = original + page_broken[1]; // include the ellipsis on the front side
  // }
  var overflowHtml = page_broken.slice(2).join("")
  if (overflowHtml.length > 0) overflowHtml = "\n" + overflowHtml;
  // now build an array of "words", the unbreakable units of the text.
  var words = new Array;
  var word = "";
  for (var i = 0; i < original.length; i++) {
    var c = original.charAt(i);
    if (c.match(/[,.=-?:;"'()]/)) {
      // these characters end a word but are included on the end of the
      // word.
      word = word + c;
      words.push(word);
      word = "";
    } else if (c.match(/\s/)) {
      // whitespace ends the word and then the whitespace itself gets its
      // own word.
      words.push(word);
      words.push(c);
      word = "";
    } else {
      // just a word character
      word = word + c;
    }
  }
  if (word.length > 0) {
    // add the last word of the loop if any
    words.push(word);
  }
  // do a binary search on the original text to find the optimum truncate
  // position quickly, by measuring the height on the inner-content div and
  // making sure it's as close as possible to maxHeight but not exceeding it
  var upper = words.length - 1;
  if (upper < 0) upper = 0;
  var lower = 0;
  var binarySearchTruncate = function(){
    var middle = Math.round((upper-lower) / 2 + lower);
    var ellipsisHtml = " ...";
    if ((middle + 1) >= words.length) {
      // don't need ellipsis if we're rendering all the original text
      ellipsisHtml = "";
    }
    var html = words.slice(0,middle+1).concat(ellipsisHtml).join("");
    html = '<p>'+html+'</p>';
    html = html.replace(/\n/gm,"</p><p>");
    dupeFrontText.html(html);
    console.log(card.find('.title').text(),lower,middle,upper,parseFloat(dupeFrontText.height()),parseFloat(dupeInnerContent.height()),html);
    if (upper == lower) {
      var needsBackSide = false;
      // we've arrived at the optimal truncation position.
      // assign final truncated text
      frontText.html(dupeFrontText.html());
      if ((overflowHtml.length > 0) || ((middle + 1) < words.length)) {
        // set overflow text on back
        if ((middle + 1) < words.length) {
          overflowHtml = words.slice(middle+1).join("") + overflowHtml;
        }
        overflowHtml = '<p>'+overflowHtml+'</p>';
        overflowHtml = overflowHtml.replace(/\n/gm,"</p><p>");
        card.find('.overflow-text').html(overflowHtml);
        needsBackSide = true;
      } else {
        card.find('.overflow-text').empty();
      }

      // TODO: properly manage presence of flip button

      //var attribution = card.find('.attribution');
      //if (attribution.text().length > 0) {
      //  needsBackSide = true;
      //}
      //if (needsBackSide) {
      //  // unhide the flip button
      //  flipButton.css('display','block');
      //  if (isPeek) card.addClass('double-wide');
      //} else {
      //  // remove the backside
      //  flipButton.css('display','none');
      //  card.find('.front').fadeIn();
      //  card.find('.back').hide();
      //  // unflip if flipped
      //  if (flipButton.data('flipped')) {
      //    flipButton.data('flipped',false);
      //    flipButton.css({
      //      '-webkit-transform':'',
      //      '-moz-transform':'',
      //      '-o-transform':'',
      //      'transform':'',
      //    });
      //  }
      //}
      // no need for the dupe
      dupeCard.remove();
      // mark rendered
      //card.data('is-rendered',true);
      // call back if provided
      //if (doneCallback) doneCallback();
      return;
    } else if (parseFloat(dupeInnerContent.height()) > maxHeight) {
      upper = Math.floor((upper - lower) / 2 + lower);
    } else {
      lower = Math.ceil((upper - lower) / 2 + lower);
    }
    binarySearchTruncate();
  }
  binarySearchTruncate();

});
