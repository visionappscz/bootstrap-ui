describe('Slugger plugin', function () {

  beforeEach(function () {
    $.fn.buiSlugger = $.fn.slugger.noConflict();
  });

  afterEach(function () {
    $.fn.slugger = $.fn.buiSlugger;
    delete $.fn.buiSlugger;
    mocha.clearFixture();
  });

  describe('Initialization tests', function () {
    it('should be defined on jquery object', function () {
      assert.isOk($(document.body).buiSlugger, 'confirmation method is defined');
    });
  });

  describe('Plugin tests', function () {
    it('should provide no conflict', function () {
      assert.strictEqual(
        $.fn.slugger,
        undefined,
        'slugger was set back to undefined (original value)'
      );
    });

    it('should return jquery collection containing the element', function () {
      var $el = $('<input type="text" />');
      var $slugger = $el.buiSlugger({ target: $() });
      assert.isOk($slugger instanceof $, 'returns jquery collection');
      assert.strictEqual($slugger[0], $el[0], 'collection contains element');
    });
  });

  describe('Slug generation tests', function () {
    it('should fire updated.bui.slugger when source value changes', function (done) {
      var $source = $('<input type="text" />');

      $source
        .on('updated.bui.slugger', function () {
          assert.isOk(true, 'Event was expected and triggered');
          done();
        })
        .buiSlugger({ target: $() });
    });

    it('should generate the correct slug', function (done) {
      var $source = $('<input type="text" />');
      var $target = $('<input type="text" />');

      $source
        .val('ãàáäâåčçďẽèéëêìíïîñõòóöôřšťùúüûýž x·x/x_x,x:x;;;')
        .on('updated.bui.slugger', function () {
          assert.strictEqual(
            $target.val(),
            'aaaaaaccdeeeeeiiiinooooorstuuuuyz-x-x-x-x-x-x-',
            'Slug was generated correctly.'
          );
          done();
        })
        .buiSlugger({ target: $target });
    });
  });

  describe('Data-api tests', function () {
    it('should generate slug', function (done) {
      var $source = $('<input type="text" data-toggle="slugger" data-slugger-target="#target" ' +
        'value="some text" />');
      $('#mocha-fixture')
        .html('<input type="text" id="target" />')
        .append($source);

      $(document).on('updated.bui.slugger', function () {
        assert.strictEqual($('#mocha-fixture #target').val(), 'some-text', 'Slug was generated.');
        $(document).off('updated.bui.slugger');
        done();
      });

      $source.trigger('keyup.bui.slugger.data-api');
    });

    it('should fire changed.bui.slugger when source looses focus after change', function (done) {
      var $source = $('<input type="text" data-toggle="slugger" data-slugger-target="#target" ' +
        'value="some text" />');
      $('#mocha-fixture')
        .html('<input type="text" id="target" />')
        .append($source);

      $(document).on('changed.bui.slugger', function () {
        $(document).off('changed.bui.slugger');
        assert.isOk(true, 'Event was expected and fired');
        done();
      });

      $source.trigger('change.bui.slugger.data-api');
    });
  });
});
