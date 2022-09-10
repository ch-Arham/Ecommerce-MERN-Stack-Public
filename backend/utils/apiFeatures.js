class ApiFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    search() {
        const keyword = this.queryString.keyword ? {
            name: {
                $regex: this.queryString.keyword,
                $options: 'i' // Case insensitive
            }
        } : {};

       
        this.query = this.query.find({...keyword});
        return this; // Return this to allow chaining
    }

    filter() { // category, price, ratings
        const queryCopy = {...this.queryString};
        // Removing the fields that are not needed for category
        const excludedFields = ['keyword', 'page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryCopy[el]);

        // Filter for price and rating (for now it only takes exact values e.g. price: 100 instead of price: {$gte: 100} i.e a range)

        let queryStr = JSON.stringify(queryCopy); // Convert the query object to a string
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`); // Replace gte, gt, lte, lt with $gte, $gt, $lte, $lt as mongoose does not support it

        this.query = this.query.find(JSON.parse(queryStr)); // convert the string back to an object
        return this;
    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryString.page) || 1; // Convert to number if it is a string
        const skip = resultPerPage * (currentPage - 1); // Calculate the number of documents to skip

        this.query = this.query.skip(skip).limit(resultPerPage);
        return this;
    }

}

module.exports = ApiFeatures;