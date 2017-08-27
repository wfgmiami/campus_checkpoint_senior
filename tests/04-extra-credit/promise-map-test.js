import {expect} from 'chai';
import sinon from 'sinon';
import path from 'path';
import fs from 'fs';

const readFile = function (filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, contents) => {
            if (err) return reject(err);
            resolve(contents);
        });
    });
};

// The following line should add a .map function on the es6-promise Promise object
// ... which will be the system under test.
// Notice that we are not using an exported value.
require('../../extra-credit/promise-map');

describe('▒▒▒ Extra Credit tests ▒▒▒', function () {

    describe('Promise.map', () => {

        beforeEach('Remove Promise.all', () => {
            // Promise.all makes some parts of this challenge negligible
            // This beforeEach attempts to remove its existence.
            // Do not use Promise.all in your implementation!
            Promise.all = null;
        });

        it('is a function that returns a promise', () => {
            expect(Promise.map).to.be.a('function');
            const returnValue = Promise.map(['./package.json'], () => true);
            expect(returnValue).to.be.an.instanceof(Promise);
        });

        describe('returned promise', () => {

            it('resolves to elements of the input array transformed by given iterator', () => {

                const returnedPromise = Promise.map(
                    ['./package.json', './README.md'],
                    fileName => fileName.toUpperCase()
                );

                return returnedPromise.then(fileNamesInCaps => {
                    expect(fileNamesInCaps.length).to.be.equal(2);
                    expect(fileNamesInCaps[0]).to.be.equal('./PACKAGE.JSON');
                    expect(fileNamesInCaps[1]).to.be.equal('./README.MD');
                });

            });

            it('rejects with the error thrown by the first iterator to throw an error', () => {

                const returnedPromise = Promise.map(
                    ['./package.json', './README.md', './.gitignore'],
                    fileName => {

                        if (fileName === './README.md') {
                            throw new Error('World exploded!!!');
                        }

                        return fileName.toUpperCase();

                    }
                );

                return returnedPromise.then(() => {
                    throw new Error('This should have errored!');
                }, err => {
                    expect(err.message).to.be.equal('World exploded!!!');
                });

            });

        });

        describe('returning a promise from the iterator', () => {

            let filePaths;

            beforeEach(() => {
                filePaths = ['1.txt', '2.txt', '3.txt'].map(
                    filePath => path.join(__dirname, filePath)
                );
            });

            it('has the transformed value be the resolved value of the promise', () => {

                const mapPromise = Promise.map(filePaths, filePath => {
                    return readFile(filePath)
                        .then(fileContents => fileContents.toString());
                });

                return mapPromise.then(files => {
                    expect(files).to.include('one');
                    expect(files).to.include('two');
                    expect(files).to.include('three');
                });

            });

            xit('maintains the order of the input array', () => {

                const mapPromise = Promise.map(filePaths, filePath => {
                    return readFile(filePath)
                        .then(fileContents => fileContents.toString());
                });

                return mapPromise.then(files => {
                    expect(files[0]).to.be.equal('one');
                    expect(files[1]).to.be.equal('two');
                    expect(files[2]).to.be.equal('three');
                });

            });

            xit('rejects the map promise if iterator returns a promise that rejects', () => {

                filePaths.push('LOLTOTALLYNOTAFILE!!.txt');

                const mapPromise = Promise.map(filePaths, filePath => {
                    return readFile(filePath)
                        .then(fileContents => fileContents.toString());
                });

                return mapPromise.then(() => {
                    throw new Error('This should have errored!');
                }, err => {
                    expect(err).to.be.an.instanceof(Error);
                    expect(err.code).to.be.equal('ENOENT');
                    expect(err.path).to.be.equal('LOLTOTALLYNOTAFILE!!.txt');
                });

            });

        });

        describe('promises in input array', () => {

            let filePaths;

            beforeEach(() => {

                filePaths = [];

                // A promise for a read of 1.txt as a string
                filePaths.push(
                    readFile(path.join(__dirname, './1.txt')).then(fileContents => fileContents.toString())
                );

                // A string that is the path of 2.txt
                filePaths.push(path.join(__dirname, './2.txt'));

                // A promise for a read of 3.txt as a string
                filePaths.push(
                    readFile(path.join(__dirname, './3.txt')).then(fileContents => fileContents.toString())
                );

            });

            xit('calls the iterator function with the resolved value of the promise', () => {

                const spy = sinon.spy();

                const mapPromise = Promise.map(filePaths, file => {

                    spy(file);

                    if (file.search('.txt') !== -1) {
                        return readFile(file)
                            .then(fileContents => fileContents.toString().toUpperCase());
                    } else {
                        return file.toUpperCase();
                    }

                });

                return mapPromise.then(files => {

                    expect(spy.calledWith('one')).to.be.equal(true);
                    expect(spy.calledWith(path.join(__dirname, './2.txt'))).to.be.equal(true);
                    expect(spy.calledWith('three')).to.be.equal(true);

                    expect(files).to.be.deep.equal(['ONE', 'TWO', 'THREE']);

                });

            });

            xit('rejects the map promise if a promise in the input array rejects', () => {

                const rejectError = new Error('World exploded!!!');

                filePaths.push(Promise.reject(rejectError));

                const mapPromise = Promise.map(filePaths, () => true);

                return mapPromise.then(() => {
                    throw new Error('This should have errored!');
                }, err => {
                    expect(err).to.be.equal(rejectError);
                });

            });

        });

    });

});

