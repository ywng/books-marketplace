SELECT list.ID, list.Price, Item.Title, User.Name as BuyerName
FROM Listing as list
INNER JOIN Transaction as tran ON list.ID = tran.ListingID AND list.SellerID = 902525625
INNER JOIN Item ON list.ItemID = Item.ID
INNER JOIN Status ON tran.StatusID = Status.ID AND Status.Name = 'in progress'
INNER JOIN User ON tran.BuyerID = User.ID;
