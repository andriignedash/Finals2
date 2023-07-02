import { faker } from '@faker-js/faker';
import user from "../fixtures/user.json";

user.email = faker.internet.email();
user.password = faker.internet.password();

it('Get all posts', () => {
  cy.request('GET', '/posts').then(response => {
    expect(response.status).to.be.equal(200);
    expect(response.headers).to.have.property('content-type', 'application/json; charset=utf-8')
  })
})


it('Get only first 10 posts', () => {
  cy.request('GET', '/posts/?_start=0&_end=10').then(response => {
    expect(response.status).to.be.equal(200);
    expect(response.body[0].id).to.be.equal(1);
    expect(response.body[9].id).to.be.equal(10);
  })
})


it('Get posts with id = 55 and id = 60', () => {
  cy.request('GET', '/posts/?id=55&id=60').then(response => {
    expect(response.status).to.be.equal(200);
    expect(response.body[0].id).to.be.equal(55);
    expect(response.body[1].id).to.be.equal(60);
  })
})

it('Create a post', () => {
  cy.request({
    method: 'POST',
    url: '/664/posts',
    failOnStatusCode: false
  })
    .then(response => {
      expect(response.status).to.be.equal(401);
    })
})

it('Create post with adding access token', () => {
  let token = null;
  cy.request('POST', '/register', { email: user.email, password: user.password });
  cy.request('POST', '/login', { email: user.email, password: user.password }).then(response => {
    token = response.body.accessToken;
    cy.request({
      method: 'POST',
      url: '/664/posts',
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(response => {
        expect(response.status).to.be.equal(201);
        expect(response.body).to.have.property('id');
      })
  })
})

let postTitle = faker.word.sample(3);
let postBody = faker.word.sample(5);

it('Create post entity and verify that the entity is created', () => {

  cy.request({
    method: 'POST',
    url: '/posts',
    body: {
      'title': postTitle,
      'body': postBody
    }
  })
    .then(response => {
      expect(response.status).to.be.equal(201);
      expect(response.body.title).to.be.equal(postTitle);
      expect(response.body.body).to.be.equal(postBody);
    })
})

it('Update non-existing entity', () => {
  cy.request({
    method: 'PUT',
    url: '/posts/987654321',
    body: {
      'title': 'x',
      'body': 'x'
    },
    failOnStatusCode: false
  })
    .then(response => {
      expect(response.status).to.be.equal(404)
    })
})


it('Create post entity and update the created entity', () => {
  let id = null;
  cy.request({
    method: 'POST',
    url: '/posts',
    body: {
      'title': 'y',
      'body': 'y'
    }
  })
    .then(response => {
      id = response.body.id;
      cy.request({
        method: 'PUT',
        url: '/posts/' + id,
        body: {
          'title': postTitle,
          'body': postBody
        },
      })
        .then(response => {
          expect(response.status).to.be.equal(200);
          expect(response.body.title).to.be.equal(postTitle);
          expect(response.body.body).to.be.equal(postBody)
        });
    })
})


it('Delete non-existing post entity', () => {
  cy.request({
    method: 'DELETE',
    url: '/posts/987654321',
    failOnStatusCode: false
  })
    .then(response => {
      expect(response.status).to.be.equal(404)
    })
})



it('Create post entity, update the created entity, and delete the entity', () => {
  let id = null;
  cy.request({
    method: 'POST',
    url: '/posts',
    body: {
      'title': 'y',
      'body': 'y'
    }
  })
    .then(response => {
      id = response.body.id;
      cy.request({
        method: 'PUT',
        url: '/posts/' + id,
        body: {
          'title': postTitle,
          'body': postBody
        },
      })
        .then(response => {
          cy.request({
            method: 'DELETE',
            url: '/posts/' + id,
          })
            .then(response => {
              expect(response.status).to.be.equal(200);
              cy.request({
                method: 'GET',
                url: '/posts/' + id,
                failOnStatusCode: false
              })
                .then(response => {
                  expect(response.status).to.be.equal(404)
                })
            })
        });
    })
})








