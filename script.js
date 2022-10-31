var x;

var win_pic = '<img src = "http://public.media.smithsonianmag.com/legacy_blog/smiley-face-1.jpg"/>';

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
  var suits = ['Diamond', 'Club', 'Heart', 'Spade'];
  var names = ["Ace","2","3","4","5","6","7","8","9","10","Jack","Queen","King"]
  var rankcount = 0;
  var deck = [];
  for (var i = 0; i < suits.length; i++) {
    while (rankcount < 13) {
      if (rankcount > 9) {
        var card = {suit: suits[i], value: 10, rank: rankcount, name: names[rankcount] + " of " + suits[i] + "s"};
      } else {
        var card = {suit: suits[i], value: rankcount + 1, rank: rankcount, name: names[rankcount] + " of " + suits[i] + "s"};
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

var blackjack_check = function(hand) {
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

var report_hand = function(hand1) {
  var sum1 = sum_hand(hand1);
  return("Currently, Player: " + sum1);
}

var report_hands = function(hand1, hand2) {
  var sum1 = sum_hand(hand1);
  var sum2 = sum_hand(hand2);
  return("Player: " + sum1 + ", Computer: " + sum2);
}

var safe_hand = function(hand) {
  var sum = sum_hand(hand);
  if (sum < 22) {
    return true;
  } else {
    return false;
  }
}

var compare_hands = function(hand1, hand2) {
  var sum1 = sum_hand(hand1);
  var sum2 = sum_hand(hand2);
  if (sum1 == sum2) {
    return("Tie!");
  } else if (sum1 > sum2) {
    return("Player wins!" + "<br/><br/>" + win_pic);
  } else {
    return("Computer wins!");
  }
}

var start_game = function (deck) {
  var player_hand = [];
  var computer_hand = [];
  var deck = generate_deck();
  var deck = shuffle_deck(deck);
  player_hand.push(deck.pop());
  player_hand.push(deck.pop());
  computer_hand.push(deck.pop());
  computer_hand.push(deck.pop());
  return {player: player_hand, computer: computer_hand, deck: deck};
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

var evaluate = function (hand1, hand2, turn) {
  var string = "Player: " + stringify_hand(hand1);
  if (blackjack_check(hand1) && blackjack_check(hand2)) {
    string = string + "<br/>" + "Computer: " + stringify_hand(hand2) + "<br/>" + "Tie by blackjack!";
  } else if (blackjack_check(hand1)) {
    string = string + "<br/>" + "Computer: " + stringify_hand(hand2) + "<br/>" + "Player wins by blackjack!" + "<br/><br/>" + win_pic;
  } else if (blackjack_check(hand2)) {
    string = string + "<br/>" + "Computer: " + stringify_hand(hand2) + "<br/>" + "Computer wins by blackjack!";
  } else if (turn) {
    string = string + "<br/><br/>" + report_hand(hand1);
    if (safe_hand(hand1)){
      string = string + "<br/>" + "Hand is still safe" + "<br/><br/>" + "Player, please choose to hit or stand";
    } else {
      string = string + "<br/>" + "Overshot!" + "<br/><br/>" + "You can only stand now";
    }
  } else {
    if (!safe_hand(hand1) && !safe_hand(hand2)){
      string = string + "<br/>" + "No one wins";
    } else if (!safe_hand(hand1)) {
      string = string + "<br/>" + "You lose!";
    } else if (!safe_hand(hand2)) {
      string = string + "<br/>" + "You win!" + "<br/><br/>" + win_pic;
    } else {
      string = string + "<br/>" + compare_hands(hand1, hand2)
    }
    string = string + "<br/><br/>" + report_hands(hand1, hand2);
  }
  return string;
}