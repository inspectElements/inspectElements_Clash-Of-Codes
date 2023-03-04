const { ethers } = require("hardhat");
const { expect } = require("chai");

const financialData = {
  personalInformation: {
    name: "Hussain",
    dateOfBirth: "04/03/2001",
    panNumber: "HussainPan0",
  },
  loanDeets: {
    loanType: "Home Loan",
    loanAmount: ethers.utils.parseEther("200"),
    loanTenure: 60,
    repaymentStatus: "on_time",
  },
  employmentInformation: {
    employerName: "Mera Employer",
    occupation: "SDE",
    incomePerYear: 100000,
  },
};

describe("ApniBachat", () => {
  let apniBachat, credibilityScore;
  let owner, account1, account2;

  before(async function () {
    const CredibilityScore = await ethers.getContractFactory(
      "contracts/CredibilityScore.sol:CredibilityScore"
    );
    // and deploy it
    credibilityScore = await CredibilityScore.deploy();
    await credibilityScore.deployed();

    const ApniBachat = await ethers.getContractFactory(
      "contracts/ApniBachat.sol:ApniBachat"
    );
    console.log(credibilityScore.address);
    apniBachat = await ApniBachat.deploy(credibilityScore.address);
    await apniBachat.deployed();

    const [_owner, _account1, _account2, account3] = await ethers.getSigners();
    owner = _owner;
    account1 = _account1;
    account2 = _account2;

    await credibilityScore.connect(_owner).addAuthorized(apniBachat.address);
    await credibilityScore.connect(_owner).addAuthorized(account3.address);
  });

  it("Enroll user", async () => {
    await apniBachat
      .connect(account1)
      .enroll(
        financialData.personalInformation,
        financialData.personalInformation.panNumber,
        financialData.employmentInformation
      );

    const cred = await credibilityScore
      .connect(account1)
      .calculateCreditScore(financialData.personalInformation.panNumber);
    console.log(cred);
  });

  it("Get balance", async () => {
    await apniBachat
      .connect(account1)
      .getBalance(financialData.personalInformation.panNumber);
  });
});