var noodle = require('../index')
  , sys = require('sys')

const API_KEY = "TEST"

var params = { apiKey: API_KEY
             , region: 'canada'
             , num: 5
             , category: 'housing/sale/home'
             , q: 'detached'
             , attributes: [ 'bedrooms_3' ]
             , location: 'l6x0m9'
             , radius: 100
             , mappable: 'address'
             , sort: 'price_reverse'
             //, refinements: 'full'
             //, ctime_low: 1307550000
             //, ctime_high: 1307619983
             //, exclude_sources: [ 1 ]
             //, paid: true
             //, assisted_search: true
             }

noodle.fetchListings(params, function(err, data) {
  console.log(data)
})

// Example: Load categories from file, file must exist at /tmp/oodle_categories.xml
/*
noodle.fetchCategories(function(err, categories) {
  if (err)
    throw err
  else
    console.log(categories)
}, '/tmp/oodle_categories.xml')
*/

// Example: Load regions from file, file must exist at /tmp/oodle_regions.xml
/*
noodle.fetchRegions(function(err, regions) {
  if (err)
    throw err
  else
    console.log(regions)
}, '/tmp/oodle_regions.xml')
*/

// Example: Load categories from Oodle 
//noodle.fetchCategories(function(err, categories) {
//  console.log(categories)
//})

// Example: Load regions from Oodle
//noodle.fetchRegions(function(err, regions) {
//  console.log(regions)
//})


