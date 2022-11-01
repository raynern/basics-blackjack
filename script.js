// Initialising global variables
var x;
var win_pic = '<img src = "http://public.media.smithsonianmag.com/legacy_blog/smiley-face-1.jpg"/>';
var active_players = [];
var game_state;
var turn;
var output = document.querySelector("#output-div");
var pregame = document.querySelector("#pregame");

// Front page, slider and buttons functionality (from w3.schools)
var slider = document.getElementById("myRange");
var output0 = document.getElementById("demo");
output0.innerHTML = slider.value;

slider.oninput = function() {
  output0.innerHTML = this.value;
}

function myFunction() {
  var x = document.getElementById("container0");
  var y = document.getElementById("container");
  x.style.display = "none";
  y.style.display = "block";
  var pax = output0.innerHTML;
  game_state = start_game(pax);
  active_players = make_active_players(pax);
  var result = print_game(game_state);
  output.innerHTML = result + blackjack_check_game(game_state, active_players);
  turn = pass_game(active_players, -1);
  pregame.innerHTML = "Cards have been dealt to " + pax + " player(s)... Player " + (turn + 1) + " begin!"
  }

var hit_button = document.querySelector("#hit-button");
hit_button.addEventListener("click", function () {
  game_state = action_game(game_state, turn);
  result = print_game(game_state);
  output.innerHTML = result;
  if (turn >= 0) {
    pregame.innerHTML = "Current turn: Player " + (turn + 1);
  } else {
    pregame.innerHTML = "Game over!";
  }
  
  console.log(game_state);
});

var stand_button = document.querySelector("#stand-button");
stand_button.addEventListener("click", function () {
  console.log("Pre: " + turn);
  turn = pass_game(active_players, turn);
  console.log("Post: " + turn);
  if (turn >= 0) {
    pregame.innerHTML = "Current turn: Player " + (turn + 1);
  } else {
    pregame.innerHTML = "It's the dealer's turn";
    stand_button.style.display = "none";
    hit_button.innerHTML = "Dealer decides and reveals";
  }
});

// Game functionality

var main = function (input) {
  var turn = true;
  if (input == "h") {
    hit(x.player, x.deck);
    var myOutputValue = evaluate(x.player, x.computer, turn);
  } else if (input == "s") {
    turn = false;
    var dealer_outcome = dealer(x.computer, x.deck);
    x.computer = dealer_outcome["hand"];
    var myOutputValue = evaluate(x.player, x.computer, turn) + "<br/>" + "The dealer hit " + dealer_outcome["dealer_hit"] + " time(s).";
  } else {
    x = start_game();
    var myOutputValue = evaluate(x.player, x.computer, turn);
  }
  return myOutputValue;
};

var generate_deck = function () {
  var suits = ['♦️', '♣️', '❤️', '♠️'];
  var names = ["Ace","2","3","4","5","6","7","8","9","10","Jack","Queen","King"]
  var rankcount = 0;
  var deck = [];
  for (var i = 0; i < suits.length; i++) {
    while (rankcount < 13) {
      if (rankcount > 9) {
        var card = {suit: suits[i], value: 10, rank: rankcount, name: names[rankcount] + " of " + suits[i]};
      } else {
        var card = {suit: suits[i], value: rankcount + 1, rank: rankcount, name: names[rankcount] + " of " + suits[i]};
      }
      deck.push(card);
      rankcount++;
    }
    rankcount = 0;
  }
  return deck;
}

var shuffle_deck = function (deck) {
  for (var i = 0; i < deck.length; i++) {
    var random = Math.ceil(Math.random() * deck.length) - 1;
    var random_card = deck[random];
    var current_card = deck[i];
    deck[i] = random_card;
    deck[random] = current_card; 
  }
  return deck;
}

var sum_hand = function(hand){
  var ace_yet = 0;
  var sum = 0;
  for (var i = 0; i < hand.length; i++) {
    if (hand[i].value == 1 && ace_yet == 0) {
      sum = sum + 11;
      ace_yet++;
    } else {
      sum = sum + hand[i].value
    }
  };
  return sum;
}

var blackjack_check_hand = function(hand) {
  var ace_yet = 0;
  var ten_yet = 0;
  if (hand.length > 2) {
    return false;
  }
  for (var i = 0; i < hand.length; i++) {
    if (hand[i].rank > 8 && ten_yet == 0) {
      ten_yet = 1;
    } else if (hand[i].rank == 0 && ace_yet == 0) {
      ace_yet = 1;
    };
  };
  if (ten_yet == 1 && ace_yet == 1) {
    return true;
  } else {
    return false;
  }
}

var make_active_players = function(pax){
  for (var i = 0; i < pax; i++) {
    active_players.push(true);
  };
  return active_players;
}

var blackjack_check_game = function(game_state, active_players){
  var string = ""
  var blackjacked_players = [];
  for (var i = 0; i < (game_state.players).length; i++) {
    if (blackjack_check_hand((game_state.players)[i].player_hand)) {
      blackjacked_players.push(i);
      active_players[i] = false;
      string = string + "<br/>" + "Player " + (i + 1) + " has won Blackjack and exited the game"
    };
  };
  if (blackjack_check_hand(game_state.computer)) {
    string = string + "<br/>" + "Dealer has won Blackjack, so no one wins"
  }
  return string;
}

var stringify_hand = function(hand) {
  var string = "";
  for (var i = 0; i < hand.length; i++) {
    if (i == 0) {
      string = string + hand[i].name;
    } else {
      string = string + ", " + hand[i].name;
    }
  }
  return string;
}

// var report_hand = function(hand1) {
//   var sum1 = sum_hand(hand1);
//   return("Currently, Player: " + sum1);
// }

// var report_hands = function(hand1, hand2) {
//   var sum1 = sum_hand(hand1);
//   var sum2 = sum_hand(hand2);
//   return("Player: " + sum1 + ", Computer: " + sum2);
// }

// var safe_hand = function(hand) {
//   var sum = sum_hand(hand);
//   if (sum < 22) {
//     return true;
//   } else {
//     return false;
//   }
// }

// var compare_hands = function(hand1, hand2) {
//   var sum1 = sum_hand(hand1);
//   var sum2 = sum_hand(hand2);
//   if (sum1 == sum2) {
//     return("Tie!");
//   } else if (sum1 > sum2) {
//     return("Player wins!" + "<br/><br/>" + win_pic);
//   } else {
//     return("Computer wins!");
//   }
// }

var start_game = function (pax) {
  var players = [];
  var computer_hand = [];
  var deck = generate_deck();
  var deck = shuffle_deck(deck);
  for (var i = 0; i < pax; i++) {
    var player = {player_no: i + 1, player_hand: []};
    (player.player_hand).push(deck.pop());
    (player.player_hand).push(deck.pop());
    players.push(player)
  }
  computer_hand.push(deck.pop());
  computer_hand.push(deck.pop());
  return {players: players, computer: computer_hand, deck: deck};
}

var print_game = function (game_state) {
  var string = "";
  for (var i = 0; i < (game_state.players).length; i++) {
    var hand = (game_state.players)[i].player_hand;
    string = string + "Player " + (i + 1) + ": " + stringify_hand(hand) + "<br/>" + "Points: " + sum_hand(hand) + "<br/><br/>";
  };
  string = string + "Computer: " + stringify_hand(game_state.computer) + "<br/>" + "Points: " + sum_hand(game_state.computer) + "<br/><br/>";
  return string;
}

var action_game = function (game_state, turn) {
  if (turn >= 0) {
    hit(((game_state.players)[turn]).player_hand, game_state.deck);
  } else {
    dealer(game_state.computer, game_state.deck);
  };
  return game_state;
}

var pass_game = function (active_players, turn) {
  if (turn == active_players.length - 1){
    return -1;
    console.log("hihi")
  } else {
    for (i = turn + 1; turn < active_players.length; i++) {
      if (active_players[i] == true) {
        break;
      }
    }
    return i;
  }
  
}

var hit = function (hand, deck) {
  hand.push(deck.pop());
}

var dealer = function(hand, deck) {
  var dealer_hit = 0
  while (sum_hand(hand) < 17){
    hit(hand, deck);
    dealer_hit++;
  }
  return {hand: hand, dealer_hit: dealer_hit};
}

// var evaluate = function (hand1, hand2, turn) {
//   var string = "Player: " + stringify_hand(hand1);
//   if (blackjack_check(hand1) && blackjack_check(hand2)) {
//     string = string + "<br/>" + "Computer: " + stringify_hand(hand2) + "<br/>" + "Tie by blackjack!";
//   } else if (blackjack_check(hand1)) {
//     string = string + "<br/>" + "Computer: " + stringify_hand(hand2) + "<br/>" + "Player wins by blackjack!" + "<br/><br/>" + win_pic;
//   } else if (blackjack_check(hand2)) {
//     string = string + "<br/>" + "Computer: " + stringify_hand(hand2) + "<br/>" + "Computer wins by blackjack!";
//   } else if (turn) {
//     string = string + "<br/><br/>" + report_hand(hand1);
//     if (safe_hand(hand1)){
//       string = string + "<br/>" + "Hand is still safe" + "<br/><br/>" + "Player, please choose to hit or stand";
//     } else {
//       string = string + "<br/>" + "Overshot!" + "<br/><br/>" + "You can only stand now";
//     }
//   } else {
//     if (!safe_hand(hand1) && !safe_hand(hand2)){
//       string = string + "<br/>" + "No one wins";
//     } else if (!safe_hand(hand1)) {
//       string = string + "<br/>" + "You lose!";
//     } else if (!safe_hand(hand2)) {
//       string = string + "<br/>" + "You win!" + "<br/><br/>" + win_pic;
//     } else {
//       string = string + "<br/>" + compare_hands(hand1, hand2)
//     }
//     string = string + "<br/><br/>" + report_hands(hand1, hand2);
//   }
//   return string;
// }