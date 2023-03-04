const { expect } = require("chai");
const { ethers } = require("hardhat");

let financialData = {
  personalInformation: {
    name: "Hussain Pettiwala",
    dateOfBirth: "04/03/2001",
    panNumber: "1234",
  },
  employmentInformation: [
    {
      employerName: "Mera Employer",
      occupation: "SDE",
      incomePerYear: 100000,
    },
  ],
  creditHistory: {
    loanRepaymentHistory: [
      {
        loanType: "Personal Loan",
        loanAmount: 200000,
        loanTenure: 36,
        repaymentStatus: "on_time",
      },
      {
        loanType: "Home Loan",
        loanAmount: 500000,
        loanTenure: 60,
        repaymentStatus: "delayed",
      },
    ],
  },
};

describe("CredibilityScore", function () {
  let credibilityScore, pan;
  let owner, authorized, unauthorized;

  before(async function () {
    // use ethers to get our contract
    const CredibilityScore = await ethers.getContractFactory(
      "contracts/CredibilityScore.sol:CredibilityScore"
    );
    // and deploy it
    credibilityScore = await CredibilityScore.deploy();
    await credibilityScore.deployed();

    pan = "1234";

    const [_owner, _authorized, _unauthorized] = await ethers.getSigners();
    owner = _owner;
    authorized = _authorized;
    unauthorized = _unauthorized;

    // verify address
    await credibilityScore.connect(_owner).addAuthorized(authorized.address);
  });

  it("should add personal information", async () => {
    const personalInformationJson = financialData.personalInformation;

    // Add personal information
    await credibilityScore
      .connect(authorized)
      .addPersonalInformation(pan, personalInformationJson);

    // Retrieve the personal information from the contract
    const financialDataFromContract = await credibilityScore
      .connect(authorized)
      .getFinancialData(pan);

    // Verify that the information is correct
    expect(financialDataFromContract[0][0]).to.equal(
      personalInformationJson.name
    );
    expect(financialDataFromContract[0][1]).to.equal(
      personalInformationJson.dateOfBirth
    );
    expect(financialDataFromContract[0][2]).to.equal(
      personalInformationJson.panNumber
    );
  });
});
