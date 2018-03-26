function player(pName, startMoney){
	/*******************************************************
		name: Players name
		money: Players current money
	*******************************************************/

	this.name = pName;
	this.money = startMoney;
}

function action(type, account, amount, next){
	/*******************************************************
		Type: Transaction, community chest, next turn
		Account: Account of a transaction
		Amount: Amount of transaction
		Next: Process next item on stack?
	*******************************************************/

	this.type = type;
	this.account = account;
	this.amount = amount;
	this.next = next;
}