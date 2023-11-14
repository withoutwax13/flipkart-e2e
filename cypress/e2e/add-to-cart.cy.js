describe("As a non-logged in user, I want to add a product to my cart", () => {
  beforeEach(() => {
    // intercept the request to the /cart endpoint
    cy.intercept("POST", "https://**.api.flipkart.com/**/cart").as("addToCart");
  });

  it("should add a product to the cart", () => {
    cy.visit("/");
    cy.location("pathname").should("include", "/");
    // click X on the login modal
    cy.get("div").find("span").contains("✕").click();
    // Hover on the electronics menu
    cy.get("span").contains("Electronics").trigger("mouseover");
    // Hover on the audio menu
    cy.get("a").contains("Audio").trigger("mouseover");
    // click on the 'Headphones Pouch and Case Covers' link
    cy.get("a").contains("Headphones Pouch & Case Covers").click();
    // assert that the url contains the correct path
    cy.location("pathname").should("include", "headphone-pouches-cases");
    // get the first product, remove its target and rel attributes and click on it
    cy.selectProduct(0).invoke("removeAttr", "target");
    cy.selectProduct(0).invoke("removeAttr", "rel");
    cy.selectProduct(0).click();
    // click the add to cart button (only works with cypress-real-events realClick)
    cy.get("button").contains("Add to cart").scrollIntoView().realClick();
    // wait for the request to complete
    cy.wait("@addToCart").then(({ response }) => {
      // assert that the response is 200
      expect(response.statusCode).to.eq(200);
      // assert that the response body contains the correct properties
      expect(response.body)
        .to.have.property("RESPONSE")
        .to.have.property("cartResponse");
      // assert that the product is present in the cart
      Object.keys(response.body.RESPONSE.cartResponse).forEach((key) => {
        expect(response.body.RESPONSE.cartResponse[key].presentInCart).to.eq(
          true
        );
      });
    });
    // assert that the view cart page is loaded
    cy.location("pathname").should("eq", "/viewcart");
  });
});
