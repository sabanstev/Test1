// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract DonationCollection {
    mapping(address => uint256) public donatList; // Список донатеров с суммами
    address[] donatsAddres; // Список донатеров
    address owner; // Владелец контракта

    constructor() {
        owner = msg.sender; // Запоминаем владельца контракта
    }

    modifier isOwner() {
        require(msg.sender == owner, "Caller is not owner"); // Модификатор для использования функции только владельцем контракта
        _;
    }

    receive() external payable {
        // Пожертвовать деньги
        require(msg.value > 0, "Empty translation"); // Не принимаем переводы без денег
        if (donatList[msg.sender] == 0) {
            // Если новый донатер, то добавляем в массив
            donatsAddres.push(msg.sender);
        }
        donatList[msg.sender] += msg.value; // Добавляем/обновляем  запись о пожертвовавшем
    }

    function withdrawalOfFunds(
        uint256 _transferAmount,
        address payable _transferAddress
    ) external isOwner {
        // Входные параметры сумма перевода и адрес перевода.
        require(address(this).balance >= _transferAmount, "insufficient funds"); // Если сумма для перевода больше чем собранно, то ошибка
        bool check = _transferAddress.send(_transferAmount); // Производим транзакцию
        require(check, "Error"); // Проверяем всё ли прошло хорошо
    }

    function getDonatsList() external view returns (address[] memory) {
        // Получаем список донатеров
        return donatsAddres;
    }
}
