SELECT Item.Title, Item.Edition, Item.Author, User.Name as SellerName, lst.Condition, lst.Price, lst.Quantity
FROM Listing as lst
INNER JOIN User ON lst.SellerID = User.ID
INNER JOIN Item ON lst.ItemID = Item.ID
WHERE lst.ID = 2
