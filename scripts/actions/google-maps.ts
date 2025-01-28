import { getPlaceDetails, searchInGoogleMaps } from "../../libs/google-maps";
import { input } from "@inquirer/prompts";
import { Command } from "..";
import { outscraperReviewsTask } from "../../libs/apis/outscraper";
import { reviewKeywords } from "../../app/api/_utils/reviews";
import { fetchScrapingdogGoogleMapsReviews } from "../../libs/apis/scrapingdog";

const searchForPlace = async () => {
    const query = await input({
        message: 'Enter the search query',
    })
    const placeDetails = await searchInGoogleMaps(query);
    console.log(placeDetails);
}   

const getDetails = async () => {
    const placeId = await input({
        message: 'Enter the place id',
    })
    const placeDetails = await getPlaceDetails(placeId, { language: "en" });
    console.log(placeDetails);
}



export const googleMapsActions: Command[] = [
    {
        name: "Google Maps: Search for Place",
        key: "google-maps-search",
        action: searchForPlace,
    },
    {
        name: "Google Maps: Get Place Details",
        key: "google-maps-get-details",
        action: getDetails,
    },
    {
        name: "Outscraper: Trigger Task",
        key: "outscraper-trigger-task",
        action: async () => {
            const placeId = await input({
                message: 'Enter the place id',
            })
            const reviews = await outscraperReviewsTask({ id: placeId, keywords: 'wifi' });
            console.log(reviews);
        },
    },
    {
        name: "Scrapingdog: Trigger Task",
        key: "scrapingdog-trigger-task",
        action: async () => {
            const placeId = await input({
                message: 'Enter the place id',
            })
            const reviews = await fetchScrapingdogGoogleMapsReviews({ data_id: placeId });
            console.log(reviews);
        },
    }
]