Deployed to GH: https://andreytimoshenkov.github.io/attack-logs/

Basic functionality includes but is not limited to: 

1. Imitation backend requests while actually fetching locally stored JSON data.
2. Filtering functionality based on product and status properties.
3. Sorting in ascending and descending order.
4. Updating the data - when filters are applied the updated data is automatically filtered too. 

All code is created in a reactive fashion with no subscriptions in components or service. 

To run the code please follow these steps:

1. Clone the repository;
2. Run 'npm i' to install dependencies;
3. Run 'npm run start' or 'ng serve' to run the app locally;
4. Enjoy updating and filtering and sorting the data!
