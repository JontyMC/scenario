gwt
===

Write your tests using the [Gherkin](https://github.com/cucumber/cucumber/wiki) language:

```javascript
scenario('Special offers displayed for preferred customer', function () {
    'Given a customer is preferred'._(function () {
        var customer = new CustomerBuilder().with(function (spec) {
            spec.isPreferred = true;
        }).build();
        api.get(customer).mock();
    });

    'And special offers are available'._(function () {
        var products = new ProductsBuilder().with(function (spec) {
            spec.specialOffers = new SpecialOfferBuilder().times(3);
        }).build();
        api.get(products).mock();
    });

    'When the product page is displayed'._(function () {
        return app.load('/products', ProductPageModel);
    });

    'Then the special offers are displayed'._(function (productPage) {
        assert.isTrue(productPage.specialOffers().exists());
        assert.equal(productPage.specialOffers().length, 3);
    });
});
```

## Features

* Run tests in browser or console via PhantomJS
* PhantomJS tests can be run in parallel
* Teamcity reporting

## Current Dependencies

* JQuery
* RequireJS
* Chai (although any assertion library can be used)