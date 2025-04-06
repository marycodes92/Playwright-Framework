const { test, expect } = require('@playwright/test')
const { data } = require('../e2e/Helper/data')

test('Verify login scenario', async ({ browser })=>{
    const email = 'onuorahmary@gmail.com'
    const context = await browser.newContext()
    const page = await context.newPage()
    console.log(data[0])
    await page.goto('https://rahulshettyacademy.com/client')

    await page.locator('input#userEmail').fill(email)
    await page.locator('input#userPassword').fill('TestAccount25')
    await page.locator('input[name=login]').click()
    await page.waitForLoadState('networkidle') 
    const items = await page.locator('.card-body b').allTextContents()
    
    // Finding desired item
    const desiredProduct = "IPHONE 13 PRO"
    const products = page.locator('.card-body')
    const count = await products.count()
    
    for ( let i = 0; i < count; i++) {
        if (await products.nth(i).locator('b').textContent() === desiredProduct){
            // Add to cart 
            await products.nth(i).locator('text= Add To Cart').click()
            break   //Because I want the loop to stop once it finds the item
        }
    }

    // Go to Cart page by attribute
    await page.locator('[routerlink*="/cart"]').click()
    await page.locator('div li').first().waitFor()
    // Verify item in cart
    const productInCart = await page.locator('.cartSection h3').textContent()
    const bool = await page.locator('h3:has-text("IPHONE 13 PRO")').isVisible()
    expect(productInCart).toEqual(desiredProduct)
    expect(bool).toBeTruthy()

    // checkout
    await page.locator('.btn-primary', {hasText: "Checkout"}).click()

    // validate email in checkout page is still correct
    const emailInCheckout = await page.locator('label', {hasText: email}).last().textContent()
    console.log(emailInCheckout)
    expect(emailInCheckout).toEqual(email)

    // // Fill personal and billing information 
    const creditCard = page.locator('input.text-validated').first()
    const month = page.locator('.ddl').first()
    const year = page.locator('.ddl').last()
    const cvv = page.locator('.txt').nth(1)
    const name = page.locator('.txt').nth(2)
    const coupon = page.locator('.ng-untouched').nth(1)
    const country = page.locator('.txt').nth(5)
    const applyCoupon = page.locator('.btn-primary')
    const text = page.locator('p.mt-1')

    await creditCard.fill('4242424242424242')
    await month.selectOption('10')
    await year.selectOption('30')

    await cvv.fill('345')
    await name.fill('Mary Ugochukwu')
    await coupon.fill('rahulshettyacademy')
    await applyCoupon.click()
    await page.waitForTimeout(3000)
    await expect(text).toBeVisible()
    await expect(text).toHaveText('* Coupon Applied')

    // Select country
    // await country.fill('Nigeria')
    await country.pressSequentially('Nigeri')
    const dropdownOption = page.locator('span.ng-star-inserted')
    await dropdownOption.click()

    // for (let i = 0; i < dropdownOption; ++i){
    //     const countryText = dropdown.locator('button').nth(i).textContent()
    //     if (await countryText === 'Nigeria'){
    //         await dropdown.nth(i).click()
    //         break
    //     }
    // }

    // // Place the order
    const submitOrder = page.locator('a.action__submit')
    const appreciationText = page.locator('h1.hero-primary')
    const historyPage = page.locator('label', {hasText: " Orders History Page "})
    
    await submitOrder.click()
    await page.waitForTimeout(6000)
    await expect(appreciationText).toBeVisible()
    await expect(appreciationText).toContainText(' Thankyou for the order. ')

    const orderId = await page.locator('label.ng-star-inserted').textContent()
    console.log(orderId)
    await historyPage.click()

    // Confirm order in history page
    // await page.locator('button', { hasText: "  ORDERS"   }).click()
    const orders = await page.locator('tbody .ng-star-inserted').count()
    
    for (let i = 0; i < orders; i++){
        const orderRow = page.locator('tbody .ng-star-inserted').nth(i)
        if (await orderRow.locator('th').textContent() === orderId){
            await orderRow.locator('.btn-primary').click()
            break
        }
        const orderIdOrderSummryPage = await page.locator('div.-main').textContent()
        console.log(orderIdOrderSummryPage)
        expect(orderId.includes(orderIdOrderSummryPage).toBeTruthy())
    }
    
    await page.pause()  

})

