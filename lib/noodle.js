if (global.GENTLY) require = GENTLY.hijack(require)

var http = require('http')
  , xml2js = require('xml2js')
  , request = require('request')
  , _ = require('underscore')

const OODLE_CATEGORIES_ENDPOINT = 'http://developer.oodle.com/files/xml/oodle_categories.xml'
const OODLE_REGIONS_ENDPOINT = 'http://developer.oodle.com/files/xml/oodle_regions.xml'
const OODLE_LISTINGS_ENDPOINT = 'http://api.oodle.com/api/v2/listings'

exports.fetchRegions = function(callback) {
  request.get({ uri: OODLE_REGIONS_ENDPOINT }, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      var parser = new xml2js.Parser()

      parser.addListener('end', function(doc) {
        var regions = []

        _.each(doc.nation, function(mainRegion) {
          var region = { name: mainRegion['@'].name, url: mainRegion['@'].url, regions: [] }

          _.each(mainRegion.region, function(subRegion) {
            region.regions.push({ name: subRegion['@'].name, url: subRegion['@'].url })
          })

          regions.push(region)
        })

        callback(regions)
      })

      parser.parseString(body)
    } else {
      throw new Error('Failed to fetch region list')
    }
  })
}

exports.fetchCategories = function(callback) {
  request.get({ uri: OODLE_CATEGORIES_ENDPOINT }, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      var parser = new xml2js.Parser()

      parser.addListener('end', function(doc) {
        var categories = []

        _.each(doc.root, function(mainCategory) {
          var category = { name: mainCategory['@'].name, categories: [] }
      
          _.each(mainCategory.category, function(subCategory) {
            category.categories.push({ name: subCategory['@'].name, url: subCategory['@'].url })
          })

          categories.push(category) 
        })

        callback(categories)
      })

      parser.parseString(body)
    } else {
      throw new Error('Failed to fetch category list')
    }
  })
}

exports.fetchListings = function(params, callback) {
  if (!params instanceof Object) {
    throw new Error('You must provide a valid parameter hash')
  }

  if (_.isUndefined(params.apiKey)) {
    throw new Error('You must provide your API key in the parameter hash')
  }

  if (_.isUndefined(params.region)) {
    throw new Error('You must provide a region in the parameter hash')
  }

  request.get({ uri: buildListingsUri(params) }, function(err, response, body) {
    if (!err && response.statusCode == 200) {
      callback(JSON.parse(body))
    } else {
      throw new Error('Failed to fetch listings')
    }
  })
}

function buildListingsUri(params) {
  var uri = OODLE_LISTINGS_ENDPOINT 
      + '?key=' + escape(params.apiKey)
      + '&region=' + escape(params.region)
      + '&format=json&jsoncallback=none'

  _.each({ start: 'integer'
         , num: 'integer'
         , category: 'string'
         , q: 'string'
         , attributes: 'array'
         , location: 'string'
         , radius: 'decimal'
         , mappable: 'string'
         , sort: 'string'
         , refinements: 'string'
         , ctime_low: 'integer'
         , ctime_high: 'integer'
         , exclude_sources: 'array'
         , paid: 'boolean'
         , assisted_search: 'boolean' }, 
    function(type, key) {
      if (!_.isUndefined(params[key])) {
        uri += '&' + prepareParameter(key, params[key], type)
      }
    })
         
  return uri
}

function prepareParameter(key, value, type) {
  switch(type) {
    case 'integer': 
      if (!_.isNumber(value)) throw new Error(key + ' must be a number')

      return key + '=' + value

    case 'decimal': 
      if (!_.isNumber(value)) throw new Error(key + ' must be a number')

      return key + '=' + value

    case 'string': 
      if (!_.isString(value)) throw new Error(key + ' must be a string')

      return key + '=' + escape(value)

    case 'array': 
      if (!_.isArray(value)) throw new Error(key + ' must be an array')

      return 'attributes=' + escape(value.join(','))

    case 'boolean': 
      if (!_.isBoolean(value)) throw new Error(key + ' must be boolean')
        
      return key + '=' + ( value == true ? 'yes' : 'no' )
  }

  throw new Error('Unknown parameter type: ' + type)
}
