angular.module("proton.richTextEditor", [])

.directive('richTextEditor', function( $log, $location ) {

  var self = this;
  var directive = {
    restrict : "A",
    replace : true,
    transclude : true,
    scope : {
      value: "=",
      showEditor: "&"
    },
    templateUrl: "templates/directives/richTextEditor.tpl.html",
    link : function( $scope, $element, $attrs ) {
      var $$element = $($element[0]);
      var textarea = $$element.find("textarea");
      var toolbar = $$element.find("div.rich-text-toolbar");

      $$element.on('click', function (event) {
        if (event.target.tagName.toUpperCase() === "DIV") {
          $scope.editor.focus();
        }
      });
      $scope.editor = new wysihtml5.Editor(textarea[0], {
        style: false,
        toolbar: toolbar[0],
        stylesheets: ["/assets/application.css"],
        stylesheets: ["/assets/app.css"],
        parserRules:  wysihtml5ParserRules
      });
      $scope.editor.on("change", function () {
        resizeIframeToFitContent();
        $scope.$apply(function () {
          $scope.value = textarea.val();
        });
      });
      $scope.editor.on("load", function () {
        resizeIframeToFitContent();
        setTimeout( function() {
          resizeIframeToFitContent();
        }), 200;
        $('.wysihtml5-sandbox').contents().find('body').on("keydown",function() {
          resizeIframeToFitContent(); 
        });
      });
      $scope.$watch('value', function( newValue, oldValue ) {
        $scope.editor.innerHTML = newValue;
        $scope.editor.composer.setValue( newValue );
      });
      function resizeIframeToFitContent() {
        $("iframe").height('');
        var iframeHeight = $("iframe").contents().find("html").outerHeight();
        iframeHeight = iframeHeight*1.1;
        $("iframe").height(iframeHeight);
      }      
    }
  }
  return directive;
});
