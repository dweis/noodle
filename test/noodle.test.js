var gently = global.GENTLY = new(require('gently'))
  , vows = require('vows')
  , assert = require('assert')
  , noodle = require('../index')

vows
  .describe('noodle')

  .addBatch({
    'WHEN I request the categories list': {
      topic: function() {
        var callback = this.callback

        gently.expect(gently.hijacked.request, 'get', function(params, callback) {
          callback(null, { statusCode: 200 }, 
              [ '<?xml version="1.0"?>'
              , '<categories>'
              , '<root name="Cars &amp; Vehicles">'
              , '<category url="vehicle" name="Cars &amp; Vehicles"/>'
              , '<category url="vehicle/airplane" name="Airplanes &amp; Aviation"/>'
              , '<category url="vehicle/boat" name="Boats"/>'
              , '</root>'
              , '<root name="Community">'
              , '<category url="community" name="Community"/>'
              , '<category url="community/announcements" name="Announcements"/>'
              , '<category url="community/announcements/auction" name="Auction Sales"/>'
              , '</root>'
              , '</categories>' ].join('\n'))
        })

        noodle.fetchCategories(function(categories) {
          callback(null, categories)
        })
      }

    , 'THEN it should complete successfully': function(err, categories) {
        assert.equal(err, null)
      }

    , 'AND it should return a value for the categories': function(err, categories) {
        assert.notEqual(categories, null)
      }

    , 'AND there should be two parent categories': function(err, categories) {
        assert.equal(categories.length, 2)
      }

    , 'AND the name of the first category should be "Cars & Vehicles"': function(err, categories) {
        assert.equal(categories[0].name, 'Cars & Vehicles')
      }
    
    , 'AND it should have three sub categories': function(err, categories) {
        assert.equal(categories[0].categories.length, 3)
      }

    , 'AND the second sub category should be named "Airplanes & Aviation"': function(err, categories) {
        assert.equal(categories[0].categories[1].name, "Airplanes & Aviation")
      }

    , 'AND the third category should have a URL of "vehicle/boat"': function(err, categories) {
        assert.equal(categories[0].categories[2].url, "vehicle/boat")
      }
    }
  })

  .addBatch({
    'WHEN I request the regions list': {
      topic: function() {
        var callback = this.callback

        gently.expect(gently.hijacked.request, 'get', function(params, callback) {
          callback(null, { statusCode: 200 }, 
              [ '<?xml version="1.0"?>'
              , '<regions>'
              , '<nation url="canada" name="Canada" >'
              , '<region url="abbotsford" name="Abbotsford" />'
              , '<region url="barrie" name="Barrie" />'
              , '<region url="brantford" name="Brantford" />'
              , '<region url="calgary" name="Calgary" />'
              , '</nation>'
              , '<nation url="uk" name="United Kingdom" >'
              , '<region url="aberdeen" name="Aberdeen" />'
              , '<region url="barnsley" name="Barnsley" />'
              , '<region url="bath" name="Bath" />'
              , '<region url="belfast" name="Belfast" />'
              , '</nation>'
              , '</regions>' ].join('\n'))
        })

        noodle.fetchRegions(function(regions) {
          callback(null, regions)
        })
      }

    , 'THEN it should complete successfully': function(err, regions) {
        assert.equal(err, null)
      }

    , 'AND it should return a value for regions': function(err, regions) {
        assert.notEqual(regions, null)   
      }

    , 'AND there should be two parent regions': function(err, regions) {
        assert.equal(regions.length, 2)
      }

    , 'AND the first main region should be named Canada': function(err, regions) {
        assert.equal(regions[0].name, 'Canada')
      }

    , 'AND the second main region should have a url of "uk"': function(err, regions) {
        assert.equal(regions[1].url, 'uk')
      }

    , 'AND "uk" should have a region named "Aberdeen"': function(err, regions) {
        var found = false

        for (idx in regions[1].regions) {
          if (regions[1].regions[idx].name == 'Aberdeen')
            found = true
        }

        assert.ok(found)
      }

    , 'AND "canada" should have four sub regions': function(err, regions) {
        assert.equal(regions[0].regions.length, 4)
      }
    }
  })

  .export(module)
