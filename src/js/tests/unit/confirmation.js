describe('Confirmation plugin', function () {

  beforeEach(function () {
    $.fn.buiConfirmation = $.fn.confirmation.noConflict();
  });

  afterEach(function () {
    $(document).off('keyup.bui.confirmation');
    $('.modal').remove();
    $('.modal-backdrop').remove();
    $.fn.confirmation = $.fn.buiConfirmation;
    delete $.fn.buiConfirmation;
    mocha.clearFixture();
  });

  describe('Initialization tests', function () {
    it('should be defined on jquery object', function () {
      assert.isOk($(document.body).buiConfirmation, 'confirmation method is defined');
    });
  });

  describe('Plugin tests', function () {
    it('should provide no conflict', function () {
      assert.strictEqual(
        $.fn.confirmation,
        undefined,
        'confirmation was set back to undefined (original value)'
      );
    });

    it('should return jquery collection containing the element', function () {
      var $el = $('<button/>');
      var $confirmation = $el.buiConfirmation();
      assert.isOk($confirmation instanceof $, 'returns jquery collection');
      assert.strictEqual($confirmation[0], $el[0], 'collection contains element');
    });
  });

  describe('Tests related to displaying the modal', function () {
    it('should fire the show.bui.confirmation event on displaying the modal', function (done) {
      var eventFired = false;

      $('<button/>')
        .on('show.bui.confirmation', function () {
          assert.isOk($('.modal').is(':visible'), 'modal is visible');
          assert.isOk(true, 'event fired');
          eventFired = true;
        })
        .buiConfirmation();

      setTimeout(function () {
        if (!eventFired) {
          assert.isOk(false, 'event not fired');
        }

        done();
      }, 100);
    });

    it('should overload default messages with custom ones if provided', function () {
      $('<button/>').buiConfirmation({
        'confirm-message': 'Custom_message',
        'confirm-yes': 'Custom_yes',
        'confirm-no': 'Custom_no',
      });
      assert.strictEqual(
        $('.modal-body').text(),
        'Custom_message',
        'the custom message was used');
      assert.strictEqual(
        $('.modal-footer button[data-confirmation=confirm]').text(),
        'Custom_yes',
        'the custom yes was used'
      );
      assert.strictEqual(
        $('.modal-footer button[data-confirmation=reject]').text(),
        'Custom_no',
        'the custom no was used'
      );
    });

    it('should use default messages when no custom messages are provided', function () {
      $('<button/>').buiConfirmation();
      assert.strictEqual(
        $('.modal-body').text(),
        'Are you sure?',
        'the default message was used'
      );
      assert.strictEqual(
        $('.modal-footer button[data-confirmation=confirm]').text(),
        'Yes',
        'the default yes was used'
      );
      assert.strictEqual(
        $('.modal-footer button[data-confirmation=reject]').text(),
        'No',
        'the default no was used'
      );
    });
  });

  describe('Tests for rejecting the confirmation', function () {
    it('should fire rejected.bui.confirmation on pressing escape', function (done) {
      var eventFired = false;

      $('<button/>')
        .on('rejected.bui.confirmation', function () {
          assert.isOk(true, 'event fired');
          eventFired = true;
        })
        .buiConfirmation();

      $('.modal').trigger($.Event('keydown', { keyCode: 27 }));

      setTimeout(function () {
        if (!eventFired) {
          assert.isOk(false, 'event not fired');
        }

        done();
      }, 100);
    });

    it('should fire rejected.bui.confirmation on pressing the reject button', function (done) {
      var eventFired = false;

      $('<button/>')
        .on('rejected.bui.confirmation', function () {
          assert.isOk(true, 'event fired');
          eventFired = true;
        })
        .buiConfirmation();

      $('.modal button[data-confirmation=reject]').click();

      setTimeout(function () {
        if (!eventFired) {
          assert.isOk(false, 'event not fired');
        }

        done();
      }, 100);
    });

    it('should destroy the confirmation modal when rejected.bui.confirmation was triggered',
      function () {
        var $el = $('<button/>').buiConfirmation();
        $el.on('rejected.bui.confirmation', function () {
          assert.strictEqual($('.modal').length, 0, 'confirmation modal destroyed');
        });

        $el.trigger('rejected.bui.confirmation');
      }
    );

    it(
      'should execute the callback function with argument set to false when ' +
      'rejected.bui.confirmation was triggered',
      function () {
        var $el = $('<button/>').buiConfirmation({
          callback: function (result) {
            assert.isNotOk(result, 'executed the callback function');
          },
        });

        $el.trigger('rejected.bui.confirmation');
      }
    );
  });

  describe('Tests for confirming the confirmation', function () {
    it('should fire confirmed.bui.confirmation on pressing enter', function (done) {
      var eventFired = false;

      $('<button/>')
        .on('confirmed.bui.confirmation', function () {
          assert.isOk(true, 'event fired');
          eventFired = true;
        })
        .buiConfirmation();

      $('.modal').trigger($.Event('keydown', { keyCode: 13 }));

      setTimeout(function () {
        if (!eventFired) {
          assert.isOk(false, 'event not fired');
        }

        done();
      }, 100);
    });

    it(
      'should fire confirmed.bui.confirmation confirmation on pressing the confirm button',
      function (done) {
        var eventFired = false;

        $('<button/>')
          .on('confirmed.bui.confirmation', function () {
            assert.isOk(true, 'event fired');
            eventFired = true;
          })
          .buiConfirmation();

        $('.modal button[data-confirmation=confirm]').click();

        setTimeout(function () {
          if (!eventFired) {
            assert.isOk(false, 'event not fired');
          }

          done();
        }, 100);
      }
    );

    it(
      'should destroy the confirmation modal when confirmed.bui.confirmation was triggered',
      function () {
        var $el = $('<button/>').buiConfirmation();

        $el.on('confirmed.bui.confirmation', function () {
          assert.strictEqual($('.modal').length, 0, 'confirmation modal destroyed');
        });

        $el.trigger('confirmed.bui.confirmation');
      }
    );

    it(
      'should execute callback function with argument set to true when ' +
      'confirmed.bui.confirmation was triggered', function () {
        $('<button/>')
          .buiConfirmation({
            callback: function (result) {
              assert.isOk(result, 'executed the callback function');
            },
          })
          .trigger('confirmed.bui.confirmation');
      });
  });

  describe('Data-api tests', function () {
    it(
      'should populate the options object from the data attributes',
      function (done) {
        var $el = $(
          '<button data-toggle="confirm" data-confirm-message="Custom_message" ' +
          'data-confirm-yes="Custom_yes" data-confirm-no="Custom_no" />'
        );
        $('#mocha-fixture').append($el);
        $(document).on('show.bui.confirmation', 'button[data-toggle=confirm]', function () {
          $(document).off('show.bui.confirmation');
          assert.strictEqual(
            $('.modal-body').text(),
            'Custom_message',
            'the custom message was used'
          );
          assert.strictEqual(
            $('.modal-footer button[data-confirmation=confirm]').text(),
            'Custom_yes',
            'the custom yes was used'
          );
          assert.strictEqual(
            $('.modal-footer button[data-confirmation=reject]').text(),
            'Custom_no',
            'the custom no was used'
          );
          done();
        });

        $el.trigger('click.bui.confirmation.data-api');
      }
    );

    it(
      'should prevent default action when click.bui.confirmation.data-api triggered with no ' +
      'argument ',
      function (done) {
        var $el = $('<span><button type="submit" data-toggle="confirm"/></span>');
        $('#mocha-fixture').append($el);
        $(document).on(
          'click.bui.confirmation.data-api.test', 'button[data-toggle=confirm]',
          function (e) {
            $(document).off('click.bui.confirmation.data-api.test');
            if (e.isDefaultPrevented()) {
              assert.isOk(true, 'default action prevented');
            } else {
              assert.isOk(false, 'default action not prevented');
            }

            done();
          }
        );

        $el.find('button').trigger('click.bui.confirmation.data-api');
      }
    );

    it(
      'should show confirmation modal when click.bui.confirmation.data-api triggered with no ' +
      'argument',
      function (done) {
        var $el = $('<span><button type="submit" data-toggle="confirm"/></span>');
        $('#mocha-fixture').append($el);
        $(document).on('show.bui.confirmation', 'button[data-toggle=confirm]', function () {
          $(document).off('show.bui.confirmation');
          assert.isOk($('.modal').length > 0, 'confirmation modal not shown');
          done();
        });

        $el.find('button').trigger('click.bui.confirmation.data-api');
      }
    );

    it(
      'should not prevent default action when click.bui.confirmation.data-api triggered with ' +
      'argument noConfirm=true ',
      function (done) {
        var $el = $('<span><button type="submit" data-toggle="confirm"/></span>');
        $('#mocha-fixture').append($el);
        $(document).on('click.bui.confirmation.data-api.test', function (e) {
          $(document).off('click.bui.confirmation.data-api.test');
          if (!e.isDefaultPrevented()) {
            assert.isOk(true, 'default action not prevented');
          } else {
            assert.isOk(false, 'default action prevented');
          }

          done();
        });

        $el.find('button').trigger('click.bui.confirmation.data-api', true);
      }
    );
  });
});
