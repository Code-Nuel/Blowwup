//SPDX-License-Identifier:UNLICENSED

pragma solidity >=0.7.0 <0.9.0;

contract Crowdfunding{

    struct CrowdfundRequest{
        address payable recipient;
        string description;
        uint targetAmount;
        uint minimumTargetAmount;
        uint ROI;
        uint amountRaised;
        uint numOfInvestors;
        bool completed;
    }

    event RequestCreated(uint _requestNo);
    event DonationSuccessful(uint _requestNo);
    event WithdrawalSuccessful(uint _requestNo);

    address super_user = 0x19fb11c71cB639cbA6729d3852c9Fd17A8df8e0e; //fake
    mapping(uint => CrowdfundRequest) private requests;
    mapping(address => bool) private _admins;
    mapping(address => uint) private _investorAmount;
    mapping(uint => bool) private exists; // Handles existence of a fundraise campaign
    uint REQUEST_NO = 0;



     constructor(){
        _admins[super_user] = true;
    }

    modifier onlyAdmin() {
        require(_admins[msg.sender] , "PERMISSION_ERROR: ADMINS ONLY ");
        _;
    }

    modifier checkAmount(uint _amount) {
        require(_amount >= 1000 wei, "Price must be at least 1000 wei");
        revert();
        _;
    }

    modifier exist(uint _requestNo) {
        require(exists[_requestNo], "Query of nonexistent CrowdFund");
        _;
    }

    function addAdmin(address _address) public onlyAdmin {
        _admins[_address] = true;
    }

    function removeAdmin(address _address) public onlyAdmin {
        _admins[_address] = false;
    }

    function getContractBalance() public view  returns(uint) {
        return address(this).balance;
    }

    function createRequest(
        string calldata _description,
        uint _targetAmount,
        uint _minimumTargetAmount,
        uint _ROI
    ) public{
        require(bytes(_description).length > 0, "Empty description");
        require(_targetAmount > 0, " State Crowdfund Amount");
        require(_minimumTargetAmount > 0, "State minimum crowdfund amount needed");
        require(_ROI > 0, "State Returns On Investment (ROI)");

        requests[REQUEST_NO] = CrowdfundRequest(
            payable(msg.sender),
            _description,
            _targetAmount,
            _minimumTargetAmount,
            _ROI,
            0, // initializing amount raised to zero
            0, // initializing number of Investors to zero
            false // initializing completed as false
        );
        exists[REQUEST_NO] = true;
        REQUEST_NO++ ;

        emit RequestCreated(REQUEST_NO);    
    }

    function viewRequest(uint _requestNo) public view 
    exist(_requestNo) returns(CrowdfundRequest memory){
        return (requests[_requestNo]);
    }

    function numOfAllRequest() public view returns(uint) {
        return REQUEST_NO;
    }    

    function donate(uint _requestNo) external payable 
    exist(_requestNo){
        require(msg.value>1000, "minimum contribution is 1000 wei");
        require(requests[_requestNo].recipient != msg.sender, 
        "You can't donate to yourself ");
        require(requests[_requestNo].completed == false,
        "The target amount has already been met" );

        requests[_requestNo].amountRaised +=msg.value;
        _investorAmount[msg.sender] +=msg.value;
        requests[_requestNo].numOfInvestors++;

        emit DonationSuccessful(_requestNo);
    }

     function withdrawFunds(uint256 _requestNo) public {
        require(requests[_requestNo].recipient == msg.sender,
        "Only recipient can use this function");
        require(requests[_requestNo].completed == false,"This request has been completed");
        require(requests[_requestNo].amountRaised >= requests[_requestNo].minimumTargetAmount,
        "Target amount has not been achieved yet !");

        payable(msg.sender).transfer(requests[_requestNo].amountRaised);
        requests[_requestNo].amountRaised = 0;
        requests[_requestNo].completed = true;

        emit WithdrawalSuccessful(_requestNo);
    }

    function adminWithdraw() public onlyAdmin{
        payable(msg.sender).transfer(address(this).balance);

    }


}