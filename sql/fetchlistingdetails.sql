SELECT Item.Title, Item.Author, Item.Edition
FROM Item
WHERE Item.ID = @itemid;

SELECT Tag
FROM Category
WHERE ItemID = @itemid;

SELECT lst.ID as ListingID, User.Name as SellerName, lst.Condition, lst.price
FROM Listing as lst
INNER JOIN User ON lst.SellerID = User.ID
WHERE lst.ItemID = @itemid;
