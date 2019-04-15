const frisby = require('frisby');

describe('Items:', function () {
    it('GET all items should return 200', function () {
        return frisby.get('http://localhost:3000/Item/All')
            .expect('status', 200);
    });

    it('GET item without id should return 404', function () {
        return frisby.get('http://localhost:3000/Item/id/')
            .expect('status', 404);
    });

    it('GET item with incorrect id should return 404', function () {
        return frisby.get('http://localhost:3000/Item/id/5cac45f4a021f0307cda6cd3')
            .expect('status', 404);
    });

    it('GET item with correct id should return 200', function () {
        return frisby.get('http://localhost:3000/Item/id/5cac4615d049bc363ca46e77')
            .expect('status', 200);
    });

    it('PUT item with correct id should return 200', function () {
        return frisby.put('http://localhost:3000/Item/id/5cac45f2a021f0307cda6cd3', {
            name: 'My Updated name',
            description: 'Some different content'
        }).expect('status', 200);
    });

    it('DEL item with correct id should return 200', function () {
        return frisby.del('http://localhost:3000/Item/id/5cac45fca021f0307cda6cd4').expect('status', 200);
    });

});

describe('Users:', function () {
    it('GET User without id should return 404', function () {
        return frisby.get('http://localhost:3000/User/Id/')
            .expect('status', 404);
    });

    it('GET User with incorrect id should return 404', function () {
        return frisby.get('http://localhost:3000/User/Id/5cad361e75aa4b3d02a1c678')
            .expect('status', 404);
    });

    it('GET User with correct id should return 200', function () {
        return frisby.get('http://localhost:3000/User/Id/5cad861e75aa4b2d04a1c678')
            .expect('status', 200);
    });

    it('GET User with correct name should return 200', function () {
        return frisby.get('http://localhost:3000/User/Name/TestUser')
            .expect('status', 200);
    });

    it('Login with correct password should return 200', function () {
        return frisby.post('http://localhost:3000/Login', {
            email: 'Test1@gmail.com',
            password: 'Password'
        }).expect('status', 200);
    });

    it('Login with incorrect password should return 400', function () {
        return frisby.post('http://localhost:3000/Login', {
            email: 'Test1@gmail.com',
            password: 'Passw32ord'
        }).expect('status', 400);
    });

    it('Register with same email should return 400', function () {
        return frisby.post('http://localhost:3000/Register', {
            email: "Test1@gmail.com",
            username: "TestUser",
            password: "Password",
            passwordConf: "Password",
        }).expect('status', 400);
    });

});

describe('Raffles:', function () {
    it('GET All Raffles should return 200', function () {
        return frisby.get('http://localhost:3000/Raffle/all')
            .expect('status', 200);
    });

    it('GET Raffles with correct id should return 200', function () {
        return frisby.get('http://localhost:3000/Raffle/Id/5cac51af6e45791288de3b68')
            .expect('status', 200);
    });

    it('GET Raffles with incorrect id should return 404', function () {
        return frisby.get('http://localhost:3000/Raffle/Id/5cac51af6e45491285de3b68')
            .expect('status', 404);
    });

    it('POST Create Raffles with correct info should return 201', function () {
        return frisby.post('http://localhost:3000/Raffle/', {
            name: 'testname',
            description: 'testdesc',
            createdBy: '5ca9d1c469bb463b9cbab79e',
            item: '5cac45fca021f0307cda6cd4'
        })
            .expect('status', 201);
    });

    it('PUT Raffles with correct id should return 200', function () {
        return frisby.put('http://localhost:3000/Raffle/id/5cac51af6e45791288de3b68', {
            name: 'My Updated name',
            description: 'Some different content'
        }).expect('status', 200);
    });

    it('PUT Raffles with correct id and status should return 200', function () {
        return frisby.put('http://localhost:3000/Raffle/Id/5cac51af6e45791288de3b68/status/0').expect('status', 200);
    });

    it('PUT Raffles with correct id and user should return 200', function () {
        return frisby.put('http://localhost:3000/Join/5cac51af6e45791288de3b68/u/5ca9cc4110f8403a9096c9de').expect('status', 200);
    });



});