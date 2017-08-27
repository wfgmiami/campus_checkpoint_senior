import {expect} from 'chai';
import sinon from 'sinon';

import {groupBy, flowRight} from '../../server/flatline';

describe('▒▒▒ JavaScript tests ▒▒▒', function () {

    /**** These are based off of lodash methods. Reference lodash docs to clarify each method purpose. ****/
    describe('flatline', () => {

        describe('groupBy function', () => {

            /*********************************
             *
             *   _.groupBy
             *
             *   in lodash: https://lodash.com/docs#groupBy
             *
             *   IMPORTANT note: the following specs do not encompass ALL features of lodash's groupBy;
             *   for example: taking an object as a parameter
             *
             *   Given a collection put through an iterator function, an object will be returned with
             *   keys relating to the return values of each element through the iterator and values as
             *   an array of those elements
             *
             *   e.g.
             *
             *      the collection `staff` ['Liz', 'Ceren', 'Shanna', 'Charlotte']
             *
             *      the `iterator` function (staffMember) {
             *          return staffMember[0]; // first letter of name
             *      }
             *
             *      _.groupBy(staff, iterator) returns
             *
             *     {
             *       'C': ['Ceren', 'Charlotte'],
             *       'L': ['Liz'],
             *       'S': ['Shanna']
             *     }
             *
             *
             *********************************/

            let users;
            beforeEach(() => {
                users = [
                    { name: 'Greg', age: 12, state: 'NJ' },
                    { name: 'Julie', age: 18, state: 'NY' },
                    { name: 'Bobby', age: 24, state: 'NJ' },
                    { name: 'Mark', age: 56, state: 'TX' },
                    { name: 'Nicole', age: 21, state: 'NV' },
                    { name: 'Joe', age: 13, state: 'NY' },
                    { name: 'Emily', age: 56, state: 'MA' },
                    { name: 'Katherine', age: 21, state: 'NJ' },
                    { name: 'John', age: 6, state: 'TX' }
                ];
            });

            it('returns an object', () => {
                const returnValue = groupBy(users, user => user.age > 13);
                expect(returnValue).to.be.an('object');
            });

            describe('returned object', () => {

                it('has keys that match return values from the iterator and the value of each key is an array of the elements that was the parameter when the key was returned', () => {

                    const returnValue = groupBy(users, user => {
                        if (user.age > 13) {
                            return 'over13';
                        } else {
                            return 'underOrExactly13';
                        }
                    });

                    expect(returnValue.underOrExactly13).to.be.an('array');
                    expect(returnValue.underOrExactly13).to.have.length(3);
                    expect(returnValue.over13).to.have.length(users.length - 3);

                    const namesOfYoungOnes = returnValue.underOrExactly13.map(user => user.name);

                    expect(namesOfYoungOnes).to.be.deep.equal(['Greg', 'Joe', 'John']);

                });

                it('pulls and groups by specific property if a string is provided instead of a function', () => {

                    const returnValue = groupBy(users, 'state');

                    expect(Object.keys(returnValue)).to.be.deep.equal([
                        'NJ',
                        'NY',
                        'TX',
                        'NV',
                        'MA'
                    ]);

                    expect(returnValue.NJ).to.have.length(3);

                    const namesFromNewJersey = returnValue.NJ.map(user => user.name);

                    expect(namesFromNewJersey).to.be.deep.equal(['Greg', 'Bobby', 'Katherine']);

                });

            });

        });

        describe('flowRight (compose) function', () => {

            /*********************************
             *
             *   flowRight (formerly known as _.compose)
             *
             *   in lodash: https://lodash.com/docs#flowRight
             *
             *   Takes an arbitrary amount of functions and returns a new function that uses its arguments
             *   and calls the provided functions from right to left (last to first). The argument for each
             *   function (except the first) is determined by the return value of the function to its right.
             *   The call to the function returned by flowRight evaluates to the return value of the leftmost
             *   function.
             *
             *   e.g.
             *
             *   sayHello = function (name) {
             *      return 'Hello, ' + name;
             *   }
             *
             *   addExclamation = function (s) {
             *      return s + '!';
             *   }
             *
             *   smallTalk = function (s) {
             *      return s + ' Nice weather we are having, eh?';
             *   }
             *
             *   greetEnthusiastically = flowRight(addExclamation, sayHello)
             *
             *   greetEnthusiastically('Omri')
             *   --> returns 'Hello, Omri!'
             *
             *   (sayHello is called with 'Omri', addExclamation is called with 'Hello, Omri')
             *
             *
             *
             *   greetEnthusiasticallyAndTalkAboutWeather = flowRight(smallTalk, greetEnthusiastically)
             *
             *   greetEnthusiasticallyAndTalkAboutWeather('Gabriel')
             *   --> returns 'Hello, Gabriel! Nice weather we are having, eh?'
             *
             *   (greetEnthusiastically is called with 'Gabriel', smallTalk is called with 'Hello, Gabriel!')
             *
             *********************************/

            let add2;
            let add1;
            let multiply3;
            let divide2;
            beforeEach(() => {

                add2 = sinon.spy(n => n + 2);

                add1 = sinon.spy(n => n + 1);

                multiply3 = sinon.spy(n => n * 3);

                divide2 = sinon.spy(n => n / 2);

            });

            let mathMaxSpy;

            beforeEach(() => {
                mathMaxSpy = sinon.spy(Math, 'max');
            });

            afterEach(() => {
                Math.max.restore();
            });

            it(`returns a new function that calls the provided functions from right to left
                with return value of the previous function, and finally evaluates
                to the return value of the leftmost function`, () => {

                const add3 = flowRight(add2, add1);

                const returnValue = add3(0);

                expect(add1.calledWith(0)).to.be.equal(true);
                expect(add2.calledWith(1)).to.be.equal(true);
                expect(returnValue).to.be.equal(3);

            });

            it('takes an arbitrary amount of functions to compose', () => {

                const add1ThenMultiplyBy3ThenDivideBy2 = flowRight(divide2, multiply3, add1);

                const returnValue1 = add1ThenMultiplyBy3ThenDivideBy2(1);

                expect(add1.calledWith(1)).to.be.equal(true);
                expect(multiply3.calledWith(2)).to.be.equal(true);
                expect(divide2.calledWith(6)).to.be.equal(true);
                expect(returnValue1).to.be.equal(3);

                const add10 = flowRight(add2, add2, add2, add2, add2);

                const returnValue2 = add10(5);

                expect(add2.callCount).to.be.equal(5);
                expect(returnValue2).to.be.equal(15);

            });

            it('calls the rightmost function with all given arguments', () => {

                const multiplyMaxBy3 = flowRight(multiply3, mathMaxSpy);

                const returnValue = multiplyMaxBy3(6, 5, 1, 3, 5, 10, 2, 3);

                expect(mathMaxSpy.calledWithExactly(6, 5, 1, 3, 5, 10, 2, 3)).to.be.equal(true);
                expect(multiply3.calledWith(10)).to.be.equal(true);
                expect(returnValue).to.be.equal(30);

            });

        });

    });

});
