describe("View", function(){
  var assert = chai.assert;

  describe("$el", function(){
    it("should create views basing on given prototype", function() {
      var view = new (View.extend({
        template: function() { return "<a><b><c>test</c></b></a>"; },
        tagName: "span",
        classNames: ["some-class"]
      }));
      view.render();

      assert.equal(view.$el[0].className, "some-class", "Class name should be set.");
      assert.equal(view.$el[0].tagName, "SPAN", "Tag name should be used.");
      assert.equal(view.$("b c")[0].innerHTML, "test", "template used");
      view.close();
      assert.isNull(view.$el, "element should be at least nullified");
    });
  });
});
