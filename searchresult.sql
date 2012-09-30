SELECT Item.Title, Item.Author, Item.Edition, COUNT(1) as NumItemsForSale, MIN(Listing.Price) AS StartingPrice
FROM Item
INNER JOIN Listing on Listing.ItemID = Item.ID
WHERE Author like '%william%' OR Description like '%william%' OR ISBN like '%william%'
GROUP BY Item.ID;
