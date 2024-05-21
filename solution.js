//console.log(transactions.length+": transactions");
//console.log(customers.length+": customers");

/*
  filter: returns a subset of the input data that contains only the items for which the predicate returns true
  @data: an array of any arbitrary data
  @predicate: a function that takes a single datapoint as an argument. Returns either true or false.
  @return: a new array that contains all of the values in data
           for which the predicate function returns true
*/
function filter(data, predicate) {
    let filteredArray = [];
    for(const transaction of data) {
        if(predicate(transaction)) {
            filteredArray.push(transaction);
        }
    }
    return filteredArray;
}
///
/*
A transaction is considered invalid if the amount is $0 or is missing altogether (either null or undefined)
A transaction is considered invalid if the product is not one of the 4 valid values: FIG_JAM, FIG_JELLY, SPICY_FIG_JAM, or ORANGE_FIG_JELLY.
*/
console.log(`Number of invalid transactions: ${filter(transactions,transaction => !transaction.amount || !(transaction.product=="FIG_JAM" || transaction.product=="SPICY_FIG_JAM" || transaction.product=="FIG_JELLY" || transaction.product=="ORANGE_FIG_JELLY")).length}`);

/*
  findLast: finds the last value in an array that meets the condition specified in the predicate
  @data: an array of any arbitrary data
  @predicate: a function that takes a single datapoint as an argument. Returns either true or false.
  @return: a single data point from data
*/
function findLast(data, predicate) {
    for(let i=data.length-1;i>0;i--) {
        if(predicate(data[i])) {
            return data[i];
        }
    }
}
console.log(`Most recent transaction over $200: ${findLast(transactions,transaction => transaction.amount>200).amount}`);

/*
  map: creates a new array based on the input array where the value at each position in the array is the result of the callback function.
  @data: an array of any arbitrary data
  @callback: a function that takes a single datapoint as an argument. Returns a new value based on the input value
  @return: a new array of the callback function results
*/
function map(data, callback) {
    let newArray=[];
    for(let value of data) {
        newArray.push(callback(value));
    }
    return newArray;
}
//console.log(map([1,2,3,4,5,6,7], x => x * 2));

/*
  pairIf: creates a new array based on the input arrays where the value at each position is an 
          array that contains the 2 values that pair according to the predicate function.
  @data1: an array of any arbitrary data
  @data2: an array of any arbitrary data
  @predicate: a function that takes a single datapoint from each input array as an argument. Returns true or false
  @return: the newly created array of pairs
*/
function pairIf(data1, data2, predicate) {
    let newArray=[];
    for(let i=0; i<data1.length; i++) {
        for(let j=0; j<data2.length;j++) {
            if(predicate(data1[i],data2[j])) {
                newArray.push([data1[i],data2[j]]);
            }
        }
    }
    return newArray;
}
//A customer is considered a duplicate if they have the same email address as another customer but a different id.
// Define the predicate function
function isDuplicateCustomer(customer1, customer2) {
    return customer1.emailAddress === customer2.emailAddress && customer1.id !== customer2.id;
}
  
console.log(`Number of duplicate customers: ${pairIf(customers,customers, isDuplicateCustomer).length/2}`);

/*
  reduce: creates an accumulated result based on the reducer function. The value returned is returned
          is the return value of the reducer function for the final iteration.
  @data: an array of any arbitrary data
  @reducer: a function that takes a single datapoint from each input array as an
            argument and the result of the reducer function from the previous iteration.
            Returns the result to be passed to the next iteration
  @initialValue: the starting point for the reduction.
  @return: the value from the final call to the reducer function.
*/
function reduce(data1, reducer, initialValue) {
    let accumulatedResult = initialValue;
    for (let i = 0; i < data1.length; i++) {
      accumulatedResult = reducer(data1[i], accumulatedResult);
    }
    return accumulatedResult;
  }
//A transaction under $25 is considered small. A transaction between $25 and $75 is considered medium. Transactions $75 and over are considered large.
const numOfEachSizeTransactions = reduce(transactions, (value, acc) => {
    if (value.amount <25) {
      acc.small.push(value);
    } 
    else if(value.amount<75) {
      acc.medium.push(value);
    }
    else {
      acc.big.push(value);
    }
    return acc;
  }, {small: [], medium: [], big: []});
console.log(`Number of small transactions: ${numOfEachSizeTransactions.small.length}`);
console.log(`Number of medium transactions: ${numOfEachSizeTransactions.medium.length}`);
console.log(`Number of large transactions: ${numOfEachSizeTransactions.big.length}`);

// Which customers have at least one transaction over $200? pairIf, reduce, filter, map
const customersWithOver200 = map(
    reduce(
      pairIf(transactions, customers, (transaction, customer) => transaction.customerId === customer.id && transaction.amount > 200),
      (pair, acc) => {
        if (!acc.includes(pair[1])) {
          acc.push(pair[1]);
        }
        return acc;
      },
      []
    ), customer => `${customer.firstName} ${customer.lastName}`
  );
  
console.log(`Customers with transactions over $200: ${customersWithOver200.length}`);
console.log("Names of customers with transactions over $200: ");
console.log(customersWithOver200);