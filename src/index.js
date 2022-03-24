const Star = `<li>
<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" class="w-3 text-yellow-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
  <path fill="currentColor" d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
</svg>
</li>`

const StarBlank = `
<li>
<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="star" class="w-3 text-yellow-500 mr-1" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
  <path fill="currentColor" d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path>
</svg>
</li>
`

$(document).ready(async function () {
    const headersList = {
        "Accept": "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)"
    }

    const apiUrl = 'https://www.cheapshark.com/api/1.0';

    async function getGameDetail(gameId) {
        const response = await fetch(`${apiUrl}/games?id=${gameId}`, {
            method: "GET",
            headers: headersList
        });

        const gameDetail = await response.json();

        return gameDetail;
    }

    async function getGameDealDetail(dealId) {
        const response = await fetch(`${apiUrl}/deals?id=${dealId}`, {
            method: "GET",
            headers: headersList
        });

        const gameDealDetail = await response.json();

        return gameDealDetail;
    }

    const gameListResponse = await fetch(`${apiUrl}/games?title=batman&limit=60&exact=0`, {
        method: "GET",
        headers: headersList
    });

    const gameList = await gameListResponse.text();
    const parsedGameList = JSON.parse(gameList);
    for (const e of parsedGameList) {

        const gameDetail = await getGameDetail(e.gameID);

        let cheapestDeal = null;

        gameDetail.deals.forEach((deal) => {
            const parsedNumber = Number(deal.savings);

            if (parsedNumber > 0) {
                if (!cheapestDeal || (cheapestDeal && parsedNumber > Number(cheapestDeal.savings))) {
                    cheapestDeal = deal;
                }
            }
        });

        if (!cheapestDeal) {
            continue;
        }

        const gameDealDetail = await getGameDealDetail(cheapestDeal.dealID);

        const starCount = Math.round(parseInt(gameDealDetail.gameInfo.steamRatingPercent) / 20);
        const blankStarCount = 5 - starCount;


        $('.card-container-row').append(`
        <div class="card-single">
        
        <a href="" class="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden">
        <div class="relative pb-48 overflow-hidden">
          <img class="absolute inset-0 h-full w-full object-cover" src="${e.thumb}" alt="">
        </div>

        <div class="p-4">
          <h2 class="mt-2 mb-2 text-xl font-bold">${e.external}</h2>
          <div class="flex flex-row justify-start align-center items-center">
          <ul class="flex justify-center">
          ${Star.repeat(starCount)}
         ${StarBlank.repeat(blankStarCount)}
        </ul>

          <span class="inline-block leading-none bg-card-blue p-1 text-white rounded-full ">
          <span class="font-bold uppercase text-xs px-2  ">${gameDealDetail.gameInfo.steamRatingCount}</span>
          </span>
          </div>
            <div class="flex flex-row justify-between mt-5 mb-4">
            <div class="flex justify-between "> 
            <div class="content-center h-1/2  bg-card-blue text-white rounded ">
            <span class="font-bold uppercase text-xs px-4 ">${gameDealDetail.gameInfo.publisher}</span>
            </div>
                
            </div>
        
          <div class="flex flex-col ">
          <span class="lg:text-2xl text-3xl font-semibold font-sans">$${cheapestDeal.price}</span>
          <span class="text-l font-semibol ml-2 self-end text-card-gray line-through">$${cheapestDeal.retailPrice}</span>

          </div>
         
         </div>
      

         <div class="flex justify-center flex-col mt-4"> 
         <span class='text-xs flex justify-center font-semibold items-center text-card-green' >
         You're saving $${Number.parseFloat(parseFloat(cheapestDeal.retailPrice) - parseFloat(cheapestDeal.price), 2).toFixed(2)}
        <span class="text-xs text-bold bg-gray-600 bg-opacity-5 text-green-600 ml-1 p-1 rounded"> -%${Number.parseFloat(cheapestDeal.savings).toFixed(2)}</span>
         </span>
         <button class="btn w-full text-white mt-1 btn-green"> Buy</button>
         </div>
        </div>
  
    </div>
    `)
    }
});
