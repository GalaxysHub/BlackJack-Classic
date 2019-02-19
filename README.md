# BlackJack-Classic
HTML5 BlackJack

Written in pure Vanilla Javascript with no third-party libraries

<img width="1124" alt="blackjack" src="https://user-images.githubusercontent.com/39435918/53032256-1eba9980-3434-11e9-9367-28f3679426f7.PNG">

## Download Instructions

Download and unzip the repo. 
Open the file named index.html. 
If images/fonts are missing, refresh the page.

## Game Rules

See game rules here:

https://wizardofodds.com/games/blackjack/basics/

## Unique Game Features

#### Insurance

If the dealer shows an ace the player has the option to buy insurance. Insurance pays 2:1 if the dealer has a natural Blackjack

#### Dynamically Split Up to 5 Times

If the player has 2 cards of the same value, he may split his hand into two separate hands.

This makes coding the entire game about 2.5 times harder because an array of hand Objects must be used to keep track of all the player different split hands properties including position on the board. 

Most online Blackjack games that allow splitting will hardcode the option to split 1 time.

## Known Bugs

Stack for insurance is not removed if player loses. 

Split option sometimes does not show after standing with multiple split hands.
