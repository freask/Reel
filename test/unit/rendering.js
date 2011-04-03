/**
 * .reel Unit Tests
 */
(function($){

  module('Rendering', { teardown: function teardown(){
    $('.jquery-reel').unbind('loaded frameChange').trigger('teardown');
  }});

  asyncTest( 'Overlay: is created with proper ID', function(){
    expect(1);
    var
      suffix= '-abc',
      $reel= $('#image').reel({ suffix: suffix }),
      $overlay= $('#image' + suffix)

    ok( $overlay.length, 'Has the right ID (original image ID + `suffix`)' );
    start();
  });

  asyncTest( 'Overlay: has the proper `jquery-reel-overlay` class', function(){
    expect(1);
    var
      $reel= $('#image').reel(),
      $overlay= $('#image-reel')

    ok( $overlay.hasClass('jquery-reel-overlay'), 'Has the class');
    start();
  });

  asyncTest( 'Indicator: is sticked to the bottom edge of the container', function(){
    expect(4);
    var
      samples= [10, 20, 50, 100],
      index= 0

    try_sizes_one_by_one();

    function try_sizes_one_by_one(){
      var
        size= samples[index],
        $reel= $('#image').reel({ indicator: size }),
        $indicator= $('#image-reel .jquery-reel-indicator'),
        indicator_offset_top= parseInt($indicator.css('top'))

      $reel.bind('loaded', function(e){
        index++;
        equal( indicator_offset_top, 126 - size );
        if (index == samples.length){
          start();
        }else{
          $('#image').unbind('loaded').trigger('teardown')
          try_sizes_one_by_one()
        }
      })
    }
  });

  asyncTest( 'Indicator: `indicator` option value is the size of the indicator', function(){
    expect(6);
    try_different_sizes([5, 10, 30]);
    start();

    function try_different_sizes(sizes){
      $(sizes).each(function try_size(ix, size){
        $('#image').trigger('teardown')
        var
          $reel= $('#image').reel({ indicator: size }),
          $indicator= $('#image-reel .jquery-reel-indicator'),
          indicator_width= parseInt($indicator.css('width')),
          indicator_height= parseInt($indicator.css('height'));

        equal( indicator_width, size );
        equal( indicator_height, size );
      });
    }
  });

  asyncTest( 'Indicator: is sticked to the bottom left corner when on min frame (1)', function(){
    expect(1);
    var
      size= 10,
      $reel= $('#image').reel({ indicator: size, frames: 36, frame: 1 }),
      $indicator= $('#image-reel .jquery-reel-indicator');

    equal( $indicator.css('left'), '0px' );
    start();
  });

  asyncTest( 'Indicator: is sticked to the bottom right corner when on max frame (36)', function(){
    expect(1);
    var
      size= 10,
      $reel= $('#image').reel({ indicator: size }),
      width= parseInt($reel.css('width')),
      $indicator= $('#image-reel .jquery-reel-indicator');

    /*
    As the indicator indicates the beginning of the frame and not its end we need to simulate
    the "end" by providing a fraction as near to 1 as possible, but not quite
    */
    $reel.trigger('fractionChange', [0.9999]);

    equal( $indicator.css('left'), (width - size) + 'px' );
    start();
  });

  asyncTest( 'Indicator: reacts on frame change', function(){
    expect(1);
    var
      $reel= $('#image').reel({ indicator: 20, frame: 1 }),
      before= $('#image-reel .jquery-reel-indicator').css('left');

    $reel.bind('loaded', function(){
      $reel.trigger('frameChange', 5);
      $reel.bind('frameChange', function(){
        var
          after= $('#image-reel .jquery-reel-indicator').css('left');

        ok( before != after, 'Position change after frame change' );
        start();
      });
    })
  });

  asyncTest( 'Indicator: Custom style may be applied to indicator via `.jquery-reel-indicator`', function(){
    expect(2);
    var
      $reel= $('#image').reel({ indicator: 10 }),
      $indicator= $('#image-reel .jquery-reel-indicator');

    $indicator.css({         // This may as well be done in external CSS
      background: '#fff',
      opacity: 0.5
    })
    equal( $indicator.css('backgroundColor'), $.browser.opera ? '#ffffff' : $.browser.msie ? '#fff' : 'rgb(255, 255, 255)', 'Custom background' )
    equal( $indicator.css('opacity'), '0.5', 'Custom opacity' )
    start();
  });

  asyncTest( 'Indicator:  is disabled (not rendered) when `indicator` option evaluates false', function(){
    expect(3);
    try_different_values([false, undefined, 0]);
    start();

    function try_different_values(values){
      $(values).each(function try_value(ix, value){
        $('#image').trigger('teardown')
        var
          $reel= $('#image').reel({ indicator: value }),
          $indicator= $('#image-reel .jquery-reel-indicator');

        equal( $indicator.length, 0, 'When ' + value );
      });
    }
  });

})(jQuery);