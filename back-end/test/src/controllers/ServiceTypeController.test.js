const assert = require('assert');
const math = require('./math');

describe('math.js tests', () => {
    describe('math.add() Test', () => {
        it('should equal 2', () => {
            const result = math.add(1, 1);
            assert.equal(result, 2);
        });
        it('should equal 4', () => {
            const result = math.add(2, 2);
            assert.equal(result, 4);
        });
    });
});