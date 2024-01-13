<!-----------Login/Sign in----------------->
--When a user registers, it creates an account and uses it for authentication
--old user can easily sign in if they already have an account

<!-----------Profile----------------->
--Only the admin can register as an admin as it will be used to allow for the edit and delete
--the admin can be able to upload picture

<!-----------Creditor-------------->
This accepts creditor input, goods collected from people on credit
--once you click a submit button, it sends the collected data to the backend
--It should have a search input which filters the item and bring out the name and display it
--It collects all the sum of goods and deduct the amount paid to give the balance
--It will only be the admin that can use the delete and edit button  

<!---------Debtor---------------->
This accepts debtors input, goods given to people on credit 
--once you click a submit button, it sends the collected data to the backend
--It should have a search input which filters the item and bring out the name and display it
--It collects all the sum of goods and deduct the amount paid to give the balance
--It will only be the admin that can use the delete and edit button

<!-----------Stock------------------>
--Once the page opens, it loads the data stored at the database
--Add all the value of the goods and total it
--This accept input for stocks and sends it to the backend
--Once at the backend, it will send an email to the registered mail

<!------------Sales------------------>
This accepts sales input, goods sold 
--once you click a submit button, it sends the collected data to the backend
--It should have a search input which filters the item and bring out the name and display it
--It collects all the sum of goods 



<!----------APIs that i need--------------------->
1. API to get the id of the biz owner
2. API to send the id of the individual creditor and debtor
3. API to get the individual creditor and debtor
4. API to get all the creditor and debtor details
5. API that enables the business owner to delete a creditor
6. API that enables the business owner to delete the debtor 