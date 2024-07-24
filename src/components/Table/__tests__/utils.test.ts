import { paginate } from "../utils";

describe("paginate", () => {
  it("Should return correct pagination if currentPage was provided as zero", () => {
    const mockedTotal = 200;
    const mockedCurrentPage = 0;
    const expected = {
      startPage: 1,
      startIndex: 0,
      endIndex: 9,
      pages: [1, 2, 3, 4, 5],
      totalPages: 20,
      endPage: 5,
    };

    expect(paginate(mockedTotal, mockedCurrentPage)).toEqual(expected);
  });

  it("Should return correct pagination if provided pageSize and maxPage", () => {
    const mockedTotal = 200;
    const mockedCurrentPage = 0;
    const expected = {
      totalPages: 40,
      startPage: 1,
      endPage: 10,
      startIndex: 0,
      endIndex: 4,
      pages: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    };
    expect(paginate(mockedTotal, mockedCurrentPage, 5, 10)).toEqual(expected);
  });

  it("Should return correct pagination if currentPage was provided bigger that total pages", () => {
    const mockedTotal = 200;
    const mockedCurrentPage = 25;
    const expected = {
      totalPages: 20,
      startPage: 16,
      endPage: 20,
      startIndex: 190,
      endIndex: 199,
      pages: [16, 17, 18, 19, 20],
    };

    expect(paginate(mockedTotal, mockedCurrentPage)).toEqual(expected);
  });

  it("Should set endPage as totalPages of totalPages less than maxPages", () => {
    const mockedTotal = 2;
    const mockedCurrentPage = 1;
    const expected = {
      totalPages: 1,
      startPage: 1,
      endPage: 1,
      startIndex: 0,
      endIndex: 1,
      pages: [1],
    };
    expect(paginate(mockedTotal, mockedCurrentPage)).toEqual(expected);
  });

  it("Should return correct startPage and endPage if current page in the middle", () => {
    const mockedTotal = 200;
    const mockedCurrentPage = 10;
    const expected = {
      totalPages: 20,
      startPage: 8,
      endPage: 12,
      startIndex: 90,
      endIndex: 99,
      pages: [8, 9, 10, 11, 12],
    };

    expect(paginate(mockedTotal, mockedCurrentPage)).toEqual(expected);
  });
});