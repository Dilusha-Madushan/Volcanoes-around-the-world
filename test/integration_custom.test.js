const to = require("./lib/to");
const { instance, userOne, userTwo, nonExistantUser } = require("./lib/setup");
const { v4: uuid } = require("uuid");

/* ======================= User Registration & Login ======================= */

describe("user", () => {
  describe("registration", () => {
    describe("with missing email", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(`user/register`, {
            password: userOne.password,
          })
        );
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 400", () =>
        expect(response.status).toBe(400));
      test("should return status text - Bad Request", () =>
        expect(response.statusText).toBe("Bad Request"));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });

    describe("with missing password", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(`user/register`, {
            email: userOne.email,
          })
        );
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 400", () =>
        expect(response.status).toBe(400));
      test("should return status text - Bad Request", () =>
        expect(response.statusText).toBe("Bad Request"));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });

    describe("with missing email and password", () => {
      beforeAll(async () => {
        const request = await to.object(instance.post(`user/register`, {}));
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });
      test("should return status code 400", () =>
        expect(response.status).toBe(400));
      test("should return status text - Bad Request", () =>
        expect(response.statusText).toBe("Bad Request"));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });

    describe("with valid email and password", () => {
      beforeAll(async () => {
        const request = await to.object(
          instance.post(`user/register`, {
            email: userOne.email,
            password: userOne.password,
          })
        );
        return (response = request.resolve
          ? request.resolve
          : request.reject.response);
      });

      test("should return status code 201", () =>
        expect(response.status).toBe(201));
      test("should return status text - Created", () =>
        expect(response.statusText).toBe("Created"));
      test("should contain message property", () =>
        expect(response.data).toHaveProperty("message"));
    });
  });
});

/*======================== Nearby Volcano===============*/

describe("/volcanoes/nearby/:id", () => {
  let userOneToken;
  beforeAll(async () => {
    const login = await instance.post(`user/login`, {
      email: userOne.email,
      password: userOne.password,
    });
    userOneToken = login.data.token;
  });

  describe("with no authorisation header", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`volcanoes/nearby/57`, {
          headers: {},
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () =>
      expect(response.status).toBe(200));
    test("should return status OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should return an array", () =>
      expect(Array.isArray(response.data)).toBe(true));
  });

  describe("with invalid bearer token", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`volcanoes/nearby/57`, {
          headers: { Authorization: `Bearer notARealToken` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));
    test("should return status text - Unauthorized", () =>
      expect(response.statusText).toBe("Unauthorized"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should contain message property", () =>
      expect(response.data.message).toBe("Invalid JWT token"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with malformed bearer token", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`volcanoes/nearby/57`, {
          headers: { Authorization: `notBearer ` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 401", () =>
      expect(response.status).toBe(401));
    test("should return status text - Unauthorized", () =>
      expect(response.statusText).toBe("Unauthorized"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should contain specific message for 'Authorization header is malformed'", () =>
      expect(response.data.message).toBe("Authorization header is malformed"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with no auth - volcano that does not exist (99999) in data set", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`volcanoes/nearby/99999`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 404", () =>
      expect(response.status).toBe(404));
    test("should return status text - Not Found", () =>
      expect(response.statusText).toBe("Not Found"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with valid auth - volcano that does not exist (99999) in data set", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`volcanoes/nearby/99999`, {
          headers: { Authorization: `Bearer ${userOneToken}` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 404", () =>
      expect(response.status).toBe(404));
    test("should return status text - Not Found", () =>
      expect(response.statusText).toBe("Not Found"));
    test("should return error with boolean of true", () =>
      expect(response.data.error).toBe(true));
    test("should contain message property", () =>
      expect(response.data).toHaveProperty("message"));
    test("should be an object result", () =>
      expect(response.data).toBeInstanceOf(Object));
  });

  describe("with no auth - volcano that does exist (5)", () => {
    beforeAll(async () => {
      const request = await to.object(instance.get(`volcanoes/nearby/5`));
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () => {
      expect(response.status).toBe(200);
    });
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should be an array result", () =>
      expect(Array.isArray(response.data)).toBe(true));

    test("should contain correct name property", () =>
      expect(response.data[0].name).toBe("Bora Ale"));
    test("should contain correct country property", () =>
      expect(response.data[0].country).toBe("Ethiopia"));
    test("should contain correct region property", () =>
      expect(response.data[0].region).toBe("Africa and Red Sea"));
    test("should contain correct subregion property", () =>
      expect(response.data[0].subregion).toBe("Africa (northeastern) and Red Sea"));
    test("should contain correct latitude property", () =>
      expect(response.data[0].latitude).toBe("13.7250"));
    test("should contain correct longitude property", () =>
      expect(response.data[0].longitude).toBe("40.6000"));
  });

  describe("with valid auth - volcano that does exist (5)", () => {
    beforeAll(async () => {
      const request = await to.object(
        instance.get(`volcanoes/nearby/5`, {
          headers: { Authorization: `Bearer ${userOneToken}` },
        })
      );
      return (response = request.resolve
        ? request.resolve
        : request.reject.response);
    });

    test("should return status code 200", () => {
      expect(response.status).toBe(200);
    });
    test("should return status text - OK", () =>
      expect(response.statusText).toBe("OK"));
    test("should be an array result", () =>
      expect(Array.isArray(response.data)).toBe(true));

    test("should contain correct name property", () =>
      expect(response.data[0].name).toBe("Bora Ale"));
    test("should contain correct country property", () =>
      expect(response.data[0].country).toBe("Ethiopia"));
    test("should contain correct region property", () =>
      expect(response.data[0].region).toBe("Africa and Red Sea"));
    test("should contain correct subregion property", () =>
      expect(response.data[0].subregion).toBe("Africa (northeastern) and Red Sea"));
    test("should contain correct latitude property", () =>
      expect(response.data[0].latitude).toBe("13.7250"));
    test("should contain correct longitude property", () =>
      expect(response.data[0].longitude).toBe("40.6000"));

    test("should contain correct population_5km property", () =>
      expect(response.data[0].population_5km).toBe(0));
    test("should contain correct population_10km property", () =>
      expect(response.data[0].population_10km).toBe(0));
    test("should contain correct population_30km property", () =>
      expect(response.data[0].population_30km).toBe(11328));
    test("should contain correct population_100km property", () =>
      expect(response.data[0].population_100km).toBe(339803));
  });
});

/*======================= Comment and Rate ============*/

describe("/volcano/:id/comments", () => {
  let userToken;

  beforeAll(async () => {
    const login = await instance.post(`user/login`, {
      email: userOne.email,
      password: userOne.password,
    });
    userToken = login.data.token;
  });

  describe("POST /volcano/:id/comments", () => {
      describe("with valid authentication and parameters", () => {
          let response;

          beforeAll(async () => {
              response = await instance.post(`/volcano/100/comments`, {
                  comment: 'Incredible experience!',
                  rating: 4
              }, {
                  headers: { Authorization: `Bearer ${userToken}` }
              });
          });

          test("should return status code 201", () => {
              expect(response.status).toBe(201);
          });

          test("should return a success message", () => {
              expect(response.data).toEqual("New comment added.");
          });
      });

      describe("without authentication token", () => {
          let response;

          beforeAll(async () => {
              try {
                  response = await instance.post(`/volcano/100/comments`, {
                      comment: 'Incredible experience!',
                      rating: 4
                  });
              } catch (error) {
                  response = error.response;
              }
          });

          test("should return status code 401", () => {
              expect(response.status).toBe(401);
          });

          test("should return an error message indicating missing token", () => {
              expect(response.data.message).toContain("Authentication token required");
          });
      });

      describe("with invalid parameters (missing comment)", () => {
          let response;

          beforeAll(async () => {
              try {
                  response = await instance.post(`/volcano/100/comments`, {
                      rating: 4
                  }, {
                      headers: { Authorization: `Bearer ${userToken}` }
                  });
              } catch (error) {
                  response = error.response;
              }
          });

          test("should return status code 400", () => {
              expect(response.status).toBe(400);
          });

          test("should return an error message for incomplete body", () => {
              expect(response.data.message).toContain("Request body incomplete: Comment and Rating are required.");
          });
      });
  });

  describe("GET /volcano/:id/comments", () => {
      describe("with valid authentication", () => {
          let response;

          beforeAll(async () => {
              response = await instance.get(`/volcano/100/comments`, {
                  headers: { Authorization: `Bearer ${userToken}` }
              });
          });

          test("should return status code 200", () => {
              expect(response.status).toBe(200);
          });

          test("should return an array of comments", () => {
              expect(Array.isArray(response.data)).toBe(true);
          });
      });

      describe("without authentication token", () => {
          let response;

          beforeAll(async () => {
              try {
                  response = await instance.get(`/volcano/100/comments`);
              } catch (error) {
                  response = error.response;
              }
          });

          test("should return status code 401", () => {
              expect(response.status).toBe(401);
          });

          test("should return an error message indicating missing token", () => {
              expect(response.data.message).toContain("Authentication token required");
          });
      });

      describe("with non-existent volcano ID", () => {
          let response;

          beforeAll(async () => {
              try {
                  response = await instance.get(`/volcano/99999/comments`, {
                      headers: { Authorization: `Bearer ${userToken}` }
                  });
              } catch (error) {
                  response = error.response;
              }
          });

          test("should return status code 404", () => {
              expect(response.status).toBe(404);
          });

          test("should return an error message indicating volcano not found", () => {
              expect(response.data.message).toBe('Volcano not found.');
          });
      });
  });
});

