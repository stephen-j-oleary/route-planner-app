/** @jest-environment node */
import { getRoute } from "@/app/api/route/actions";
import radarClient from "@/utils/Radar";

jest.mock("@/utils/Radar", () => ({
  matrix: jest.fn().mockReturnValue([
    [
      { distance: { value: 0 }, duration: { value: 0 }, originIndex: 0, destinationIndex: 0 },
      { distance: { value: 1 }, duration: { value: 1 }, originIndex: 0, destinationIndex: 1 },
    ],
    [
      { distance: { value: 1 }, duration: { value: 1 }, originIndex: 1, destinationIndex: 0 },
      { distance: { value: 0 }, duration: { value: 0 }, originIndex: 1, destinationIndex: 1 },
    ],
  ]),
  directions: jest.fn().mockReturnValue([{
    legs: [
      { geometry: { polyline: "poly" } },
      { geometry: { polyline: "poly" } },
    ],
  }]),
}));

const mockedRadarClient = radarClient;


describe("/directions", () => {
  afterEach(jest.clearAllMocks);

  it("properly handles a valid request", async () => {
    const stops = [
      "51.15807,-113.946967",
      "51.11682,-113.60195",
      "51.095928,-114.133099",
      "51.032066,-113.825216",
      "51.12256,-114.244983",
    ];
    const origin = 1, destination = 1;

    const result = await getRoute({ stops, origin, destination });

    expect(mockedRadarClient.matrix).toHaveBeenCalledWith({
      origins: expect.any(String),
      destinations: expect.any(String),
      units: "metric",
    });

    expect(mockedRadarClient.directions).toHaveBeenCalledWith({
      locations: expect.any(String),
      units: "metric",
    });

    expect(result).toHaveProperty("matrix", mockedRadarClient.matrix({
      origins: "string",
      destinations: "string",
    }));

    expect(result).toHaveProperty("results", expect.arrayContaining([
      expect.objectContaining({
        distance: expect.any(Number),
        duration: expect.any(Number),
        stopOrder: expect.any(Array),
        stops: expect.any(Array),
        legs: expect.any(Array),
      })
    ]));
  });
});