describe('Disable plugin', function () {

  beforeEach(function () {
    $.fn.buiDisable = $.fn.disable.noConflict();
  });

  afterEach(function () {
    $.fn.disable = $.fn.buiDisable;
    delete $.fn.buiDisable;
    mocha.clearFixture();
  });

  describe('Initialization tests', function () {
    it('should be defined on jquery object', function () {
      assert.isOk($(document.body).buiDisable, 'confirmation method is defined');
    });
  });

  describe('Plugin tests', function () {
    it('should provide no conflict', function () {
      assert.strictEqual(
        $.fn.disable,
        undefined,
        'disable was set back to undefined (original value)'
      );
    });

    it('should return jquery collection containing the element', function () {
      var $el = $('<input type="checkbox" />');
      var $disable = $el.buiDisable();
      assert.isOk($disable instanceof $, 'returns jquery collection');
      assert.strictEqual($disable[0], $el[0], 'collection contains element');
    });
  });

  describe('Disabling elements tests', function () {
    it(
      'should fire toggle.bui.disable when disable("toggle") function is called',
      function (done) {
        var eventFired = false;
        var $el = $('<input type="text" />');

        $(document).on('toggle.bui.disable', function () {
          assert.isOk(true, 'event fired');
          eventFired = true;
        });

        $el.buiDisable('toggle');

        setTimeout(function () {
          if (!eventFired) {
            assert.isOk(false, 'event not fired');
          }

          $(document).off('toggle.bui.disable');
          done();
        }, 100);
      }
    );

    it(
      'should fire toggled.bui.disable when disable("toggle") function is finished',
      function (done) {
        var eventFired = false;
        var $el = $('<input type="text" />');

        $(document).on('toggled.bui.disable', function () {
          assert.isOk($el.prop('disabled'), 'element is disabled');
          assert.isOk(true, 'event fired');
          eventFired = true;
        });

        $el.buiDisable('toggle');

        setTimeout(function () {
          if (!eventFired) {
            assert.isOk(false, 'event not fired');
          }

          $(document).off('toggled.bui.disable');
          done();
        }, 100);
      }
    );

    it('should enable element if it is already disabled', function (done) {
      var internalDoneCalled = false;
      var internalDone = function () {
        if (internalDoneCalled) {
          done();
        }

        internalDoneCalled = true;
      };

      var $el = $('<input type="text" />');

      $(document).on('toggled.bui.disable', function () {
        $(document).off('toggled.bui.disable');
        assert.isOk($el.prop('disabled'), 'element is disabled');

        $(document).on('toggled.bui.disable', function () {
          $(document).off('toggled.bui.disable');
          assert.isOk(!$el.prop('disabled'), 'element is not disabled');
          internalDone();
        });

        internalDone();
      });

      $el.buiDisable('toggle').buiDisable('toggle');
    });
  });

  describe('Data-api tests', function () {
    it('should disable element by change event on control element', function (done) {
      // Two control elements are defined to ensue that the second one does not interfere
      $('#mocha-fixture').html('<input type=text id="input_1" />' +
        '<input type="checkbox" id="control" data-toggle="disable" ' +
        'data-disable-target="#input_1" /><input type=text id="input_2" />' +
        '<input type="checkbox" data-toggle="disable" data-disable-target="#input_2" />');

      $(document).on('toggled.bui.disable', function () {
        assert.isOk(
          $('#mocha-fixture #input_1').prop('disabled'),
          'element input_1 is disabled'
        );
        assert.isOk(
          !$('#mocha-fixture #input_2').prop('disabled'),
          'element input_2 is not disabled'
        );
      });

      $(window).trigger('load');
      $('#control').prop('checked', true).change();

      setTimeout(function () {
        $(document).off('toggled.bui.disable');
        done();
      }, 100);
    });

    it('should disable and enable element by custom event type on an element', function (done) {
      // Two control elements are defined to ensure that the second one does not interfere
      $('#mocha-fixture').html('<input type=text id="input_1" />' +
        '<button id="control" data-toggle="disable" data-disable-target="#input_1" ' +
        'data-disable-event="click" /><input type=text id="input_2" />' +
        '<button type="checkbox" data-toggle="disable" data-disable-target="#input_2" ' +
        'data-disable-event="click" />');

      $(document).on('toggled.bui.disable', function () {
        assert.isOk(
          $('#mocha-fixture #input_1').prop('disabled'),
          'element input_1 is disabled'
        );
        assert.isOk(
          !$('#mocha-fixture #input_2').prop('disabled'),
          'element input_2 is not disabled'
        );
      });

      $(window).trigger('load');
      $('#control').click();

      setTimeout(function () {
        $(document).off('toggled.bui.disable');
        done();
      }, 100);
    });
  });
});
