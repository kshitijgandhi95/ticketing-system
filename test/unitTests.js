var assert = require('assert');
const helperFuncs = require ('./../utility/helper')

describe('Helper Functions', function () {
 
    it('should return false when seat number is greater than 40', function () {
        let returnVal = helperFuncs.validateSeatNum (43);
        assert.equal(returnVal.toString(), "false");
    });

    it('should return true when seat number is between 1 and 40', function () {
        let returnVal = helperFuncs.validateSeatNum (22);
        assert.equal(returnVal.toString(), "true");
    });

//  it('should return first charachter of the string', function () {
//         assert.equal("Hello".charAt(0), 'H');
//     });
});