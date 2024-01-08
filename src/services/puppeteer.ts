import puppeteer from 'puppeteer';
import { supabase } from '../lib/api';
import { RESY_EMAIL, RESY_PASSWORD } from '../lib/constants';

async function bookReservations() {
  const { data: reservations, error } = await supabase
    .from('reservations')
    .select('*');

  if (error) {
    console.error('Error fetching reservations: ', error);
    return;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const reservation of reservations) {
    // navigate to resy.com and fill in the booking form
    // login
    await page.goto('https://resy.com/');
    await page.click('[data-test-id="menu_container-button-log_in"]');
    await page.click('div.AuthView__Footer > button');
    await page.type('#email', RESY_EMAIL);
    await page.type('#password', RESY_PASSWORD);

    // find resturant
    await page.type('#restaurantName', reservation.restaurantName);
    await page.keyboard.press('Enter');

    await page.waitForSelector('.SearchResult__venue-name');

    // Get the text content of each search result
    const searchResults = await page.$$eval(
      '.SearchResult__venue-name',
      (elements) =>
        elements.map((element) =>
          element.innerHTML.trim().normalize('NFD').toLowerCase(),
        ),
    );

    console.log(searchResults);

    // Find the search result that matches the restaurant name
    const matchingResult = searchResults.find(
      (result: string) => result === reservation.restaurantName,
    );

    console.log(matchingResult);

    if (!matchingResult) {
      console.error('No matching restaurant found');
      return;
    }

    // Click the matching search result
    await page.click(`.SearchResult__venue-name:contains('${matchingResult}')`);

    // await page.type('#dateTime', reservation.dateTime);
    // // Add any other necessary steps to complete and submit the form

    // // Submit the form
    // await page.click('#submit');

    // Wait for the response and handle it
    // Update the reservation in Supabase based on the result
  }

  await browser.close();
}

bookReservations();
